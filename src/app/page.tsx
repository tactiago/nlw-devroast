import { Suspense } from "react";
import { HomeContent } from "@/components/home/home-content";
import { LeaderboardDisplay } from "@/components/home/leaderboard-display";
import { LeaderboardSkeleton } from "@/components/home/leaderboard-skeleton";
import { MetricsDisplay } from "@/components/home/metrics-display";
import { MetricsSkeleton } from "@/components/home/metrics-skeleton";
import { HydrateClient, prefetchAll, trpc } from "@/trpc/server";

export default async function Home() {
	await prefetchAll([
		trpc.metrics.get.queryOptions(),
		trpc.submission.leaderboard.queryOptions({ limit: 3 }),
	]);

	return (
		<HydrateClient>
			<HomeContent
				metrics={
					<Suspense fallback={<MetricsSkeleton />}>
						<MetricsDisplay />
					</Suspense>
				}
				leaderboard={
					<Suspense fallback={<LeaderboardSkeleton />}>
						<LeaderboardDisplay />
					</Suspense>
				}
			/>
		</HydrateClient>
	);
}
