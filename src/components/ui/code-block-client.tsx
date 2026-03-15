"use client";

import { useEffect, useState } from "react";
import { useShikiHighlighter } from "@/components/ui/code-editor/use-shiki-highlighter";

type CodeBlockClientProps = {
	code: string;
	language?: string;
	className?: string;
};

export function CodeBlockClient({
	code,
	language = "typescript",
	className,
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

	if (!ready && !html) {
		return (
			<div className={`flex w-full min-w-0 ${className ?? ""}`}>
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
				<pre className="flex-1 overflow-x-auto p-3 text-left font-mono text-[13px] leading-[1.6] text-text-primary">
					{code}
				</pre>
			</div>
		);
	}

	return (
		<div className={`flex w-full min-w-0 ${className ?? ""}`}>
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
				className="flex-1 overflow-x-auto p-3 text-left font-mono text-[13px] leading-[1.6] [&_pre]:!bg-transparent [&_pre]:!text-left [&_code]:!bg-transparent [&_code]:!text-left"
				dangerouslySetInnerHTML={{ __html: html || "" }}
			/>
		</div>
	);
}
