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

export const despesaSchema = z.object({
  id: z.number().positive("ID deve ser positivo"),
  nome: z.string().min(1, "Nome é obrigatório"),
  data: z.string(),
  data_ult_pagamento: z.string().nullable(),
  valor: z.number().positive("Valor deve ser positivo"),
  categoria: z.string(),
  subcategoria: z.string(),
  tipo: z.string(),
})

export type Despesa = z.infer<typeof despesaSchema>

export const columns: ColumnDef<Despesa>[] = [
  {
    accessorKey: "nome",
    header: ({ column }) => (
      <Button
        variant="ghost"
        onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        className="w-full justify-center"
      >
        Nome
        <ArrowUpDown className="ml-2 h-4 w-4" />
      </Button>
    ),
    cell: ({ row }) => (
      <div className="w-full flex justify-center">{row.getValue("nome")}</div>
    ),
  },
  {
    accessorKey: "data",
    header: ({ column }) => (
      <Button
        variant="ghost"
        onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        className="w-full justify-center"
      >
        Data do Pagamento
        <ArrowUpDown className="ml-2 h-4 w-4" />
      </Button>
    ),
    cell: ({ row }) => {
      const data = new Date(row.getValue("data") as string)
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
    accessorKey: "data_ult_pagamento",
    header: () => (
      <Button variant="ghost" className="w-full justify-center hover:cursor-default hover:bg-transparent">
        Último Pagamento
      </Button>
    ),
    cell: ({ row }) => {
      const data = row.getValue("data_ult_pagamento") as string | null
      if (!data) return <div className="w-full flex justify-center">—</div>
      return (
        <div className="w-full flex justify-center">
          {new Intl.DateTimeFormat("pt-BR", {
            timeZone: "UTC",
            day: "2-digit",
            month: "2-digit",
            year: "numeric",
          }).format(new Date(data))}
        </div>
      )
    },
  },
  {
    accessorKey: "valor",
    header: () => (
      <Button variant="ghost" className="w-full justify-center hover:cursor-default hover:bg-transparent">
        Valor
      </Button>
    ),
    cell: ({ row }) => {
      const valor = row.getValue("valor") as number
      return (
        <div className="w-full flex justify-center">
          {new Intl.NumberFormat("pt-BR", { style: "currency", currency: "BRL" }).format(valor)}
        </div>
      )
    },
  },
  {
    accessorKey: "categoria",
    header: () => (
      <Button variant="ghost" className="w-full justify-center hover:cursor-default hover:bg-transparent">
        Categoria
      </Button>
    ),
    cell: ({ row }) => {
      const categoria = row.getValue("categoria") as string
      return (
        <div className="w-full flex justify-center">
          {categoria.charAt(0).toUpperCase() + categoria.slice(1).toLowerCase()}
        </div>
      )
    },
  },
  {
    accessorKey: "subcategoria",
    header: () => (
      <Button variant="ghost" className="w-full justify-center hover:cursor-default hover:bg-transparent">
        Subcategoria
      </Button>
    ),
    cell: ({ row }) => {
      const subcategoria = row.getValue("subcategoria") as string
      if (!subcategoria) return <div className="w-full flex justify-center">—</div>
      return (
        <div className="w-full flex justify-center">
          {subcategoria.charAt(0).toUpperCase() + subcategoria.slice(1).toLowerCase()}
        </div>
      )
    },
  },
  {
    accessorKey: "tipo",
    header: () => (
      <Button variant="ghost" className="w-full justify-center hover:cursor-default hover:bg-transparent">
        Tipo
      </Button>
    ),
    cell: ({ row }) => {
      const tipo = row.getValue("tipo") as string
      return (
        <div className="w-full flex justify-center">
          {tipo.charAt(0).toUpperCase() + tipo.slice(1).toLowerCase()}
        </div>
      )
    },
  },
  {
    id: "ações",
    cell: ({ row, table }) => {
      const despesa = row.original

      return (
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" className="h-8 w-8 p-0">
              <span className="sr-only">Abrir menu</span>
              <MoreHorizontal className="h-4 w-4" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuLabel>Ações</DropdownMenuLabel>
            <DropdownMenuSeparator />
            <DropdownMenuItem
              className="hover:cursor-pointer"
              onSelect={() => table.options.meta?.onEditRow?.(despesa.id)}
            >
              Editar Despesa
            </DropdownMenuItem>
            <DropdownMenuItem
              className="hover:cursor-pointer text-destructive focus:text-destructive"
              onSelect={() => table.options.meta?.onDeleteRow?.(despesa.id)}
            >
              Excluir Despesa
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      )
    },
  },
]


