"use client"

import { useCallback, useEffect, useMemo, useState } from "react"
import { useRouter } from "next/navigation"
import { z } from "zod"

import formatDate from "@/functions/format-date"

const dashboardFiltersSchema = z
  .object({
    startDate: z.string().min(1, "Data inicial obrigatória"),
    endDate: z.string().min(1, "Data final obrigatória"),
    scope: z.enum(["personal", "group"]),
  })
  .refine(
    ({ startDate, endDate }) => {
      const start = new Date(`${startDate}T00:00:00`)
      const end = new Date(`${endDate}T00:00:00`)

      return !Number.isNaN(start.getTime()) && !Number.isNaN(end.getTime())
    },
    {
      message: "Use datas válidas no formato AAAA-MM-DD",
      path: ["startDate"],
    }
  )
  .refine(({ startDate, endDate }) => startDate <= endDate, {
    message: "A data inicial não pode ser maior que a data final",
    path: ["endDate"],
  })

type DashboardScope = "personal" | "group"

type DashboardFilters = {
  startDate: string
  endDate: string
  scope: DashboardScope
}

type DashboardSummary = {
  totalGanhos: number
  totalDespesas: number
  saldoLiquido: number
}

type DashboardEvolutionApiItem = {
  mes: string
  total_ganhos: number
  total_despesas: number
  saldo_liquido: number
}

type DashboardEvolutionItem = {
  month: string
  monthLabel: string
  totalGanhos: number
  totalDespesas: number
  saldoLiquido: number
}

type DashboardState = {
  filters: DashboardFilters
  summary: DashboardSummary
  evolution: DashboardEvolutionItem[]
  isLoading: boolean
  error: string | null
  hasGroupAvailable: boolean
  setFilters: (filters: DashboardFilters) => void
  applyFilters: () => Promise<void>
  resetToLastSixMonths: () => void
}

type FetchJsonOptions = {
  onUnauthorized: () => Promise<void>
}

function getLastSixMonthsRange(): Pick<DashboardFilters, "startDate" | "endDate"> {
  const now = new Date()
  const start = new Date(now.getFullYear(), now.getMonth() - 5, 1)
  const end = new Date(now.getFullYear(), now.getMonth() + 1, 0)

  return {
    startDate: formatDate(start),
    endDate: formatDate(end),
  }
}

function createInitialFilters(hasGroup: boolean): DashboardFilters {
  return {
    ...getLastSixMonthsRange(),
    scope: hasGroup ? "group" : "personal",
  }
}

async function fetchJson<T>(url: string, options: FetchJsonOptions): Promise<T> {
  const response = await fetch(url)

  if (response.status === 401) {
    await options.onUnauthorized()
    throw new Error("Sessão expirada. Por favor, faça login novamente.")
  }

  if (!response.ok) {
    const errorData = await response.json().catch(() => ({}))
    const message =
      errorData && typeof errorData.error === "string"
        ? errorData.error
        : "Erro ao carregar dashboard"

    throw new Error(message)
  }

  const data = await response.json().catch(() => null)

  return data as T
}

function formatMonthLabel(value: string): string {
  const [year, month] = value.split("-")
  const date = new Date(Number(year), Number(month) - 1, 1)

  return new Intl.DateTimeFormat("pt-BR", {
    month: "short",
    year: "2-digit",
  }).format(date)
}

export function useDashboard(hasGroup: boolean, groupId: number | null): DashboardState {
  const router = useRouter()
  const [filters, setFilters] = useState<DashboardFilters>(() =>
    createInitialFilters(hasGroup)
  )
  const [summary, setSummary] = useState<DashboardSummary>({
    totalGanhos: 0,
    totalDespesas: 0,
    saldoLiquido: 0,
  })
  const [evolution, setEvolution] = useState<DashboardEvolutionItem[]>([])
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const hasGroupAvailable = useMemo(
    () => hasGroup && groupId !== null,
    [groupId, hasGroup]
  )

  const handleUnauthorized = useCallback(async () => {
    await fetch("/api/auth/logout", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
    })

    router.push("/")
  }, [router])

  const loadDashboard = useCallback(
    async (currentFilters: DashboardFilters) => {
      const parsedFilters = dashboardFiltersSchema.safeParse(currentFilters)

      if (!parsedFilters.success) {
        const issue = parsedFilters.error.issues[0]
        setError(issue?.message ?? "Filtros inválidos para o dashboard")
        return
      }

      if (currentFilters.scope === "group" && !hasGroupAvailable) {
        setError("Nenhum grupo disponível para consulta.")
        return
      }

      setIsLoading(true)
      setError(null)

      try {
        const query = new URLSearchParams({
          data_inicio: currentFilters.startDate,
          data_fim: currentFilters.endDate,
        })

        if (currentFilters.scope === "group" && groupId !== null) {
          query.set("id_grupo", String(groupId))
        }

        const queryString = query.toString()
        const responses = await Promise.all([
          fetchJson<{ total_ganhos: number }>(
            `/api/dashboard/total-ganhos?${queryString}`,
            { onUnauthorized: handleUnauthorized }
          ),
          fetchJson<{ total_despesas: number }>(
            `/api/dashboard/total-despesas?${queryString}`,
            { onUnauthorized: handleUnauthorized }
          ),
          fetchJson<{ saldo_liquido: number }>(
            `/api/dashboard/saldo-liquido?${queryString}`,
            { onUnauthorized: handleUnauthorized }
          ),
          fetchJson<DashboardEvolutionApiItem[] | null>(
            `/api/dashboard/evolucao-mensal?${queryString}`,
            { onUnauthorized: handleUnauthorized }
          ),
        ])

        const totalGanhosData = responses[0] ?? { total_ganhos: 0 }
        const totalDespesasData = responses[1] ?? { total_despesas: 0 }
        const saldoLiquidoData = responses[2] ?? { saldo_liquido: 0 }
        const evolutionData = Array.isArray(responses[3]) ? responses[3] : []

        setSummary({
          totalGanhos: totalGanhosData.total_ganhos,
          totalDespesas: totalDespesasData.total_despesas,
          saldoLiquido: saldoLiquidoData.saldo_liquido,
        })

        const evolutionList = Array.isArray(evolutionData)
          ? evolutionData
          : []

        setEvolution(
          evolutionList.map((item) => ({
            month: item.mes,
            monthLabel: formatMonthLabel(item.mes),
            totalGanhos: item.total_ganhos,
            totalDespesas: item.total_despesas,
            saldoLiquido: item.saldo_liquido,
          }))
        )
      } catch (loadError) {
        console.error("Erro ao carregar dashboard:", loadError)
        setError(
          loadError instanceof Error
            ? loadError.message
            : "Erro ao carregar dashboard"
        )
      } finally {
        setIsLoading(false)
      }
    },
    [groupId, handleUnauthorized, hasGroupAvailable]
  )

  useEffect(() => {
    setFilters((currentFilters) => {
      if (currentFilters.scope === "group" && !hasGroupAvailable) {
        return {
          ...currentFilters,
          scope: "personal",
        }
      }

      if (currentFilters.scope === "personal" && hasGroupAvailable) {
        return currentFilters
      }

      return currentFilters
    })
  }, [hasGroupAvailable])

  useEffect(() => {
    const initialFilters = createInitialFilters(hasGroupAvailable)
    setFilters((currentFilters) => {
      if (currentFilters.startDate || currentFilters.endDate) {
        return currentFilters
      }

      return initialFilters
    })
  }, [hasGroupAvailable])

  useEffect(() => {
    void loadDashboard(filters)
  }, [filters, loadDashboard])

  const applyFilters = useCallback(async () => {
    await loadDashboard(filters)
  }, [filters, loadDashboard])

  const resetToLastSixMonths = useCallback(() => {
    setFilters((currentFilters) => ({
      ...currentFilters,
      ...getLastSixMonthsRange(),
    }))
  }, [])

  return {
    filters,
    summary,
    evolution,
    isLoading,
    error,
    hasGroupAvailable,
    setFilters,
    applyFilters,
    resetToLastSixMonths,
  }
}