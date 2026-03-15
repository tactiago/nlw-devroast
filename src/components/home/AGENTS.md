# Home — Padrão de métricas com dados do tRPC

## Fluxo

1. **Page (Server Component)** — faz `prefetch` e passa slot `metrics` para o conteúdo
2. **HydrateClient** — envolve o conteúdo para hidratar o cache no cliente
3. **Suspense** — com skeleton como fallback enquanto os dados carregam
4. **MetricsDisplay (Client Component)** — usa `useSuspenseQuery` + NumberFlow para animação

## Componentes

| Componente | Tipo | Responsabilidade |
|------------|------|------------------|
| `HomeContent` | Client | Layout da homepage; recebe `metrics` como prop |
| `MetricsDisplay` | Client | `useSuspenseQuery` + NumberFlow para animar números |
| `MetricsSkeleton` | Server | Fallback visual durante loading |

## NumberFlow

Usar `@number-flow/react` quando animação de números (zero → valor real) for necessária. Client Components são aceitáveis nesse caso.
