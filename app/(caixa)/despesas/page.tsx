import { 
  columnsFixa,
  DespesaFixa,
  DespesaVariavel,
  columnsVariavel
} from "./columns";

import { ThemeToggle } from "@/components/theme-toggle";
import { AppSidebar } from "@/components/app-sidebar";
import { DataTable } from "@/components/data-table";
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";
import { Separator } from "@/components/ui/separator";
import {
  SidebarInset,
  SidebarProvider,
  SidebarTrigger,
} from "@/components/ui/sidebar";

async function fetchDespesasFixas(): Promise<DespesaFixa[]> {
  return [
    {
      id: 1,
      pessoa: "Gabriel e Luana",
      data: new Date(2026, 4, 10),
      valor: 2770,
      categoria: "aluguel",
    },
    {
      id: 2,
      pessoa: "Gabriel e Luana",
      data: new Date(2026, 4, 10),
      valor: 100,
      categoria: "internet",
    },
    {
      id: 3,
      pessoa: "Gabriel e Luana",
      data: new Date(2026, 4, 10),
      valor: 4400,
      categoria: "assinaturas",
    },
  ]
}

async function fetchDespesasVariaveis(): Promise<DespesaVariavel[]> {
  return [
    {
      id: 1,
      pessoa: "Gabriel e Luana",
      data: new Date(2026, 4, 6),
      valor: 200,
      categoria: "casa",
      subCategoria: "energia",
    },
    {
      id: 2,
      pessoa: "Gabriel",
      data: new Date(2026, 4, 1),
      valor: 263.7,
      categoria: "mercado",
      subCategoria: "matheus",
    },
    {
      id: 3,
      pessoa: "Gabriel e Luana",
      data: new Date(2026, 4, 10),
      valor: 63.96,
      categoria: "casa",
      subCategoria: "lavanderia",
    },
    {
      id: 4,
      pessoa: "Luana",
      data: new Date(2026, 4, 20),
      valor: 40,
      categoria: "mercado",
      subCategoria: "armazem",
    },
    {
      id: 5,
      pessoa: "Gabriel e Luana",
      data: new Date(2026, 4, 1),
      valor: 72,
      categoria: "lazer",
      subCategoria: "feirinha",
    },
    {
      id: 6,
      pessoa: "Gabriel",
      data: new Date(2026, 4, 1),
      valor: 51.94,
      categoria: "mercado",
      subCategoria: "armazem",
    },
    {
      id: 7,
      pessoa: "Gabriel",
      data: new Date(2026, 4, 1),
      valor: 13,
      categoria: "mercado",
      subCategoria: "armazem",
    },
    {
      id: 8,
      pessoa: "Gabriel e Luana",
      data: new Date(2026, 4, 1),
      valor: 204.92,
      categoria: "mercado",
      subCategoria: "fribal",
    },
    {
      id: 9,
      pessoa: "Gabriel e Luana",
      data: new Date(2026, 4, 1),
      valor: 8.09,
      categoria: "mercado",
      subCategoria: "armazem",
    },
  ]
}

export default async function Page() {
  const despesasFixas = await fetchDespesasFixas()
  const despesasVariaveis = await fetchDespesasVariaveis()
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
                    <BreadcrumbPage>Despesas</BreadcrumbPage>
                  </BreadcrumbItem>
                </BreadcrumbList>
              </Breadcrumb>
            </div>
            <ThemeToggle />
          </div>
        </header>
        <div className="flex flex-col p-4 mr-2 gap-4 overflow-y-auto max-h-[calc(100vh-5rem)] [&::-webkit-scrollbar]:w-2 [&::-webkit-scrollbar-track]:bg-transparent [&::-webkit-scrollbar-thumb]:bg-primary [&::-webkit-scrollbar-thumb]:rounded-full">
          <div className="flex flex-col gap-4">
            <h1><b>Despesas Fixas</b></h1>
            <div className="container mx-auto">
              <DataTable columns={columnsFixa} data={despesasFixas} />
            </div>
          </div>
          <div className="flex flex-col gap-4">
            <h1><b>Despesas Variáveis</b></h1>
            <div className="container mx-auto">
              <DataTable columns={columnsVariavel} data={despesasVariaveis} />
            </div>
          </div>
        </div>
      </SidebarInset>
    </SidebarProvider>
  )
}
