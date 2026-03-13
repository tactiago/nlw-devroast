import type { ComponentProps } from "react";

type ScoreRingProps = ComponentProps<"div"> & {
	score: number;
	maxScore?: number;
};

function getScoreColor(score: number) {
	if (score <= 3) return "text-accent-red";
	if (score <= 6) return "text-accent-amber";
	return "text-accent-green";
}

function getStrokeColor(score: number) {
	if (score <= 3) return "#ef4444";
	if (score <= 6) return "#f59e0b";
	return "#10b981";
}

function ScoreRing({ score, maxScore = 10, ...props }: ScoreRingProps) {
	const radius = 82;
	const strokeWidth = 4;
	const circumference = 2 * Math.PI * radius;
	const progress = score / maxScore;
	const dashOffset = circumference * (1 - progress);

	return (
		<div className="relative size-[180px] shrink-0" {...props}>
			<svg className="size-full -rotate-90" viewBox="0 0 180 180" fill="none">
				<circle
					cx="90"
					cy="90"
					r={radius}
					stroke="var(--color-border-primary)"
					strokeWidth={strokeWidth}
				/>
				<circle
					cx="90"
					cy="90"
					r={radius}
					stroke={getStrokeColor(score)}
					strokeWidth={strokeWidth}
					strokeDasharray={circumference}
					strokeDashoffset={dashOffset}
					strokeLinecap="round"
				/>
			</svg>
			<div className="absolute inset-0 flex flex-col items-center justify-center">
				<span
					className={`font-mono text-5xl font-bold ${getScoreColor(score)}`}
				>
					{score}
				</span>
				<span className="font-mono text-base text-text-tertiary">
					/{maxScore}
				</span>
			</div>
		</div>
	);
}

export { ScoreRing, type ScoreRingProps };
