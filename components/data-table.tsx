"use client"

import {
  ColumnDef,
  ColumnFiltersState,
  RowData,
  SortingState,
  VisibilityState,
  flexRender,
  getCoreRowModel,
  getFilteredRowModel,
  getPaginationRowModel,
  getSortedRowModel,
  useReactTable,
} from "@tanstack/react-table"

declare module "@tanstack/react-table" {
  interface TableMeta<TData extends RowData> {
    onEditRow?: (id: number) => void
    onDeleteRow?: (id: number) => void
    onToggleAdminRow?: (id: number, isAdmin: boolean) => void
  }
}

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import {
  DropdownMenu,
  DropdownMenuCheckboxItem,
  DropdownMenuContent,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"

import { useState } from "react"
import { Plus } from "lucide-react"
import { useIsMobile } from "@/app/hooks/use-mobile"

interface DataTableProps<TData, TValue> {
  columns: ColumnDef<TData, TValue>[]
  data: TData[]
  filterColumn?: string
  filterPlaceholder?: string
  onAdd?: () => void
  onEdit?: (id: number) => void
  onDelete?: (id: number) => void
  onToggleAdmin?: (id: number, isAdmin: boolean) => void
  dialog?: React.ReactNode
  renderMobileCard?: (
    row: TData,
    meta: {
      onEdit?: (id: number) => void
      onDelete?: (id: number) => void
      onToggleAdmin?: (id: number, isAdmin: boolean) => void
    }
  ) => React.ReactNode
}

export function DataTable<TData, TValue>({
  columns,
  data,
  filterColumn = "nome",
  filterPlaceholder = "Filtrar...",
  onAdd,
  onEdit,
  onDelete,
  onToggleAdmin,
  dialog,
  renderMobileCard,
}: DataTableProps<TData, TValue>) {
  const [sorting, setSorting] = useState<SortingState>([])
  const [columnFilters, setColumnFilters] = useState<ColumnFiltersState>([])
  const [columnVisibility, setColumnVisibility] = useState<VisibilityState>({})
  const isMobile = useIsMobile()

  const table = useReactTable({
    data,
    columns,
    getCoreRowModel: getCoreRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    onSortingChange: setSorting,
    getSortedRowModel: getSortedRowModel(),
    onColumnFiltersChange: setColumnFilters,
    getFilteredRowModel: getFilteredRowModel(),
    onColumnVisibilityChange: setColumnVisibility,
    state: {
      sorting,
      columnFilters,
      columnVisibility,
    },
    meta: {
      onEditRow: onEdit,
      onDeleteRow: onDelete,
      onToggleAdminRow: onToggleAdmin,
    },
  })

  const filteredRows = table.getRowModel().rows

  return (
    <div>
      <div className="flex items-center py-4 gap-2">
        <Input
          placeholder={filterPlaceholder}
          value={(table.getColumn(filterColumn)?.getFilterValue() as string) ?? ""}
          onChange={(event) =>
            table.getColumn(filterColumn)?.setFilterValue(event.target.value)
          }
          className="max-w-sm"
        />
        {!isMobile && (
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="outline" className="ml-auto">
                Colunas
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              {table
                .getAllColumns()
                .filter((column) => column.getCanHide())
                .map((column) => {
                  if (column.id === "data_ult_pagamento") {
                    return (
                      <DropdownMenuCheckboxItem
                        key={column.id}
                        className="capitalize"
                        checked={column.getIsVisible()}
                        onCheckedChange={(value) =>
                          column.toggleVisibility(!!value)
                        }
                      >
                        Último Pagamento
                      </DropdownMenuCheckboxItem>
                    )
                  }
                  return (
                    <DropdownMenuCheckboxItem
                      key={column.id}
                      className="capitalize"
                      checked={column.getIsVisible()}
                      onCheckedChange={(value) =>
                        column.toggleVisibility(!!value)
                      }
                    >
                      {column.id}
                    </DropdownMenuCheckboxItem>
                  )
                })}
            </DropdownMenuContent>
          </DropdownMenu>
        )}
        {isMobile && onAdd && (
          <Button onClick={onAdd} className="ml-auto">
            <Plus className="h-4 w-4" />
          </Button>
        )}
      </div>

      {isMobile && renderMobileCard ? (
        <div className="flex flex-col gap-3">
          {filteredRows.length ? (
            filteredRows.map((row) =>
              renderMobileCard(row.original, { onEdit, onDelete, onToggleAdmin })
            )
          ) : (
            <div className="flex h-24 items-center justify-center rounded-md border text-sm text-muted-foreground">
              Nenhum resultado encontrado.
            </div>
          )}
        </div>
      ) : (
        <div className="overflow-hidden rounded-md border">
          <Table>
            <TableHeader>
              {table.getHeaderGroups().map((headerGroup) => (
                <TableRow key={headerGroup.id} className="bg-primary hover:bg-primary/90 dark:bg-muted dark:hover:bg-muted/80 [&>th]:text-primary-foreground dark:[&>th]:text-foreground">
                  {headerGroup.headers.map((header) => {
                    return (
                      <TableHead key={header.id}>
                        {header.isPlaceholder
                          ? null
                          : flexRender(
                              header.column.columnDef.header,
                              header.getContext()
                            )}
                      </TableHead>
                    )
                  })}
                </TableRow>
              ))}
            </TableHeader>
            <TableBody>
              {table.getRowModel().rows?.length ? (
                table.getRowModel().rows.map((row) => (
                  <TableRow
                    key={row.id}
                    data-state={row.getIsSelected() && "selected"}
                  >
                    {row.getVisibleCells().map((cell) => (
                      <TableCell key={cell.id}>
                        {flexRender(cell.column.columnDef.cell, cell.getContext())}
                      </TableCell>
                    ))}
                  </TableRow>
                ))
              ) : (
                <TableRow>
                  <TableCell colSpan={columns.length} className="h-24 text-center">
                    No results.
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </div>
      )}

      <div className="flex items-center justify-between space-x-2 py-4">
        <div>
          {!isMobile && onAdd && (
            <Button onClick={onAdd}>
              <Plus className="h-4 w-4" />
            </Button>
          )}
        </div>
        <div className="flex gap-2">
          <Button
            variant="outline"
            size="sm"
            onClick={() => table.previousPage()}
            disabled={!table.getCanPreviousPage()}
          >
            Anterior
          </Button>
          <Button
            variant="outline"
            size="sm"
            onClick={() => table.nextPage()}
            disabled={!table.getCanNextPage()}
          >
            Próxima
          </Button>
        </div>
      </div>
      {dialog}
    </div>
  )
}