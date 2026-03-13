# UI Components — Padrões de Criação

## Stack

- **Tailwind CSS** para estilização via classes utilitárias.
- **tailwind-variants** (`tv`) para definir variantes de componentes. Ele já faz merge de classes internamente — **nunca use `twMerge` manualmente**.

## Estrutura de um componente

Cada componente segue esta ordem:

1. **Imports** — tipos do React, `tv` e `VariantProps` de `tailwind-variants`.
2. **Definição de variantes** — `const nomeDoComponente = tv({ ... })` com `base`, `variants` e `defaultVariants`.
3. **Tipos** — `VariantProps<typeof ...>` combinado com `ComponentProps<"elemento">` para estender as props nativas do HTML.
4. **Componente** — função que desestrutura `variant`, `size`, `className` e `...props`, passando tudo para `tv()` como um único objeto.
5. **Exports** — sempre **named exports**. Nunca use `export default`.

## Regras

- Sempre estender `ComponentProps<"elemento">` para herdar as propriedades nativas do elemento HTML (`button`, `input`, `a`, etc.).
- Passar `className` diretamente para a chamada da variant (`tv({ variant, size, className })`), pois `tailwind-variants` já faz o merge. Nunca use `twMerge` junto.
- Nunca usar `export default`. Sempre usar `export { Componente, variantes, type Props }`.
- Usar `type` para definições de tipo (não `interface`).
- Nomear a constante `tv()` em camelCase com o nome do componente (ex: `button`, `badge`, `card`).
- Nomear o componente React em PascalCase (ex: `Button`, `Badge`, `Card`).

## Exemplo de referência — Componente simples

```tsx
import type { ComponentProps } from "react";
import { tv, type VariantProps } from "tailwind-variants";

const button = tv({
	base: "inline-flex items-center justify-center ...",
	variants: {
		variant: {
			primary: "...",
			secondary: "...",
		},
		size: {
			sm: "...",
			md: "...",
		},
	},
	defaultVariants: {
		variant: "primary",
		size: "md",
	},
});

type ButtonVariants = VariantProps<typeof button>;

type ButtonProps = ComponentProps<"button"> & ButtonVariants;

function Button({ variant, size, className, ...props }: ButtonProps) {
	return (
		<button className={button({ variant, size, className })} {...props} />
	);
}

export { Button, button, type ButtonProps };
```

## Composição (sub-componentes)

Para componentes com várias peças internas (rank, score, code, etc.), use o pattern de composição ao invés de múltiplas props:

- Crie uma função para cada sub-componente (`CardRoot`, `CardTitle`, `CardBody`, etc.).
- Use `Object.assign` para acoplar os sub-componentes ao componente raiz, habilitando dot notation (`Card.Title`, `Card.Body`).
- Cada sub-componente estende `ComponentProps<"elemento">` com suas props específicas.
- O componente raiz usa `tv()` para merge de classes. Sub-componentes podem usar string templates quando não precisam de variantes.

### Exemplo de referência — Composição

```tsx
import type { ComponentProps } from "react";
import { tv } from "tailwind-variants";

const card = tv({
	base: "rounded-lg border border-border-primary p-4",
});

type CardRootProps = ComponentProps<"div">;

function CardRoot({ className, ...props }: CardRootProps) {
	return <div className={card({ className })} {...props} />;
}

type CardTitleProps = ComponentProps<"h3">;

function CardTitle({ className, ...props }: CardTitleProps) {
	return (
		<h3
			className={`font-mono text-sm font-bold text-text-primary ${className ?? ""}`}
			{...props}
		/>
	);
}

type CardBodyProps = ComponentProps<"div">;

function CardBody({ className, ...props }: CardBodyProps) {
	return (
		<div
			className={`text-sm text-text-secondary ${className ?? ""}`}
			{...props}
		/>
	);
}

const Card = Object.assign(CardRoot, {
	Title: CardTitle,
	Body: CardBody,
});

export { Card, card, type CardRootProps, type CardTitleProps, type CardBodyProps };
```

### Uso

```tsx
<Card>
	<Card.Title>Título</Card.Title>
	<Card.Body>Conteúdo aqui</Card.Body>
</Card>
```
