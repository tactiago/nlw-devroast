import type { Metadata } from "next";
import { LeaderboardEntryCard } from "@/components/ui/leaderboard-entry-card";

export const metadata: Metadata = {
	title: "Shame Leaderboard | Dev Roast",
	description:
		"The most roasted code on the internet. See the worst code submissions ranked by shame.",
};

const leaderboardEntries = [
	{
		rank: 1,
		score: 1.2,
		language: "javascript",
		code: `eval(prompt("enter code"))
document.write(response)
// trust the user lol`,
	},
	{
		rank: 2,
		score: 1.8,
		language: "typescript",
		code: `if (x == true) { return true; }
else if (x == false) { return false; }
else { return !false; }`,
	},
	{
		rank: 3,
		score: 2.1,
		language: "sql",
		code: `SELECT * FROM users WHERE 1=1
-- TODO: add authentication`,
	},
	{
		rank: 4,
		score: 2.3,
		language: "java",
		code: `catch (e) {
  // ignore
}`,
	},
	{
		rank: 5,
		score: 2.5,
		language: "javascript",
		code: `const sleep = (ms) =>
  new Date(Date.now() + ms)
  while(new Date() < end) {}`,
	},
];

export default function LeaderboardPage() {
	return (
		<div className="mx-auto flex w-full max-w-5xl flex-col gap-10 px-10 py-10">
			<div className="flex flex-col gap-4">
				<div className="flex items-center gap-3">
					<span className="font-mono text-[32px] font-bold text-accent-green">
						{">"}
					</span>
					<h1 className="font-mono text-[28px] font-bold text-text-primary">
						shame_leaderboard
					</h1>
				</div>

				<p className="font-mono text-sm text-text-secondary">
					{"// the most roasted code on the internet"}
				</p>

				<div className="flex items-center gap-2 font-mono text-xs text-text-tertiary">
					<span>2,847 submissions</span>
					<span>·</span>
					<span>avg score: 4.2/10</span>
				</div>
			</div>

			<div className="flex flex-col gap-5">
				{leaderboardEntries.map((entry) => (
					<LeaderboardEntryCard
						key={entry.rank}
						rank={entry.rank}
						score={entry.score}
						language={entry.language}
						code={entry.code}
					/>
				))}
			</div>
		</div>
	);
}
