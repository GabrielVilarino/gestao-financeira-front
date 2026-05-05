"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { useGroupContext } from "@/lib/context/group-context"

import { columns, Ganho, renderMobileCard } from "./columns"
import { GanhoDialog, GanhoFormData } from "./ganho-dialog"
import { ConfirmDialog } from "@/components/confirm-dialog"
import formatDate from "@/functions/format-date"

import { ThemeToggle } from "@/components/theme-toggle"
import { AppSidebar } from "@/components/app-sidebar"
import { DataTable } from "@/components/data-table"
import { Button } from "@/components/ui/button"
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb"
import { Separator } from "@/components/ui/separator"
import {
  SidebarInset,
  SidebarProvider,
  SidebarTrigger,
} from "@/components/ui/sidebar"

import { Categorias, Subcategorias } from "./types"

export default function GrupoGanhosPage() {
  const { hasGroup } = useGroupContext()
  const [ganhos, setGanhos] = useState<Ganho[]>([])
  const [categorias, setCategorias] = useState<Categorias[]>([])
  const [subcategorias, setSubcategorias] = useState<Subcategorias[]>([])

  const [isLoading, setIsLoading] = useState(false)
  const [isCheckingGroup, setIsCheckingGroup] = useState(true)

  const [dialogOpen, setDialogOpen] = useState(false)
  const [editId, setEditId] = useState<number | undefined>()
  const [confirmOpen, setConfirmOpen] = useState(false)
  const [deleteId, setDeleteId] = useState<number | undefined>()

  const router = useRouter()

  useEffect(() => {
    // Permitir que o Context seja carregado primeiro
    const timer = setTimeout(() => {
      setIsCheckingGroup(false)
      if (!hasGroup) {
        router.push("/grupo")
      }
    }, 100)

    return () => clearTimeout(timer)
  }, [hasGroup, router])

  function handleOpenAdd() {
    setEditId(undefined)
    setDialogOpen(true)
  }

  function handleOpenEdit(id: number) {
    setEditId(id)
    setDialogOpen(true)
  }

  function handleOpenDelete(id: number) {
    setDeleteId(id)
    setConfirmOpen(true)
  }

  async function handleConfirmDelete() {
    if (!deleteId) return
    const response = await fetch(`/api/ganhos/delete/${deleteId}?group=true`, {
      method: "DELETE",
    })

    if (response.status === 401) {
      alert("Sessão expirada. Por favor, faça login novamente.")

      await fetch("/api/auth/logout", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
      })

      router.push("/")
    }

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}))
      throw new Error(errorData.error || "Erro ao excluir ganho")
    }

    setDeleteId(undefined)
    await fetchGanhos().then(setGanhos)
  }

  async function handleSubmit(data: GanhoFormData, id?: number) {
    const isEditing = id !== undefined
    const url = isEditing
      ? "/api/ganhos/update?group=true"
      : "/api/ganhos/create?group=true"
    const method = isEditing ? "PUT" : "POST"

    const payload = isEditing ? { id, ...data } : { ...data }

    const response = await fetch(url, {
      method,
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    })

    if (response.status === 401) {
      alert("Sessão expirada. Por favor, faça login novamente.")

      await fetch("/api/auth/logout", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
      })

      router.push("/")
    }

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}))
      throw new Error(errorData.error || "Erro ao salvar ganho")
    }

    await fetchGanhos().then(setGanhos)
  }

  async function fetchGanhos(): Promise<Ganho[]> {
    setIsLoading(true)
    try {
      const now = new Date()

      const startDate = new Date(now.getFullYear(), now.getMonth(), 1)
      const endDate = new Date(now.getFullYear(), now.getMonth() + 1, 0)

      const start = formatDate(startDate)
      const end = formatDate(endDate)

      const response = await fetch(
        `/api/ganhos?data_inicio=${start}&data_fim=${end}&group=true`
      )

      if (response.status === 401) {
        alert("Sessão expirada. Por favor, faça login novamente.")

        await fetch("/api/auth/logout", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
        })

        router.push("/")
      }
      const ganhos = await response.json()

      return ganhos
    } catch (error) {
      console.error("Erro ao buscar ganhos:", error)
      return []
    } finally {
      setIsLoading(false)
    }
  }

  async function fetchCategorias(): Promise<Categorias[]> {
    try {
      const response = await fetch(`/api/categorias?tipo=receita&group=true`)

      if (response.status === 401) {
        alert("Sessão expirada. Por favor, faça login novamente.")

        await fetch("/api/auth/logout", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
        })

        router.push("/")
      }
      const categorias = await response.json()
      return categorias
    } catch (error) {
      console.error("Erro ao buscar categorias:", error)
      return []
    }
  }

  async function fetchSubcategorias(): Promise<Subcategorias[]> {
    try {
      const response = await fetch(`/api/subcategorias?group=true`)

      if (response.status === 401) {
        alert("Sessão expirada. Por favor, faça login novamente.")

        await fetch("/api/auth/logout", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
        })

        router.push("/")
      }
      const subcategorias = await response.json()

      return subcategorias
    } catch (error) {
      console.error("Erro ao buscar subcategorias:", error)
      return []
    }
  }

  useEffect(() => {
    if (hasGroup) {
      fetchGanhos().then(setGanhos)
      fetchCategorias().then(setCategorias)
      fetchSubcategorias().then(setSubcategorias)
    }
  }, [hasGroup])

  if (isCheckingGroup || !hasGroup) {
    return null
  }

  return (
    <SidebarProvider>
      <AppSidebar />
      <SidebarInset>
        <header className="flex h-16 shrink-0 items-center gap-2 transition-[width,height] ease-linear group-has-data-[collapsible=icon]/sidebar-wrapper:h-12">
          <div className="flex w-full items-center justify-between gap-2 px-4">
            <div className="flex items-center gap-2">
              <SidebarTrigger className="-ml-1" />
              <Separator
                orientation="vertical"
                className="mr-2 data-[orientation=vertical]:h-4"
              />
              <Breadcrumb>
                <BreadcrumbList>
                  <BreadcrumbItem className="hidden md:block">
                    <BreadcrumbLink href="/home">
                      Gestão Financeira
                    </BreadcrumbLink>
                  </BreadcrumbItem>
                  <BreadcrumbSeparator className="hidden md:block" />
                  <BreadcrumbItem>
                    <BreadcrumbPage>Grupo</BreadcrumbPage>
                  </BreadcrumbItem>
                  <BreadcrumbSeparator className="hidden md:block" />
                  <BreadcrumbItem>
                    <BreadcrumbPage>Ganhos</BreadcrumbPage>
                  </BreadcrumbItem>
                </BreadcrumbList>
              </Breadcrumb>
            </div>
            <ThemeToggle />
          </div>
        </header>
        <div className="flex p-4">
          {isLoading ? (
            <div className="flex h-64 w-full items-center justify-center">
              <span className="text-sm text-muted-foreground">
                Carregando ganhos...
              </span>
            </div>
          ) : !ganhos || ganhos.length === 0 ? (
            <div className="flex h-64 w-full flex-col items-center justify-center gap-4">
              <span className="text-sm text-muted-foreground">
                Nenhum ganho encontrado.
              </span>
              <Button onClick={handleOpenAdd}>Adicionar ganho</Button>
              <GanhoDialog
                open={dialogOpen}
                onOpenChange={(open) => {
                  setDialogOpen(open)
                  if (!open) setEditId(undefined)
                }}
                id={editId}
                categorias={categorias}
                subcategorias={subcategorias}
                onSubmit={handleSubmit}
              />
            </div>
          ) : (
            <div className="container mx-auto py-10">
              <DataTable
                columns={columns}
                data={ganhos}
                filterColumn="nome"
                filterPlaceholder="Filtrar por nome..."
                onAdd={handleOpenAdd}
                onEdit={handleOpenEdit}
                onDelete={handleOpenDelete}
                renderMobileCard={(row, meta) => renderMobileCard(row, meta)}
                dialog={
                  <>
                    <GanhoDialog
                      open={dialogOpen}
                      onOpenChange={(open) => {
                        setDialogOpen(open)
                        if (!open) setEditId(undefined)
                      }}
                      id={editId}
                      categorias={categorias}
                      subcategorias={subcategorias}
                      onSubmit={handleSubmit}
                    />
                    <ConfirmDialog
                      open={confirmOpen}
                      onOpenChange={(open) => {
                        setConfirmOpen(open)
                        if (!open) setDeleteId(undefined)
                      }}
                      title="Excluir ganho"
                      description="Essa ação não pode ser desfeita. Deseja realmente excluir este ganho?"
                      confirmLabel="Excluir"
                      onConfirm={handleConfirmDelete}
                    />
                  </>
                }
              />
            </div>
          )}
        </div>
      </SidebarInset>
    </SidebarProvider>
  )
}
