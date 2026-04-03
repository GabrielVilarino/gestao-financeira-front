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

export type GanhoDetalhe = {
    id_categoria: number
    id_subcategoria: number | null
    valor: number
    tipo_transacao: "fixa" | "variavel"
    data_recebimento: string
}