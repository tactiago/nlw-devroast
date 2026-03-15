import type { Metadata } from "next";
import { cacheLife } from "next/cache";
import { Suspense } from "react";
import { LeaderboardDisplay } from "@/components/home/leaderboard-display";
import { LeaderboardSkeleton } from "@/components/home/leaderboard-skeleton";
import { MetricsDisplay } from "@/components/home/metrics-display";
import { MetricsSkeleton } from "@/components/home/metrics-skeleton";
import { HydrateClient, prefetchAll, trpc } from "@/trpc/server";

export const metadata: Metadata = {
	title: "Shame Leaderboard | Dev Roast",
	description:
		"The most roasted code on the internet. See the worst code submissions ranked by shame.",
};

const LEADERBOARD_LIMIT = 20;

async function CachedLeaderboardContent() {
	"use cache";
	cacheLife("hours");

	await prefetchAll([
		trpc.metrics.get.queryOptions(),
		trpc.submission.leaderboard.queryOptions({ limit: LEADERBOARD_LIMIT }),
	]);

	return (
		<HydrateClient>
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

					<Suspense fallback={<MetricsSkeleton />}>
						<MetricsDisplay />
					</Suspense>
				</div>

				<Suspense fallback={<LeaderboardSkeleton rowCount={LEADERBOARD_LIMIT} />}>
					<LeaderboardDisplay
						limit={LEADERBOARD_LIMIT}
						showViewAllLink={false}
					/>
				</Suspense>
			</div>
		</HydrateClient>
	);
}

export default async function LeaderboardPage() {
	return <CachedLeaderboardContent />;
}
