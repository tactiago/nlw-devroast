"use client";

import Link from "next/link";
import { useCallback, useState } from "react";
import { Button } from "@/components/ui/button";
import { CodeEditor } from "@/components/ui/code-editor";
import { LeaderboardRow } from "@/components/ui/leaderboard-row";
import { Toggle } from "@/components/ui/toggle";

const placeholderCode = `function calculateTotal(items) {
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
}`;

type HomeContentProps = {
	metrics?: React.ReactNode;
};

export function HomeContent({ metrics }: HomeContentProps) {
	const [, setCode] = useState(placeholderCode);
	const [, setLanguage] = useState("javascript");
	const [overLimit, setOverLimit] = useState(false);

	const handleEditorChange = useCallback((code: string, language: string) => {
		setCode(code);
		setLanguage(language);
	}, []);

	return (
		<div className="flex flex-col items-center gap-8 px-10 py-20">
			<div className="flex flex-col items-center gap-3">
				<h1 className="flex items-center gap-3 font-mono text-4xl font-bold">
					<span className="text-accent-green">{"$"}</span>
					<span className="text-text-primary">
						paste your code. get roasted.
					</span>
				</h1>
				<p className="font-mono text-sm text-text-secondary">
					{
						"// drop your code below and we'll rate it — brutally honest or full roast mode"
					}
				</p>
			</div>

			<div className="w-full max-w-3xl">
				<CodeEditor
					defaultValue={placeholderCode}
					onChange={handleEditorChange}
					onOverLimit={setOverLimit}
				/>
			</div>

			<div className="flex w-full max-w-3xl items-center justify-between">
				<div className="flex items-center gap-4">
					<Toggle defaultChecked label="roast mode" />
					<span className="font-mono text-xs text-text-tertiary">
						{"// maximum sarcasm enabled"}
					</span>
				</div>
				<Button variant="primary" size="md" disabled={overLimit}>
					$ roast_my_code
				</Button>
			</div>

			{metrics ?? (
				<div className="flex items-center gap-6 font-mono text-xs text-text-tertiary">
					<span>2,847 codes roasted</span>
					<span>·</span>
					<span>avg score: 4.2/10</span>
				</div>
			)}

			<div className="mt-8 flex w-full max-w-4xl flex-col gap-6">
				<div className="flex items-center justify-between">
					<div className="flex items-center gap-2">
						<span className="font-mono text-sm font-bold text-accent-green">
							{"//"}
						</span>
						<span className="font-mono text-sm font-bold text-text-primary">
							shame_leaderboard
						</span>
					</div>
					<Link href="/leaderboard">
						<Button variant="outline" size="sm">
							{"$ view_all >>"}
						</Button>
					</Link>
				</div>

				<p className="font-mono text-[13px] text-text-tertiary">
					{"// the worst code on the internet, ranked by shame"}
				</p>

				<div className="overflow-hidden rounded-lg border border-border-primary">
					<div className="flex items-center gap-6 bg-bg-surface px-5 py-2.5">
						<span className="w-12 font-mono text-xs font-medium text-text-tertiary">
							#
						</span>
						<span className="w-16 font-mono text-xs font-medium text-text-tertiary">
							score
						</span>
						<span className="min-w-0 flex-1 font-mono text-xs font-medium text-text-tertiary">
							code
						</span>
						<span className="w-24 text-right font-mono text-xs font-medium text-text-tertiary">
							lang
						</span>
					</div>
					<LeaderboardRow>
						<LeaderboardRow.Rank highlight>1</LeaderboardRow.Rank>
						<LeaderboardRow.Score>1.2</LeaderboardRow.Score>
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
						<LeaderboardRow.Score>1.8</LeaderboardRow.Score>
						<LeaderboardRow.Code>
							<LeaderboardRow.CodeLine>
								{"if (x == true) { return true; }"}
							</LeaderboardRow.CodeLine>
							<LeaderboardRow.CodeLine>
								{"else if (x == false) { return false; }"}
							</LeaderboardRow.CodeLine>
							<LeaderboardRow.CodeLine>
								{"else { return !false; }"}
							</LeaderboardRow.CodeLine>
						</LeaderboardRow.Code>
						<LeaderboardRow.Language>typescript</LeaderboardRow.Language>
					</LeaderboardRow>
					<LeaderboardRow>
						<LeaderboardRow.Rank>3</LeaderboardRow.Rank>
						<LeaderboardRow.Score>2.1</LeaderboardRow.Score>
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

				<p className="text-center font-mono text-xs text-text-tertiary">
					{"showing top 3 of 2,847 · "}
					<Link
						href="/leaderboard"
						className="text-text-secondary transition-colors hover:text-text-primary"
					>
						{"view full leaderboard >>"}
					</Link>
				</p>
			</div>
		</div>
	);
}
