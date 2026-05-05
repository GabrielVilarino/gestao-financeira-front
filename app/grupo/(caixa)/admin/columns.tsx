"use client"

import { z } from "zod"

import { ColumnDef } from "@tanstack/react-table"
import { 
  MoreHorizontal,
  ArrowUpDown,
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