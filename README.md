# > devroast

Cole seu codigo. Leve um roast.

**Dev Roast** e uma aplicacao que analisa trechos de codigo e da uma nota de 0 a 10 — com comentarios brutalmente honestos. Ative o "roast mode" para receber criticas com sarcasmo maximo.

## O que faz

- **Analise de codigo** — cole qualquer trecho e receba uma avaliacao com score, sugestoes de melhoria e diferencas antes/depois
- **Roast mode** — ative para comentarios mais sarcasticos e diretos
- **Leaderboard** — ranking dos piores codigos ja enviados, classificados pela vergonha

## Sobre o projeto

Este app esta sendo construido durante o evento **NLW** da [Rocketseat](https://www.rocketseat.com.br), nas aulas praticas do evento. O foco e aprender construindo, usando tecnologias modernas do ecossistema React.

## Tecnologias

- Next.js 16
- React 19
- TypeScript
- Tailwind CSS 4
- Biome

## Como rodar

1. Crie um arquivo `.env` na raiz com:
   - `DATABASE_URL` — connection string PostgreSQL
   - `GEMINI_API_KEY` — chave da API Google Gemini (para a análise de código via roast)

2. Execute:

```bash
npm install
npm run db:migrate
npm run dev
```

Acesse [http://localhost:3000](http://localhost:3000).
