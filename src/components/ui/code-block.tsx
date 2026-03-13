import { codeToHtml } from "shiki";

type CodeBlockProps = {
	code: string;
	language?: string;
	filename?: string;
};

async function CodeBlock({
	code,
	language = "typescript",
	filename,
}: CodeBlockProps) {
	const html = await codeToHtml(code.trim(), {
		lang: language,
		theme: "vesper",
	});

	const lineCount = code.trim().split("\n").length;
	const lineNumbers = Array.from({ length: lineCount }, (_, i) =>
		String(i + 1),
	);

	return (
		<div className="overflow-hidden rounded-lg border border-border-primary bg-bg-input">
			<div className="flex h-10 items-center gap-3 border-b border-border-primary px-4">
				<div className="flex items-center gap-2">
					<span className="size-2.5 rounded-full bg-accent-red" />
					<span className="size-2.5 rounded-full bg-accent-amber" />
					<span className="size-2.5 rounded-full bg-accent-green" />
				</div>
				<div className="flex-1" />
				{filename && (
					<span className="font-mono text-xs text-text-tertiary">
						{filename}
					</span>
				)}
			</div>

			<div className="flex">
				<div className="flex flex-col border-r border-border-primary bg-bg-surface px-2.5 py-3">
					{lineNumbers.map((num) => (
						<span
							key={num}
							className="text-right font-mono text-[13px] leading-[1.6] text-text-tertiary"
						>
							{num}
						</span>
					))}
				</div>

				<div
					className="flex-1 overflow-x-auto p-3 font-mono text-[13px] leading-[1.6] [&_pre]:!bg-transparent [&_code]:!bg-transparent"
					dangerouslySetInnerHTML={{ __html: html }}
				/>
			</div>
		</div>
	);
}

export { CodeBlock, type CodeBlockProps };
