import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { CodeBlock } from "@/components/ui/code-block";
import { DiffLine } from "@/components/ui/diff-line";
import { LeaderboardRow } from "@/components/ui/leaderboard-row";
import { ScoreRing } from "@/components/ui/score-ring";
import { Toggle } from "@/components/ui/toggle";

const buttonVariants = ["primary", "secondary", "outline", "ghost"] as const;
const buttonSizes = ["sm", "md", "lg"] as const;

const sampleCode = `function calculateTotal(items) {
  var total = 0;
  for (var i = 0; i < items.length; i++) {
    total += items[i].price;
  }
  return total;
}`;

function SectionTitle({ children }: { children: string }) {
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

export default function ExamplesPage() {
	return (
		<div className="mx-auto min-h-screen max-w-4xl space-y-16 px-10 py-16">
			<div className="flex items-center gap-2">
				<span className="font-mono text-2xl font-bold text-accent-green">
					{"//"}
				</span>
				<h1 className="font-mono text-2xl font-bold text-text-primary">
					component_library
				</h1>
			</div>

			<section className="space-y-6">
				<SectionTitle>buttons</SectionTitle>
				<div className="space-y-4">
					<div className="flex flex-wrap items-center gap-4">
						{buttonVariants.map((variant) => (
							<Button key={variant} variant={variant}>
								$ {variant}
							</Button>
						))}
					</div>
					<div className="flex flex-wrap items-center gap-4">
						{buttonSizes.map((size) => (
							<Button key={size} size={size}>
								$ {size}
							</Button>
						))}
					</div>
					<div className="flex flex-wrap items-center gap-4">
						{buttonVariants.map((variant) => (
							<Button key={variant} variant={variant} disabled>
								$ {variant}
							</Button>
						))}
					</div>
				</div>
			</section>

			<section className="space-y-6">
				<SectionTitle>toggle</SectionTitle>
				<div className="flex items-center gap-8">
					<Toggle defaultChecked label="roast mode" />
					<Toggle label="roast mode" />
				</div>
			</section>

			<section className="space-y-6">
				<SectionTitle>badge_status</SectionTitle>
				<div className="flex items-center gap-6">
					<Badge variant="critical">critical</Badge>
					<Badge variant="warning">warning</Badge>
					<Badge variant="good">good</Badge>
				</div>
			</section>

			<section className="space-y-6">
				<SectionTitle>code_block</SectionTitle>
				<CodeBlock
					code={sampleCode}
					language="javascript"
					filename="calculate.js"
				/>
			</section>

			<section className="space-y-6">
				<SectionTitle>diff_line</SectionTitle>
				<div className="overflow-hidden rounded-lg border border-border-primary">
					<DiffLine variant="removed" code="var total = 0;" />
					<DiffLine variant="added" code="const total = 0;" />
					<DiffLine
						variant="context"
						code="for (let i = 0; i < items.length; i++) {"
					/>
					<DiffLine
						variant="removed"
						code="    total = total + items[i].price;"
					/>
					<DiffLine variant="added" code="    total += items[i].price;" />
					<DiffLine variant="context" code="}" />
				</div>
			</section>

			<section className="space-y-6">
				<SectionTitle>table_row</SectionTitle>
				<div className="overflow-hidden rounded-lg border border-border-primary">
					<LeaderboardRow>
						<LeaderboardRow.Rank highlight>1</LeaderboardRow.Rank>
						<LeaderboardRow.Score>2.1</LeaderboardRow.Score>
						<LeaderboardRow.Code>
							<LeaderboardRow.CodeLine>
								{'eval(prompt("enter code"))'}
							</LeaderboardRow.CodeLine>
							<LeaderboardRow.CodeLine>
								document.write(response)
							</LeaderboardRow.CodeLine>
							<LeaderboardRow.CodeLine comment>
								{"// trust the user lol"}
							</LeaderboardRow.CodeLine>
						</LeaderboardRow.Code>
						<LeaderboardRow.Language>javascript</LeaderboardRow.Language>
					</LeaderboardRow>
					<LeaderboardRow>
						<LeaderboardRow.Rank>2</LeaderboardRow.Rank>
						<LeaderboardRow.Score>4.5</LeaderboardRow.Score>
						<LeaderboardRow.Code>
							<LeaderboardRow.CodeLine>
								def process_data(raw):
							</LeaderboardRow.CodeLine>
							<LeaderboardRow.CodeLine>
								{"    data = eval(raw)"}
							</LeaderboardRow.CodeLine>
							<LeaderboardRow.CodeLine comment>
								{"    # what could go wrong?"}
							</LeaderboardRow.CodeLine>
						</LeaderboardRow.Code>
						<LeaderboardRow.Language>python</LeaderboardRow.Language>
					</LeaderboardRow>
					<LeaderboardRow>
						<LeaderboardRow.Rank>3</LeaderboardRow.Rank>
						<LeaderboardRow.Score>6.8</LeaderboardRow.Score>
						<LeaderboardRow.Code>
							<LeaderboardRow.CodeLine>
								SELECT * FROM users WHERE 1=1
							</LeaderboardRow.CodeLine>
							<LeaderboardRow.CodeLine comment>
								{"-- TODO: add authentication"}
							</LeaderboardRow.CodeLine>
						</LeaderboardRow.Code>
						<LeaderboardRow.Language>sql</LeaderboardRow.Language>
					</LeaderboardRow>
				</div>
			</section>

			<section className="space-y-6">
				<SectionTitle>score_ring</SectionTitle>
				<div className="flex items-center gap-12">
					<ScoreRing score={3.5} />
					<ScoreRing score={7.2} />
					<ScoreRing score={1.0} />
				</div>
			</section>
		</div>
	);
}
