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

export const categoriaSchema = z.object({
  id_categoria: z.number(),
  nome: z.string(),
  tipo_movimentacao: z.string(),
  id_usuario: z.number().nullable().optional(),
})

export const subCategoriaSchema = z.object({
  id_subcategoria: z.number(),
  id_categoria: z.number(),
  nome: z.string(),
  nome_categoria: z.string().optional(),
})

export type Categoria = z.infer<typeof categoriaSchema>
export type SubCategoria = z.infer<typeof subCategoriaSchema>

export const columnsCategorias: ColumnDef<Categoria>[] = [
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
    accessorKey: "tipo_movimentacao",
    header: () => (
      <Button variant="ghost" className="w-full justify-center hover:cursor-default hover:bg-transparent">
        Tipo
      </Button>
    ),
    cell: ({ row }) => {
      const tipo = row.getValue("tipo_movimentacao") as string
      return (
        <div className="w-full flex justify-center">
          {tipo.charAt(0).toUpperCase() + tipo.slice(1).toLowerCase()}
        </div>
      )
    },
  },
  {
    accessorKey: "id_usuario",
    header: () => (
      <Button variant="ghost" className="w-full justify-center hover:cursor-default hover:bg-transparent">
        Origem
      </Button>
    ),
    cell: ({ row }) => {
      const idUsuario = row.getValue("id_usuario") as number | null | undefined
      return (
        <div className="w-full flex justify-center">
          {idUsuario == null ? "Padrão" : "Personalizado"}
        </div>
      )
    },
  },
  {
    id: "ações",
    cell: ({ row, table }) => {
      const categoria = row.original

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
              onSelect={() => table.options.meta?.onEditRow?.(categoria.id_categoria)}
            >
              Editar Categoria
            </DropdownMenuItem>
            <DropdownMenuItem
              className="hover:cursor-pointer text-destructive focus:text-destructive"
              onSelect={() => table.options.meta?.onDeleteRow?.(categoria.id_categoria)}
            >
              Excluir Categoria
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      )
    },
  },
]

export const columnsSubCategorias: ColumnDef<SubCategoria>[] = [
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
    accessorKey: "nome_categoria",
    header: ({ column }) => (
      <Button
        variant="ghost"
        onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        className="w-full justify-center"
      >
        Categoria
        <ArrowUpDown className="ml-2 h-4 w-4" />
      </Button>
    ),
    cell: ({ row }) => (
      <div className="w-full flex justify-center">{row.getValue("nome_categoria")}</div>
    ),
  },
  {
    id: "ações",
    cell: ({ row, table }) => {
      const subcategoria = row.original

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
              onSelect={() => table.options.meta?.onEditRow?.(subcategoria.id_subcategoria)}
            >
              Editar SubCategoria
            </DropdownMenuItem>
            <DropdownMenuItem
              className="hover:cursor-pointer text-destructive focus:text-destructive"
              onSelect={() => table.options.meta?.onDeleteRow?.(subcategoria.id_subcategoria)}
            >
              Excluir SubCategoria
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      )
    },
  },
]
