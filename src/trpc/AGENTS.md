# tRPC — Padrões de API

## Estrutura

```
src/trpc/
├── init.ts           # initTRPC, createTRPCContext (cache), baseProcedure
├── routers/
│   ├── _app.ts       # appRouter (merge de sub-routers)
│   └── *.ts          # routers por domínio
├── query-client.ts   # makeQueryClient (staleTime, dehydrate)
├── server.tsx        # trpc proxy, prefetch, HydrateClient, caller
└── client.tsx        # TRPCReactProvider, useTRPC
```

## Contexto e procedures

- `createTRPCContext`: usar `cache()` do React para contexto request-scoped
- Passar `db` (Drizzle) no contexto para procedures acessarem o banco
- Procedures usam `ctx.db` para queries

## Server vs Client

| Arquivo | Uso | Import |
|---------|-----|--------|
| `server.tsx` | Server Components, prefetch | `import "server-only"` |
| `client.tsx` | Client Components, hooks | `"use client"` |

## Fluxo em Server Components

1. `prefetch(trpc.[router].[procedure].queryOptions())` — inicia o fetch (fire-and-forget)
2. `prefetchAll([...])` — executa múltiplas queries em paralelo com `Promise.all`; usar `await prefetchAll([...])` quando precisar aguardar
3. `HydrateClient` — envolve children com `HydrationBoundary` (dehydrate do queryClient)
4. Client child usa `useSuspenseQuery(trpc.[router].[procedure].queryOptions())` — lê do cache

## Fluxo em Client Components

- `useTRPC()` → `trpc` proxy
- `useQuery(trpc.[router].[procedure].queryOptions())` ou `useSuspenseQuery(...)`
- `useMutation(trpc.[router].[procedure].mutationOptions())`

## Prefetch em paralelo

Quando a page precisa de múltiplas queries, usar `prefetchAll` com `await Promise.all` para executar em paralelo:

```ts
await prefetchAll([
  trpc.metrics.get.queryOptions(),
  trpc.submission.leaderboard.queryOptions({ limit: 3 }),
]);
```

## Dados só no servidor (sem cache)

- `caller = appRouter.createCaller(createTRPCContext)`
- `await caller.[router].[procedure]({ input })` — dados não vão para o cliente
