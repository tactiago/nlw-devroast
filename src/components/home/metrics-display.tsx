"use client";

import NumberFlow from "@number-flow/react";
import { useSuspenseQuery } from "@tanstack/react-query";
import { useTRPC } from "@/trpc/client";

export function MetricsDisplay() {
	const trpc = useTRPC();
	const { data } = useSuspenseQuery(trpc.metrics.get.queryOptions());

	return (
		<div className="flex items-center gap-6 font-mono text-xs text-text-tertiary">
			<span>
				<NumberFlow value={data.roastedCount} /> codes roasted
			</span>
			<span>·</span>
			<span>
				avg score:{" "}
				<NumberFlow
					value={data.avgScore}
					format={{ minimumFractionDigits: 1, maximumFractionDigits: 1 }}
				/>
				/10
			</span>
		</div>
	);
}
