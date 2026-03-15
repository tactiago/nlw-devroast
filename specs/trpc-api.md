# tRPC como camada de API — Spec

## Contexto

O **Dev Roast** hoje usa dados estáticos. Precisamos de uma camada de API type-safe para substituir isso e preparar a integração com o banco Drizzle e futuras operações (submissão de código, análise via IA, leaderboard).

O projeto é **Next.js 16** com App Router. É essencial integrar o tRPC com **SSR e Server Components**, aproveitando prefetch no servidor e hidratação no cliente para melhor performance.

---

## Documentação de referência

- [tRPC + TanStack React Query — Setup](https://trpc.io/docs/client/tanstack-react-query/setup)
- [tRPC + TanStack React Query — Server Components](https://trpc.io/docs/client/tanstack-react-query/server-components)
- [Next.js App Router setup](https://trpc.io/docs/client/nextjs/app-router-setup) (guia dedicado)

---

## Decisão: tRPC + TanStack React Query + Server Components

| Critério | Avaliação |
|----------|-----------|
| Type-safety | End-to-end: router → client sem duplicar tipos |
| SSR/Server Components | Suporte oficial via prefetch + HydrationBoundary |
| Bundle | TanStack React Query já é padrão; tRPC client é leve |
| Drizzle | Integra direto nos procedures (queries no servidor) |
| Alternativas (REST, GraphQL) | Mais boilerplate, sem type-safety automático |

**Veredito:** tRPC com TanStack React Query é a escolha recomendada pela doc e encaixa no stack Next.js + Server Components.

---

## Especificação de implementação

### Estrutura de arquivos

```
src/
├── trpc/
│   ├── init.ts           # initTRPC, createTRPCRouter, createCallerFactory, createTRPCContext
│   ├── routers/
│   │   ├── _app.ts       # appRouter (merge de sub-routers)
│   │   └── submission.ts # procedures de submissions/issues
│   ├── query-client.ts   # makeQueryClient (staleTime, dehydrate, hydrate)
│   ├── server.ts         # trpc proxy para RSC, getQueryClient, prefetch, HydrateClient, caller
│   └── client.tsx        # TRPCReactProvider (client), useTRPC
├── app/
│   ├── api/trpc/[trpc]/
│   │   └── route.ts      # fetchRequestHandler (GET, POST)
│   └── layout.tsx        # envolver children com TRPCReactProvider
```

---

### 1. Dependências

```bash
npm install @trpc/server @trpc/client @trpc/tanstack-react-query @tanstack/react-query zod
npm install -D server-only client-only
```

> `zod` para validação de inputs nos procedures. `server-only` e `client-only` para garantir que arquivos server/client não vazem para o lado errado.

---

### 2. Inicialização (`src/trpc/init.ts`)

- `createTRPCContext`: função assíncrona que retorna o contexto (ex: `{ db }` para Drizzle). Usar `cache()` do React para request-scoped context.
- `initTRPC.context()` para procedures acessarem o contexto.
- Exportar: `createTRPCRouter`, `createCallerFactory`, `baseProcedure`.

---

### 3. Router (`src/trpc/routers/`)

**submission.ts** — procedures iniciais:

| Procedure | Tipo | Input | Descrição |
|-----------|------|-------|-----------|
| `leaderboard` | query | `{ limit?: number }` | Lista submissions ordenadas por score ASC |
| `getById` | query | `{ id: string }` | Submission + issues por ID |

**\_app.ts** — merge:

```typescript
export const appRouter = createTRPCRouter({
  submission: submissionRouter,
});
export type AppRouter = typeof appRouter;
```

---

### 4. API Route (`src/app/api/trpc/[trpc]/route.ts`)

- Usar `fetchRequestHandler` de `@trpc/server/adapters/fetch`.
- `endpoint: '/api/trpc'`
- `router: appRouter`
- `createContext: createTRPCContext`
- Exportar `GET` e `POST` como handlers.

---

### 5. Query Client (`src/trpc/query-client.ts`)

- `makeQueryClient()`: cria `QueryClient` com:
  - `staleTime: 30 * 1000` (evita refetch imediato no cliente após SSR)
  - `dehydrate.shouldDehydrateQuery`: incluir queries `pending` (para prefetch em RSC)
  - Opcional: `superjson` para serialização se usar datas/Map/Set

---

### 6. Client (`src/trpc/client.tsx`)

- `'use client'`
- `createTRPCContext<AppRouter>()` → `{ TRPCProvider, useTRPC }`
- `getQueryClient()`: no servidor sempre novo; no browser singleton (evitar recriação em suspense)
- `getUrl()`: `''` no browser, `http://localhost:3000` ou `https://${VERCEL_URL}` no servidor
- `TRPCReactProvider`: envolve `QueryClientProvider` + `TRPCProvider` com `trpcClient` e `queryClient`
- Montar no `layout.tsx` raiz

---

### 7. Server (`src/trpc/server.ts`)

- `import 'server-only'`
- `getQueryClient = cache(makeQueryClient)` — mesmo client por request
- `trpc = createTRPCOptionsProxy({ ctx: createTRPCContext, router: appRouter, queryClient: getQueryClient })`
- Helpers:
  - `prefetch(queryOptions)` — prefetch sem await (streaming)
  - `HydrateClient` — `<HydrationBoundary state={dehydrate(queryClient)}>{children}</HydrationBoundary>`
  - `caller = appRouter.createCaller(createTRPCContext)` — para uso direto em Server Components (dados não vão para cache do cliente)

---

### 8. Uso em Server Components

**Prefetch + Client child:**

```tsx
// app/leaderboard/page.tsx (Server Component)
import { HydrateClient, prefetch, trpc } from "@/trpc/server";
import { LeaderboardList } from "./leaderboard-list";

export default async function LeaderboardPage() {
  prefetch(trpc.submission.leaderboard.queryOptions({ limit: 10 }));
  return (
    <HydrateClient>
      <LeaderboardList />
    </HydrateClient>
  );
}
```

**Dados só no servidor (caller):**

```tsx
const data = await caller.submission.leaderboard({ limit: 10 });
```

---

### 9. Uso em Client Components

```tsx
'use client';
import { useQuery } from '@tanstack/react-query';
import { useTRPC } from '@/trpc/client';

export function LeaderboardList() {
  const trpc = useTRPC();
  const { data } = useQuery(trpc.submission.leaderboard.queryOptions({ limit: 10 }));
  // ...
}
```

Para mutations: `useMutation(trpc.submission.create.mutationOptions())`.

---

### 10. Integração com Drizzle

- Em `createTRPCContext`, passar `db` (instância do Drizzle) no contexto.
- Nos procedures, usar `ctx.db` para queries.
- Manter procedures como funções puras de dados; lógica de negócio em camada separada se crescer.

---

## TODOs

- [ ] **1. Instalar dependências** — `@trpc/server`, `@trpc/client`, `@trpc/tanstack-react-query`, `@tanstack/react-query`, `zod`, `server-only`, `client-only`

- [ ] **2. Criar `src/trpc/init.ts`** — initTRPC, createTRPCContext (com `cache()` e `db`), createTRPCRouter, createCallerFactory, baseProcedure

- [ ] **3. Criar router de submissions** — `src/trpc/routers/submission.ts` com `leaderboard` e `getById`; `_app.ts` com merge

- [ ] **4. Criar API route** — `src/app/api/trpc/[trpc]/route.ts` com fetchRequestHandler (GET, POST)

- [ ] **5. Criar query-client.ts** — makeQueryClient com staleTime, shouldDehydrateQuery para pending

- [ ] **6. Criar client.tsx** — TRPCReactProvider, getQueryClient, getUrl, createTRPCContext, useTRPC. Montar no layout.tsx

- [ ] **7. Criar server.ts** — getQueryClient (cache), trpc proxy, prefetch, HydrateClient, caller. `import 'server-only'`

- [ ] **8. Integrar leaderboard** — Substituir dados estáticos da home e `/leaderboard` por prefetch + useQuery

- [ ] **9. Testar fluxo completo** — SSR com prefetch, hidratação no cliente, mutations quando houver
