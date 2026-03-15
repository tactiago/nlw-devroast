export function LeaderboardSkeleton() {
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
				{[1, 2, 3].map((i) => (
					<div
						key={i}
						className="flex items-center gap-6 border-b border-border-primary px-5 py-4"
					>
						<span className="h-4 w-4 animate-pulse rounded bg-bg-surface" />
						<span className="h-4 w-8 animate-pulse rounded bg-bg-surface" />
						<div className="flex min-w-0 flex-1 flex-col gap-1">
							<span className="h-4 w-full max-w-48 animate-pulse rounded bg-bg-surface" />
							<span className="h-4 w-full max-w-32 animate-pulse rounded bg-bg-surface" />
							<span className="h-4 w-full max-w-24 animate-pulse rounded bg-bg-surface" />
						</div>
						<span className="h-4 w-12 animate-pulse rounded bg-bg-surface" />
					</div>
				))}
			</div>
			<p className="text-center font-mono text-xs text-text-tertiary">
				<span className="inline-block h-4 w-24 animate-pulse rounded bg-bg-surface align-middle" />
			</p>
		</>
	);
}
