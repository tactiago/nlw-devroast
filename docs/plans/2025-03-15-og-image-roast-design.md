# Open Graph Image para Roast Results — Design

> Design validado em 2025-03-15. Frame de referência: Screen 4 - OG Image (pencil.pen).

---

## Contexto

Links compartilháveis de resultados de roast (`/roast/[id]`) não possuem imagem Open Graph. Ao compartilhar em redes sociais ou mensageiros, o embed mostra apenas título e descrição genéricos. O objetivo é gerar automaticamente uma imagem OG que reflita o design do Screen 4 do Pencil.

---

## Arquitetura

1. **`generateMetadata`** em `/roast/[id]` retorna `openGraph.images` apontando para `/api/og/roast/[id]`.
2. **Route Handler** `/api/og/roast/[id]/route.ts` busca o roast via tRPC caller, renderiza a imagem com Takumi e retorna `ImageResponse`.
3. **Fallback:** roast inexistente → 404 (sem imagem).

**Arquivos envolvidos:**
- `src/app/roast/[id]/page.tsx` — `generateMetadata` dinâmico
- `src/app/api/og/roast/[id]/route.ts` — novo Route Handler
- `next.config.ts` — `serverExternalPackages: ["@takumi-rs/core"]`

---

## Layout da OG Image (Screen 4)

Dimensões: **1200×630** (padrão OG).

| Elemento | Especificação |
|----------|---------------|
| Root | `#0a0a0a`, borda 1px `#2a2a2a` |
| Layout | Flex vertical, centralizado, padding 64, gap 28 |
| logoRow | `>` (accent-green) + `devroast` (text-primary), font 24/20 |
| scoreRow | Número grande em accent-amber/red/green conforme score, font 160 + `/10` em text-tertiary, font 56 |
| verdictRow | Círculo 12px accent-red + texto verdict em accent-red, font 20 |
| langInfo | `lang: {language} · {lineCount} lines`, text-tertiary, JetBrains Mono, font 16 |
| roastQuote | Entre aspas, centralizado, text-primary, font 22, truncado ~80–100 chars |

**Cores dinâmicas do score:**
- ≤3: accent-red (#ef4444)
- 4–6: accent-amber (#f59e0b)
- 7–10: accent-green (#10b981)

---

## Fontes

- **JetBrains Mono** para consistência com o app. Carregar via `fetch` de arquivo estático em `public/fonts/`.
- Alternativa: Geist Mono (padrão Takumi) se a diferença for aceitável.

---

## Metadata e Cache

- `openGraph.title`: "Roast Results | Dev Roast"
- `openGraph.description`: roastQuote truncado
- `openGraph.images`: `[{ url: /api/og/roast/${id}, width: 1200, height: 630 }]`
- Route Handler: `Cache-Control: public, max-age=3600, s-maxage=3600`

---

## Stack

- **Takumi** (`@takumi-rs/image-response`) — geração de imagem
- **Next.js** Route Handler (GET)
- **tRPC caller** para buscar roast
- **Vercel** (Node.js runtime)
