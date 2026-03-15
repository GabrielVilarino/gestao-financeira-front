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
  dataTermino: z.date().optional(),
  valor: z.number().positive("Valor deve ser positivo"),
  categoria: z.enum(["aluguel", "casa", "caucao", "alimentacao", "transporte", "lazer", "saude", "educacao", "internet", "assinaturas", "outros"]),
  subCategoria: z.enum(["geladeira", "cama", "bebedouro", "colchão", "maquina de lavar", "robo aspirador", "celular"]).optional(),
  tipo: z.enum(["fixa", "parcelada"]),
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
    },
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
          Data
          <ArrowUpDown className="ml-2 h-4 w-4" />
        </Button>
      )
    },
    cell: ({ row }) => {
      const data = row.getValue("data") as Date
      return (
        <div className="w-full flex justify-center">
          {new Intl.DateTimeFormat("pt-BR").format(data)}
        </div>
      )
    },
  },
  {
    accessorKey: "dataTermino",
    header: ({ column }) => {
      return (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
          className="w-full justify-center"
        >
          Data do Último Pagamento
          <ArrowUpDown className="ml-2 h-4 w-4" />
        </Button>
      )
    },
    cell: ({ row }) => {
      const data = row.getValue("dataTermino") as Date | undefined
      if (!data) return <div className="w-full flex justify-center">—</div>
      return (
        <div className="w-full flex justify-center">
          {new Intl.DateTimeFormat("pt-BR").format(data)}
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
          Valor
        </Button>
      )
    },
    cell: ({ row }) => {
      const valor = row.getValue("valor") as number
      return <div className="w-full flex justify-center">{new Intl.NumberFormat("pt-BR", {
        style: "currency",
        currency: "BRL",
      }).format(valor)}</div>
    },
  },
  {
    accessorKey: "categoria",
    header: ({ column }) => {
      return (
        <Button
          variant="ghost"
          className="w-full justify-center hover:cursor-default hover:bg-transparent"
        >
          Categoria
        </Button>
      )
    },
    cell: ({ row }) => {
      const categoria = row.getValue("categoria") as string
      return <div className="w-full flex justify-center">{categoria.charAt(0).toUpperCase() + categoria.slice(1)}</div>
    },
  },
  {
    accessorKey: "subCategoria",
    header: ({ column }) => {
      return (
        <Button
          variant="ghost"
          className="w-full justify-center hover:cursor-default hover:bg-transparent"
        >
          Subcategoria
        </Button>
      )
    },
    cell: ({ row }) => {
      const subCategoria = row.getValue("subCategoria") as string | undefined
      if (!subCategoria) return <div className="w-full flex justify-center">—</div>
      return <div className="w-full flex justify-center">{subCategoria.charAt(0).toUpperCase() + subCategoria.slice(1)}</div>
    },
  },
  {
    accessorKey: "tipo",
    header: ({ column }) => {
      return (
        <Button
          variant="ghost"
          className="w-full p-0 justify-center hover:cursor-default hover:bg-transparent"
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
