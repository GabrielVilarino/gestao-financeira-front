"use client"

import * as React from "react"
import * as RechartsPrimitive from "recharts"
import type {
  LegendPayload,
  TooltipContentProps,
  TooltipValueType,
} from "recharts"

import { cn } from "@/lib/utils"

export type ChartConfig = {
  [key: string]: {
    label?: React.ReactNode
    color?: string
  }
}

type ChartContextProps = {
  config: ChartConfig
}

const ChartContext = React.createContext<ChartContextProps | null>(null)

function useChart() {
  const context = React.useContext(ChartContext)

  if (!context) {
    throw new Error("useChart deve ser usado dentro de ChartContainer")
  }

  return context
}

function ChartContainer({
  id,
  className,
  children,
  config,
  ...props
}: React.ComponentProps<"div"> & {
  config: ChartConfig
  children: React.ComponentProps<
    typeof RechartsPrimitive.ResponsiveContainer
  >["children"]
}) {
  const chartId = React.useId().replace(/:/g, "")
  const containerId = `chart-${id ?? chartId}`
  const [isMounted, setIsMounted] = React.useState(false)

  React.useEffect(() => {
    setIsMounted(true)
  }, [])

  return (
    <ChartContext.Provider value={{ config }}>
      <div
        data-slot="chart"
        data-chart={containerId}
        className="relative w-full h-87.5 min-h-62.5"
        style={Object.fromEntries(
          Object.entries(config).map(([key, item]) => [
            `--color-${key}`,
            item.color ?? "currentColor",
          ])
        )}
        {...props}
      >
        {isMounted ? (
          <RechartsPrimitive.ResponsiveContainer
            width="100%"
            height={350}
            minWidth={0}
          >
            {children}
          </RechartsPrimitive.ResponsiveContainer>
        ) : null}
      </div>
    </ChartContext.Provider>
  )
}

function ChartTooltipContent({
  active,
  payload,
  label,
  className,
  formatter,
}: TooltipContentProps<TooltipValueType> & {
  className?: string
}) {
  const { config } = useChart()

  if (!active || !payload?.length) {
    return null
  }

  return (
    <div
      className={cn(
        "grid min-w-40 gap-2 rounded-lg border bg-popover px-3 py-2 text-xs shadow-md",
        className
      )}
    >
      {label ? <div className="font-medium text-foreground">{label}</div> : null}
      <div className="grid gap-1.5">
        {payload.map((item, index) => {
          const key = typeof item.dataKey === "string" ? item.dataKey : "value"
          const itemConfig = config[key]
          const itemValue = item.value

          return (
            <div key={key} className="flex items-center justify-between gap-4">
              <div className="flex items-center gap-2 text-muted-foreground">
                <span
                  className="size-2.5 rounded-xs"
                  style={{ backgroundColor: item.color }}
                />
                <span>{itemConfig?.label ?? item.name}</span>
              </div>
              <span className="font-medium text-foreground">
                {formatter
                  ? formatter(itemValue, item.name, item, index, payload)
                  : itemValue?.toLocaleString("pt-BR")}
              </span>
            </div>
          )
        })}
      </div>
    </div>
  )
}

function ChartLegendContent({
  className,
  payload,
}: React.ComponentProps<"div"> & {
  payload?: ReadonlyArray<LegendPayload>
}) {
  const { config } = useChart()

  if (!payload?.length) {
    return null
  }

  return (
    <div className={cn("flex flex-wrap items-center gap-4", className)}>
      {payload.map((item) => {
        const key = typeof item.dataKey === "string" ? item.dataKey : "value"
        const itemConfig = config[key]

        return (
          <div key={key} className="flex items-center gap-2 text-sm text-muted-foreground">
            <span
              className="size-2.5 rounded-xs"
              style={{ backgroundColor: item.color }}
            />
            <span>{itemConfig?.label ?? item.value}</span>
          </div>
        )
      })}
    </div>
  )
}

const ChartTooltip = RechartsPrimitive.Tooltip
const ChartLegend = RechartsPrimitive.Legend

export {
  ChartContainer,
  ChartLegend,
  ChartLegendContent,
  ChartTooltip,
  ChartTooltipContent,
}