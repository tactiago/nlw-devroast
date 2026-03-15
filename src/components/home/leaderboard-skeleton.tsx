type LeaderboardSkeletonProps = {
	rowCount?: number;
};

export function LeaderboardSkeleton({ rowCount = 3 }: LeaderboardSkeletonProps) {
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
				{Array.from({ length: rowCount }).map((_, i) => (
					<div
						key={i}
						className="flex flex-col overflow-hidden border-b border-border-primary"
					>
						<div className="flex h-12 items-center justify-between border-b border-border-primary px-5">
							<div className="flex items-center gap-4">
								<span className="h-4 w-4 animate-pulse rounded bg-bg-surface" />
								<span className="h-4 w-8 animate-pulse rounded bg-bg-surface" />
							</div>
							<span className="h-4 w-12 animate-pulse rounded bg-bg-surface" />
						</div>
						<div className="h-[120px] w-full animate-pulse bg-bg-input" />
					</div>
				))}
			</div>
			<p className="text-center font-mono text-xs text-text-tertiary">
				<span className="inline-block h-4 w-24 animate-pulse rounded bg-bg-surface align-middle" />
			</p>
		</>
	);
}
