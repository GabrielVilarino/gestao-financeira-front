"use client"

import { useMemo } from "react"
import {
  CartesianGrid,
  ComposedChart,
  Bar,
  Line,
  XAxis,
  YAxis,
} from "recharts"
import {
  ArrowDownRight,
  ArrowUpRight,
  BadgeDollarSign,
  CalendarRange,
  ChartColumnIncreasing,
  RefreshCcw,
  Scale,
  Wallet,
} from "lucide-react"

import { useDashboard } from "@/app/hooks/use-dashboard"
import { ThemeToggle } from "@/components/theme-toggle";
import { AppSidebar } from "@/components/app-sidebar"
import {
  ChartConfig,
  ChartContainer,
  ChartLegend,
  ChartLegendContent,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/chart"
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { Separator } from "@/components/ui/separator"
import {
  SidebarInset,
  SidebarProvider,
  SidebarTrigger,
} from "@/components/ui/sidebar"
import { Skeleton } from "@/components/ui/skeleton"
import { useGroupContext } from "@/lib/context/group-context"

const currencyFormatter = new Intl.NumberFormat("pt-BR", {
  style: "currency",
  currency: "BRL",
})

const chartConfig = {
  totalGanhos: {
    label: "Ganhos",
    color: "var(--chart-2)",
  },
  totalDespesas: {
    label: "Despesas",
    color: "var(--destructive)",
  },
  saldoLiquido: {
    label: "Saldo líquido",
    color: "var(--chart-1)",
  },
} satisfies ChartConfig

function formatCurrency(value: number): string {
  return currencyFormatter.format(value)
}

function getBalanceDescription(value: number): string {
  if (value > 0) {
    return "Resultado positivo no período analisado"
  }

  if (value < 0) {
    return "Atenção ao ritmo de despesas neste período"
  }

  return "Saldo zerado no período analisado"
}

function DashboardCard({
  title,
  description,
  value,
  icon: Icon,
  trend,
}: {
  title: string
  description: string
  value: string
  icon: typeof Wallet
  trend?: "positive" | "negative" | "neutral"
}) {
  return (
    <Card className="gap-4">
      <CardHeader className="flex flex-row items-start justify-between space-y-0 pb-0">
        <div className="space-y-1">
          <CardDescription>{title}</CardDescription>
          <CardTitle className="text-2xl">{value}</CardTitle>
        </div>
        <div className="rounded-lg border bg-muted/60 p-2 text-muted-foreground">
          <Icon className="size-4" />
        </div>
      </CardHeader>
      <CardContent className="flex items-center gap-2 text-sm text-muted-foreground">
        {trend === "positive" ? (
          <ArrowUpRight className="size-4 text-primary" />
        ) : null}
        {trend === "negative" ? (
          <ArrowDownRight className="size-4 text-destructive" />
        ) : null}
        {description}
      </CardContent>
    </Card>
  )
}

function DashboardCardSkeleton() {
  return (
    <Card>
      <CardHeader className="space-y-3">
        <Skeleton className="h-4 w-24" />
        <Skeleton className="h-8 w-40" />
      </CardHeader>
      <CardContent>
        <Skeleton className="h-4 w-52" />
      </CardContent>
    </Card>
  )
}

export default function Page() {
  const { hasGroup, groupId, groupName } = useGroupContext()
  const {
    filters,
    summary,
    evolution,
    isLoading,
    error,
    hasGroupAvailable,
    setFilters,
    applyFilters,
    resetToLastSixMonths,
  } = useDashboard(hasGroup, groupId)

  const chartData = useMemo(
    () =>
      evolution.map((item) => ({
        monthLabel: item.monthLabel,
        totalGanhos: item.totalGanhos,
        totalDespesas: item.totalDespesas,
        saldoLiquido: item.saldoLiquido,
      })),
    [evolution]
  )

  const comparisonChartData = useMemo(
    () => [
      {
        label: "Ganhos",
        value: summary.totalGanhos,
        fill: "var(--color-totalGanhos)",
      },
      {
        label: "Despesas",
        value: summary.totalDespesas,
        fill: "var(--color-totalDespesas)",
      },
      {
        label: "Saldo",
        value: summary.saldoLiquido,
        fill: "var(--color-saldoLiquido)",
      },
    ],
    [summary.saldoLiquido, summary.totalDespesas, summary.totalGanhos]
  )

  return (
    <SidebarProvider className="h-svh">
      <AppSidebar />
      <SidebarInset className="min-h-0 overflow-hidden">
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
                    <BreadcrumbLink href="#">
                      Gestão Financeira
                    </BreadcrumbLink>
                  </BreadcrumbItem>
                  <BreadcrumbSeparator className="hidden md:block" />
                  <BreadcrumbItem>
                    <BreadcrumbPage>Dashboard</BreadcrumbPage>
                  </BreadcrumbItem>
                </BreadcrumbList>
              </Breadcrumb>
            </div>
            <ThemeToggle />
          </div>
        </header>
        <div className="flex min-h-0 flex-1 flex-col gap-4 overflow-y-auto p-4 pt-0">
          <div className="grid items-stretch gap-4 xl:grid-cols-[minmax(0,1fr)_320px]">
            <div className="grid content-start gap-4">
              <Card>
                <CardHeader className="gap-3 md:flex-row md:items-end md:justify-between">
                  <div className="space-y-1">
                    <CardTitle className="text-xl">Visão geral financeira</CardTitle>
                    <CardDescription>
                      Acompanhe ganhos, despesas e saldo líquido com foco no período selecionado.
                    </CardDescription>
                  </div>
                  <div className="rounded-lg border bg-muted/40 px-3 py-2 text-sm text-muted-foreground">
                    {filters.scope === "group" && hasGroupAvailable
                      ? `Escopo: Grupo ${groupName ?? "selecionado"}`
                      : "Escopo: Caixa pessoal"}
                  </div>
                </CardHeader>
                <CardContent className="grid gap-3 md:grid-cols-2 xl:grid-cols-4">
                  <div className="space-y-2">
                    <div className="text-sm font-medium text-muted-foreground">
                      Data inicial
                    </div>
                    <Input
                      type="date"
                      value={filters.startDate}
                      onChange={(event) =>
                        setFilters({
                          ...filters,
                          startDate: event.target.value,
                        })
                      }
                    />
                  </div>
                  <div className="space-y-2">
                    <div className="text-sm font-medium text-muted-foreground">
                      Data final
                    </div>
                    <Input
                      type="date"
                      value={filters.endDate}
                      onChange={(event) =>
                        setFilters({
                          ...filters,
                          endDate: event.target.value,
                        })
                      }
                    />
                  </div>
                  <div className="space-y-2">
                    <div className="text-sm font-medium text-muted-foreground">
                      Escopo
                    </div>
                    <Select
                      value={filters.scope}
                      onValueChange={(value: "personal" | "group") =>
                        setFilters({
                          ...filters,
                          scope: value,
                        })
                      }
                    >
                      <SelectTrigger className="w-full">
                        <SelectValue placeholder="Selecione o escopo" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="personal">Caixa pessoal</SelectItem>
                        {hasGroupAvailable ? (
                          <SelectItem value="group">
                            Grupo {groupName ?? "ativo"}
                          </SelectItem>
                        ) : null}
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="flex flex-col justify-end gap-2 md:flex-row md:items-end xl:flex-col xl:items-stretch">
                    <Button className="w-full" onClick={() => void applyFilters()}>
                      <CalendarRange className="size-4" />
                      Atualizar
                    </Button>
                    <Button
                      variant="outline"
                      className="w-full"
                      onClick={resetToLastSixMonths}
                    >
                      <RefreshCcw className="size-4" />
                      Últimos 6 meses
                    </Button>
                  </div>
                </CardContent>
              </Card>

              {error ? (
                <Card className="border-destructive/40 bg-destructive/5">
                  <CardHeader className="gap-2">
                    <CardTitle className="text-base text-destructive">
                      Não foi possível carregar o dashboard
                    </CardTitle>
                    <CardDescription className="text-destructive/80">
                      {error}
                    </CardDescription>
                  </CardHeader>
                </Card>
              ) : null}

              <div className="grid gap-4 md:grid-cols-2 2xl:grid-cols-3">
                {isLoading ? (
                  <>
                    <DashboardCardSkeleton />
                    <DashboardCardSkeleton />
                    <DashboardCardSkeleton />
                  </>
                ) : (
                  <>
                    <DashboardCard
                      title="Total de ganhos"
                      description="Entradas consolidadas no intervalo atual"
                      value={formatCurrency(summary.totalGanhos)}
                      icon={BadgeDollarSign}
                      trend="positive"
                    />
                    <DashboardCard
                      title="Total de despesas"
                      description="Saídas acumuladas no mesmo período"
                      value={formatCurrency(summary.totalDespesas)}
                      icon={Scale}
                      trend="negative"
                    />
                    <DashboardCard
                      title="Saldo líquido"
                      description={getBalanceDescription(summary.saldoLiquido)}
                      value={formatCurrency(summary.saldoLiquido)}
                      icon={Wallet}
                      trend={
                        summary.saldoLiquido > 0
                          ? "positive"
                          : summary.saldoLiquido < 0
                            ? "negative"
                            : "neutral"
                      }
                    />
                  </>
                )}
              </div>
            </div>

            <Card className="h-full xl:min-h-full">
              <CardHeader>
                <CardTitle className="text-base">Comparativo do período</CardTitle>
                <CardDescription>
                  Leitura direta dos totais consolidados para apoiar a decisão rápida.
                </CardDescription>
              </CardHeader>
              <CardContent className="flex h-full flex-1 items-center">
                {isLoading ? (
                  <Skeleton className="h-65 w-full" />
                ) : (
                  <ChartContainer config={chartConfig} className="h-65 w-full">
                    <ComposedChart data={comparisonChartData} layout="vertical" margin={{ left: 12, right: 12 }}>
                      <CartesianGrid horizontal={false} />
                      <XAxis
                        type="number"
                        tickLine={false}
                        axisLine={false}
                        tickFormatter={(value: number) =>
                          value.toLocaleString("pt-BR", {
                            notation: "compact",
                            compactDisplay: "short",
                          })
                        }
                      />
                      <YAxis
                        dataKey="label"
                        type="category"
                        tickLine={false}
                        axisLine={false}
                        width={72}
                      />
                      <ChartTooltip
                        cursor={false}
                        content={(props) => (
                          <ChartTooltipContent
                            {...props}
                            formatter={(value) => formatCurrency(Number(value ?? 0))}
                          />
                        )}
                      />
                      <Bar dataKey="value" radius={10} fill="var(--color-totalGanhos)" />
                    </ComposedChart>
                  </ChartContainer>
                )}
              </CardContent>
            </Card>

            <Card className="h-full">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <ChartColumnIncreasing className="size-5 text-primary" />
                    Evolução mensal
                  </CardTitle>
                  <CardDescription>
                    Ganhos e despesas em barras, com saldo líquido sobreposto para leitura rápida.
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  {isLoading ? (
                    <Skeleton className="h-85 w-full" />
                  ) : chartData.length ? (
                    <ChartContainer config={chartConfig} className="h-85 w-full">
                      <ComposedChart data={chartData} margin={{ left: 12, right: 12, top: 12 }}>
                        <CartesianGrid vertical={false} />
                        <XAxis
                          dataKey="monthLabel"
                          tickLine={false}
                          axisLine={false}
                          tickMargin={8}
                        />
                        <YAxis
                          tickLine={false}
                          axisLine={false}
                          width={92}
                          tickFormatter={(value: number) =>
                            value.toLocaleString("pt-BR", {
                              style: "currency",
                              currency: "BRL",
                              maximumFractionDigits: 0,
                            })
                          }
                        />
                        <ChartTooltip
                          content={(props) => (
                            <ChartTooltipContent
                              {...props}
                              formatter={(value) => formatCurrency(Number(value ?? 0))}
                            />
                          )}
                        />
                        <ChartLegend content={<ChartLegendContent className="pt-4" />} />
                        <Bar
                          dataKey="totalGanhos"
                          fill="var(--color-totalGanhos)"
                          radius={[8, 8, 0, 0]}
                          maxBarSize={34}
                        />
                        <Bar
                          dataKey="totalDespesas"
                          fill="var(--color-totalDespesas)"
                          radius={[8, 8, 0, 0]}
                          maxBarSize={34}
                        />
                        <Line
                          type="monotone"
                          dataKey="saldoLiquido"
                          stroke="var(--color-saldoLiquido)"
                          strokeWidth={3}
                          dot={{ fill: "var(--color-saldoLiquido)", strokeWidth: 0, r: 4 }}
                          activeDot={{ r: 6 }}
                        />
                      </ComposedChart>
                    </ChartContainer>
                  ) : (
                    <div className="flex h-85 items-center justify-center rounded-xl border border-dashed text-sm text-muted-foreground">
                      Nenhum dado mensal foi retornado para o período selecionado.
                    </div>
                  )}
                </CardContent>
              </Card>

            <Card className="h-full">
                <CardHeader>
                  <CardTitle className="text-base">Leitura do recorte</CardTitle>
                  <CardDescription>
                    Resumo textual para complementar os gráficos sem depender de tabela.
                  </CardDescription>
                </CardHeader>
                <CardContent className="flex h-full flex-col space-y-4 text-sm text-muted-foreground">
                  <div className="rounded-xl border bg-muted/30 p-4">
                    <div className="font-medium text-foreground">Período analisado</div>
                    <div>
                      {filters.startDate} até {filters.endDate}
                    </div>
                  </div>
                  <div className="rounded-xl border bg-muted/30 p-4">
                    <div className="font-medium text-foreground">Melhor leitura</div>
                    <div>
                      {summary.totalGanhos >= summary.totalDespesas
                        ? "Os ganhos sustentam as saídas no intervalo atual."
                        : "As despesas estão acima das entradas e pedem revisão."}
                    </div>
                  </div>
                  <div className="rounded-xl border bg-muted/30 p-4">
                    <div className="font-medium text-foreground">Escopo ativo</div>
                    <div>
                      {filters.scope === "group" && hasGroupAvailable
                        ? `Dados consolidados do grupo ${groupName ?? "ativo"}.`
                        : "Dados consolidados do caixa pessoal."}
                    </div>
                  </div>
                </CardContent>
              </Card>
          </div>
        </div>
      </SidebarInset>
    </SidebarProvider>
  )
}
