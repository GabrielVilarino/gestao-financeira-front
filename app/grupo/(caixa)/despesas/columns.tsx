"use client"

import { z } from "zod"

import { ColumnDef } from "@tanstack/react-table"
import {
  MoreHorizontal,
  ArrowUpDown,
  CalendarDays,
  Tag,
  Layers,
  Banknote,
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

export const despesaSchema = z.object({
  id: z.number().positive("ID deve ser positivo"),
  nome: z.string(),
  descricao: z.string(),
  valor: z.number().positive("Valor deve ser positivo"),
  competencia: z.string(),
  status: z.string(),
  categoria: z.string(),
  subcategoria: z.string().nullable(),
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
        Membro
        <ArrowUpDown className="ml-2 h-4 w-4" />
      </Button>
    ),
    cell: ({ row }) => (
      <div className="w-full flex justify-center">{row.getValue("nome")}</div>
    ),
  },
  {
    accessorKey: "descricao",
    header: ({ column }) => (
      <Button
        variant="ghost"
        onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        className="w-full justify-center"
      >
        Descrição
        <ArrowUpDown className="ml-2 h-4 w-4" />
      </Button>
    ),
    cell: ({ row }) => (
      <div className="w-full flex justify-center">{row.getValue("descricao")}</div>
    ),
  },
  {
    accessorKey: "competencia",
    header: ({ column }) => (
      <Button
        variant="ghost"
        onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        className="w-full justify-center"
      >
        Competência
        <ArrowUpDown className="ml-2 h-4 w-4" />
      </Button>
    ),
    cell: ({ row }) => {
      const data = new Date(row.getValue("competencia") as string)
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
    accessorKey: "status",
    header: () => (
      <Button variant="ghost" className="w-full justify-center hover:cursor-default hover:bg-transparent">
        Status
      </Button>
    ),
    cell: ({ row }) => {
      const status = row.getValue("status") as string
      return (
        <div className="w-full flex justify-center">
          {status.charAt(0).toUpperCase() + status.slice(1).toLowerCase()}
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
      const subcategoria = row.getValue("subcategoria") as string | null
      if (!subcategoria) return <div className="w-full flex justify-center">—</div>
      return (
        <div className="w-full flex justify-center">
          {subcategoria.charAt(0).toUpperCase() + subcategoria.slice(1).toLowerCase()}
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

const dateFormatter = new Intl.DateTimeFormat("pt-BR", {
  timeZone: "UTC",
  day: "2-digit",
  month: "2-digit",
  year: "numeric",
})

const currencyFormatter = new Intl.NumberFormat("pt-BR", {
  style: "currency",
  currency: "BRL",
})

export function renderMobileCard(
  despesa: Despesa,
  meta: {
    onEdit?: (id: number) => void
    onDelete?: (id: number) => void
  }
) {
  return (
    <Card key={despesa.id} className="w-full">
      <CardHeader className="flex flex-row items-start justify-between pb-2 gap-2">
        <CardTitle className="text-base font-semibold leading-tight">
          {despesa.descricao}
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
              onSelect={() => meta.onEdit?.(despesa.id)}
            >
              Editar Despesa
            </DropdownMenuItem>
            <DropdownMenuItem
              className="hover:cursor-pointer text-destructive focus:text-destructive"
              onSelect={() => meta.onDelete?.(despesa.id)}
            >
              Excluir Despesa
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </CardHeader>
      <CardContent className="grid grid-cols-2 gap-x-4 gap-y-2 text-sm">
        <div className="flex items-center gap-1.5 text-muted-foreground">
          <span className="font-medium">Membro</span>
        </div>
        <div className="text-right">{despesa.nome}</div>

        <div className="flex items-center gap-1.5 text-muted-foreground">
          <CalendarDays className="h-3.5 w-3.5 shrink-0" />
          <span>Competência</span>
        </div>
        <div className="text-right font-medium">
          {dateFormatter.format(new Date(despesa.competencia))}
        </div>

        <div className="flex items-center gap-1.5 text-muted-foreground">
          <Banknote className="h-3.5 w-3.5 shrink-0" />
          <span>Valor</span>
        </div>
        <div className="text-right font-semibold text-destructive">
          {currencyFormatter.format(despesa.valor)}
        </div>

        <div className="flex items-center gap-1.5 text-muted-foreground">
          <Tag className="h-3.5 w-3.5 shrink-0" />
          <span>Categoria</span>
        </div>
        <div className="text-right">
          {despesa.categoria.charAt(0).toUpperCase() + despesa.categoria.slice(1).toLowerCase()}
        </div>

        {despesa.subcategoria && (
          <>
            <div className="flex items-center gap-1.5 text-muted-foreground">
              <Layers className="h-3.5 w-3.5 shrink-0" />
              <span>Subcategoria</span>
            </div>
            <div className="text-right">
              {despesa.subcategoria.charAt(0).toUpperCase() + despesa.subcategoria.slice(1).toLowerCase()}
            </div>
          </>
        )}

        <div className="col-span-2 mt-1 rounded-md bg-muted/50 px-2 py-1 text-center text-xs text-muted-foreground">
          {despesa.status.charAt(0).toUpperCase() + despesa.status.slice(1).toLowerCase()}
        </div>
      </CardContent>
    </Card>
  )
}
