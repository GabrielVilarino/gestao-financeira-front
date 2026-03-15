"use client"

import { z } from "zod"

import { ColumnDef } from "@tanstack/react-table"
import { 
  MoreHorizontal,
  ArrowUpDown,
  Dice1,
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

export const ganhoSchema = z.object({
  id: z.number().positive("ID deve ser positivo"),
  pessoa: z.string().min(1, "Nome da pessoa é obrigatório"),
  data: z.date(),
  valor: z.number().positive("Valor deve ser positivo"),
  tipo: z.enum(["salario", "outros"]),
})

export type Ganho = z.infer<typeof ganhoSchema>

export const columns: ColumnDef<Ganho>[] = [
  {
    accessorKey: "pessoa",
    header: ({ column }) => {
      return (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
          className="w-full justify-center"
        >
          Pessoa
          <ArrowUpDown className="ml-2 h-4 w-4" />
        </Button>
      )
    },
    cell: ({ row }) => {
      const pessoa = row.getValue("pessoa") as string
      return <div className="w-full flex justify-center">{pessoa}</div>
    }
  },
  {
    accessorKey: "data",
    header: ({ column }) => {
      return (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
          className="w-full justify-center"
        >
          Data de Recebimento
          <ArrowUpDown className="ml-2 h-4 w-4" />
        </Button>
      )
    },
    cell: ({ row }) => {
      const data = row.getValue("data") as Date

      return (
        <div className="w-full flex justify-center">
          {new Intl.DateTimeFormat("pt-BR", {
            day: "2-digit",
            month: "2-digit",
            year: "numeric",
          }).format(data)}
        </div>
      )
    },
  },
  {
    accessorKey: "valor",
    header: ({ column }) => {
      return (
        <Button
          variant="ghost"
          className="w-full justify-center hover:cursor-default hover:bg-transparent"
        >
          Valor Recebido
        </Button>
      )
    },
    cell: ({ row }) => {
      const valor = row.getValue("valor") as number
      return (
        <div className="w-full flex justify-center">
          {new Intl.NumberFormat("pt-BR", {
            style: "currency",
            currency: "BRL",
          }).format(valor)}
        </div>
      )
    },
  },
  {
    accessorKey: "tipo",
    header: ({ column }) => {
      return (
        <Button
          variant="ghost"
          className="w-full justify-center hover:cursor-default hover:bg-transparent"
        >
          Tipo
        </Button>
      )
    },
    cell: ({ row }) => {
      const tipo = row.getValue("tipo") as string
      return <div className="w-full flex justify-center">{tipo.charAt(0).toUpperCase() + tipo.slice(1)}</div>
    },
  },
  {
    id: "ações",
    cell: ({ row }) => {
      const ganho = row.original
 
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
            <DropdownMenuItem className="hover:cursor-pointer">Editar Ganho</DropdownMenuItem>
            <DropdownMenuItem className="hover:cursor-pointer">Excluir Ganho</DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      )
    },
  },
]