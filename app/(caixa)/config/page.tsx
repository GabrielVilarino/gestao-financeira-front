"use client";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

import { ThemeToggle } from "@/components/theme-toggle";
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
import { DataTable } from "@/components/data-table";
import { ConfirmDialog } from "@/components/confirm-dialog";

import { columnsCategorias, Categoria, columnsSubCategorias, SubCategoria, renderCategoriaMobileCard, renderSubCategoriaMobileCard } from "./columns";
import { CategoriaDialog, CategoriaFormData } from "./categoria-dialog";
import { SubCategoriaDialog, SubCategoriaFormData } from "./subcategoria-dialog";

export default function Page() {
  const [categorias, setCategorias] = useState<Categoria[]>([]);
  const [subCategorias, setSubCategorias] = useState<SubCategoria[]>([]);

  // Categoria dialog state
  const [categoriaDialogOpen, setCategoriaDialogOpen] = useState(false);
  const [categoriaEditId, setCategoriaEditId] = useState<number | undefined>();
  const [categoriaEditData, setCategoriaEditData] = useState<CategoriaFormData | undefined>();
  const [categoriaConfirmOpen, setCategoriaConfirmOpen] = useState(false);
  const [categoriaDeleteId, setCategoriaDeleteId] = useState<number | undefined>();

  // SubCategoria dialog state
  const [subCategoriaDialogOpen, setSubCategoriaDialogOpen] = useState(false);
  const [subCategoriaEditId, setSubCategoriaEditId] = useState<number | undefined>();
  const [subCategoriaEditData, setSubCategoriaEditData] = useState<SubCategoriaFormData | undefined>();
  const [subCategoriaConfirmOpen, setSubCategoriaConfirmOpen] = useState(false);
  const [subCategoriaDeleteId, setSubCategoriaDeleteId] = useState<number | undefined>();

  const router = useRouter();

  async function handleUnauthorized() {
    alert("Sessão expirada. Por favor, faça login novamente.");
    await fetch("/api/auth/logout", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
    });
    router.push("/");
  }

  // ── Categorias ────────────────────────────────────────────────────────────

  async function fetchCategorias(): Promise<Categoria[]> {
    try {
      const response = await fetch("/api/categorias");
      if (response.status === 401) {
        await handleUnauthorized();
        return [];
      }
      const data = await response.json();
      return Array.isArray(data) ? data : [];
    } catch (error) {
      console.error("Erro ao buscar categorias:", error);
      return [];
    }
  }

  function handleOpenAddCategoria() {
    setCategoriaEditId(undefined);
    setCategoriaEditData(undefined);
    setCategoriaDialogOpen(true);
  }

  function handleOpenEditCategoria(id: number) {
    const categoria = categorias.find((c) => c.id_categoria === id);
    if (!categoria) return;
    setCategoriaEditId(id);
    setCategoriaEditData({ nome: categoria.nome, tipo_movimentacao: categoria.tipo_movimentacao as "receita" | "despesa" });
    setCategoriaDialogOpen(true);
  }

  function handleOpenDeleteCategoria(id: number) {
    setCategoriaDeleteId(id);
    setCategoriaConfirmOpen(true);
  }

  async function handleConfirmDeleteCategoria() {
    if (!categoriaDeleteId) return;

    const response = await fetch(`/api/categorias/delete/${categoriaDeleteId}`, { method: "DELETE" });

    if (response.status === 401) {
      await handleUnauthorized();
      return;
    }

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      throw new Error(errorData.error || "Erro ao excluir categoria");
    }

    setCategoriaDeleteId(undefined);
    await fetchCategorias().then(setCategorias);
  }

  async function handleSubmitCategoria(data: CategoriaFormData, id?: number) {
    const isEditing = id !== undefined;
    const url = isEditing ? "/api/categorias/update" : "/api/categorias/create";
    const method = isEditing ? "PUT" : "POST";
    const payload = isEditing ? { id_categoria: id, ...data } : { ...data };

    const response = await fetch(url, {
      method,
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    });

    if (response.status === 401) {
      await handleUnauthorized();
      return;
    }

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      throw new Error(errorData.error || "Erro ao salvar categoria");
    }

    await fetchCategorias().then(setCategorias);
  }

  // ── SubCategorias ─────────────────────────────────────────────────────────

  async function fetchSubCategorias(cats: Categoria[]): Promise<SubCategoria[]> {
    try {
      const response = await fetch("/api/subcategorias");
      if (response.status === 401) {
        await handleUnauthorized();
        return [];
      }
      const data: Omit<SubCategoria, "nome_categoria">[] = await response.json();
      return data.map((sub) => ({
        ...sub,
        nome_categoria: cats.find((c) => c.id_categoria === sub.id_categoria)?.nome ?? "",
      }));
    } catch (error) {
      console.error("Erro ao buscar subcategorias:", error);
      return [];
    }
  }

  function handleOpenAddSubCategoria() {
    setSubCategoriaEditId(undefined);
    setSubCategoriaEditData(undefined);
    setSubCategoriaDialogOpen(true);
  }

  function handleOpenEditSubCategoria(id: number) {
    const sub = subCategorias.find((s) => s.id_subcategoria === id);
    if (!sub) return;
    setSubCategoriaEditId(id);
    setSubCategoriaEditData({ id_categoria: sub.id_categoria, nome: sub.nome });
    setSubCategoriaDialogOpen(true);
  }

  function handleOpenDeleteSubCategoria(id: number) {
    setSubCategoriaDeleteId(id);
    setSubCategoriaConfirmOpen(true);
  }

  async function handleConfirmDeleteSubCategoria() {
    if (!subCategoriaDeleteId) return;

    const response = await fetch(`/api/subcategorias/delete/${subCategoriaDeleteId}`, { method: "DELETE" });

    if (response.status === 401) {
      await handleUnauthorized();
      return;
    }

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      throw new Error(errorData.error || "Erro ao excluir subcategoria");
    }

    setSubCategoriaDeleteId(undefined);
    await fetchSubCategorias(categorias).then(setSubCategorias);
  }

  async function handleSubmitSubCategoria(data: SubCategoriaFormData, id?: number) {
    const isEditing = id !== undefined;
    const url = isEditing ? "/api/subcategorias/update" : "/api/subcategorias/create";
    const method = isEditing ? "PUT" : "POST";
    const payload = isEditing ? { id_subcategoria: id, ...data } : { ...data };

    const response = await fetch(url, {
      method,
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    });

    if (response.status === 401) {
      await handleUnauthorized();
      return;
    }

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      throw new Error(errorData.error || "Erro ao salvar subcategoria");
    }

    await fetchSubCategorias(categorias).then(setSubCategorias);
  }

  useEffect(() => {
    fetchCategorias().then((cats) => {
      setCategorias(cats);
      fetchSubCategorias(cats).then(setSubCategorias);
    });
  }, []);

  return (
    <SidebarProvider className="h-svh">
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
                    <BreadcrumbLink href="#">
                      Gestão Financeira
                    </BreadcrumbLink>
                  </BreadcrumbItem>
                  <BreadcrumbSeparator className="hidden md:block" />
                  <BreadcrumbItem>
                    <BreadcrumbPage>Configurações</BreadcrumbPage>
                  </BreadcrumbItem>
                </BreadcrumbList>
              </Breadcrumb>
            </div>
            <ThemeToggle />
          </div>
        </header>
        <div className="flex flex-1 flex-col gap-4 p-4 pt-0 overflow-y-auto min-h-0">
          <div className="flex flex-col">
            <h1><b>Configurações de Categorias</b></h1>
            <DataTable
              columns={columnsCategorias}
              data={categorias}
              filterColumn="nome"
              filterPlaceholder="Filtrar por nome..."
              onAdd={handleOpenAddCategoria}
              onEdit={handleOpenEditCategoria}
              onDelete={handleOpenDeleteCategoria}
              renderMobileCard={(row, meta) => renderCategoriaMobileCard(row, meta)}
              dialog={
                <>
                  <CategoriaDialog
                    open={categoriaDialogOpen}
                    onOpenChange={(open) => {
                      setCategoriaDialogOpen(open);
                      if (!open) setCategoriaEditId(undefined);
                    }}
                    id={categoriaEditId}
                    initialData={categoriaEditData}
                    onSubmit={handleSubmitCategoria}
                  />
                  <ConfirmDialog
                    open={categoriaConfirmOpen}
                    onOpenChange={setCategoriaConfirmOpen}
                    title="Excluir Categoria"
                    description="Tem certeza que deseja excluir esta categoria? Esta ação não pode ser desfeita."
                    confirmLabel="Excluir"
                    onConfirm={handleConfirmDeleteCategoria}
                  />
                </>
              }
            />
          </div>
          <div className="flex flex-col">
            <h1><b>Configurações de SubCategorias</b></h1>
            <DataTable
              columns={columnsSubCategorias}
              data={subCategorias}
              filterColumn="nome"
              filterPlaceholder="Filtrar por nome..."
              onAdd={handleOpenAddSubCategoria}
              onEdit={handleOpenEditSubCategoria}
              onDelete={handleOpenDeleteSubCategoria}
              renderMobileCard={(row, meta) => renderSubCategoriaMobileCard(row, meta)}
              dialog={
                <>
                  <SubCategoriaDialog
                    open={subCategoriaDialogOpen}
                    onOpenChange={(open) => {
                      setSubCategoriaDialogOpen(open);
                      if (!open) setSubCategoriaEditId(undefined);
                    }}
                    id={subCategoriaEditId}
                    categorias={categorias}
                    initialData={subCategoriaEditData}
                    onSubmit={handleSubmitSubCategoria}
                  />
                  <ConfirmDialog
                    open={subCategoriaConfirmOpen}
                    onOpenChange={setSubCategoriaConfirmOpen}
                    title="Excluir SubCategoria"
                    description="Tem certeza que deseja excluir esta subcategoria? Esta ação não pode ser desfeita."
                    confirmLabel="Excluir"
                    onConfirm={handleConfirmDeleteSubCategoria}
                  />
                </>
              }
            />
          </div>
        </div>
      </SidebarInset>
    </SidebarProvider>
  )
}

