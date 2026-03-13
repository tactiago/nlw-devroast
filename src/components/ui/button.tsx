import type { ComponentProps } from "react";
import { tv, type VariantProps } from "tailwind-variants";

const button = tv({
	base: "inline-flex items-center justify-center gap-2 font-mono font-medium transition-colors cursor-pointer disabled:pointer-events-none disabled:opacity-50",
	variants: {
		variant: {
			primary: "bg-accent-green text-bg-page enabled:hover:bg-accent-green/80",
			secondary:
				"border border-border-primary bg-transparent text-text-primary enabled:hover:bg-bg-elevated",
			outline:
				"border border-border-primary text-text-secondary bg-transparent enabled:hover:bg-bg-elevated",
			ghost: "text-text-secondary bg-transparent enabled:hover:bg-bg-elevated",
		},
		size: {
			sm: "px-4 py-2 text-xs rounded-lg",
			md: "px-6 py-2.5 text-sm rounded-lg",
			lg: "px-8 py-3 text-base rounded-xl",
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
	return <button className={button({ variant, size, className })} {...props} />;
}

export { Button, button, type ButtonProps };
