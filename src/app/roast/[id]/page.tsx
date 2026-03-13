import type { Metadata } from "next";
import { CodeBlock } from "@/components/ui/code-block";
import { DiffBlock } from "@/components/ui/diff-block";
import type { DiffLineData } from "@/components/ui/diff-block";
import { IssueCard } from "@/components/ui/issue-card";
import { ScoreRing } from "@/components/ui/score-ring";

export const metadata: Metadata = {
	title: "Roast Results | Dev Roast",
	description: "Your code has been roasted. See the results.",
};

const staticRoast = {
	score: 3.5,
	verdict: "needs_serious_help" as const,
	roastLine:
		'"this code looks like it was written during a power outage... in 2005."',
	language: "javascript",
	lineCount: 16,
	code: `function calculateTotal(items) {
  var total = 0;
  for (var i = 0; i < items.length; i++) {
    total = total + items[i].price;
  }

  if (total > 100) {
    console.log("discount applied");
    total = total * 0.9;
  }

  // TODO: handle tax calculation
  // TODO: handle currency conversion

  return total;
}`,
	issues: [
		{
			severity: "critical" as const,
			title: "using var instead of const/let",
			description:
				"var is function-scoped and leads to hoisting bugs. use const by default, let when reassignment is needed.",
		},
		{
			severity: "warning" as const,
			title: "imperative loop pattern",
			description:
				"for loops are verbose and error-prone. use .reduce() or .map() for cleaner, functional transformations.",
		},
		{
			severity: "good" as const,
			title: "clear naming conventions",
			description:
				"calculateTotal and items are descriptive, self-documenting names that communicate intent without comments.",
		},
		{
			severity: "good" as const,
			title: "single responsibility",
			description:
				"the function does one thing well — calculates a total. no side effects, no mixed concerns, no hidden complexity.",
		},
	],
	diff: {
		filename: "your_code.ts → improved_code.ts",
		lines: [
			{ variant: "context", code: "function calculateTotal(items) {" },
			{ variant: "removed", code: "  var total = 0;" },
			{
				variant: "removed",
				code: "  for (var i = 0; i < items.length; i++) {",
			},
			{ variant: "removed", code: "    total = total + items[i].price;" },
			{ variant: "removed", code: "  }" },
			{ variant: "removed", code: "  return total;" },
			{
				variant: "added",
				code: "  return items.reduce((sum, item) => sum + item.price, 0);",
			},
			{ variant: "context", code: "}" },
		] satisfies DiffLineData[],
	},
};

function SectionTitle({ children }: { children: React.ReactNode }) {
	return (
		<div className="flex items-center gap-2">
			<span className="font-mono text-sm font-bold text-accent-green">
				{"//"}
			</span>
			<span className="font-mono text-sm font-bold text-text-primary">
				{children}
			</span>
		</div>
	);
}

export default async function RoastResultPage({
	params,
}: {
	params: Promise<{ id: string }>;
}) {
	const { id } = await params;
	void id;

	const roast = staticRoast;

	return (
		<div className="mx-auto flex w-full max-w-5xl flex-col gap-10 px-10 py-10">
			{/* Score Hero */}
			<section className="flex items-center gap-12">
				<ScoreRing score={roast.score} />

				<div className="flex flex-col gap-4">
					<div className="flex items-center gap-2">
						<span className="size-2 rounded-full bg-accent-red" />
						<span className="font-mono text-[13px] font-medium text-accent-red">
							verdict: {roast.verdict}
						</span>
					</div>

					<p className="font-mono text-xl leading-relaxed text-text-primary">
						{roast.roastLine}
					</p>

					<div className="flex items-center gap-4 font-mono text-xs text-text-tertiary">
						<span>lang: {roast.language}</span>
						<span>·</span>
						<span>{roast.lineCount} lines</span>
					</div>

					<div>
						<button
							type="button"
							className="border border-border-primary px-4 py-2 font-mono text-xs text-text-primary transition-colors hover:bg-bg-elevated"
						>
							$ share_roast
						</button>
					</div>
				</div>
			</section>

			<hr className="border-border-primary" />

			{/* Submitted Code */}
			<section className="flex flex-col gap-4">
				<SectionTitle>your_submission</SectionTitle>
				<div className="overflow-hidden border border-border-primary bg-bg-input">
					<CodeBlock code={roast.code} language={roast.language} />
				</div>
			</section>

			<hr className="border-border-primary" />

			{/* Detailed Analysis */}
			<section className="flex flex-col gap-6">
				<SectionTitle>detailed_analysis</SectionTitle>
				<div className="grid grid-cols-2 gap-5">
					{roast.issues.map((issue) => (
						<IssueCard
							key={issue.title}
							severity={issue.severity}
							title={issue.title}
							description={issue.description}
						/>
					))}
				</div>
			</section>

			<hr className="border-border-primary" />

			{/* Suggested Fix */}
			<section className="flex flex-col gap-6">
				<SectionTitle>suggested_fix</SectionTitle>
				<DiffBlock filename={roast.diff.filename} lines={roast.diff.lines} />
			</section>
		</div>
	);
}
