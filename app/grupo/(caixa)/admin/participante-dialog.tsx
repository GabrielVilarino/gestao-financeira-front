"use client"

import { useEffect, useState } from "react"
import { z } from "zod"

import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Field, FieldGroup, FieldLabel } from "@/components/ui/field"
import { Input } from "@/components/ui/input"

const participanteFormSchema = z.object({
  email: z.email("Informe um email valido"),
})

export type ParticipanteFormData = z.infer<typeof participanteFormSchema>

interface ParticipanteDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  onSubmit: (data: ParticipanteFormData) => Promise<void>
}

const INITIAL_FORM: ParticipanteFormData = {
  email: "",
}

export function ParticipanteDialog({
  open,
  onOpenChange,
  onSubmit,
}: ParticipanteDialogProps) {
  const [form, setForm] = useState<ParticipanteFormData>(INITIAL_FORM)
  const [error, setError] = useState<string | undefined>()
  const [isLoading, setIsLoading] = useState(false)

  useEffect(() => {
    if (!open) {
      setForm(INITIAL_FORM)
      setError(undefined)
    }
  }, [open])

  async function handleSubmit(event: React.FormEvent) {
    event.preventDefault()
    setError(undefined)

    const result = participanteFormSchema.safeParse(form)

    if (!result.success) {
      setError(result.error.issues[0]?.message)
      return
    }

    setIsLoading(true)

    try {
      await onSubmit(result.data)
      onOpenChange(false)
    } catch {
      // Erro tratado pela pagina
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="w-[calc(100%-2rem)] max-w-md sm:max-w-lg">
        <DialogHeader>
          <DialogTitle>Adicionar membro</DialogTitle>
        </DialogHeader>

        <form onSubmit={handleSubmit} noValidate>
          <FieldGroup className="gap-5 py-2">
            <Field>
              <FieldLabel htmlFor="email">Email do usuario</FieldLabel>
              <Input
                id="email"
                type="email"
                placeholder="Digite o email do usuario"
                value={form.email}
                onChange={(event) =>
                  setForm({ email: event.target.value })
                }
              />
              {error && <p className="text-xs text-destructive">{error}</p>}
            </Field>
          </FieldGroup>

          <DialogFooter>
            <Button
              type="button"
              variant="outline"
              onClick={() => onOpenChange(false)}
              disabled={isLoading}
            >
              Cancelar
            </Button>
            <Button type="submit" disabled={isLoading}>
              {isLoading ? "Adicionando..." : "Adicionar"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}