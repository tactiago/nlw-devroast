type ScoreRingProps = {
	score: number;
	maxScore?: number;
	size?: number;
};

function ScoreRing({ score, maxScore = 10, size = 180 }: ScoreRingProps) {
	const ratio = Math.min(Math.max(score / maxScore, 0), 1);
	const strokeWidth = 4;
	const radius = (size - strokeWidth) / 2;
	const circumference = 2 * Math.PI * radius;
	const offset = circumference * (1 - ratio);

	return (
		<div
			className="relative inline-flex items-center justify-center"
			style={{ width: size, height: size }}
		>
			<svg
				width={size}
				height={size}
				viewBox={`0 0 ${size} ${size}`}
				className="absolute inset-0 -rotate-90"
				aria-hidden="true"
			>
				<circle
					cx={size / 2}
					cy={size / 2}
					r={radius}
					fill="none"
					stroke="currentColor"
					strokeWidth={strokeWidth}
					className="text-border-primary"
				/>
				<circle
					cx={size / 2}
					cy={size / 2}
					r={radius}
					fill="none"
					stroke="url(#scoreGradient)"
					strokeWidth={strokeWidth}
					strokeLinecap="round"
					strokeDasharray={circumference}
					strokeDashoffset={offset}
					className="transition-[stroke-dashoffset] duration-700 ease-out"
				/>
				<defs>
					<linearGradient id="scoreGradient" x1="0%" y1="0%" x2="100%" y2="0%">
						<stop offset="0%" stopColor="var(--color-accent-green)" />
						<stop offset="100%" stopColor="var(--color-accent-amber)" />
					</linearGradient>
				</defs>
			</svg>

			<div className="flex flex-col items-center justify-center gap-0.5">
				<span className="font-mono text-5xl font-bold leading-none text-text-primary">
					{score}
				</span>
				<span className="font-mono text-base leading-none text-text-tertiary">
					/{maxScore}
				</span>
			</div>
		</div>
	);
}

export { ScoreRing, type ScoreRingProps };
