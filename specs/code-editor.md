# Code Editor com Syntax Highlighting — Spec

## Contexto

A homepage do Dev Roast precisa de um editor onde o usuário cola um trecho de código e recebe syntax highlighting em tempo real. A linguagem deve ser detectada automaticamente, com opção de seleção manual.

Hoje a homepage (`src/app/page.tsx`) usa um `<textarea>` simples sem highlighting. Já existe um componente `CodeBlock` server-side (`src/components/ui/code-block.tsx`) que usa **shiki 4** com o tema **vesper** para renderizar código estático.

---

## Pesquisa: Como o ray-so faz

Repositório: https://github.com/raycast/ray-so

### Arquitetura

O ray-so **não usa** CodeMirror nem Monaco. Usa o pattern de **textarea overlay**:

- Um `<textarea>` transparente fica por cima de uma `<div>` que renderiza o HTML com syntax highlighting
- O textarea tem `background: transparent` e `-webkit-text-fill-color: transparent`, tornando o texto invisível (mas o cursor/caret continua visível)
- Ambos os elementos ficam na mesma célula de grid (`grid-area: 1 / 1 / 2 / 2`) para se sobreporem perfeitamente
- O usuário digita no textarea invisível, e a div por baixo mostra o output colorizado

### Highlighting

Usa **shiki** (via `getHighlighterCore()` com WASM) para o rendering visual. Linguagens são carregadas sob demanda via `import("shiki/langs/xxx.mjs")`.

### Detecção de linguagem

Usa **highlight.js** (`hljs.highlightAuto()`) exclusivamente para detecção — não para rendering. Passa a lista de linguagens suportadas para limitar o escopo da detecção.

### Estado

Usa **Jotai** para gerenciamento de estado (atoms para código, linguagem detectada, linguagem selecionada, highlighter instance, etc.).

### Keyboard handling

Trata manualmente Tab (indent/dedent), Enter (auto-indent), brackets (auto-dedent) e Escape (blur).

---

## Alternativas pesquisadas

### 1. CodeMirror 6 (`@uiw/react-codemirror`)

| Critério | Avaliação |
|---|---|
| Bundle size | ~93KB gzipped (com basicSetup + 1 linguagem) |
| React 19 | Funciona, mas não oficialmente documentado |
| Highlighting | Sistema próprio (Lezer grammars), não usa shiki |
| Auto-detect | Não tem built-in, precisa trazer separado |
| Tema vesper | Precisa ser portado manualmente |

**Veredito:** Overkill. Traz autocomplete, multi-cursor, busca — features que não precisamos para um app de "colar código". Usa sistema de highlighting diferente do shiki, quebrando consistência com o `CodeBlock`.

### 2. Monaco Editor (`@monaco-editor/react`)

| Critério | Avaliação |
|---|---|
| Bundle size | ~800KB+ gzipped (CDN) ou ~2-3MB self-hosted |
| Next.js SSR | Incompatível, precisa `dynamic(() => import(...), { ssr: false })` |
| Mobile | Suporte ruim |
| Auto-detect | Sim, built-in para ~30 linguagens |

**Veredito:** Absurdamente pesado. É pra construir IDEs, não formulários de paste. Descartado.

### 3. Shiki + Textarea Overlay (RECOMENDADO)

| Critério | Avaliação |
|---|---|
| Bundle size | ~40-60KB marginal (shiki já é dependência) |
| Consistência | Mesmo highlighting e tema vesper do `CodeBlock` |
| Controle | Total sobre DOM, classes Tailwind, UX |
| Complexidade | Baixa — ~50-80 linhas custom ou ~3KB com `react-simple-code-editor` |

**Veredito:** Melhor opção. Reutiliza shiki e vesper, bundle mínimo, controle total.

### 4. Shiki + CodeMirror (`@cmshiki/shiki`)

| Critério | Avaliação |
|---|---|
| Maturidade | v0.1.0, 5 downloads/semana, bugs de rendering |
| Bundle size | ~93KB+ (carrega todo o CodeMirror) |

**Veredito:** Imaturo demais. Descartado.

---

## Decisão: Approach 3 — Shiki + Textarea Overlay

### Por que essa abordagem

1. **Consistência visual** — mesmo highlighting (shiki + vesper) entre o editor e o `CodeBlock` de resultado
2. **Bundle mínimo** — shiki já é dependência; custo marginal é só o engine JS + grammars client-side (~40-60KB)
3. **Controle total** — DOM, Tailwind classes, tudo sob nosso controle
4. **Simplicidade** — pattern comprovado (ray-so usa exatamente isso)
5. **UX adequada** — para um app de "colar código", não precisamos de features de IDE

### Bibliotecas auxiliares: `react-simple-code-editor` vs Custom

| | `react-simple-code-editor` | Custom |
|---|---|---|
| Bundle | ~3KB | 0KB |
| Scroll sync | Resolvido | Precisa implementar |
| Tab handling | Resolvido | Precisa implementar |
| Undo/redo | Resolvido (browser nativo) | Precisa cuidar |
| Manutenção | Dependência externa | Nosso código |

**Decisão:** Começar **custom** (como o ray-so faz). O pattern é simples o suficiente (~50-80 linhas) e nos dá controle total. Se encontrarmos edge cases demais (scroll sync, IME input, mobile), migrar para `react-simple-code-editor`.

### Detecção de linguagem

**Opção escolhida:** `highlight.js` no modo auto-detect (mesma abordagem do ray-so).

- Importar apenas o core + grammars das linguagens alvo (~50-80KB)
- Usar `hljs.highlightAuto(code, languageSubset)` para limitar o escopo
- Executar detecção com debounce (não a cada keystroke)
- Resultado é apenas a string da linguagem — o shiki faz o highlighting real

**Linguagens alvo (15):** JavaScript, TypeScript, Python, Java, Go, Rust, C, C++, Ruby, PHP, SQL, HTML, CSS, Bash, JSON.

### Shiki client-side

Shiki 4 suporta highlighting síncrono via `createHighlighterCoreSync` com o engine de regex JavaScript (sem WASM):

```typescript
import { createHighlighterCoreSync } from "shiki/core"
import { createJavaScriptRegexEngine } from "shiki/engine/javascript"

const highlighter = createHighlighterCoreSync({
  themes: [import("@shikijs/themes/vesper")],
  langs: [import("@shikijs/langs/javascript"), ...],
  engine: createJavaScriptRegexEngine(),
})
```

Grammars podem ser lazy-loaded conforme a linguagem detectada/selecionada.

---

## Especificação de implementação

### Componente: `CodeEditor`

**Localização:** `src/components/ui/code-editor.tsx`

**Tipo:** Client Component (`"use client"`)

**Props:**

```typescript
type CodeEditorProps = {
  defaultValue?: string
  placeholder?: string
  onChange?: (code: string, language: string) => void
  minHeight?: number
}
```

**Estrutura visual:**

```
┌──────────────────────────────────────┐
│  ● ● ●                    [lang ▾]  │  ← Header bar (dots + language selector)
├──────┬───────────────────────────────┤
│  1   │  function hello() {           │
│  2   │    console.log("world")       │  ← textarea (invisible) + highlighted div
│  3   │  }                            │
│  ... │                               │
└──────┴───────────────────────────────┘
```

### Arquitetura interna

```
CodeEditor (client component)
├── Header
│   ├── Traffic lights (● ● ●)
│   └── LanguageSelector (dropdown/combobox)
│       ├── "Auto-Detect" option (default)
│       └── Lista de 15 linguagens
│
├── Editor Area (position: relative)
│   ├── Line Numbers (left column)
│   ├── Highlighted Code (div, visible, z-index inferior)
│   │   └── shiki codeToHtml() output via dangerouslySetInnerHTML
│   └── Textarea (transparent, z-index superior)
│       └── Handles: input, paste, Tab, Shift+Tab, Enter
│
└── Hooks internos
    ├── useShikiHighlighter() — inicializa highlighter sync, lazy-load grammars
    ├── useLanguageDetection() — highlight.js auto-detect com debounce
    └── useEditorKeyboard() — Tab indent, auto-indent, etc.
```

### Overlay CSS

```css
.editor-container {
  display: grid;
}

.editor-textarea,
.editor-highlight {
  grid-area: 1 / 1 / 2 / 2;
  font-family: var(--font-mono);
  font-size: 13px;
  line-height: 1.65;
  padding: 16px;
  white-space: pre;
  overflow-wrap: normal;
}

.editor-textarea {
  background: transparent;
  color: transparent;
  caret-color: #fafafa;
  resize: none;
  outline: none;
  z-index: 1;
}

.editor-highlight {
  pointer-events: none;
  z-index: 0;
}
```

> Nota: esses estilos podem ser aplicados via Tailwind classes inline ao invés de CSS module, seguindo o pattern do projeto.

### Language selector

- Componente dropdown/combobox usando `@base-ui/react` (já instalado)
- Opção default: "Auto-Detect" — usa highlight.js para detectar
- Ao selecionar manualmente, sobrescreve a detecção automática
- Exibir a linguagem detectada como hint quando em auto-detect (ex: `"Auto-Detect (javascript)"`)

### Fluxo de dados

```
Usuário cola/digita código
  ↓
textarea onChange
  ↓
├── setState(code) → re-render highlighted div (shiki codeToHtml)
└── debounce(300ms) → hljs.highlightAuto(code) → setState(detectedLanguage)
                                                    ↓
                                              se nenhuma linguagem
                                              selecionada manualmente,
                                              usa detectedLanguage para
                                              re-highlight com shiki
```

### Dependências a instalar

| Pacote | Motivo | Bundle |
|---|---|---|
| `highlight.js` | Auto-detect de linguagem | ~50-80KB (subset) |

> **Nota:** `shiki` já está instalado. Mas o uso atual é server-side. Para o editor client-side, precisaremos importar o engine JavaScript e as grammars específicas. Não é necessário instalar nada novo para o shiki.

### Integração na homepage

Substituir o `<textarea>` atual em `src/app/page.tsx` pelo componente `<CodeEditor>`:

```tsx
<CodeEditor
  defaultValue={placeholderCode}
  onChange={(code, language) => {
    setCode(code)
    setLanguage(language)
  }}
/>
```

---

## TODOs

- [ ] **1. Setup shiki client-side** — Criar hook `useShikiHighlighter` que inicializa `createHighlighterCoreSync` com engine JS e tema vesper. Pré-carregar JS/TS/Python. Implementar lazy-load de grammars adicionais.

- [ ] **2. Instalar highlight.js** — `npm install highlight.js`. Criar hook `useLanguageDetection` com debounce de 300ms usando `hljs.highlightAuto()`. Importar apenas os grammars das 15 linguagens alvo.

- [ ] **3. Implementar CodeEditor** — Componente client com textarea overlay + highlighted div. Usar CSS grid para sobreposição. Sincronizar scroll entre textarea e div. Tratar Tab, Shift+Tab, Enter com auto-indent.

- [ ] **4. Implementar LanguageSelector** — Dropdown usando `@base-ui/react` com opção "Auto-Detect" + 15 linguagens. Mostrar linguagem detectada como hint. Permitir override manual.

- [ ] **5. Implementar line numbers** — Coluna de line numbers à esquerda, sincronizada com o conteúdo do editor. Reaproveitar o pattern visual do `CodeBlock` existente.

- [ ] **6. Integrar na homepage** — Substituir o `<textarea>` atual em `page.tsx` pelo `<CodeEditor>`. Conectar com o estado existente (`code`, novo state `language`). Manter o layout e espaçamento atuais.

- [ ] **7. Testar edge cases** — Código muito longo (scroll sync). Paste de código com tabs vs spaces. Linguagens não suportadas (fallback para plaintext). Mobile (touch input). IME input (CJK). Performance com snippets grandes (>100 linhas).

- [ ] **8. Otimizar bundle** — Verificar tree-shaking do highlight.js (importar linguagens individualmente). Medir bundle size com `next build`. Lazy-load grammars do shiki que não são pré-carregados.
