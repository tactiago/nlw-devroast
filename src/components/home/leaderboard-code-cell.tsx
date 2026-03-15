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
		<Collapsible.Root defaultOpen={false} className="w-full min-w-0">
			<Collapsible.Trigger
				className="data-panel-open:hidden flex w-full cursor-pointer outline-none"
				nativeButton
			>
				<div className="relative w-full overflow-hidden border border-border-primary bg-bg-input">
					<div className="max-h-[120px] overflow-hidden">
						<CodeBlockClient
							code={code}
							language={language}
							className="w-full min-w-0"
							variant="leaderboard"
						/>
					</div>
					<div
						className="pointer-events-none absolute inset-x-0 bottom-0 h-14 bg-linear-to-t from-bg-input to-transparent"
						aria-hidden
					/>
					<div className="absolute inset-x-0 bottom-0 flex justify-center py-2">
						<span className="flex items-center gap-1.5 rounded bg-bg-input/80 px-3 py-1 font-mono text-xs text-text-tertiary backdrop-blur-sm">
							expand
							<ChevronDown className="size-3" />
						</span>
					</div>
				</div>
			</Collapsible.Trigger>
			<Collapsible.Panel
				className="overflow-hidden border border-border-primary bg-bg-input"
				keepMounted
			>
				<div className="flex w-full flex-col">
					<CodeBlockClient
						code={code}
						language={language}
						className="w-full min-w-0"
						variant="leaderboard"
					/>
					<div className="flex justify-center border-t border-border-primary py-2">
						<Collapsible.Trigger
							className="flex cursor-pointer items-center gap-1.5 font-mono text-xs text-text-tertiary outline-none transition-colors hover:text-text-secondary"
							nativeButton
						>
							collapse
							<ChevronUp className="size-3" />
						</Collapsible.Trigger>
					</div>
				</div>
			</Collapsible.Panel>
		</Collapsible.Root>
	);
}
