"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { isSupportedLanguage, SUPPORTED_LANGUAGE_KEYS } from "./languages";

type HljsApi = {
	highlightAuto: (
		code: string,
		languageSubset?: string[],
	) => { language?: string };
};

function useLanguageDetection(code: string, manualLanguage: string | null) {
	const [detectedLanguage, setDetectedLanguage] = useState("javascript");
	const hljsRef = useRef<HljsApi | null>(null);
	const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

	useEffect(() => {
		async function loadHljs() {
			const hljs = await import("highlight.js/lib/core");

			const langModules = await Promise.all([
				import("highlight.js/lib/languages/javascript"),
				import("highlight.js/lib/languages/typescript"),
				import("highlight.js/lib/languages/python"),
				import("highlight.js/lib/languages/java"),
				import("highlight.js/lib/languages/go"),
				import("highlight.js/lib/languages/rust"),
				import("highlight.js/lib/languages/c"),
				import("highlight.js/lib/languages/cpp"),
				import("highlight.js/lib/languages/ruby"),
				import("highlight.js/lib/languages/php"),
				import("highlight.js/lib/languages/sql"),
				import("highlight.js/lib/languages/xml"),
				import("highlight.js/lib/languages/css"),
				import("highlight.js/lib/languages/bash"),
				import("highlight.js/lib/languages/json"),
			]);

			const langNames = [
				"javascript",
				"typescript",
				"python",
				"java",
				"go",
				"rust",
				"c",
				"cpp",
				"ruby",
				"php",
				"sql",
				"html",
				"css",
				"bash",
				"json",
			];

			for (let i = 0; i < langNames.length; i++) {
				hljs.default.registerLanguage(langNames[i], langModules[i].default);
			}

			hljsRef.current = hljs.default;
		}

		loadHljs();
	}, []);

	const detect = useCallback(
		(input: string) => {
			if (manualLanguage || !hljsRef.current) return;

			if (timerRef.current) clearTimeout(timerRef.current);

			timerRef.current = setTimeout(() => {
				const hljs = hljsRef.current;
				if (!hljs || !input.trim()) return;

				const result = hljs.highlightAuto(input, [...SUPPORTED_LANGUAGE_KEYS]);

				if (result.language && isSupportedLanguage(result.language)) {
					setDetectedLanguage(result.language);
				}
			}, 300);
		},
		[manualLanguage],
	);

	useEffect(() => {
		detect(code);
	}, [code, detect]);

	useEffect(() => {
		return () => {
			if (timerRef.current) clearTimeout(timerRef.current);
		};
	}, []);

	const activeLanguage = manualLanguage ?? detectedLanguage;

	return { detectedLanguage, activeLanguage };
}

export { useLanguageDetection };
