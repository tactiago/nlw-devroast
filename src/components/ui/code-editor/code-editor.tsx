"use client";

import {
	type KeyboardEvent,
	useCallback,
	useEffect,
	useRef,
	useState,
} from "react";
import { LanguageSelector } from "./language-selector";
import { useLanguageDetection } from "./use-language-detection";
import { useShikiHighlighter } from "./use-shiki-highlighter";

const MAX_CHARS = 2500;

type CodeEditorProps = {
	defaultValue?: string;
	onChange?: (code: string, language: string) => void;
	onOverLimit?: (overLimit: boolean) => void;
	maxChars?: number;
	minHeight?: number;
	maxHeight?: number;
};

function CodeEditor({
	defaultValue = "",
	onChange,
	onOverLimit,
	maxChars = MAX_CHARS,
	minHeight = 360,
	maxHeight = 480,
}: CodeEditorProps) {
	const [code, setCode] = useState(defaultValue);
	const [manualLanguage, setManualLanguage] = useState<string | null>(null);
	const [highlightedHtml, setHighlightedHtml] = useState("");

	const textareaRef = useRef<HTMLTextAreaElement>(null);
	const highlightRef = useRef<HTMLDivElement>(null);

	const { highlight, ready } = useShikiHighlighter();
	const { detectedLanguage, activeLanguage } = useLanguageDetection(
		code,
		manualLanguage,
	);

	useEffect(() => {
		let cancelled = false;

		highlight(code, activeLanguage).then((html) => {
			if (!cancelled) setHighlightedHtml(html);
		});

		return () => {
			cancelled = true;
		};
	}, [code, activeLanguage, highlight]);

	const overLimit = code.length > maxChars;

	useEffect(() => {
		onChange?.(code, activeLanguage);
	}, [code, activeLanguage, onChange]);

	useEffect(() => {
		onOverLimit?.(overLimit);
	}, [overLimit, onOverLimit]);

	const handleChange = useCallback(
		(e: React.ChangeEvent<HTMLTextAreaElement>) => {
			setCode(e.target.value);
		},
		[],
	);

	const handleScroll = useCallback(() => {
		const textarea = textareaRef.current;
		const highlightDiv = highlightRef.current;
		if (!textarea || !highlightDiv) return;

		highlightDiv.scrollTop = textarea.scrollTop;
		highlightDiv.scrollLeft = textarea.scrollLeft;
	}, []);

	const handleKeyDown = useCallback((e: KeyboardEvent<HTMLTextAreaElement>) => {
		const textarea = e.currentTarget;

		if (e.key === "Tab") {
			e.preventDefault();
			const { selectionStart, selectionEnd, value } = textarea;

			if (e.shiftKey) {
				const lineStart = value.lastIndexOf("\n", selectionStart - 1) + 1;
				const line = value.substring(lineStart, selectionEnd);

				if (line.startsWith("  ")) {
					const newValue = value.substring(0, lineStart) + line.substring(2);
					setCode(newValue);
					requestAnimationFrame(() => {
						textarea.selectionStart = Math.max(selectionStart - 2, lineStart);
						textarea.selectionEnd = Math.max(selectionEnd - 2, lineStart);
					});
				}
			} else {
				const newValue =
					value.substring(0, selectionStart) +
					"  " +
					value.substring(selectionEnd);
				setCode(newValue);
				requestAnimationFrame(() => {
					textarea.selectionStart = selectionStart + 2;
					textarea.selectionEnd = selectionStart + 2;
				});
			}
		}
	}, []);

	const lineCount = code.split("\n").length;

	return (
		<div className="w-full overflow-hidden rounded-lg border border-border-primary bg-bg-input">
			<div className="flex h-10 items-center gap-2 border-b border-border-primary px-4">
				<div className="flex items-center gap-2">
					<span className="size-3 rounded-full bg-accent-red" />
					<span className="size-3 rounded-full bg-accent-amber" />
					<span className="size-3 rounded-full bg-accent-green" />
				</div>
				<div className="flex-1" />
				<LanguageSelector
					value={manualLanguage}
					detectedLanguage={detectedLanguage}
					onValueChange={setManualLanguage}
				/>
			</div>

			<div className="flex overflow-y-auto" style={{ minHeight, maxHeight }}>
				<div className="flex w-12 shrink-0 flex-col items-end border-r border-border-primary bg-bg-surface px-3 py-4">
					{Array.from({ length: lineCount }, (_, i) => {
						const lineNum = String(i + 1);
						return (
							<span
								key={lineNum}
								className="font-mono text-xs leading-[1.65] text-text-tertiary"
							>
								{lineNum}
							</span>
						);
					})}
				</div>

				<div className="grid flex-1 grid-cols-1 grid-rows-1">
					<div
						ref={highlightRef}
						aria-hidden
						className="pointer-events-none col-start-1 row-start-1 p-4 font-mono text-xs leading-[1.65] [&_code]:!bg-transparent [&_pre]:!bg-transparent [&_pre]:!m-0 [&_pre]:!p-0"
						dangerouslySetInnerHTML={{
							__html: ready ? highlightedHtml : escapeHtml(code),
						}}
					/>
					<textarea
						ref={textareaRef}
						value={code}
						onChange={handleChange}
						onScroll={handleScroll}
						onKeyDown={handleKeyDown}
						spellCheck={false}
						autoCapitalize="off"
						autoComplete="off"
						autoCorrect="off"
						className="z-10 col-start-1 row-start-1 resize-none bg-transparent p-4 font-mono text-xs leading-[1.65] text-transparent caret-text-primary outline-none"
						style={{ WebkitTextFillColor: "transparent" }}
					/>
				</div>
			</div>

			<div className="flex items-center justify-end border-t border-border-primary px-4 py-1.5">
				<span
					className={`font-mono text-xs ${overLimit ? "text-accent-red" : "text-text-tertiary"}`}
				>
					{code.length}/{maxChars}
				</span>
			</div>
		</div>
	);
}

function escapeHtml(text: string) {
	return `<pre><code>${text.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;")}</code></pre>`;
}

export { CodeEditor, type CodeEditorProps };
