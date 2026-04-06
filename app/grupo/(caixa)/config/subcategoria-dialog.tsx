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

import { Categoria } from "./columns"

const subCategoriaFormSchema = z.object({
  id_categoria: z.number({ error: "Categoria é obrigatória" }).int().positive("Categoria inválida"),
  nome: z.string().min(1, "Nome é obrigatório"),
})

export type SubCategoriaFormData = z.infer<typeof subCategoriaFormSchema>

interface SubCategoriaDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  id?: number
  categorias?: Categoria[]
  initialData?: SubCategoriaFormData
  onSubmit: (data: SubCategoriaFormData, id?: number) => Promise<void>
}

const INITIAL_FORM: SubCategoriaFormData = {
  id_categoria: 0,
  nome: "",
}

export function SubCategoriaDialog({
  open,
  onOpenChange,
  id,
  categorias = [],
  initialData,
  onSubmit,
}: SubCategoriaDialogProps) {
  const isEditing = id !== undefined

  const [form, setForm] = useState<SubCategoriaFormData>(INITIAL_FORM)
  const [errors, setErrors] = useState<Partial<Record<keyof SubCategoriaFormData, string>>>({})
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

  function setField<K extends keyof SubCategoriaFormData>(key: K, value: SubCategoriaFormData[K]) {
    setForm((prev) => ({ ...prev, [key]: value }))
    setErrors((prev) => ({ ...prev, [key]: undefined }))
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setErrors({})

    const result = subCategoriaFormSchema.safeParse(form)

    if (!result.success) {
      const fieldErrors: Partial<Record<keyof SubCategoriaFormData, string>> = {}
      result.error.issues.forEach((issue) => {
        const key = issue.path[0] as keyof SubCategoriaFormData
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
          <DialogTitle>{isEditing ? "Editar SubCategoria" : "Nova SubCategoria"}</DialogTitle>
        </DialogHeader>

        <form onSubmit={handleSubmit} noValidate>
          <FieldGroup className="gap-5 py-2">

            {/* Categoria */}
            <Field>
              <FieldLabel>Categoria</FieldLabel>
              <Select
                value={form.id_categoria ? String(form.id_categoria) : ""}
                onValueChange={(val) => setField("id_categoria", Number(val))}
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

            {/* Nome */}
            <Field>
              <FieldLabel>Nome</FieldLabel>
              <Input
                type="text"
                placeholder="Nome da subcategoria"
                value={form.nome}
                onChange={(e) => setField("nome", e.target.value)}
              />
              {errors.nome && (
                <p className="text-xs text-destructive">{errors.nome}</p>
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
