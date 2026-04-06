"use client"

import { GroupProvider } from "@/lib/context/group-context"
import { ReactNode } from "react"

export function Providers({ children }: { children: ReactNode }) {
  return <GroupProvider>{children}</GroupProvider>
}
