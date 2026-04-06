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

import { Categorias, GanhoDetalhe, Subcategorias } from "./types"

// == Schema de validação == //
const ganhoFormSchema = z.object({
  id_categoria: z.number({ error: "Categoria é obrigatória" }).int().positive("Categoria inválida"),
  id_subcategoria: z.number().int().positive("Subcategoria inválida").optional(),
  tipo_transacao: z.enum(["fixa", "variavel"] as const, { error: "Tipo de transação é obrigatório" }),
  valor: z.number({ error: "Valor é obrigatório" }).positive("Valor deve ser positivo"),
  data_recebimento: z.string().min(1, "Data de recebimento é obrigatória"),
})

export type GanhoFormData = z.infer<typeof ganhoFormSchema>

interface GanhoDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  id?: number
  categorias?: Categorias[]
  subcategorias?: Subcategorias[]
  onSubmit: (data: GanhoFormData, id?: number) => Promise<void>
}

const INITIAL_FORM: GanhoFormData = {
  id_categoria: 0,
  id_subcategoria: undefined,
  tipo_transacao: "fixa",
  valor: 0,
  data_recebimento: "",
}

async function fetchGanhoDetalhe(id: number): Promise<GanhoFormData> {
  const res = await fetch(`/api/ganhos/${id}`)
  const data: GanhoDetalhe = await res.json()
  return {
    id_categoria: data.id_categoria,
    id_subcategoria: data.id_subcategoria ?? undefined,
    tipo_transacao: data.tipo_transacao,
    valor: data.valor,
    data_recebimento: data.data_recebimento.slice(0, 10),
  }
}

export function GanhoDialog({
  open,
  onOpenChange,
  id,
  categorias = [],
  subcategorias = [],
  onSubmit,
}: GanhoDialogProps) {
  const isEditing = id !== undefined

  const [form, setForm] = useState<GanhoFormData>(INITIAL_FORM)
  const [errors, setErrors] = useState<Partial<Record<keyof GanhoFormData, string>>>({})
  const [isLoading, setIsLoading] = useState(false)
  const [isFetching, setIsFetching] = useState(false)

  // Subcategorias filtradas pela categoria selecionada
  const subcategoriasFiltradas = subcategorias.filter(
    (s) => s.id_categoria === form.id_categoria
  )

  // Limpa ou popula o formulário ao abrir/fechar
  useEffect(() => {
    if (!open) {
      setForm(INITIAL_FORM)
      setErrors({})
      return
    }

    if (!id) return

    setIsFetching(true)
    fetchGanhoDetalhe(id)
      .then(setForm)
      .catch(() => {})
      .finally(() => setIsFetching(false))
  }, [open, id])

  function setField<K extends keyof GanhoFormData>(key: K, value: GanhoFormData[K]) {
    setForm((prev) => ({ ...prev, [key]: value }))
    setErrors((prev) => ({ ...prev, [key]: undefined }))
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setErrors({})

    const result = ganhoFormSchema.safeParse({
      ...form,
      id_subcategoria: form.id_subcategoria || undefined,
    })

    if (!result.success) {
      const fieldErrors: Partial<Record<keyof GanhoFormData, string>> = {}
      result.error.issues.forEach((issue) => {
        const key = issue.path[0] as keyof GanhoFormData
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
          <DialogTitle>{isEditing ? "Editar Ganho" : "Novo Ganho"}</DialogTitle>
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
                  setField("tipo_transacao", val as "fixa" | "variavel")
                }
              >
                <SelectTrigger className="w-full">
                  <SelectValue placeholder="Selecione o tipo" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="fixa">Fixa</SelectItem>
                  <SelectItem value="variavel">Variável</SelectItem>
                </SelectContent>
              </Select>
              {errors.tipo_transacao && (
                <p className="text-xs text-destructive">{errors.tipo_transacao}</p>
              )}
            </Field>

            {/* Valor + Data em linha no desktop */}
            <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
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

              {/* Data de Recebimento */}
              <Field>
                <FieldLabel>Data de Recebimento</FieldLabel>
                <Input
                  type="date"
                  value={form.data_recebimento}
                  onChange={(e) => setField("data_recebimento", e.target.value)}
                />
                {errors.data_recebimento && (
                  <p className="text-xs text-destructive">{errors.data_recebimento}</p>
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
