"use client"

import { GroupProvider } from "@/lib/context/group-context"
import { ReactNode } from "react"
import { useServiceWorker } from "./hooks/use-service-worker"

function ServiceWorkerRegistrar() {
  useServiceWorker()
  return null
}

export function Providers({ children }: { children: ReactNode }) {
  return (
    <GroupProvider>
      <ServiceWorkerRegistrar />
      {children}
    </GroupProvider>
  )
}
