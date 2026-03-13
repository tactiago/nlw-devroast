import type { ComponentProps } from "react";
import { tv, type VariantProps } from "tailwind-variants";

const diffLine = tv({
	base: "flex gap-2 px-4 py-2 font-mono text-[13px]",
	variants: {
		variant: {
			removed: "bg-diff-removed",
			added: "bg-diff-added",
			context: "bg-transparent",
		},
	},
	defaultVariants: {
		variant: "context",
	},
});

const diffPrefix = tv({
	variants: {
		variant: {
			removed: "text-accent-red",
			added: "text-accent-green",
			context: "text-text-tertiary",
		},
	},
});

const diffCode = tv({
	variants: {
		variant: {
			removed: "text-text-secondary",
			added: "text-text-primary",
			context: "text-text-secondary",
		},
	},
});

type DiffLineVariants = VariantProps<typeof diffLine>;

type DiffLineProps = ComponentProps<"div"> &
	DiffLineVariants & {
		code: string;
	};

const prefixMap = { removed: "-", added: "+", context: " " } as const;

function DiffLine({ variant, code, className, ...props }: DiffLineProps) {
	const v = variant ?? "context";
	return (
		<div className={diffLine({ variant, className })} {...props}>
			<span className={diffPrefix({ variant: v })}>{prefixMap[v]}</span>
			<span className={diffCode({ variant: v })}>{code}</span>
		</div>
	);
}

export { DiffLine, diffLine, type DiffLineProps };
