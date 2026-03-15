export function MetricsSkeleton() {
	return (
		<div className="flex items-center gap-6 font-mono text-xs text-text-tertiary">
			<span className="h-4 w-24 animate-pulse rounded bg-bg-surface" />
			<span>·</span>
			<span className="h-4 w-20 animate-pulse rounded bg-bg-surface" />
		</div>
	);
}
