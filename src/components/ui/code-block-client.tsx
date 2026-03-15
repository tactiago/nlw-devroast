"use client";

import { useEffect, useState } from "react";
import { useShikiHighlighter } from "@/components/ui/code-editor/use-shiki-highlighter";

type CodeBlockClientProps = {
	code: string;
	language?: string;
	className?: string;
	variant?: "default" | "leaderboard";
};

export function CodeBlockClient({
	code,
	language = "typescript",
	className,
	variant = "default",
}: CodeBlockClientProps) {
	const { highlight, ready } = useShikiHighlighter();
	const [html, setHtml] = useState("");

	useEffect(() => {
		let cancelled = false;
		highlight(code.trim(), language).then((result) => {
			if (!cancelled) setHtml(result);
		});
		return () => {
			cancelled = true;
		};
	}, [code, language, highlight, ready]);

	const lineCount = code.trim().split("\n").length;
	const lineNumbers = Array.from({ length: lineCount }, (_, i) =>
		String(i + 1),
	);

	const isLeaderboard = variant === "leaderboard";
	const lineNumbersCn = isLeaderboard
		? "flex w-10 flex-col items-end gap-1.5 border-r border-border-primary bg-bg-surface px-2.5 py-3.5"
		: "flex flex-col border-r border-border-primary bg-bg-surface px-2.5 py-3";
	const lineNumCn = isLeaderboard
		? "font-mono text-xs leading-none text-text-tertiary"
		: "text-right font-mono text-[13px] leading-[1.6] text-text-tertiary";
	const codeCn = isLeaderboard
		? "flex-1 overflow-x-auto px-4 py-3.5 text-left font-mono text-xs leading-relaxed"
		: "flex-1 overflow-x-auto p-3 text-left font-mono text-[13px] leading-[1.6]";
	const codeHighlightCn = isLeaderboard
		? "flex-1 overflow-x-auto px-4 py-3.5 text-left font-mono text-xs leading-relaxed [&_pre]:!bg-transparent [&_pre]:!text-left [&_code]:!bg-transparent [&_code]:!text-left"
		: "flex-1 overflow-x-auto p-3 text-left font-mono text-[13px] leading-[1.6] [&_pre]:!bg-transparent [&_pre]:!text-left [&_code]:!bg-transparent [&_code]:!text-left";

	if (!ready && !html) {
		return (
			<div className={`flex w-full min-w-0 ${className ?? ""}`}>
				<div className={lineNumbersCn}>
					{lineNumbers.map((num) => (
						<span key={num} className={lineNumCn}>
							{num}
						</span>
					))}
				</div>
				<pre className={`${codeCn} text-text-primary`}>{code}</pre>
			</div>
		);
	}

	return (
		<div className={`flex w-full min-w-0 ${className ?? ""}`}>
			<div className={lineNumbersCn}>
				{lineNumbers.map((num) => (
					<span key={num} className={lineNumCn}>
						{num}
					</span>
				))}
			</div>
			<div
				className={codeHighlightCn}
				dangerouslySetInnerHTML={{ __html: html || "" }}
			/>
		</div>
	);
}
