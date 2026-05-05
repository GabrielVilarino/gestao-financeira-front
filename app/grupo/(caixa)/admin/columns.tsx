"use client"

import { z } from "zod"

import { ColumnDef } from "@tanstack/react-table"
import { 
  MoreHorizontal,
  ArrowUpDown,
  CalendarDays,
  Mail,
  ShieldCheck,
} from "lucide-react"

import { Button } from "@/components/ui/button"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"

export const pessoaSchema = z.object({
  id: z.number().positive("ID deve ser positivo"),
  nome: z.string().min(1, "Nome da pessoa é obrigatório"),
  email: z.string().min(1, "Email da pessoa é obrigatório"),
  data_criacao: z.date(),
  is_admin: z.boolean(),
})

export type Participante = z.infer<typeof pessoaSchema>

export const columns: ColumnDef<Participante>[] = [
  {
    accessorKey: "nome",
    header: ({ column }) => {
      return (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
          className="w-full justify-center"
        >
          Nome
          <ArrowUpDown className="ml-2 h-4 w-4" />
        </Button>
      )
    },
    cell: ({ row }) => {
      const nome = row.getValue("nome") as string
      return <div className="w-full flex justify-center">{nome}</div>
    }
  },
  {
    accessorKey: "email",
    header: ({ column }) => {
      return (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
          className="w-full justify-center"
        >
          Email
          <ArrowUpDown className="ml-2 h-4 w-4" />
        </Button>
      )
    },
    cell: ({ row }) => {
      const email = row.getValue("email") as string
      return <div className="w-full flex justify-center">{email}</div>
    }
  },
  {
    accessorKey: "data_criacao",
    header: ({ column }) => {
      return (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
          className="w-full justify-center"
        >
          Data de Criação
          <ArrowUpDown className="ml-2 h-4 w-4" />
        </Button>
      )
    },
    cell: ({ row }) => {
      const data = new Date(row.getValue("data_criacao") as string);

      return (
        <div className="w-full flex justify-center">
          {new Intl.DateTimeFormat("pt-BR", {
            timeZone: "UTC",
            day: "2-digit",
            month: "2-digit",
            year: "numeric",
          }).format(data)}
        </div>
      )
    },
  },
  {
    accessorKey: "is_admin",
    header: ({ column }) => {
      return (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
          className="w-full justify-center"
        >
          Admin
          <ArrowUpDown className="ml-2 h-4 w-4" />
        </Button>
      )
    },
    cell: ({ row }) => {
      const isAdmin = row.getValue("is_admin") as boolean
      return (
        <div className="w-full flex justify-center">
          {isAdmin ? "Sim" : "Não"}
        </div>
      )
    },
  },
  {
    id: "ações",
    cell: ({ row, table }) => {
      const participante = row.original
 
      return (
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" className="h-8 w-8 p-0">
              <span className="sr-only">Open menu</span>
              <MoreHorizontal className="h-4 w-4" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuLabel>Ações</DropdownMenuLabel>
            <DropdownMenuSeparator />
            <DropdownMenuItem
              className="hover:cursor-pointer"
              onSelect={() =>
                table.options.meta?.onToggleAdminRow?.(
                  participante.id,
                  participante.is_admin
                )
              }
            >
              {participante.is_admin
                ? "Remover administrador"
                : "Tornar administrador"}
            </DropdownMenuItem>
            <DropdownMenuItem className="hover:cursor-pointer text-destructive focus:text-destructive" onSelect={() => table.options.meta?.onDeleteRow?.(participante.id)}>Excluir Participante</DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      )
    },
  },
]

const dateFormatter = new Intl.DateTimeFormat("pt-BR", {
  timeZone: "UTC",
  day: "2-digit",
  month: "2-digit",
  year: "numeric",
})

export function renderMobileCard(
  participante: Participante,
  meta: {
    onDelete?: (id: number) => void
    onToggleAdmin?: (id: number, isAdmin: boolean) => void
  }
) {
  return (
    <Card key={participante.id} className="w-full">
      <CardHeader className="flex flex-row items-start justify-between pb-2 gap-2">
        <div className="flex flex-col gap-1">
          <CardTitle className="text-base font-semibold leading-tight">
            {participante.nome}
          </CardTitle>
          {participante.is_admin && (
            <span className="inline-flex items-center rounded-full border px-2 py-0.5 text-xs font-medium text-muted-foreground">
              Administrador
            </span>
          )}
        </div>
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" className="h-8 w-8 shrink-0 p-0">
              <span className="sr-only">Abrir menu</span>
              <MoreHorizontal className="h-4 w-4" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuLabel>Ações</DropdownMenuLabel>
            <DropdownMenuSeparator />
            <DropdownMenuItem
              className="hover:cursor-pointer"
              onSelect={() => meta.onToggleAdmin?.(participante.id, participante.is_admin)}
            >
              {participante.is_admin ? "Remover administrador" : "Tornar administrador"}
            </DropdownMenuItem>
            <DropdownMenuItem
              className="hover:cursor-pointer text-destructive focus:text-destructive"
              onSelect={() => meta.onDelete?.(participante.id)}
            >
              Excluir Participante
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </CardHeader>
      <CardContent className="grid grid-cols-2 gap-x-4 gap-y-2 text-sm">
        <div className="flex items-center gap-1.5 text-muted-foreground">
          <Mail className="h-3.5 w-3.5 shrink-0" />
          <span>Email</span>
        </div>
        <div className="text-right font-medium truncate">
          {participante.email}
        </div>

        <div className="flex items-center gap-1.5 text-muted-foreground">
          <CalendarDays className="h-3.5 w-3.5 shrink-0" />
          <span>Membro desde</span>
        </div>
        <div className="text-right">
          {dateFormatter.format(new Date(participante.data_criacao as unknown as string))}
        </div>

        <div className="flex items-center gap-1.5 text-muted-foreground">
          <ShieldCheck className="h-3.5 w-3.5 shrink-0" />
          <span>Admin</span>
        </div>
        <div className="text-right">
          {participante.is_admin ? "Sim" : "Não"}
        </div>
      </CardContent>
    </Card>
  )
}
