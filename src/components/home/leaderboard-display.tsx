"use client";

import { useQuery, useSuspenseQuery } from "@tanstack/react-query";
import Link from "next/link";
import { LeaderboardCodeCell } from "@/components/home/leaderboard-code-cell";
import { LeaderboardRow } from "@/components/ui/leaderboard-row";
import { useTRPC } from "@/trpc/client";

export function LeaderboardDisplay() {
	const trpc = useTRPC();
	const { data: leaderboard } = useSuspenseQuery(
		trpc.submission.leaderboard.queryOptions({ limit: 3 }),
	);
	const { data: metrics } = useQuery(trpc.metrics.get.queryOptions());
	const totalCount = metrics?.roastedCount ?? 0;

	return (
		<>
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
				{leaderboard.map((item) => (
					<LeaderboardRow key={item.id}>
						<LeaderboardRow.Rank highlight={item.rank === 1}>
							{item.rank}
						</LeaderboardRow.Rank>
						<LeaderboardRow.Score>{item.score}</LeaderboardRow.Score>
						<LeaderboardRow.Code>
							<LeaderboardCodeCell
								code={item.code}
								language={item.language}
							/>
						</LeaderboardRow.Code>
						<LeaderboardRow.Language>{item.language}</LeaderboardRow.Language>
					</LeaderboardRow>
				))}
			</div>

			<p className="text-center font-mono text-xs text-text-tertiary">
				{`showing top 3 of ${totalCount} · `}
				<Link
					href="/leaderboard"
					className="text-text-secondary transition-colors hover:text-text-primary"
				>
					{"view full leaderboard >>"}
				</Link>
			</p>
		</>
	);
}
