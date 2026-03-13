import type { ComponentProps } from "react";
import { DiffLine } from "./diff-line";

type DiffLineData = {
	variant: "removed" | "added" | "context";
	code: string;
};

type DiffBlockProps = ComponentProps<"div"> & {
	filename: string;
	lines: DiffLineData[];
};

function DiffBlock({ filename, lines, className, ...props }: DiffBlockProps) {
	return (
		<div
			className={`overflow-hidden border border-border-primary bg-bg-input ${className ?? ""}`}
			{...props}
		>
			<div className="flex h-10 items-center border-b border-border-primary px-4">
				<span className="font-mono text-xs font-medium text-text-secondary">
					{filename}
				</span>
			</div>
			<div className="flex flex-col py-1">
				{lines.map((line, i) => (
					<DiffLine key={i} variant={line.variant} code={line.code} />
				))}
			</div>
		</div>
	);
}

export { DiffBlock, type DiffBlockProps, type DiffLineData };
