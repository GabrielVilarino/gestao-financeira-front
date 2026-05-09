"use client"

import { useState, useEffect } from "react"
import { z } from "zod"
import { Repeat } from "lucide-react"

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
import { Switch } from "@/components/ui/switch"

import { Categorias, DespesaDetalhe, Subcategorias } from "./types"

// == Schema de validação == //
const despesaFormSchema = z.object({
  id_categoria: z.number({ error: "Categoria é obrigatória" }).int().positive("Categoria inválida"),
  id_subcategoria: z.number().int().positive("Subcategoria inválida").optional(),
  descricao: z.string().min(1, "Descrição é obrigatória"),
  observacao: z.string().optional(),
  valor: z.number({ error: "Valor é obrigatório" }).positive("Valor deve ser positivo"),
  competencia: z.string().min(1, "Competência é obrigatória"),
  data_vencimento: z.string().optional(),
  data_pagamento: z.string().optional(),
  status: z.enum(["PENDENTE", "PAGO", "ATRASADO", "CANCELADO"]),
})

export type DespesaFormData = z.infer<typeof despesaFormSchema>

const recorrenciaFormSchema = z.object({
  id_categoria: z.number({ error: "Categoria é obrigatória" }).int().positive("Categoria inválida"),
  id_subcategoria: z.number().int().positive("Subcategoria inválida").optional(),
  descricao: z.string().min(1, "Descrição é obrigatória"),
  observacao: z.string().optional(),
  valor: z.number({ error: "Valor é obrigatório" }).positive("Valor deve ser positivo"),
  data_inicio: z.string().min(1, "Data de início é obrigatória"),
  frequencia: z.enum(["DIARIA", "SEMANAL", "MENSAL", "ANUAL"], { error: "Frequência é obrigatória" }),
  intervalo: z.number({ error: "Intervalo é obrigatório" }).int().positive("Intervalo deve ser positivo"),
  data_fim: z.string().optional(),
})

export type RecorrenciaFormData = z.infer<typeof recorrenciaFormSchema>

type RecorrenciaErrors = Partial<Record<keyof RecorrenciaFormData, string>>

interface DespesaDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  id?: number
  categorias?: Categorias[]
  subcategorias?: Subcategorias[]
  onSubmit: (data: DespesaFormData, id?: number) => Promise<void>
  onSubmitRecorrencia?: (data: RecorrenciaFormData) => Promise<void>
}

const INITIAL_FORM: DespesaFormData = {
  id_categoria: 0,
  id_subcategoria: undefined,
  descricao: "",
  observacao: undefined,
  valor: 0,
  competencia: "",
  data_vencimento: undefined,
  data_pagamento: undefined,
  status: "PENDENTE",
}

async function fetchDespesaDetalhe(id: number): Promise<DespesaFormData> {
  const res = await fetch(`/api/transacoes/${id}`)
  const data: DespesaDetalhe = await res.json()

  return {
    id_categoria: data.id_categoria,
    id_subcategoria: data.id_subcategoria ?? undefined,
    descricao: data.descricao,
    observacao: data.observacao ?? undefined,
    valor: data.valor,
    competencia: data.competencia.slice(0, 10),
    data_vencimento: data.data_vencimento ? data.data_vencimento.slice(0, 10) : undefined,
    data_pagamento: data.data_pagamento ? data.data_pagamento.slice(0, 10) : undefined,
    status: data.status,
  }
}

const INITIAL_RECORRENCIA = {
  frequencia: "MENSAL" as "DIARIA" | "SEMANAL" | "MENSAL" | "ANUAL",
  intervalo: 1,
  data_fim: "",
}

export function DespesaDialog({
  open,
  onOpenChange,
  id,
  categorias = [],
  subcategorias = [],
  onSubmit,
  onSubmitRecorrencia,
}: DespesaDialogProps) {
  const isEditing = id !== undefined

  const [form, setForm] = useState<DespesaFormData>(INITIAL_FORM)
  const [errors, setErrors] = useState<Partial<Record<keyof DespesaFormData, string>>>({})
  const [isLoading, setIsLoading] = useState(false)
  const [isFetching, setIsFetching] = useState(false)
  const [repetir, setRepetir] = useState(false)
  const [recorrencia, setRecorrencia] = useState(INITIAL_RECORRENCIA)
  const [recorrenciaErrors, setRecorrenciaErrors] = useState<RecorrenciaErrors>({})

  const subcategoriasFiltradas = subcategorias.filter(
    (s) => s.id_categoria === form.id_categoria
  )

  useEffect(() => {
    if (!open) {
      setForm(INITIAL_FORM)
      setErrors({})
      setRepetir(false)
      setRecorrencia(INITIAL_RECORRENCIA)
      setRecorrenciaErrors({})
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

  function setRecorrenciaField<K extends keyof typeof INITIAL_RECORRENCIA>(
    key: K,
    value: (typeof INITIAL_RECORRENCIA)[K]
  ) {
    setRecorrencia((prev) => ({ ...prev, [key]: value }))
    setRecorrenciaErrors((prev) => ({ ...prev, [key]: undefined }))
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setErrors({})
    setRecorrenciaErrors({})

    if (repetir) {
      const payload = {
        id_categoria: form.id_categoria,
        id_subcategoria: form.id_subcategoria || undefined,
        descricao: form.descricao,
        observacao: form.observacao,
        valor: form.valor,
        data_inicio: form.competencia,
        frequencia: recorrencia.frequencia,
        intervalo: recorrencia.intervalo,
        data_fim: recorrencia.data_fim || undefined,
      }

      const result = recorrenciaFormSchema.safeParse(payload)
      if (!result.success) {
        const fieldErrors: RecorrenciaErrors = {}
        result.error.issues.forEach((issue) => {
          const key = issue.path[0] as keyof RecorrenciaFormData
          if (!fieldErrors[key]) fieldErrors[key] = issue.message
        })
        setRecorrenciaErrors(fieldErrors)
        const mainErrors: Partial<Record<keyof DespesaFormData, string>> = {}
        if (fieldErrors.id_categoria) mainErrors.id_categoria = fieldErrors.id_categoria
        if (fieldErrors.descricao) mainErrors.descricao = fieldErrors.descricao
        if (fieldErrors.valor) mainErrors.valor = fieldErrors.valor
        if (fieldErrors.data_inicio) mainErrors.competencia = fieldErrors.data_inicio
        setErrors(mainErrors)
        return
      }

      setIsLoading(true)
      try {
        await onSubmitRecorrencia?.(result.data)
        onOpenChange(false)
      } catch {
        // Erro tratado pelo caller
      } finally {
        setIsLoading(false)
      }
      return
    }

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
      <DialogContent className="w-[calc(100%-2rem)] max-w-md sm:max-w-lg overflow-y-auto max-h-[90dvh]">
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

            {/* Descrição */}
            <Field>
              <FieldLabel>Descrição</FieldLabel>
              <Input
                type="text"
                placeholder="Ex: Conta de luz, Aluguel..."
                value={form.descricao}
                onChange={(e) => setField("descricao", e.target.value)}
              />
              {errors.descricao && (
                <p className="text-xs text-destructive">{errors.descricao}</p>
              )}
            </Field>

            {/* Observação */}
            <Field>
              <FieldLabel>
                Observação
                <span className="ml-1 text-xs text-muted-foreground">(opcional)</span>
              </FieldLabel>
              <Input
                type="text"
                placeholder="Informações adicionais..."
                value={form.observacao ?? ""}
                onChange={(e) => setField("observacao", e.target.value || undefined)}
              />
            </Field>

            {/* Valor + Data de Início / Competência em linha */}
            <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
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

              <Field>
                <FieldLabel>{repetir ? "Data de Início" : "Competência"}</FieldLabel>
                <Input
                  type="date"
                  value={form.competencia}
                  onChange={(e) => setField("competencia", e.target.value)}
                />
                {errors.competencia && (
                  <p className="text-xs text-destructive">{errors.competencia}</p>
                )}
              </Field>
            </div>

            {/* Toggle recorrência — oculto ao editar */}
            {!isEditing && (
              <div className="flex items-center gap-3 rounded-lg border border-dashed px-3 py-2">
                <Repeat className="h-4 w-4 shrink-0 text-muted-foreground" />
                <div className="flex flex-1 flex-col gap-0.5">
                  <span className="text-sm font-medium">Repetir automaticamente</span>
                  <span className="text-xs text-muted-foreground">
                    Gera essa despesa em intervalos definidos
                  </span>
                </div>
                <Switch
                  checked={repetir}
                  onCheckedChange={(checked) => {
                    setRepetir(checked)
                    setRecorrenciaErrors({})
                  }}
                />
              </div>
            )}

            {/* Campos exclusivos de recorrência */}
            {repetir && (
              <>
                <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
                  <Field>
                    <FieldLabel>Frequência</FieldLabel>
                    <Select
                      value={recorrencia.frequencia}
                      onValueChange={(val) =>
                        setRecorrenciaField("frequencia", val as "DIARIA" | "SEMANAL" | "MENSAL" | "ANUAL")
                      }
                    >
                      <SelectTrigger className="w-full">
                        <SelectValue placeholder="Selecione a frequência" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="DIARIA">Diária</SelectItem>
                        <SelectItem value="SEMANAL">Semanal</SelectItem>
                        <SelectItem value="MENSAL">Mensal</SelectItem>
                        <SelectItem value="ANUAL">Anual</SelectItem>
                      </SelectContent>
                    </Select>
                    {recorrenciaErrors.frequencia && (
                      <p className="text-xs text-destructive">{recorrenciaErrors.frequencia}</p>
                    )}
                  </Field>

                  <Field>
                    <FieldLabel>Intervalo</FieldLabel>
                    <Input
                      type="number"
                      min={1}
                      step={1}
                      placeholder="1"
                      value={recorrencia.intervalo}
                      onChange={(e) =>
                        setRecorrenciaField("intervalo", parseInt(e.target.value) || 1)
                      }
                    />
                    {recorrenciaErrors.intervalo && (
                      <p className="text-xs text-destructive">{recorrenciaErrors.intervalo}</p>
                    )}
                  </Field>
                </div>

                <Field>
                  <FieldLabel>
                    Data de Fim
                    <span className="ml-1 text-xs text-muted-foreground">(opcional — sem prazo se vazio)</span>
                  </FieldLabel>
                  <Input
                    type="date"
                    value={recorrencia.data_fim}
                    onChange={(e) => setRecorrenciaField("data_fim", e.target.value)}
                  />
                </Field>
              </>
            )}

            {/* Campos exclusivos de transação normal */}
            {!repetir && (
              <>
                <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
                  <Field>
                    <FieldLabel>
                      Data de Vencimento
                      <span className="ml-1 text-xs text-muted-foreground">(opcional)</span>
                    </FieldLabel>
                    <Input
                      type="date"
                      value={form.data_vencimento ?? ""}
                      onChange={(e) => setField("data_vencimento", e.target.value || undefined)}
                    />
                  </Field>

                  <Field>
                    <FieldLabel>
                      Data de Pagamento
                      <span className="ml-1 text-xs text-muted-foreground">(opcional)</span>
                    </FieldLabel>
                    <Input
                      type="date"
                      value={form.data_pagamento ?? ""}
                      onChange={(e) => setField("data_pagamento", e.target.value || undefined)}
                    />
                  </Field>
                </div>

                <Field>
                  <FieldLabel>Status</FieldLabel>
                  <Select
                    value={form.status}
                    onValueChange={(val) =>
                      setField("status", val as "PENDENTE" | "PAGO" | "ATRASADO" | "CANCELADO")
                    }
                  >
                    <SelectTrigger className="w-full">
                      <SelectValue placeholder="Selecione o status" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="PENDENTE">Pendente</SelectItem>
                      <SelectItem value="PAGO">Pago</SelectItem>
                      <SelectItem value="ATRASADO">Atrasado</SelectItem>
                      <SelectItem value="CANCELADO">Cancelado</SelectItem>
                    </SelectContent>
                  </Select>
                  {errors.status && (
                    <p className="text-xs text-destructive">{errors.status}</p>
                  )}
                </Field>
              </>
            )}

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
              {isFetching
                ? "Carregando..."
                : isLoading
                  ? "Salvando..."
                  : isEditing
                    ? "Salvar Alterações"
                    : repetir
                      ? "Criar Recorrência"
                      : "Adicionar"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}
