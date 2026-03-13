"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import type { HighlighterCore } from "shiki";
import {
	ensureLanguageLoaded,
	isSupportedLanguage,
	type SupportedLanguage,
} from "./languages";

function useShikiHighlighter() {
	const highlighterRef = useRef<HighlighterCore | null>(null);
	const [ready, setReady] = useState(false);
	const loadingLangsRef = useRef<Set<string>>(new Set());

	useEffect(() => {
		let cancelled = false;

		async function init() {
			const [{ createHighlighterCore }, { createJavaScriptRegexEngine }] =
				await Promise.all([
					import("shiki/core"),
					import("shiki/engine/javascript"),
				]);

			const [vesper, javascript, typescript, python] = await Promise.all([
				import("shiki/themes/vesper.mjs"),
				import("shiki/langs/javascript.mjs"),
				import("shiki/langs/typescript.mjs"),
				import("shiki/langs/python.mjs"),
			]);

			if (cancelled) return;

			const highlighter = await createHighlighterCore({
				engine: createJavaScriptRegexEngine(),
				themes: [vesper],
				langs: [javascript, typescript, python],
			});

			if (cancelled) return;

			highlighterRef.current = highlighter;
			setReady(true);
		}

		init();
		return () => {
			cancelled = true;
		};
	}, []);

	const highlight = useCallback(
		async (code: string, lang: string): Promise<string> => {
			const highlighter = highlighterRef.current;
			if (!highlighter) {
				return escapeHtml(code);
			}

			const resolvedLang = isSupportedLanguage(lang) ? lang : "javascript";

			if (!loadingLangsRef.current.has(resolvedLang)) {
				loadingLangsRef.current.add(resolvedLang);
				try {
					await ensureLanguageLoaded(
						highlighter,
						resolvedLang as SupportedLanguage,
					);
				} catch {
					return escapeHtml(code);
				}
			}

			try {
				return highlighter.codeToHtml(code, {
					lang: resolvedLang,
					theme: "vesper",
				});
			} catch {
				return escapeHtml(code);
			}
		},
		[],
	);

	return { highlight, ready };
}

function escapeHtml(text: string) {
	return `<pre><code>${text.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;")}</code></pre>`;
}

export { useShikiHighlighter };
