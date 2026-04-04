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
    data_pagamento: string
    data_ult_pagamento: string | null
    valor: number
    tipo_transacao: "fixa" | "variavel" | "parcelado"
}
