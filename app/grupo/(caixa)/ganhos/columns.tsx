"use client"

import { z } from "zod"

import { ColumnDef } from "@tanstack/react-table"
import { 
  MoreHorizontal,
  ArrowUpDown,
  CalendarDays,
  Banknote,
  Briefcase,
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

export const ganhoSchema = z.object({
  id: z.number().positive("ID deve ser positivo"),
  nome: z.string().min(1, "Nome da pessoa é obrigatório"),
  data: z.date(),
  valor: z.number().positive("Valor deve ser positivo"),
  tipo: z.enum(["salario", "outros"]),
})

export type Ganho = z.infer<typeof ganhoSchema>

export const columns: ColumnDef<Ganho>[] = [
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
      const data = new Date(row.getValue("data") as string);

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
      return <div className="w-full flex justify-center">{tipo.charAt(0).toUpperCase() + tipo.slice(1).toLowerCase()}</div>
    },
  },
  {
    id: "ações",
    cell: ({ row, table }) => {
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
            <DropdownMenuItem className="hover:cursor-pointer" onSelect={() => table.options.meta?.onEditRow?.(ganho.id)}>Editar Ganho</DropdownMenuItem>
            <DropdownMenuItem className="hover:cursor-pointer text-destructive focus:text-destructive" onSelect={() => table.options.meta?.onDeleteRow?.(ganho.id)}>Excluir Ganho</DropdownMenuItem>
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
  ganho: Ganho,
  meta: {
    onEdit?: (id: number) => void
    onDelete?: (id: number) => void
  }
) {
  return (
    <Card key={ganho.id} className="w-full">
      <CardHeader className="flex flex-row items-start justify-between pb-2 gap-2">
        <CardTitle className="text-base font-semibold leading-tight">
          {ganho.nome}
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
              onSelect={() => meta.onEdit?.(ganho.id)}
            >
              Editar Ganho
            </DropdownMenuItem>
            <DropdownMenuItem
              className="hover:cursor-pointer text-destructive focus:text-destructive"
              onSelect={() => meta.onDelete?.(ganho.id)}
            >
              Excluir Ganho
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </CardHeader>
      <CardContent className="grid grid-cols-2 gap-x-4 gap-y-2 text-sm">
        <div className="flex items-center gap-1.5 text-muted-foreground">
          <CalendarDays className="h-3.5 w-3.5 shrink-0" />
          <span>Recebimento</span>
        </div>
        <div className="text-right font-medium">
          {dateFormatter.format(new Date(ganho.data as unknown as string))}
        </div>

        <div className="flex items-center gap-1.5 text-muted-foreground">
          <Banknote className="h-3.5 w-3.5 shrink-0" />
          <span>Valor</span>
        </div>
        <div className="text-right font-semibold text-primary">
          {currencyFormatter.format(ganho.valor)}
        </div>

        <div className="flex items-center gap-1.5 text-muted-foreground">
          <Briefcase className="h-3.5 w-3.5 shrink-0" />
          <span>Tipo</span>
        </div>
        <div className="text-right">
          {ganho.tipo.charAt(0).toUpperCase() + ganho.tipo.slice(1).toLowerCase()}
        </div>
      </CardContent>
    </Card>
  )
}
