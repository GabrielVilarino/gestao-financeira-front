"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { z } from "zod"
import { Repeat, CalendarDays, Banknote, Tag, Layers, CircleStop } from "lucide-react"
import { useGroupContext } from "@/lib/context/group-context"

import { ThemeToggle } from "@/components/theme-toggle"
import { AppSidebar } from "@/components/app-sidebar"
import { ConfirmDialog } from "@/components/confirm-dialog"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
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

const recorrenciaSchema = z.object({
  id_recorrencia: z.number(),
  id_categoria: z.number(),
  tipo: z.enum(["RECEITA", "DESPESA"]),
  descricao: z.string(),
  valor: z.number(),
  frequencia: z.enum(["DIARIA", "SEMANAL", "MENSAL", "ANUAL"]),
  intervalo: z.number(),
  data_inicio: z.string(),
  data_fim: z.string().nullish(),
  ativa: z.boolean(),
  categoria: z.string(),
  subcategoria: z.string().nullish(),
})

type Recorrencia = z.infer<typeof recorrenciaSchema>

const currencyFormatter = new Intl.NumberFormat("pt-BR", {
  style: "currency",
  currency: "BRL",
})

const dateFormatter = new Intl.DateTimeFormat("pt-BR", {
  timeZone: "UTC",
  day: "2-digit",
  month: "2-digit",
  year: "numeric",
})

function formatFrequencia(frequencia: string, intervalo: number): string {
  const labels: Record<string, [string, string]> = {
    DIARIA: ["Todo dia", `A cada ${intervalo} dias`],
    SEMANAL: ["Toda semana", `A cada ${intervalo} semanas`],
    MENSAL: ["Todo mês", `A cada ${intervalo} meses`],
    ANUAL: ["Todo ano", `A cada ${intervalo} anos`],
  }
  const pair = labels[frequencia]
  if (!pair) return frequencia
  return intervalo === 1 ? pair[0] : pair[1]
}

export default function GrupoRecorrenciasPage() {
  const router = useRouter()
  const { hasGroup } = useGroupContext()
  const [recorrencias, setRecorrencias] = useState<Recorrencia[]>([])
  const [isLoading, setIsLoading] = useState(false)
  const [encerrarId, setEncerrarId] = useState<number | undefined>()
  const [confirmOpen, setConfirmOpen] = useState(false)

  useEffect(() => {
    const timer = setTimeout(() => {
      if (!hasGroup) router.push("/grupo")
    }, 100)
    return () => clearTimeout(timer)
  }, [hasGroup, router])

  async function fetchRecorrencias(): Promise<Recorrencia[]> {
    setIsLoading(true)
    try {
      const response = await fetch("/api/recorrencias?group=true")

      if (response.status === 401) {
        alert("Sessão expirada. Por favor, faça login novamente.")

        await fetch("/api/auth/logout", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
        })

        router.push("/")
        return []
      }

      const data: unknown = await response.json()
      const parsed = z.array(recorrenciaSchema).safeParse(data)
      return parsed.success ? parsed.data : []
    } catch {
      return []
    } finally {
      setIsLoading(false)
    }
  }

  async function handleEncerrar() {
    if (!encerrarId) return

    const response = await fetch(`/api/recorrencias/encerrar/${encerrarId}?group=true`, {
      method: "PATCH",
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
      throw new Error((errorData as { error?: string }).error || "Erro ao encerrar recorrência")
    }

    setEncerrarId(undefined)
    await fetchRecorrencias().then(setRecorrencias)
  }

  useEffect(() => {
    if (hasGroup) {
      fetchRecorrencias().then(setRecorrencias)
    }
  }, [hasGroup])

  const ativas = recorrencias.filter((r) => r.ativa)
  const encerradas = recorrencias.filter((r) => !r.ativa)

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
                    <BreadcrumbLink href="/home">Gestão Financeira</BreadcrumbLink>
                  </BreadcrumbItem>
                  <BreadcrumbSeparator className="hidden md:block" />
                  <BreadcrumbItem>
                    <BreadcrumbPage>Grupo</BreadcrumbPage>
                  </BreadcrumbItem>
                  <BreadcrumbSeparator className="hidden md:block" />
                  <BreadcrumbItem>
                    <BreadcrumbPage>Recorrências</BreadcrumbPage>
                  </BreadcrumbItem>
                </BreadcrumbList>
              </Breadcrumb>
            </div>
            <ThemeToggle />
          </div>
        </header>

        <div className="flex flex-1 flex-col gap-6 p-4 pt-2">
          {isLoading ? (
            <div className="flex h-64 w-full items-center justify-center">
              <span className="text-sm text-muted-foreground">Carregando recorrências...</span>
            </div>
          ) : recorrencias.length === 0 ? (
            <div className="flex h-64 w-full flex-col items-center justify-center gap-3">
              <Repeat className="h-8 w-8 text-muted-foreground" />
              <p className="text-sm text-muted-foreground">Nenhuma recorrência cadastrada no grupo.</p>
              <p className="text-xs text-muted-foreground">
                Crie uma recorrência ao adicionar um ganho ou despesa com "Repetir automaticamente".
              </p>
            </div>
          ) : (
            <>
              {ativas.length > 0 && (
                <section>
                  <h2 className="mb-3 text-sm font-semibold text-muted-foreground uppercase tracking-wide">
                    Ativas ({ativas.length})
                  </h2>
                  <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                    {ativas.map((r) => (
                      <RecorrenciaCard
                        key={r.id_recorrencia}
                        recorrencia={r}
                        onEncerrar={(id) => {
                          setEncerrarId(id)
                          setConfirmOpen(true)
                        }}
                      />
                    ))}
                  </div>
                </section>
              )}

              {encerradas.length > 0 && (
                <section>
                  <h2 className="mb-3 text-sm font-semibold text-muted-foreground uppercase tracking-wide">
                    Encerradas ({encerradas.length})
                  </h2>
                  <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                    {encerradas.map((r) => (
                      <RecorrenciaCard key={r.id_recorrencia} recorrencia={r} />
                    ))}
                  </div>
                </section>
              )}
            </>
          )}
        </div>

        <ConfirmDialog
          open={confirmOpen}
          onOpenChange={(open) => {
            setConfirmOpen(open)
            if (!open) setEncerrarId(undefined)
          }}
          title="Encerrar recorrência"
          description="Isso vai cancelar as transações futuras pendentes desta recorrência. O histórico já pago permanece intacto. Deseja continuar?"
          confirmLabel="Encerrar"
          onConfirm={handleEncerrar}
        />
      </SidebarInset>
    </SidebarProvider>
  )
}

function RecorrenciaCard({
  recorrencia: r,
  onEncerrar,
}: {
  recorrencia: Recorrencia
  onEncerrar?: (id: number) => void
}) {
  return (
    <Card className={r.ativa ? "" : "opacity-60"}>
      <CardHeader className="flex flex-row items-start justify-between pb-2 gap-2">
        <div className="flex flex-col gap-1">
          <CardTitle className="text-base font-semibold leading-tight">{r.descricao}</CardTitle>
          <span className={`w-fit rounded-full px-2 py-0.5 text-xs font-medium ${r.tipo === "RECEITA" ? "bg-primary/15 text-primary" : "bg-destructive/15 text-destructive"}`}>
            {r.tipo === "RECEITA" ? "Receita" : "Despesa"}
          </span>
        </div>
        {r.ativa && onEncerrar && (
          <Button
            variant="ghost"
            size="sm"
            className="h-8 shrink-0 gap-1.5 text-destructive hover:text-destructive hover:bg-destructive/10"
            onClick={() => onEncerrar(r.id_recorrencia)}
          >
            <CircleStop className="h-3.5 w-3.5" />
            Encerrar
          </Button>
        )}
        {!r.ativa && (
          <span className="shrink-0 rounded-full bg-muted px-2 py-0.5 text-xs font-medium text-muted-foreground">Encerrada</span>
        )}
      </CardHeader>
      <CardContent className="grid grid-cols-2 gap-x-4 gap-y-2 text-sm">
        <div className="flex items-center gap-1.5 text-muted-foreground">
          <Banknote className="h-3.5 w-3.5 shrink-0" />
          <span>Valor</span>
        </div>
        <div className="text-right font-semibold">{currencyFormatter.format(r.valor)}</div>

        <div className="flex items-center gap-1.5 text-muted-foreground">
          <Repeat className="h-3.5 w-3.5 shrink-0" />
          <span>Frequência</span>
        </div>
        <div className="text-right">{formatFrequencia(r.frequencia, r.intervalo)}</div>

        <div className="flex items-center gap-1.5 text-muted-foreground">
          <CalendarDays className="h-3.5 w-3.5 shrink-0" />
          <span>Início</span>
        </div>
        <div className="text-right">{dateFormatter.format(new Date(r.data_inicio))}</div>

        {r.data_fim && (
          <>
            <div className="flex items-center gap-1.5 text-muted-foreground">
              <CalendarDays className="h-3.5 w-3.5 shrink-0" />
              <span>Fim</span>
            </div>
            <div className="text-right">{dateFormatter.format(new Date(r.data_fim))}</div>
          </>
        )}

        <div className="flex items-center gap-1.5 text-muted-foreground">
          <Tag className="h-3.5 w-3.5 shrink-0" />
          <span>Categoria</span>
        </div>
        <div className="text-right">
          {r.categoria.charAt(0).toUpperCase() + r.categoria.slice(1).toLowerCase()}
        </div>

        {r.subcategoria && (
          <>
            <div className="flex items-center gap-1.5 text-muted-foreground">
              <Layers className="h-3.5 w-3.5 shrink-0" />
              <span>Subcategoria</span>
            </div>
            <div className="text-right">
              {r.subcategoria.charAt(0).toUpperCase() + r.subcategoria.slice(1).toLowerCase()}
            </div>
          </>
        )}
      </CardContent>
    </Card>
  )
}
