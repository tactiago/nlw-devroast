"use client";

import { useQuery, useSuspenseQuery } from "@tanstack/react-query";
import Link from "next/link";
import { LeaderboardCodeCell } from "@/components/home/leaderboard-code-cell";
import { LeaderboardRow } from "@/components/ui/leaderboard-row";
import { useTRPC } from "@/trpc/client";

type LeaderboardDisplayProps = {
	limit?: number;
	showViewAllLink?: boolean;
};

export function LeaderboardDisplay({
	limit = 3,
	showViewAllLink = true,
}: LeaderboardDisplayProps) {
	const trpc = useTRPC();
	const { data: leaderboard } = useSuspenseQuery(
		trpc.submission.leaderboard.queryOptions({ limit }),
	);
	const { data: metrics } = useQuery(trpc.metrics.get.queryOptions());
	const totalCount = metrics?.roastedCount ?? 0;

	return (
		<>
			<div className="overflow-hidden rounded-lg border border-border-primary">
				<div className="flex h-12 items-center justify-between border-b border-border-primary bg-bg-surface px-5">
					<div className="flex items-center gap-4">
						<span className="font-mono text-xs text-text-tertiary">#</span>
						<span className="font-mono text-xs text-text-tertiary">score:</span>
					</div>
					<span className="font-mono text-xs text-text-tertiary">lang</span>
				</div>
				{leaderboard.map((item) => {
					const lineCount = item.code.trim().split("\n").length;
					return (
						<LeaderboardRow key={item.id}>
							<LeaderboardRow.Meta>
								<div className="flex items-center gap-4">
									<div className="flex items-center gap-1.5">
										<span className="font-mono text-xs text-text-tertiary">
											#
										</span>
										<LeaderboardRow.Rank highlight={item.rank === 1}>
											{item.rank}
										</LeaderboardRow.Rank>
									</div>
									<div className="flex items-center gap-1.5">
										<span className="font-mono text-xs text-text-tertiary">
											score:
										</span>
										<LeaderboardRow.Score>{item.score}</LeaderboardRow.Score>
									</div>
								</div>
								<div className="flex items-center gap-3">
									<LeaderboardRow.Language>
										{item.language}
									</LeaderboardRow.Language>
									<span className="font-mono text-xs text-text-tertiary">
										{lineCount}{" "}
										{lineCount === 1 ? "line" : "lines"}
									</span>
								</div>
							</LeaderboardRow.Meta>
							<LeaderboardRow.Code>
								<LeaderboardCodeCell
									code={item.code}
									language={item.language}
								/>
							</LeaderboardRow.Code>
						</LeaderboardRow>
					);
				})}
			</div>

			<p className="text-center font-mono text-xs text-text-tertiary">
				{`showing top ${leaderboard.length} of ${totalCount}`}
				{showViewAllLink && (
					<>
						{" · "}
						<Link
							href="/leaderboard"
							className="text-text-secondary transition-colors hover:text-text-primary"
						>
							{"view full leaderboard >>"}
						</Link>
					</>
				)}
			</p>
		</>
	);
}
