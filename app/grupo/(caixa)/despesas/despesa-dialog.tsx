"use client"

import { useState, useEffect } from "react"
import { z } from "zod"

import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { Input } from "@/components/ui/input"
import { Field, FieldGroup, FieldLabel } from "@/components/ui/field"

import { Categorias, DespesaDetalhe, Subcategorias } from "./types"

// == Schema de validação == //
const despesaFormSchema = z.object({
  id_categoria: z.number({ error: "Categoria é obrigatória" }).int().positive("Categoria inválida"),
  id_subcategoria: z.number().int().positive("Subcategoria inválida").optional(),
  tipo_transacao: z.enum(["fixa", "variavel", "parcelado"] as const, { error: "Tipo de transação é obrigatório" }),
  valor: z.number({ error: "Valor é obrigatório" }).positive("Valor deve ser positivo"),
  data_pagamento: z.string().min(1, "Data de pagamento é obrigatória"),
  data_ultimo_pagamento: z.string().optional(),
})

export type DespesaFormData = z.infer<typeof despesaFormSchema>

interface DespesaDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  id?: number
  categorias?: Categorias[]
  subcategorias?: Subcategorias[]
  onSubmit: (data: DespesaFormData, id?: number) => Promise<void>
}

const INITIAL_FORM: DespesaFormData = {
  id_categoria: 0,
  id_subcategoria: undefined,
  tipo_transacao: "fixa",
  valor: 0,
  data_pagamento: "",
  data_ultimo_pagamento: undefined,
}

async function fetchDespesaDetalhe(id: number): Promise<DespesaFormData> {
  const res = await fetch(`/api/despesas/${id}`)
  const data: DespesaDetalhe = await res.json()

  return {
    id_categoria: data.id_categoria,
    id_subcategoria: data.id_subcategoria ?? undefined,
    tipo_transacao: data.tipo_transacao,
    valor: data.valor,
    data_pagamento: data.data_pagamento.slice(0, 10),
    data_ultimo_pagamento: data.data_ult_pagamento ? data.data_ult_pagamento.slice(0, 10) : undefined,
  }
}

export function DespesaDialog({
  open,
  onOpenChange,
  id,
  categorias = [],
  subcategorias = [],
  onSubmit,
}: DespesaDialogProps) {
  const isEditing = id !== undefined

  const [form, setForm] = useState<DespesaFormData>(INITIAL_FORM)
  const [errors, setErrors] = useState<Partial<Record<keyof DespesaFormData, string>>>({})
  const [isLoading, setIsLoading] = useState(false)
  const [isFetching, setIsFetching] = useState(false)

  const subcategoriasFiltradas = subcategorias.filter(
    (s) => s.id_categoria === form.id_categoria
  )

  useEffect(() => {
    if (!open) {
      setForm(INITIAL_FORM)
      setErrors({})
      return
    }

    if (!id) return

    setIsFetching(true)
    fetchDespesaDetalhe(id)
      .then(setForm)
      .catch(() => {})
      .finally(() => setIsFetching(false))
  }, [open, id])

  function setField<K extends keyof DespesaFormData>(key: K, value: DespesaFormData[K]) {
    setForm((prev) => ({ ...prev, [key]: value }))
    setErrors((prev) => ({ ...prev, [key]: undefined }))
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setErrors({})

    const result = despesaFormSchema.safeParse({
      ...form,
      id_subcategoria: form.id_subcategoria || undefined,
    })

    if (!result.success) {
      const fieldErrors: Partial<Record<keyof DespesaFormData, string>> = {}
      result.error.issues.forEach((issue) => {
        const key = issue.path[0] as keyof DespesaFormData
        if (!fieldErrors[key]) fieldErrors[key] = issue.message
      })
      setErrors(fieldErrors)
      return
    }

    setIsLoading(true)
    try {
      await onSubmit(result.data, id)
      onOpenChange(false)
    } catch {
      // Erro tratado pelo caller
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="w-[calc(100%-2rem)] max-w-md sm:max-w-lg">
        <DialogHeader>
          <DialogTitle>{isEditing ? "Editar Despesa" : "Nova Despesa"}</DialogTitle>
        </DialogHeader>

        <form onSubmit={handleSubmit} noValidate aria-busy={isFetching}>
          <FieldGroup className="gap-5 py-2">

            {/* Categoria */}
            <Field>
              <FieldLabel>Categoria</FieldLabel>
              <Select
                value={form.id_categoria ? String(form.id_categoria) : ""}
                onValueChange={(val) => {
                  setField("id_categoria", Number(val))
                  setField("id_subcategoria", undefined)
                }}
              >
                <SelectTrigger className="w-full">
                  <SelectValue placeholder="Selecione uma categoria" />
                </SelectTrigger>
                <SelectContent>
                  {categorias.map((cat) => (
                    <SelectItem key={cat.id_categoria} value={String(cat.id_categoria)}>
                      {cat.nome}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              {errors.id_categoria && (
                <p className="text-xs text-destructive">{errors.id_categoria}</p>
              )}
            </Field>

            {/* Subcategoria */}
            <Field>
              <FieldLabel>
                Subcategoria
                <span className="ml-1 text-xs text-muted-foreground">(opcional)</span>
              </FieldLabel>
              <Select
                key={form.id_categoria}
                value={form.id_subcategoria ? String(form.id_subcategoria) : ""}
                onValueChange={(val) =>
                  setField("id_subcategoria", val ? Number(val) : undefined)
                }
                disabled={!form.id_categoria || subcategoriasFiltradas.length === 0}
              >
                <SelectTrigger className="w-full">
                  <SelectValue placeholder="Selecione uma subcategoria" />
                </SelectTrigger>
                <SelectContent>
                  {subcategoriasFiltradas.map((sub) => (
                    <SelectItem key={sub.id_subcategoria} value={String(sub.id_subcategoria)}>
                      {sub.nome}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              {errors.id_subcategoria && (
                <p className="text-xs text-destructive">{errors.id_subcategoria}</p>
              )}
            </Field>

            {/* Tipo de Transação */}
            <Field>
              <FieldLabel>Tipo de Transação</FieldLabel>
              <Select
                value={form.tipo_transacao}
                onValueChange={(val) =>
                  setField("tipo_transacao", val as "fixa" | "variavel" | "parcelado")
                }
              >
                <SelectTrigger className="w-full">
                  <SelectValue placeholder="Selecione o tipo" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="fixa">Fixa</SelectItem>
                  <SelectItem value="variavel">Variável</SelectItem>
                  <SelectItem value="parcelado">Parcelado</SelectItem>
                </SelectContent>
              </Select>
              {errors.tipo_transacao && (
                <p className="text-xs text-destructive">{errors.tipo_transacao}</p>
              )}
            </Field>

            {/* Valor */}
            <Field>
              <FieldLabel>Valor (R$)</FieldLabel>
              <Input
                type="number"
                min={0}
                step={0.01}
                placeholder="0,00"
                value={form.valor || ""}
                onChange={(e) => setField("valor", parseFloat(e.target.value) || 0)}
              />
              {errors.valor && (
                <p className="text-xs text-destructive">{errors.valor}</p>
              )}
            </Field>

            {/* Data Pagamento + Data Último Pagamento em linha no desktop */}
            <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
              <Field>
                <FieldLabel>Data de Pagamento</FieldLabel>
                <Input
                  type="date"
                  value={form.data_pagamento}
                  onChange={(e) => setField("data_pagamento", e.target.value)}
                />
                {errors.data_pagamento && (
                  <p className="text-xs text-destructive">{errors.data_pagamento}</p>
                )}
              </Field>

              <Field>
                <FieldLabel>
                  Último Pagamento
                  <span className="ml-1 text-xs text-muted-foreground">(opcional)</span>
                </FieldLabel>
                <Input
                  type="date"
                  value={form.data_ultimo_pagamento ?? ""}
                  onChange={(e) => setField("data_ultimo_pagamento", e.target.value || undefined)}
                />
                {errors.data_ultimo_pagamento && (
                  <p className="text-xs text-destructive">{errors.data_ultimo_pagamento}</p>
                )}
              </Field>
            </div>

          </FieldGroup>

          <DialogFooter className="mt-6 flex-col gap-2 sm:flex-row">
            <Button
              type="button"
              variant="outline"
              className="w-full sm:w-auto"
              onClick={() => onOpenChange(false)}
              disabled={isLoading || isFetching}
            >
              Cancelar
            </Button>
            <Button
              type="submit"
              className="w-full sm:w-auto"
              disabled={isLoading || isFetching}
            >
              {isFetching ? "Carregando..." : isLoading ? "Salvando..." : isEditing ? "Salvar Alterações" : "Adicionar"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}
