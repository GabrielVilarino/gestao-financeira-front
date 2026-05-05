"use client"

import { z } from "zod"

import { ColumnDef } from "@tanstack/react-table"
import {
  MoreHorizontal,
  ArrowUpDown,
  Tag,
  Layers,
  User,
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

export function renderCategoriaMobileCard(
  categoria: Categoria,
  meta: {
    onEdit?: (id: number) => void
    onDelete?: (id: number) => void
  }
) {
  return (
    <Card key={categoria.id_categoria} className="w-full">
      <CardHeader className="flex flex-row items-start justify-between pb-2 gap-2">
        <CardTitle className="text-base font-semibold leading-tight">
          {categoria.nome}
        </CardTitle>
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
              onSelect={() => meta.onEdit?.(categoria.id_categoria)}
            >
              Editar Categoria
            </DropdownMenuItem>
            <DropdownMenuItem
              className="hover:cursor-pointer text-destructive focus:text-destructive"
              onSelect={() => meta.onDelete?.(categoria.id_categoria)}
            >
              Excluir Categoria
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </CardHeader>
      <CardContent className="grid grid-cols-2 gap-x-4 gap-y-2 text-sm">
        <div className="flex items-center gap-1.5 text-muted-foreground">
          <Tag className="h-3.5 w-3.5 shrink-0" />
          <span>Tipo</span>
        </div>
        <div className="text-right font-medium">
          {categoria.tipo_movimentacao.charAt(0).toUpperCase() + categoria.tipo_movimentacao.slice(1).toLowerCase()}
        </div>

        <div className="flex items-center gap-1.5 text-muted-foreground">
          <User className="h-3.5 w-3.5 shrink-0" />
          <span>Origem</span>
        </div>
        <div className="text-right">
          {categoria.id_usuario == null ? "Padrão" : "Personalizado"}
        </div>
      </CardContent>
    </Card>
  )
}

export function renderSubCategoriaMobileCard(
  subcategoria: SubCategoria,
  meta: {
    onEdit?: (id: number) => void
    onDelete?: (id: number) => void
  }
) {
  return (
    <Card key={subcategoria.id_subcategoria} className="w-full">
      <CardHeader className="flex flex-row items-start justify-between pb-2 gap-2">
        <CardTitle className="text-base font-semibold leading-tight">
          {subcategoria.nome}
        </CardTitle>
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
              onSelect={() => meta.onEdit?.(subcategoria.id_subcategoria)}
            >
              Editar SubCategoria
            </DropdownMenuItem>
            <DropdownMenuItem
              className="hover:cursor-pointer text-destructive focus:text-destructive"
              onSelect={() => meta.onDelete?.(subcategoria.id_subcategoria)}
            >
              Excluir SubCategoria
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </CardHeader>
      <CardContent className="grid grid-cols-2 gap-x-4 gap-y-2 text-sm">
        <div className="flex items-center gap-1.5 text-muted-foreground">
          <Layers className="h-3.5 w-3.5 shrink-0" />
          <span>Categoria</span>
        </div>
        <div className="text-right font-medium">
          {subcategoria.nome_categoria ?? "—"}
        </div>
      </CardContent>
    </Card>
  )
}
