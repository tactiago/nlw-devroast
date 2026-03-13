# Especificação: Banco de Dados com Drizzle ORM

## Visão geral

O **Dev Roast** recebe trechos de código, analisa e devolve uma nota de 0 a 10 com comentários brutalmente honestos. Os dados persistidos incluem cada submissão de código, os problemas encontrados na análise e o ranking público (shame leaderboard).

Esta especificação define o schema do banco de dados PostgreSQL usando **Drizzle ORM**, incluindo tabelas, enums, relacionamentos e o setup de infraestrutura com Docker Compose.

---

## Enums

### `severity`

Nível de severidade de cada issue encontrada na análise do código.

| Valor      | Descrição                                |
| ---------- | ---------------------------------------- |
| `critical` | Problema grave (uso de `eval`, `var`...) |
| `warning`  | Prática ruim mas não catastrófica        |
| `good`     | Ponto positivo do código                 |

### `verdict`

Veredito geral atribuído à submissão com base no score.

| Valor                | Faixa de score |
| -------------------- | -------------- |
| `needs_serious_help` | 0.0 – 2.9     |
| `below_average`      | 3.0 – 4.9     |
| `average`            | 5.0 – 6.4     |
| `above_average`      | 6.5 – 7.9     |
| `impressive`         | 8.0 – 9.4     |
| `legendary`          | 9.5 – 10.0    |

---

## Tabelas

### `submissions`

Representa cada código enviado para análise ("roast").

| Coluna           | Tipo                    | Constraints                    | Descrição                                                       |
| ---------------- | ----------------------- | ------------------------------ | --------------------------------------------------------------- |
| `id`             | `uuid`                  | PK, default `gen_random_uuid`  | Identificador único                                             |
| `code`           | `text`                  | NOT NULL                       | Código-fonte enviado pelo usuário                               |
| `language`       | `varchar(50)`           | NOT NULL                       | Linguagem detectada (`javascript`, `typescript`, `python`, etc) |
| `line_count`     | `integer`               | NOT NULL                       | Número de linhas do código                                      |
| `roast_mode`     | `boolean`               | NOT NULL, default `false`      | Se o modo sarcasmo máximo estava ativo                          |
| `score`          | `numeric(3,1)`          | NOT NULL                       | Nota de 0.0 a 10.0                                              |
| `roast_quote`    | `text`                  | NOT NULL                       | Frase de roast gerada pela IA                                   |
| `verdict`        | `verdict` (enum)        | NOT NULL                       | Veredito calculado com base no score                            |
| `suggested_fix`  | `text`                  |                                | Código sugerido como melhoria (diff "after")                    |
| `created_at`     | `timestamp with tz`     | NOT NULL, default `now()`      | Data de criação                                                 |

**Índices:**

- `idx_submissions_score` em `score` (ASC) — para o leaderboard ordenado pelos piores
- `idx_submissions_created_at` em `created_at` (DESC) — para listagem recente

### `issues`

Cada problema (ou ponto positivo) identificado na análise de uma submissão.

| Coluna          | Tipo               | Constraints                   | Descrição                                    |
| --------------- | ------------------ | ----------------------------- | -------------------------------------------- |
| `id`            | `uuid`             | PK, default `gen_random_uuid` | Identificador único                          |
| `submission_id` | `uuid`             | NOT NULL, FK → `submissions`  | Submissão à qual o issue pertence            |
| `severity`      | `severity` (enum)  | NOT NULL                      | Nível: `critical`, `warning` ou `good`       |
| `title`         | `varchar(255)`     | NOT NULL                      | Título curto (ex: "using var instead of let")|
| `description`   | `text`             | NOT NULL                      | Explicação detalhada do problema             |
| `position`      | `integer`          | NOT NULL, default `0`         | Ordem de exibição na UI                      |
| `created_at`    | `timestamp with tz`| NOT NULL, default `now()`     | Data de criação                              |

**Índices:**

- `idx_issues_submission_id` em `submission_id` — para buscar issues de uma submissão

**Relações:**

- `issues.submission_id` → `submissions.id` (ON DELETE CASCADE)

---

## Relacionamentos

```
submissions 1 ──── N issues
```

Uma submissão possui N issues (tipicamente 2–6 items de análise).

---

## Schema Drizzle (referência)

```typescript
import { pgTable, pgEnum, uuid, text, varchar, integer, boolean, numeric, timestamp } from "drizzle-orm/pg-core"

export const severityEnum = pgEnum("severity", ["critical", "warning", "good"])

export const verdictEnum = pgEnum("verdict", [
  "needs_serious_help",
  "below_average",
  "average",
  "above_average",
  "impressive",
  "legendary",
])

export const submissions = pgTable("submissions", {
  id: uuid().primaryKey().defaultRandom(),
  code: text().notNull(),
  language: varchar({ length: 50 }).notNull(),
  lineCount: integer("line_count").notNull(),
  roastMode: boolean("roast_mode").notNull().default(false),
  score: numeric({ precision: 3, scale: 1 }).notNull(),
  roastQuote: text("roast_quote").notNull(),
  verdict: verdictEnum().notNull(),
  suggestedFix: text("suggested_fix"),
  createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
})

export const issues = pgTable("issues", {
  id: uuid().primaryKey().defaultRandom(),
  submissionId: uuid("submission_id")
    .notNull()
    .references(() => submissions.id, { onDelete: "cascade" }),
  severity: severityEnum().notNull(),
  title: varchar({ length: 255 }).notNull(),
  description: text().notNull(),
  position: integer().notNull().default(0),
  createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
})
```

---

## Docker Compose — PostgreSQL

```yaml
services:
  pg:
    image: postgres:17-alpine
    ports:
      - "5432:5432"
    environment:
      POSTGRES_USER: devroast
      POSTGRES_PASSWORD: devroast
      POSTGRES_DB: devroast
    volumes:
      - pg_data:/var/lib/postgresql/data

volumes:
  pg_data:
```

**Connection string** para `.env`:

```
DATABASE_URL=postgresql://devroast:devroast@localhost:5432/devroast
```

---

## To-dos para implantação

### 1. Infraestrutura

- [ ] Criar `docker-compose.yml` na raiz do projeto com o serviço PostgreSQL
- [ ] Criar `.env` com a `DATABASE_URL` (adicionar `.env` ao `.gitignore`)
- [ ] Subir o container: `docker compose up -d`

### 2. Dependências

- [ ] Instalar Drizzle ORM: `npm install drizzle-orm pg`
- [ ] Instalar Drizzle Kit (dev): `npm install -D drizzle-kit @types/pg`

### 3. Configuração do Drizzle

- [ ] Criar `drizzle.config.ts` na raiz com referência ao schema e connection string
- [ ] Criar `src/db/index.ts` com a instância do client `drizzle()`
- [ ] Criar `src/db/schema.ts` com as tabelas e enums definidos acima

### 4. Migrations

- [ ] Gerar a primeira migration: `npx drizzle-kit generate`
- [ ] Aplicar migration no banco: `npx drizzle-kit migrate`
- [ ] Validar as tabelas criadas: `npx drizzle-kit studio`

### 5. Integração com a aplicação

- [ ] Criar Server Action ou Route Handler para receber o código e salvar a submissão
- [ ] Após análise da IA, persistir o resultado (submission + issues) no banco
- [ ] Substituir dados estáticos do leaderboard (home e `/leaderboard`) por queries reais
- [ ] Implementar query do leaderboard: `SELECT * FROM submissions ORDER BY score ASC LIMIT N`
- [ ] Implementar query de detalhes: buscar submission + issues por ID
