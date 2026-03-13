import { Suspense } from "react";
import { HomeContent } from "@/components/home/home-content";
import { MetricsDisplay } from "@/components/home/metrics-display";
import { MetricsSkeleton } from "@/components/home/metrics-skeleton";
import { HydrateClient, prefetch, trpc } from "@/trpc/server";

export default async function Home() {
	prefetch(trpc.metrics.get.queryOptions());

	return (
		<HydrateClient>
			<HomeContent
				metrics={
					<Suspense fallback={<MetricsSkeleton />}>
						<MetricsDisplay />
					</Suspense>
				}
			/>
		</HydrateClient>
	);
}
