"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { useGroupContext } from "@/lib/context/group-context"

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

export default function GrupoMetasPage() {
  const [isCheckingGroup, setIsCheckingGroup] = useState(true)
  
  const { hasGroup } = useGroupContext()
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
                    <BreadcrumbPage>Metas</BreadcrumbPage>
                  </BreadcrumbItem>
                </BreadcrumbList>
              </Breadcrumb>
            </div>
            <ThemeToggle />
          </div>
        </header>
        <div className="flex flex-1 items-center justify-center p-4">
          <div className="text-center">
            <h2 className="text-2xl font-semibold">Metas do Grupo</h2>
            <p className="mt-2 text-muted-foreground">
              Esta página será implementada em breve.
            </p>
          </div>
        </div>
      </SidebarInset>
    </SidebarProvider>
  )
}
