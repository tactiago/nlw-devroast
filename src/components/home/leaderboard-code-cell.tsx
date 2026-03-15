"use client";

import { Collapsible } from "@base-ui/react/collapsible";
import { ChevronDown, ChevronUp } from "lucide-react";
import { CodeBlockClient } from "@/components/ui/code-block-client";

type LeaderboardCodeCellProps = {
	code: string;
	language: string;
};

export function LeaderboardCodeCell({ code, language }: LeaderboardCodeCellProps) {
	return (
		<Collapsible.Root defaultOpen={false} className="min-w-0 flex-1">
			<Collapsible.Trigger
				className="group flex w-full cursor-pointer flex-col gap-1 text-left outline-none"
				nativeButton
			>
				<div className="max-h-[120px] overflow-hidden rounded border border-border-primary bg-bg-input group-data-panel-open:hidden">
					<CodeBlockClient code={code} language={language} />
				</div>
				<span className="flex items-center gap-1 font-mono text-xs text-text-tertiary group-data-panel-open:hidden">
					expand
					<ChevronDown className="size-3" />
				</span>
				<span className="hidden items-center gap-1 font-mono text-xs text-text-tertiary group-data-panel-open:flex">
					collapse
					<ChevronUp className="size-3" />
				</span>
			</Collapsible.Trigger>
			<Collapsible.Panel
				className="overflow-hidden rounded border border-border-primary bg-bg-input"
				keepMounted
			>
				<CodeBlockClient code={code} language={language} />
			</Collapsible.Panel>
		</Collapsible.Root>
	);
}
