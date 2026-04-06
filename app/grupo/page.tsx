"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { useGroupContext } from "@/lib/context/group-context"

import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { ThemeToggle } from "@/components/theme-toggle"
import { AppSidebar } from "@/components/app-sidebar"
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbList,
  BreadcrumbPage,
} from "@/components/ui/breadcrumb"
import { Separator } from "@/components/ui/separator"
import {
  SidebarInset,
  SidebarProvider,
  SidebarTrigger,
} from "@/components/ui/sidebar"
import { Users, Plus } from "lucide-react"

export default function GrupoPage() {
  const { hasGroup, updateGroup } = useGroupContext()
  const router = useRouter()

  const [createDialogOpen, setCreateDialogOpen] = useState(false)
  const [joinDialogOpen, setJoinDialogOpen] = useState(false)
  const [groupName, setGroupName] = useState("")
  const [groupCode, setGroupCode] = useState("")
  const [isLoading, setIsLoading] = useState(false)

  useEffect(() => {
    if (hasGroup) {
      router.push("/grupo/ganhos")
    }
  }, [hasGroup, router])

  async function handleCreateGroup() {
    if (!groupName.trim()) {
      alert("Por favor, insira um nome para o grupo")
      return
    }

    setIsLoading(true)
    try {
      const response = await fetch("/api/grupos/create", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ nome: groupName }),
      })

      if (response.status === 401) {
        alert("Sessão expirada. Por favor, faça login novamente.")
        await fetch("/api/auth/logout", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
        })
        router.push("/")
        return
      }

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}))
        throw new Error(errorData.error || "Erro ao criar grupo")
      }

      const data = await response.json()
      updateGroup({ id: data.id, nome: data.nome, isAdmin: true })
      setCreateDialogOpen(false)
      setGroupName("")
      router.push("/grupo/ganhos")
    } catch (error) {
      console.error("Erro ao criar grupo:", error)
      alert(error instanceof Error ? error.message : "Erro ao criar grupo")
    } finally {
      setIsLoading(false)
    }
  }

  async function handleJoinGroup() {
    if (!groupCode.trim()) {
      alert("Por favor, insira o código do grupo")
      return
    }

    setIsLoading(true)
    try {
      const response = await fetch("/api/grupos/solicitar", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ codigo: groupCode }),
      })

      if (response.status === 401) {
        alert("Sessão expirada. Por favor, faça login novamente.")
        await fetch("/api/auth/logout", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
        })
        router.push("/")
        return
      }

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}))
        throw new Error(errorData.error || "Erro ao solicitar entrada no grupo")
      }

      alert("Solicitação enviada com sucesso! Aguarde a aprovação do administrador.")
      setJoinDialogOpen(false)
      setGroupCode("")
    } catch (error) {
      console.error("Erro ao solicitar entrada:", error)
      alert(error instanceof Error ? error.message : "Erro ao solicitar entrada")
    } finally {
      setIsLoading(false)
    }
  }

  if (hasGroup) {
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
                  <BreadcrumbItem>
                    <BreadcrumbPage>Grupo</BreadcrumbPage>
                  </BreadcrumbItem>
                </BreadcrumbList>
              </Breadcrumb>
            </div>
            <ThemeToggle />
          </div>
        </header>
        <div className="flex flex-1 flex-col gap-4 p-4 pt-0">
          <div className="flex min-h-[calc(100vh-8rem)] items-center justify-center">
            <div className="mx-auto max-w-2xl space-y-6">
              <div className="text-center">
                <Users className="mx-auto h-16 w-16 text-muted-foreground" />
                <h1 className="mt-4 text-3xl font-bold">Gestão em Grupo</h1>
                <p className="mt-2 text-muted-foreground">
                  Você ainda não faz parte de nenhum grupo. Crie um novo grupo ou solicite entrada em um grupo existente.
                </p>
              </div>

              <div className="grid gap-4 md:grid-cols-2">
                <Card className="p-6">
                  <h2 className="text-xl font-semibold">Criar Grupo</h2>
                  <p className="mt-2 text-sm text-muted-foreground">
                    Crie um novo grupo e convide outras pessoas para gerenciar finanças juntos.
                  </p>
                  <Button
                    className="mt-4 w-full"
                    onClick={() => setCreateDialogOpen(true)}
                  >
                    <Plus className="mr-2 h-4 w-4" />
                    Criar Novo Grupo
                  </Button>
                </Card>

                <Card className="p-6">
                  <h2 className="text-xl font-semibold">Solicitar Entrada</h2>
                  <p className="mt-2 text-sm text-muted-foreground">
                    Já tem um código de grupo? Solicite entrada em um grupo existente.
                  </p>
                  <Button
                    className="mt-4 w-full"
                    onClick={() => setJoinDialogOpen(true)}
                  >
                    Entrar em Grupo
                  </Button>
                </Card>
              </div>
            </div>
          </div>
        </div>
      </SidebarInset>

      <Dialog open={createDialogOpen} onOpenChange={setCreateDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Criar Novo Grupo</DialogTitle>
            <DialogDescription>
              Insira um nome para o seu grupo. Você será o administrador automaticamente.
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="groupName">Nome do Grupo</Label>
              <Input
                id="groupName"
                placeholder="Ex: Família Silva"
                value={groupName}
                onChange={(e) => setGroupName(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === "Enter" && !isLoading) {
                    handleCreateGroup()
                  }
                }}
              />
            </div>
            <div className="flex gap-2 justify-end">
              <Button
                variant="outline"
                onClick={() => {
                  setCreateDialogOpen(false)
                  setGroupName("")
                }}
                disabled={isLoading}
              >
                Cancelar
              </Button>
              <Button onClick={handleCreateGroup} disabled={isLoading}>
                {isLoading ? "Criando..." : "Criar Grupo"}
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>

      <Dialog open={joinDialogOpen} onOpenChange={setJoinDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Solicitar Entrada em Grupo</DialogTitle>
            <DialogDescription>
              Insira o código do grupo para solicitar entrada. O administrador precisará aprovar sua solicitação.
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="groupCode">Código do Grupo</Label>
              <Input
                id="groupCode"
                placeholder="Ex: 12345"
                value={groupCode}
                onChange={(e) => setGroupCode(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === "Enter" && !isLoading) {
                    handleJoinGroup()
                  }
                }}
              />
            </div>
            <div className="flex gap-2 justify-end">
              <Button
                variant="outline"
                onClick={() => {
                  setJoinDialogOpen(false)
                  setGroupCode("")
                }}
                disabled={isLoading}
              >
                Cancelar
              </Button>
              <Button onClick={handleJoinGroup} disabled={isLoading}>
                {isLoading ? "Enviando..." : "Solicitar Entrada"}
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </SidebarProvider>
  )
}
