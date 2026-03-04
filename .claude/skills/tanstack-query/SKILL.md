---
name: tanstack-query
description: Padroniza o fetching usando TanStack Query v5 com Query Key Factories e queryOptions para compatibilidade entre useQuery e useSuspenseQuery.
---

# TanStack Query Standard (v5)

Sempre que o usuário solicitar buscas de dados ou integração com API, utilize obrigatoriamente o padrão abaixo.

## 1. Estrutura de Query Key Factory

Centralize todas as chaves em um objeto constante para evitar typos e facilitar invalidações granulares.

Exemplo:

```ts
export const featureKeys = {
  all: ["feature"] as const,
  lists: () => [...featureKeys.all, "list"] as const,
  list: (filters: object) => [...featureKeys.lists(), { ...filters }] as const,
  details: () => [...featureKeys.all, "detail"] as const,
  detail: (id: string | number) => [...featureKeys.details(), id] as const,
};
```

## 2. Padronização com queryOptions

Não crie hooks customizados. Exporte objetos usando queryOptions. Isso garante tipagem automática e permite o uso de useQuery, useSuspenseQuery e prefetchQuery com a mesma definição.

Exemplo:

```ts
import { queryOptions } from "@tanstack/react-query";

export const featureQueries = {
  list: (filters: object) =>
    queryOptions({
      queryKey: featureKeys.list(filters),
      queryFn: () => api.fetchData(filters),
    }),

  detail: (id: string) =>
    queryOptions({
      queryKey: featureKeys.detail(id),
      queryFn: () => api.fetchDetail(id),
    }),
};
```

## 3. Regras de Aplicação

- Consumo: Oriente o uso como useQuery(featureQueries.list(filters)) ou useSuspenseQuery(featureQueries.list(filters)).
- Mutações: Em onSuccess, use a factory para invalidar: queryClient.invalidateQueries({ queryKey: featureKeys.all }).
- Refatoração: Se encontrar queryKey definida manualmente em componentes ou hooks, converta imediatamente para este padrão.
