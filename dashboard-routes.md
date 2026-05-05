# Dashboard API

Este documento descreve como consumir as rotas de dashboard da API, quais parâmetros cada rota aceita e quais respostas podem ser esperadas.

## Base da rota

Todas as rotas de dashboard ficam abaixo de:

```text
/api/v1/dashboard
```

## Autenticação

As rotas de dashboard usam o middleware `AuthMiddleware()`. Isso significa que a autenticação é feita pelo cookie `auth_token`.

Exemplo de envio do cookie em uma requisição HTTP:

```http
Cookie: auth_token=SEU_TOKEN_AQUI
```

Exemplo usando `fetch` no frontend:

```javascript
const response = await fetch("http://localhost:8080/api/v1/dashboard/total-ganhos?data_inicio=2026-01-01&data_fim=2026-01-31", {
  method: "GET",
  credentials: "include",
  headers: {
    "Content-Type": "application/json"
  }
});

const data = await response.json();
```

Se o frontend estiver em outro domínio, o navegador só enviará o cookie se a aplicação estiver configurada para isso e a requisição usar `credentials: "include"`.

## Parâmetros compartilhados

Todas as rotas de dashboard aceitam os mesmos query params.

| Parâmetro | Tipo | Obrigatório | Exemplo | Regras |
|---|---|---|---|---|
| `data_inicio` | `string` | Sim | `2026-01-01` | Deve estar no formato `AAAA-MM-DD` |
| `data_fim` | `string` | Sim | `2026-01-31` | Deve estar no formato `AAAA-MM-DD` |
| `id_grupo` | `int` | Não | `3` | Se informado, deve ser numérico e precisa ser igual ao `id_group` do usuário autenticado |

### Regras de validação

- `data_inicio` e `data_fim` são obrigatórias em todas as rotas de dashboard.
- `data_inicio` não pode ser maior que `data_fim`.
- `id_grupo` é opcional.
- Se `id_grupo` for enviado, ele precisa corresponder ao grupo presente no token/cookie do usuário autenticado.
- Se `id_grupo` não for enviado, a API usa o contexto do usuário autenticado.

### Erros de validação possíveis

Essas mensagens podem ser retornadas com status `400 Bad Request`:

```json
{ "error": "data_inicio e data_fim são obrigatórias para o dashboard" }
```

```json
{ "error": "data_inicio inválida, use o formato AAAA-MM-DD" }
```

```json
{ "error": "data_fim inválida, use o formato AAAA-MM-DD" }
```

```json
{ "error": "data_inicio não pode ser maior que data_fim" }
```

```json
{ "error": "id_grupo inválido" }
```

```json
{ "error": "id_grupo não corresponde ao grupo do usuário autenticado" }
```

### Erros de autenticação possíveis

Essas mensagens podem ser retornadas com status `401 Unauthorized`:

```json
{ "error": "Token de autenticação não encontrado" }
```

```json
{ "error": "Token de autenticação inválido ou expirado" }
```

## 1. Buscar total de ganhos

Retorna a soma das receitas do período informado.

### Endpoint

```http
GET /api/v1/dashboard/total-ganhos
```

### Query params aceitos

| Parâmetro | Obrigatório | Tipo |
|---|---|---|
| `data_inicio` | Sim | `string` |
| `data_fim` | Sim | `string` |
| `id_grupo` | Não | `int` |

### Exemplo de requisição

```http
GET /api/v1/dashboard/total-ganhos?data_inicio=2026-01-01&data_fim=2026-01-31&id_grupo=3
Cookie: auth_token=SEU_TOKEN_AQUI
```

### Exemplo de resposta `200 OK`

```json
{
  "total_ganhos": 5400.75
}
```

## 2. Buscar total de despesas

Retorna a soma das despesas do período informado.

Para despesas, o cálculo considera o comportamento dos tipos de transação existentes no sistema, incluindo despesas fixas, parceladas e variáveis.

### Endpoint

```http
GET /api/v1/dashboard/total-despesas
```

### Query params aceitos

| Parâmetro | Obrigatório | Tipo |
|---|---|---|
| `data_inicio` | Sim | `string` |
| `data_fim` | Sim | `string` |
| `id_grupo` | Não | `int` |

### Exemplo de requisição

```http
GET /api/v1/dashboard/total-despesas?data_inicio=2026-01-01&data_fim=2026-01-31&id_grupo=3
Cookie: auth_token=SEU_TOKEN_AQUI
```

### Exemplo de resposta `200 OK`

```json
{
  "total_despesas": 2150.30
}
```

## 3. Buscar saldo líquido

Retorna a diferença entre total de ganhos e total de despesas no período.

Fórmula:

```text
saldo_liquido = total_ganhos - total_despesas
```

### Endpoint

```http
GET /api/v1/dashboard/saldo-liquido
```

### Query params aceitos

| Parâmetro | Obrigatório | Tipo |
|---|---|---|
| `data_inicio` | Sim | `string` |
| `data_fim` | Sim | `string` |
| `id_grupo` | Não | `int` |

### Exemplo de requisição

```http
GET /api/v1/dashboard/saldo-liquido?data_inicio=2026-01-01&data_fim=2026-01-31&id_grupo=3
Cookie: auth_token=SEU_TOKEN_AQUI
```

### Exemplo de resposta `200 OK`

```json
{
  "saldo_liquido": 3250.45
}
```

## 4. Buscar evolução mensal

Retorna uma lista com os valores agregados por mês dentro do intervalo informado.

O campo `mes` é retornado no formato `YYYY-MM`.

### Endpoint

```http
GET /api/v1/dashboard/evolucao-mensal
```

### Query params aceitos

| Parâmetro | Obrigatório | Tipo |
|---|---|---|
| `data_inicio` | Sim | `string` |
| `data_fim` | Sim | `string` |
| `id_grupo` | Não | `int` |

### Exemplo de requisição

```http
GET /api/v1/dashboard/evolucao-mensal?data_inicio=2026-01-01&data_fim=2026-03-31&id_grupo=3
Cookie: auth_token=SEU_TOKEN_AQUI
```

### Exemplo de resposta `200 OK`

```json
[
  {
    "mes": "2026-01",
    "total_ganhos": 5400.75,
    "total_despesas": 2150.30,
    "saldo_liquido": 3250.45
  },
  {
    "mes": "2026-02",
    "total_ganhos": 4800.00,
    "total_despesas": 2200.00,
    "saldo_liquido": 2600.00
  },
  {
    "mes": "2026-03",
    "total_ganhos": 5100.00,
    "total_despesas": 2400.00,
    "saldo_liquido": 2700.00
  }
]
```

## Exemplo prático de consumo no frontend

```javascript
async function buscarSaldoLiquido(dataInicio, dataFim, idGrupo) {
  const query = new URLSearchParams({
    data_inicio: dataInicio,
    data_fim: dataFim,
    ...(idGrupo ? { id_grupo: String(idGrupo) } : {})
  });

  const response = await fetch(`http://localhost:8080/api/v1/dashboard/saldo-liquido?${query.toString()}`, {
    method: "GET",
    credentials: "include"
  });

  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.error || "Erro ao consultar dashboard");
  }

  return response.json();
}
```

## Resumo rápido das rotas

| Método | Rota | Descrição |
|---|---|---|
| `GET` | `/api/v1/dashboard/total-ganhos` | Retorna o total de ganhos do período |
| `GET` | `/api/v1/dashboard/total-despesas` | Retorna o total de despesas do período |
| `GET` | `/api/v1/dashboard/saldo-liquido` | Retorna o saldo líquido do período |
| `GET` | `/api/v1/dashboard/evolucao-mensal` | Retorna a evolução mensal do período |