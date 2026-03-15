"use client";

import { Select } from "@base-ui/react/select";
import { ChevronDown } from "lucide-react";
import {
	isSupportedLanguage,
	LANGUAGES,
	type SupportedLanguage,
} from "./languages";

type LanguageSelectorProps = {
	value: string | null;
	detectedLanguage: string;
	onValueChange: (value: string | null) => void;
};

const AUTO_DETECT_VALUE = "__auto__";

function getDisplayLabel(value: string | null, detectedLanguage: string) {
	if (!value) {
		const lang = isSupportedLanguage(detectedLanguage)
			? LANGUAGES[detectedLanguage].name
			: detectedLanguage;
		return `auto-detect · ${lang}`;
	}

	if (isSupportedLanguage(value)) {
		return LANGUAGES[value].name;
	}

	return value;
}

function LanguageSelector({
	value,
	detectedLanguage,
	onValueChange,
}: LanguageSelectorProps) {
	const displayLabel = getDisplayLabel(value, detectedLanguage);

	return (
		<Select.Root
			value={value ?? AUTO_DETECT_VALUE}
			onValueChange={(val) =>
				onValueChange(val === AUTO_DETECT_VALUE ? null : val)
			}
		>
			<Select.Trigger className="flex cursor-pointer items-center gap-1.5 rounded-md px-2 py-1 font-mono text-xs text-text-tertiary transition-colors hover:bg-bg-elevated hover:text-text-secondary">
				<span>{displayLabel}</span>
				<ChevronDown size={12} />
			</Select.Trigger>

			<Select.Portal>
				<Select.Positioner
					side="bottom"
					align="end"
					sideOffset={4}
					className="z-50"
				>
					<Select.Popup className="max-h-60 overflow-y-auto rounded-lg border border-border-primary bg-bg-surface p-1 shadow-xl">
						<Select.Item
							value={AUTO_DETECT_VALUE}
							className="flex cursor-pointer items-center rounded-md px-3 py-1.5 font-mono text-xs text-text-secondary outline-none data-[highlighted]:bg-bg-elevated data-[highlighted]:text-text-primary data-[selected]:text-accent-green"
						>
							<Select.ItemText>
								auto-detect ·{" "}
								{isSupportedLanguage(detectedLanguage)
									? LANGUAGES[detectedLanguage].name
									: detectedLanguage}
							</Select.ItemText>
						</Select.Item>

						<div className="my-1 h-px bg-border-primary" />

						{(
							Object.entries(LANGUAGES) as [
								SupportedLanguage,
								(typeof LANGUAGES)[SupportedLanguage],
							][]
						).map(([key, lang]) => (
							<Select.Item
								key={key}
								value={key}
								className="flex cursor-pointer items-center rounded-md px-3 py-1.5 font-mono text-xs text-text-secondary outline-none data-[highlighted]:bg-bg-elevated data-[highlighted]:text-text-primary data-[selected]:text-accent-green"
							>
								<Select.ItemText>{lang.name}</Select.ItemText>
							</Select.Item>
						))}
					</Select.Popup>
				</Select.Positioner>
			</Select.Portal>
		</Select.Root>
	);
}

export { LanguageSelector, type LanguageSelectorProps };
