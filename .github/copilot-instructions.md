# Gestão Financeira - Frontend

Stack: Next.js 15, TypeScript, Tailwind CSS, Shadcn UI, Lucide React, Zod, Bun
Arquitetura: Clean Architecture
Público-alvo: Usuário comum

## Code Style

### Nomenclatura
- Usar **camelCase** para variáveis, funções e propriedades
- Arquivos de componentes: PascalCase
- Hooks: prefixo `use` (ex: `useTransaction`)

### Estrutura de Componentes
- Priorizar **composition** sobre herança
- Extrair lógica para **custom hooks**
- Classes apenas quando estritamente necessário
- Manter componentes pequenos e focados
- Preferir **Server Components** (padrão Next.js)

### Imports (ordem)
1. React / Next.js
2. Bibliotecas externas
3. Alias do projeto (`@/...`)
4. Relativos (`./`, `../`)

## TypeScript

- Modo `strict` habilitado
- Tipos **explícitos** em funções públicas e APIs
- Tipos **inferidos** em escopo interno
- **NUNCA** use `any`
- Validação de dados com **Zod**

## Error Handling

- `try/catch` em todas as operações assíncronas
- Error boundaries em componentes críticos
- Mensagens amigáveis ao usuário
- **Nunca exibir stacktrace** em produção

## Performance

- Evitar re-renders desnecessários
- Usar `useMemo`, `useCallback` quando apropriado
- Evitar `useEffect` desnecessário
- Evitar chamadas de API duplicadas
- Code splitting automático do Next.js

## Comentários

Apenas em **lógica complexa** que não é auto-explicativa. Código deve ser legível por si.

## Restrições

❌ **NÃO usar**:
- `any` (TypeScript)
- `axios` ou bibliotecas HTTP externas
- Classes desnecessárias
- Lógica complexa dentro de componentes
- `useEffect` para sincronização simples

✅ **SEMPRE usar**:
- TypeScript strict
- Zod para validação
- Composition
- Custom hooks para lógica reutilizável
- Server Components quando possível
- `fetch` nativo para chamadas HTTP

## Testing

Implementar testes apenas quando explicitamente solicitado.

## Build & Dev

```bash
bun install     # Instalar dependências
bun dev         # Servidor de desenvolvimento
bun build       # Build de produção
```
