import type { ComponentProps } from "react";
import { tv, type VariantProps } from "tailwind-variants";

const issueCard = tv({
	base: "flex flex-col gap-3 border border-border-primary p-5",
});

const severityDot = tv({
	variants: {
		severity: {
			critical: "bg-accent-red",
			warning: "bg-accent-amber",
			good: "bg-accent-green",
		},
	},
});

const severityLabel = tv({
	variants: {
		severity: {
			critical: "text-accent-red",
			warning: "text-accent-amber",
			good: "text-accent-green",
		},
	},
});

type IssueSeverity = "critical" | "warning" | "good";

type IssueCardProps = ComponentProps<"div"> &
	VariantProps<typeof issueCard> & {
		severity: IssueSeverity;
		title: string;
		description: string;
	};

function IssueCard({
	severity,
	title,
	description,
	className,
	...props
}: IssueCardProps) {
	return (
		<div className={issueCard({ className })} {...props}>
			<div className="flex items-center gap-2">
				<span className={`size-2 rounded-full ${severityDot({ severity })}`} />
				<span
					className={`font-mono text-xs font-medium ${severityLabel({ severity })}`}
				>
					{severity}
				</span>
			</div>
			<span className="font-mono text-[13px] font-medium text-text-primary">
				{title}
			</span>
			<p className="font-mono text-xs leading-relaxed text-text-secondary">
				{description}
			</p>
		</div>
	);
}

export { IssueCard, issueCard, type IssueCardProps };
