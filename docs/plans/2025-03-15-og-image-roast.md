# OG Image para Roast Results — Implementation Plan

> **For Claude:** REQUIRED SUB-SKILL: Use superpowers:executing-plans to implement this plan task-by-task.

**Goal:** Gerar automaticamente imagens Open Graph para links compartilháveis de resultados de roast, usando Takumi e o design do Screen 4 (pencil.pen).

**Architecture:** Route Handler `/api/og/roast/[id]` busca roast via tRPC, renderiza imagem com Takumi (layout Screen 4), retorna ImageResponse. Página `/roast/[id]` usa `generateMetadata` para referenciar a imagem.

**Tech Stack:** Next.js 16, Takumi (@takumi-rs/image-response), tRPC caller, design tokens do globals.css

**Design reference:** `docs/plans/2025-03-15-og-image-roast-design.md`

---

## Task 1: Instalar Takumi e configurar Next.js

**Files:**
- Modify: `package.json`
- Modify: `next.config.ts`

**Step 1: Instalar dependência**

```bash
npm i @takumi-rs/image-response
```

**Step 2: Configurar serverExternalPackages**

Em `next.config.ts`, adicionar:

```ts
const nextConfig: NextConfig = {
	cacheComponents: true,
	serverExternalPackages: ["@takumi-rs/core"],
};
```

**Step 3: Verificar build**

```bash
npm run build
```

Expected: Build passa sem erros.

**Step 4: Commit**

```bash
git add package.json package-lock.json next.config.ts
git commit -m "chore: add Takumi for OG image generation"
```

---

## Task 2: Criar Route Handler da OG image

**Files:**
- Create: `src/app/api/og/roast/[id]/route.ts`
- Reference: `src/trpc/server.tsx` (caller)
- Reference: `src/trpc/routers/roast.ts` (getById)

**Step 1: Criar o Route Handler**

Criar `src/app/api/og/roast/[id]/route.ts`:

```ts
import { ImageResponse } from "@takumi-rs/image-response";
import { caller } from "@/trpc/server";

function getScoreColor(score: number) {
	if (score <= 3) return "#ef4444";
	if (score <= 6) return "#f59e0b";
	return "#10b981";
}

function truncateQuote(quote: string, maxLen = 90) {
	if (quote.length <= maxLen) return quote;
	return quote.slice(0, maxLen - 3).trim() + "...";
}

export async function GET(
	_request: Request,
	{ params }: { params: Promise<{ id: string }> },
) {
	const { id } = await params;
	const roast = await caller.roast.getById({ id });

	if (!roast) {
		return new Response("Not found", { status: 404 });
	}

	const scoreColor = getScoreColor(roast.score);
	const quote = truncateQuote(roast.roastQuote);
	const langInfo = `lang: ${roast.language} · ${roast.lineCount} lines`;

	return new ImageResponse(
		<div
			style={{
				display: "flex",
				width: "100%",
				height: "100%",
				backgroundColor: "#0a0a0a",
				border: "1px solid #2a2a2a",
				flexDirection: "column",
				alignItems: "center",
				justifyContent: "center",
				padding: 64,
				gap: 28,
			}}
		>
			{/* logoRow */}
			<div style={{ display: "flex", gap: 8, alignItems: "center" }}>
				<span style={{ color: "#10b981", fontSize: 24, fontWeight: 700 }}>
					{">"}
				</span>
				<span style={{ color: "#fafafa", fontSize: 20, fontWeight: 500 }}>
					devroast
				</span>
			</div>

			{/* scoreRow */}
			<div
				style={{
					display: "flex",
					gap: 4,
					alignItems: "flex-end",
				}}
			>
				<span
					style={{
						color: scoreColor,
						fontSize: 160,
						fontWeight: 900,
						lineHeight: 1,
					}}
				>
					{roast.score}
				</span>
				<span
					style={{
						color: "#4b5563",
						fontSize: 56,
						fontWeight: 400,
						lineHeight: 1,
					}}
				>
					/10
				</span>
			</div>

			{/* verdictRow */}
			<div style={{ display: "flex", gap: 8, alignItems: "center" }}>
				<div
					style={{
						width: 12,
						height: 12,
						borderRadius: "50%",
						backgroundColor: "#ef4444",
					}}
				/>
				<span
					style={{
						color: "#ef4444",
						fontSize: 20,
						fontWeight: 400,
					}}
				>
					{roast.verdict}
				</span>
			</div>

			{/* langInfo */}
			<span
				style={{
					color: "#4b5563",
					fontSize: 16,
					fontWeight: 400,
				}}
			>
				{langInfo}
			</span>

			{/* roastQuote */}
			<span
				style={{
					color: "#fafafa",
					fontSize: 22,
					fontWeight: 400,
					lineHeight: 1.5,
					textAlign: "center",
					maxWidth: "100%",
				}}
			>
				"{quote}"
			</span>
		</div>,
		{
			width: 1200,
			height: 630,
			format: "png",
			headers: {
				"Cache-Control": "public, max-age=3600, s-maxage=3600",
			},
		},
	);
}
```

**Step 2: Verificar que o caller existe**

O `caller` deve ser importado de `@/trpc/server`. Verificar em `src/trpc/server.tsx` que `createCaller` está exportado como `caller`.

**Step 3: Testar manualmente**

1. `npm run dev`
2. Criar um roast na home
3. Acessar `http://localhost:3000/api/og/roast/{id}` (substituir {id} pelo ID retornado)
4. Expected: imagem PNG 1200×630 com score, verdict, quote

**Step 4: Commit**

```bash
git add src/app/api/og/roast/[id]/route.ts
git commit -m "feat: add OG image route handler for roast results"
```

---

## Task 3: Adicionar generateMetadata na página de roast

**Files:**
- Modify: `src/app/roast/[id]/page.tsx`

**Step 1: Substituir metadata estática por generateMetadata**

Remover:

```ts
export const metadata: Metadata = {
	title: "Roast Results | Dev Roast",
	description: "Your code has been roasted. See the results.",
};
```

Adicionar (após os imports, antes do SectionTitle):

```ts
type Props = {
	params: Promise<{ id: string }>;
};

export async function generateMetadata({ params }: Props): Promise<Metadata> {
	const { id } = await params;
	const roast = await caller.roast.getById({ id });

	if (!roast) {
		return {
			title: "Roast Results | Dev Roast",
		};
	}

	const description =
		roast.roastQuote.length > 120
			? roast.roastQuote.slice(0, 117) + "..."
			: roast.roastQuote;

	const baseUrl = process.env.VERCEL_URL
		? `https://${process.env.VERCEL_URL}`
		: process.env.NEXT_PUBLIC_APP_URL ?? "http://localhost:3000";

	return {
		title: "Roast Results | Dev Roast",
		description,
		openGraph: {
			title: "Roast Results | Dev Roast",
			description,
			images: [
				{
					url: `${baseUrl}/api/og/roast/${id}`,
					width: 1200,
					height: 630,
					alt: `Roast score: ${roast.score}/10 - ${roast.verdict}`,
				},
			],
		},
		twitter: {
			card: "summary_large_image",
			title: "Roast Results | Dev Roast",
			description,
			images: [`${baseUrl}/api/og/roast/${id}`],
		},
	};
}
```

**Step 2: Ajustar assinatura do page component**

O `RoastResultPage` já recebe `params`. Garantir que a página continua funcionando.

**Step 3: Variável de ambiente (opcional)**

Se usar domínio custom em produção, definir `NEXT_PUBLIC_APP_URL` ou `VERCEL_URL` (já definido na Vercel).

**Step 4: Testar metadata**

1. `npm run dev`
2. Acessar `/roast/{id}`
3. View page source ou usar ferramenta (e.g. opengraph.xyz) para validar meta tags
4. Expected: `og:image` aponta para `/api/og/roast/{id}`

**Step 5: Commit**

```bash
git add src/app/roast/[id]/page.tsx
git commit -m "feat: add dynamic Open Graph metadata for roast results"
```

---

## Task 4: Validação final

**Step 1: Build e lint**

```bash
npm run build
npm run lint
```

Expected: ambos passam.

**Step 2: Teste de compartilhamento (manual)**

Compartilhar um link `/roast/{id}` em um app que renderiza OG (Twitter, Slack, Discord, etc.) e verificar se a imagem aparece.

**Step 3: Commit design doc (se ainda não commitado)**

```bash
git add docs/plans/
git status
git commit -m "docs: add OG image design and implementation plan"
```

---

## Notas

- **Fontes:** Implementação inicial usa fontes padrão do Takumi (Geist). Para JetBrains Mono, adicionar font file em `public/fonts/` e passar no options do ImageResponse (ver [Takumi fonts](https://takumi.kane.tw/docs/guide/typography-fonts)).
- **Formato:** PNG por compatibilidade; WebP pode ser usado se preferir menor tamanho.
- **Cache:** 1h (3600s) para reduzir regeneração em crawlers.
