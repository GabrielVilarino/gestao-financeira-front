export type Categorias = {
    id_categoria: number
    nome: string
    tipo_movimentacao: string
}

export type Subcategorias = {
    id_subcategoria: number
    id_categoria: number
    nome: string
}

export type DespesaDetalhe = {
    id_categoria: number
    id_subcategoria: number | null
    tipo: "RECEITA" | "DESPESA"
    descricao: string
    observacao: string | null
    valor: number
    competencia: string
    data_vencimento: string | null
    data_pagamento: string | null
    status: "PENDENTE" | "PAGO" | "ATRASADO" | "CANCELADO"
}
