import { columns, Ganho } from "./columns";

import { ThemeToggle } from "@/components/theme-toggle";
import { AppSidebar } from "@/components/app-sidebar"
import { DataTable } from "@/components/data-table";
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

async function fetchGanhos(): Promise<Ganho[]> {
  return [
    {
      id: 1,
      pessoa: "Luana",
      data: new Date(2026, 4, 1),
      valor: 4000,
      tipo: "salario",
    },
    {
      id: 2,
      pessoa: "Gabriel",
      data: new Date(2026, 4, 1),
      valor: 4200,
      tipo: "salario",
    },
    {
      id: 3,
      pessoa: "Luana",
      data: new Date(2026, 4, 20),
      valor: 4400,
      tipo: "salario",
    },
  ]
}

export default async function Page() {
  const ganhos = await fetchGanhos()
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
                    <BreadcrumbPage>Caixa</BreadcrumbPage>
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
          <div className="container mx-auto py-10">
            <DataTable columns={columns} data={ganhos} />
          </div>
        </div>
      </SidebarInset>
    </SidebarProvider>
  )
}
