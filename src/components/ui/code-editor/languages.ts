import type { HighlighterCore } from "shiki";

const LANGUAGES = {
	javascript: { name: "JavaScript", aliases: ["js"] },
	typescript: { name: "TypeScript", aliases: ["ts"] },
	python: { name: "Python", aliases: ["py"] },
	java: { name: "Java", aliases: [] },
	go: { name: "Go", aliases: ["golang"] },
	rust: { name: "Rust", aliases: ["rs"] },
	c: { name: "C", aliases: [] },
	cpp: { name: "C++", aliases: [] },
	ruby: { name: "Ruby", aliases: ["rb"] },
	php: { name: "PHP", aliases: [] },
	sql: { name: "SQL", aliases: [] },
	html: { name: "HTML", aliases: [] },
	css: { name: "CSS", aliases: [] },
	bash: { name: "Bash", aliases: ["sh", "shell"] },
	json: { name: "JSON", aliases: [] },
} as const;

type SupportedLanguage = keyof typeof LANGUAGES;

const SUPPORTED_LANGUAGE_KEYS = Object.keys(LANGUAGES) as SupportedLanguage[];

const GRAMMAR_IMPORTS: Record<SupportedLanguage, () => Promise<unknown>> = {
	javascript: () => import("shiki/langs/javascript.mjs"),
	typescript: () => import("shiki/langs/typescript.mjs"),
	python: () => import("shiki/langs/python.mjs"),
	java: () => import("shiki/langs/java.mjs"),
	go: () => import("shiki/langs/go.mjs"),
	rust: () => import("shiki/langs/rust.mjs"),
	c: () => import("shiki/langs/c.mjs"),
	cpp: () => import("shiki/langs/cpp.mjs"),
	ruby: () => import("shiki/langs/ruby.mjs"),
	php: () => import("shiki/langs/php.mjs"),
	sql: () => import("shiki/langs/sql.mjs"),
	html: () => import("shiki/langs/html.mjs"),
	css: () => import("shiki/langs/css.mjs"),
	bash: () => import("shiki/langs/bash.mjs"),
	json: () => import("shiki/langs/json.mjs"),
};

function isSupportedLanguage(lang: string): lang is SupportedLanguage {
	return lang in LANGUAGES;
}

async function ensureLanguageLoaded(
	highlighter: HighlighterCore,
	lang: SupportedLanguage,
) {
	const loaded = highlighter.getLoadedLanguages();
	if (loaded.includes(lang)) return;

	const grammar = GRAMMAR_IMPORTS[lang];
	if (grammar) {
		await highlighter.loadLanguage(
			grammar as Parameters<typeof highlighter.loadLanguage>[0],
		);
	}
}

export {
	LANGUAGES,
	SUPPORTED_LANGUAGE_KEYS,
	GRAMMAR_IMPORTS,
	isSupportedLanguage,
	ensureLanguageLoaded,
	type SupportedLanguage,
};
