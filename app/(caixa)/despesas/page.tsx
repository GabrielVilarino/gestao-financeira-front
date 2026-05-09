"use client";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

import { columns, Despesa, renderMobileCard } from "./columns";
import { DespesaDialog, DespesaFormData, RecorrenciaFormData } from "./despesa-dialog";
import { ConfirmDialog } from "@/components/confirm-dialog";
import formatDate from "@/functions/format-date";

import { ThemeToggle } from "@/components/theme-toggle";
import { AppSidebar } from "@/components/app-sidebar";
import { DataTable } from "@/components/data-table";
import { Button } from "@/components/ui/button";
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

import { Categorias, Subcategorias } from "./types";

export default function Page() {
  const [despesas, setDespesas] = useState<Despesa[]>([]);
  const [categorias, setCategorias] = useState<Categorias[]>([]);
  const [subcategorias, setSubcategorias] = useState<Subcategorias[]>([]);

  const [isLoading, setIsLoading] = useState(false);

  const [dialogOpen, setDialogOpen] = useState(false);
  const [editId, setEditId] = useState<number | undefined>();
  const [confirmOpen, setConfirmOpen] = useState(false);
  const [deleteId, setDeleteId] = useState<number | undefined>();

  const router = useRouter();

  function handleOpenAdd() {
    setEditId(undefined);
    setDialogOpen(true);
  }

  function handleOpenEdit(id: number) {
    setEditId(id);
    setDialogOpen(true);
  }

  function handleOpenDelete(id: number) {
    setDeleteId(id);
    setConfirmOpen(true);
  }

  async function handleConfirmDelete() {
    if (!deleteId) return;
    
    const response = await fetch(`/api/transacoes/delete/${deleteId}`, { method: "DELETE" });

    if (response.status === 401) {
      alert("Sessão expirada. Por favor, faça login novamente.");

      await fetch("/api/auth/logout", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
      });

      router.push("/");
    }

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      throw new Error(errorData.error || "Erro ao excluir despesa");
    }

    setDeleteId(undefined);
    await fetchDespesas().then(setDespesas);
  }

  async function handleSubmit(data: DespesaFormData, id?: number) {
    const isEditing = id !== undefined;
    const url = isEditing ? "/api/transacoes/update" : "/api/transacoes/create";
    const method = isEditing ? "PUT" : "POST";

    const payload = isEditing ? { id, ...data, tipo: "DESPESA" } : { ...data, tipo: "DESPESA" };

    const response = await fetch(url, {
      method,
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    });

    if (response.status === 401) {
      alert("Sessão expirada. Por favor, faça login novamente.");

      await fetch("/api/auth/logout", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
      });

      router.push("/");
    }

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      throw new Error(errorData.error || "Erro ao salvar despesa");
    }

    await fetchDespesas().then(setDespesas);
  }

  async function handleSubmitRecorrencia(data: RecorrenciaFormData) {
    const response = await fetch("/api/recorrencias/create", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ ...data, tipo: "DESPESA" }),
    });

    if (response.status === 401) {
      alert("Sessão expirada. Por favor, faça login novamente.");

      await fetch("/api/auth/logout", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
      });

      router.push("/");
    }

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      throw new Error(errorData.error || "Erro ao criar recorrência");
    }

    await fetchDespesas().then(setDespesas);
  }

  async function fetchDespesas(): Promise<Despesa[]> {
    setIsLoading(true);
    try {
      const now = new Date();

      const startDate = new Date(now.getFullYear(), now.getMonth(), 1);
      const endDate = new Date(now.getFullYear(), now.getMonth() + 1, 0);

      const start = formatDate(startDate);
      const end = formatDate(endDate);

      const response = await fetch(`/api/transacoes?tipo=DESPESA&data_inicio=${start}&data_fim=${end}`);

      if (response.status === 401) {
        alert("Sessão expirada. Por favor, faça login novamente.");

        await fetch("/api/auth/logout", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
        });

        router.push("/");
        return [];
      }

      const despesas = await response.json();
      return Array.isArray(despesas) ? despesas : [];
    } catch (error) {
      console.error("Erro ao buscar despesas:", error);
      return [];
    } finally {
      setIsLoading(false);
    }
  }

  async function fetchCategorias(): Promise<Categorias[]> {
    try {
      const response = await fetch(`/api/categorias?tipo=despesa`);

      if (response.status === 401) {
        alert("Sessão expirada. Por favor, faça login novamente.");

        await fetch("/api/auth/logout", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
        });

        router.push("/");
        return [];
      }

      const categorias = await response.json();
      return Array.isArray(categorias) ? categorias : [];
    } catch (error) {
      console.error("Erro ao buscar categorias:", error);
      return [];
    }
  }

  async function fetchSubcategorias(): Promise<Subcategorias[]> {
    try {
      const response = await fetch(`/api/subcategorias`);

      if (response.status === 401) {
        alert("Sessão expirada. Por favor, faça login novamente.");

        await fetch("/api/auth/logout", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
        });

        router.push("/");
        return [];
      }

      const subcategorias = await response.json();
      return Array.isArray(subcategorias) ? subcategorias : [];
    } catch (error) {
      console.error("Erro ao buscar subcategorias:", error);
      return [];
    }
  }

  useEffect(() => {
    fetchDespesas().then(setDespesas);
    fetchCategorias().then(setCategorias);
    fetchSubcategorias().then(setSubcategorias);
  }, []);

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
        <div className="flex min-h-0 flex-1 flex-col overflow-y-auto p-4">
          {isLoading ?
            (
              <div className="flex h-64 w-full items-center justify-center">
                <span className="text-sm text-muted-foreground">Carregando despesas...</span>
              </div>
            ) : !despesas || despesas.length === 0 ?
            (
              <div className="flex h-64 w-full flex-col items-center justify-center gap-4">
                <span className="text-sm text-muted-foreground">Nenhuma despesa encontrada.</span>
                <Button onClick={handleOpenAdd}>Adicionar despesa</Button>
                <DespesaDialog
                  open={dialogOpen}
                  onOpenChange={(open) => {
                    setDialogOpen(open);
                    if (!open) setEditId(undefined);
                  }}
                  id={editId}
                  categorias={categorias}
                  subcategorias={subcategorias}
                  onSubmit={handleSubmit}
                  onSubmitRecorrencia={handleSubmitRecorrencia}
                />
              </div>
            ) :
            (
              <div className="container mx-auto py-10">
                <DataTable
                  columns={columns}
                  data={despesas}
                  filterColumn="descricao"
                  filterPlaceholder="Filtrar por descrição..."
                  onAdd={handleOpenAdd}
                  onEdit={handleOpenEdit}
                  onDelete={handleOpenDelete}
                  renderMobileCard={(row, meta) => renderMobileCard(row, meta)}
                  dialog={
                    <>
                      <DespesaDialog
                        open={dialogOpen}
                        onOpenChange={(open) => {
                          setDialogOpen(open);
                          if (!open) setEditId(undefined);
                        }}
                        id={editId}
                        categorias={categorias}
                        subcategorias={subcategorias}
                        onSubmit={handleSubmit}
                        onSubmitRecorrencia={handleSubmitRecorrencia}
                      />
                      <ConfirmDialog
                        open={confirmOpen}
                        onOpenChange={(open) => {
                          setConfirmOpen(open);
                          if (!open) setDeleteId(undefined);
                        }}
                        title="Excluir despesa"
                        description="Essa ação não pode ser desfeita. Deseja realmente excluir esta despesa?"
                        confirmLabel="Excluir"
                        onConfirm={handleConfirmDelete}
                      />
                    </>
                  }
                />
              </div>
            )
          }
        </div>
      </SidebarInset>
    </SidebarProvider>
  );
}


