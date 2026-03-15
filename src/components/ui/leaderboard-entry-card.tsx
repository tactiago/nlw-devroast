import { codeToHtml } from "shiki";

type LeaderboardEntryCardProps = {
	rank: number;
	score: number;
	language: string;
	code: string;
};

async function LeaderboardEntryCard({
	rank,
	score,
	language,
	code,
}: LeaderboardEntryCardProps) {
	const trimmedCode = code.trim();
	const lineCount = trimmedCode.split("\n").length;
	const lineNumbers = Array.from({ length: lineCount }, (_, i) =>
		String(i + 1),
	);

	const html = await codeToHtml(trimmedCode, {
		lang: language,
		theme: "vesper",
	});

	return (
		<div className="overflow-hidden border border-border-primary">
			<div className="flex h-12 items-center justify-between border-b border-border-primary px-5">
				<div className="flex items-center gap-4">
					<div className="flex items-center gap-1.5">
						<span className="font-mono text-xs text-text-tertiary">#</span>
						<span className="font-mono text-sm font-bold text-accent-amber">
							{rank}
						</span>
					</div>
					<div className="flex items-center gap-1.5">
						<span className="font-mono text-xs text-text-tertiary">score:</span>
						<span className="font-mono text-sm font-bold text-accent-red">
							{score}
						</span>
					</div>
				</div>
				<div className="flex items-center gap-3">
					<span className="font-mono text-xs text-text-secondary">
						{language}
					</span>
					<span className="font-mono text-xs text-text-tertiary">
						{lineCount} {lineCount === 1 ? "line" : "lines"}
					</span>
				</div>
			</div>

			<div className="flex h-[120px] overflow-hidden border border-border-primary bg-bg-input">
				<div className="flex w-10 flex-col items-end gap-1.5 border-r border-border-primary bg-bg-surface px-2.5 py-3.5">
					{lineNumbers.map((num) => (
						<span
							key={num}
							className="font-mono text-xs leading-none text-text-tertiary"
						>
							{num}
						</span>
					))}
				</div>

				<div
					className="flex-1 overflow-hidden px-4 py-3.5 font-mono text-xs leading-relaxed [&_pre]:bg-transparent! [&_code]:bg-transparent!"
					dangerouslySetInnerHTML={{ __html: html }}
				/>
			</div>
		</div>
	);
}

export { LeaderboardEntryCard, type LeaderboardEntryCardProps };
