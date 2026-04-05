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

const categoriaFormSchema = z.object({
  nome: z.string().min(1, "Nome é obrigatório"),
  tipo_movimentacao: z.enum(["receita", "despesa"] as const, {
    error: "Tipo de movimentação é obrigatório",
  }),
})

export type CategoriaFormData = z.infer<typeof categoriaFormSchema>

interface CategoriaDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  id?: number
  initialData?: CategoriaFormData
  onSubmit: (data: CategoriaFormData, id?: number) => Promise<void>
}

const INITIAL_FORM: CategoriaFormData = {
  nome: "",
  tipo_movimentacao: "despesa",
}

export function CategoriaDialog({
  open,
  onOpenChange,
  id,
  initialData,
  onSubmit,
}: CategoriaDialogProps) {
  const isEditing = id !== undefined

  const [form, setForm] = useState<CategoriaFormData>(INITIAL_FORM)
  const [errors, setErrors] = useState<Partial<Record<keyof CategoriaFormData, string>>>({})
  const [isLoading, setIsLoading] = useState(false)

  useEffect(() => {
    if (!open) {
      setForm(INITIAL_FORM)
      setErrors({})
      return
    }
    if (initialData) {
      setForm(initialData)
    }
  }, [open, initialData])

  function setField<K extends keyof CategoriaFormData>(key: K, value: CategoriaFormData[K]) {
    setForm((prev) => ({ ...prev, [key]: value }))
    setErrors((prev) => ({ ...prev, [key]: undefined }))
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setErrors({})

    const result = categoriaFormSchema.safeParse(form)

    if (!result.success) {
      const fieldErrors: Partial<Record<keyof CategoriaFormData, string>> = {}
      result.error.issues.forEach((issue) => {
        const key = issue.path[0] as keyof CategoriaFormData
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
          <DialogTitle>{isEditing ? "Editar Categoria" : "Nova Categoria"}</DialogTitle>
        </DialogHeader>

        <form onSubmit={handleSubmit} noValidate>
          <FieldGroup className="gap-5 py-2">

            {/* Nome */}
            <Field>
              <FieldLabel>Nome</FieldLabel>
              <Input
                type="text"
                placeholder="Nome da categoria"
                value={form.nome}
                onChange={(e) => setField("nome", e.target.value)}
              />
              {errors.nome && (
                <p className="text-xs text-destructive">{errors.nome}</p>
              )}
            </Field>

            {/* Tipo de Movimentação */}
            <Field>
              <FieldLabel>Tipo de Movimentação</FieldLabel>
              <Select
                value={form.tipo_movimentacao}
                onValueChange={(val) =>
                  setField("tipo_movimentacao", val as "receita" | "despesa")
                }
              >
                <SelectTrigger className="w-full">
                  <SelectValue placeholder="Selecione o tipo" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="receita">Receita</SelectItem>
                  <SelectItem value="despesa">Despesa</SelectItem>
                </SelectContent>
              </Select>
              {errors.tipo_movimentacao && (
                <p className="text-xs text-destructive">{errors.tipo_movimentacao}</p>
              )}
            </Field>

          </FieldGroup>

          <DialogFooter className="mt-6 flex-col gap-2 sm:flex-row">
            <Button
              type="button"
              variant="outline"
              className="w-full sm:w-auto"
              onClick={() => onOpenChange(false)}
              disabled={isLoading}
            >
              Cancelar
            </Button>
            <Button
              type="submit"
              className="w-full sm:w-auto"
              disabled={isLoading}
            >
              {isLoading ? "Salvando..." : isEditing ? "Salvar Alterações" : "Adicionar"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}
