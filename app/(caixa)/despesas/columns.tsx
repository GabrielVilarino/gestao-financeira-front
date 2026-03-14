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

// == Estrutura para Despesas Fixas == //
export const despesaFixaSchema = z.object({
  id: z.number().positive("ID deve ser positivo"),
  pessoa: z.string().min(1, "Nome da pessoa é obrigatório"),
  data: z.date(),
  valor: z.number().positive("Valor deve ser positivo"),
  categoria: z.enum(["aluguel", "alimentacao", "transporte", "lazer", "saude", "educacao", "internet", "assinaturas", "outros"]),
})

export type DespesaFixa = z.infer<typeof despesaFixaSchema>

export const columnsFixa: ColumnDef<DespesaFixa>[] = [
  {
    accessorKey: "pessoa",
    header: ({ column }) => {
      return (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
          className="p-0"
        >
          Pessoa
          <ArrowUpDown className="ml-2 h-4 w-4" />
        </Button>
      )
    },
  },
  {
    accessorKey: "data",
    header: ({ column }) => {
      return (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
          className="p-0"
        >
          Data
          <ArrowUpDown className="ml-2 h-4 w-4" />
        </Button>
      )
    },
    cell: ({ row }) => {
      const data = row.getValue("data") as Date
      return new Intl.DateTimeFormat("pt-BR", {
        day: "2-digit",
        month: "2-digit",
        year: "numeric",
      }).format(data)
    },
  },
  {
    accessorKey: "valor",
    header: ({ column }) => {
      return (
        <Button
          variant="ghost"
          className="p-0 hover:cursor-default hover:bg-transparent"
        >
          Valor
        </Button>
      )
    },
    cell: ({ row }) => {
      const valor = row.getValue("valor") as number
      return new Intl.NumberFormat("pt-BR", {
        style: "currency",
        currency: "BRL",
      }).format(valor)
    },
  },
  {
    accessorKey: "categoria",
    header: ({ column }) => {
      return (
        <Button
          variant="ghost"
          className="p-0 hover:cursor-default hover:bg-transparent"
        >
          Categoria
        </Button>
      )
    },
    cell: ({ row }) => {
      const categoria = row.getValue("categoria") as string
      return categoria.charAt(0).toUpperCase() + categoria.slice(1)
    },
  },
  {
    id: "ações",
    cell: ({ row }) => {
      const despesa = row.original
 
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
            <DropdownMenuItem className="hover:cursor-pointer">Editar Despesa</DropdownMenuItem>
            <DropdownMenuItem className="hover:cursor-pointer">Excluir Despesa</DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      )
    },
  },
]

// == Estrutura para Despesas Variáveis == //
export const despesaVariavelSchema = z.object({
  id: z.number().positive("ID deve ser positivo"),
  pessoa: z.string().min(1, "Nome da pessoa é obrigatório"),
  data: z.date(),
  valor: z.number().positive("Valor deve ser positivo"),
  categoria: z.enum(["mercado", "alimentacao", "transporte", "lazer", "saude", "educacao", "casa"]),
  subCategoria: z.enum(["matheus", "lavanderia", "fribal", "feirinha", "armazem", "energia", "outros"]).optional(),
})

export type DespesaVariavel = z.infer<typeof despesaVariavelSchema>

export const columnsVariavel: ColumnDef<DespesaVariavel>[] = [
  {
    accessorKey: "pessoa",
    header: ({ column }) => {
      return (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
          className="p-0"
        >
          Pessoa
          <ArrowUpDown className="ml-2 h-4 w-4" />
        </Button>
      )
    },
  },
  {
    accessorKey: "data",
    header: ({ column }) => {
      return (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
          className="p-0"
        >
          Data
          <ArrowUpDown className="ml-2 h-4 w-4" />
        </Button>
      )
    },
    cell: ({ row }) => {
      const data = row.getValue("data") as Date
      return new Intl.DateTimeFormat("pt-BR", {
        day: "2-digit",
        month: "2-digit",
        year: "numeric",
      }).format(data)
    },
  },
  {
    accessorKey: "valor",
    header: ({ column }) => {
      return (
        <Button
          variant="ghost"
          className="p-0 hover:cursor-default hover:bg-transparent"
        >
          Valor
        </Button>
      )
    },
    cell: ({ row }) => {
      const valor = row.getValue("valor") as number
      return new Intl.NumberFormat("pt-BR", {
        style: "currency",
        currency: "BRL",
      }).format(valor)
    },
  },
  {
    accessorKey: "categoria",
    header: ({ column }) => {
      return (
        <Button
          variant="ghost"
          className="p-0 hover:cursor-default hover:bg-transparent"
        >
          Categoria
        </Button>
      )
    },
    cell: ({ row }) => {
      const categoria = row.getValue("categoria") as string
      return categoria.charAt(0).toUpperCase() + categoria.slice(1)
    },
  },
  {
    accessorKey: "subCategoria",
    header: ({ column }) => {
      return (
        <Button
          variant="ghost"
          className="p-0 hover:cursor-default hover:bg-transparent"
        >
          Subcategoria
        </Button>
      )
    },
    cell: ({ row }) => {
      const subCategoria = row.getValue("subCategoria") as string
      return subCategoria.charAt(0).toUpperCase() + subCategoria.slice(1)
    },
  },
  {
    id: "ações",
    cell: ({ row }) => {
      const despesa = row.original
 
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
            <DropdownMenuItem className="hover:cursor-pointer">Editar Despesa</DropdownMenuItem>
            <DropdownMenuItem className="hover:cursor-pointer">Excluir Despesa</DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      )
    },
  },
]
