"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { useGroupContext } from "@/lib/context/group-context"

import { columns, Participante, renderMobileCard } from "./columns"
import { ParticipanteDialog, ParticipanteFormData } from "./participante-dialog"
import { ConfirmDialog } from "@/components/confirm-dialog"
import { ThemeToggle } from "@/components/theme-toggle"
import { AppSidebar } from "@/components/app-sidebar"
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
import { DataTable } from "@/components/data-table"

export default function GrupoAdminPage() {
  const { hasGroup, isAdmin, groupId } = useGroupContext()
  const [isCheckingGroup, setIsCheckingGroup] = useState(true)
  const [isLoading, setIsLoading] = useState(false)
  const [groupData, setGroupData] = useState<Participante[]>([])
  const [dialogOpen, setDialogOpen] = useState(false)
  const [confirmOpen, setConfirmOpen] = useState(false)
  const [deleteId, setDeleteId] = useState<number | undefined>()
  const [adminConfirmOpen, setAdminConfirmOpen] = useState(false)
  const [adminTarget, setAdminTarget] = useState<{
    id: number
    isAdmin: boolean
  } | undefined>()
  const router = useRouter()

  useEffect(() => {
    const timer = setTimeout(() => {
      setIsCheckingGroup(false)
      if (!hasGroup || !isAdmin) {
        router.push("/grupo")
      }
    }, 100)

    return () => clearTimeout(timer)
  }, [hasGroup, isAdmin, router])

  useEffect(() => {
    if (hasGroup && isAdmin) {
      fetchParticipantes().then(setGroupData)
    }
  }, [hasGroup, isAdmin])

  if (isCheckingGroup || !hasGroup || !isAdmin) {
    return null
  }

  function handleOpenAdd() {
    setDialogOpen(true)
  }

  function handleOpenDelete(id: number) {
    setDeleteId(id)
    setConfirmOpen(true)
  }

  function handleOpenToggleAdmin(id: number, currentIsAdmin: boolean) {
    setAdminTarget({
      id,
      isAdmin: currentIsAdmin,
    })
    setAdminConfirmOpen(true)
  }

  async function handleSubmit(data: ParticipanteFormData) {
    const response = await fetch(`/api/grupos/${groupId}/participantes`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(data),
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
      throw new Error(errorData.error || "Erro ao adicionar participante")
    }

    await fetchParticipantes().then(setGroupData)
  }

  async function handleConfirmDelete() {
    if (!deleteId) return

    const response = await fetch(
      `/api/grupos/${groupId}/participantes/${deleteId}`,
      {
        method: "DELETE",
      }
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

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}))
      throw new Error(errorData.error || "Erro ao remover participante")
    }

    setDeleteId(undefined)
    await fetchParticipantes().then(setGroupData)
  }

  async function handleConfirmToggleAdmin() {
    if (!adminTarget) return

    const response = await fetch(
      `/api/grupos/${groupId}/participantes/${adminTarget.id}/admin`,
      {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ is_admin: !adminTarget.isAdmin }),
      }
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

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}))
      throw new Error(
        errorData.error || "Erro ao atualizar administrador do participante"
      )
    }

    setAdminTarget(undefined)
    await fetchParticipantes().then(setGroupData)
  }

  async function fetchParticipantes(): Promise<Participante[]> {
    setIsLoading(true)
    try {
      const response = await fetch(
        `/api/grupos/${groupId}/participantes`
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

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}))
        throw new Error(errorData.error || "Erro ao buscar participantes")
      }

      const participantes = await response.json()

      return participantes.participantes
    } catch (error) {
      console.error("Erro ao buscar participantes:", error)
      return []
    } finally {
      setIsLoading(false)
    }
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
                    <BreadcrumbPage>Administração</BreadcrumbPage>
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
                Carregando usuários...
              </span>
            </div>
          ) : (
            <div className="container mx-auto py-10">
              <DataTable
                columns={columns}
                data={groupData}
                filterColumn="nome"
                filterPlaceholder="Filtrar por nome..."
                onAdd={handleOpenAdd}
                onDelete={handleOpenDelete}
                onToggleAdmin={handleOpenToggleAdmin}
                renderMobileCard={(row, meta) => renderMobileCard(row, meta)}
                dialog={
                  <>
                    <ParticipanteDialog
                      open={dialogOpen}
                      onOpenChange={setDialogOpen}
                      onSubmit={handleSubmit}
                    />
                    <ConfirmDialog
                      open={confirmOpen}
                      onOpenChange={(open) => {
                        setConfirmOpen(open)
                        if (!open) setDeleteId(undefined)
                      }}
                      title="Remover participante"
                      description="Essa ação não pode ser desfeita. Deseja realmente remover este participante do grupo?"
                      confirmLabel="Remover"
                      onConfirm={handleConfirmDelete}
                    />
                    <ConfirmDialog
                      open={adminConfirmOpen}
                      onOpenChange={(open) => {
                        setAdminConfirmOpen(open)
                        if (!open) setAdminTarget(undefined)
                      }}
                      title={
                        adminTarget?.isAdmin
                          ? "Remover administrador"
                          : "Tornar administrador"
                      }
                      description={
                        adminTarget?.isAdmin
                          ? "Deseja remover a permissão de administrador deste participante?"
                          : "Deseja conceder permissão de administrador para este participante?"
                      }
                      confirmLabel="Confirmar"
                      onConfirm={handleConfirmToggleAdmin}
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
