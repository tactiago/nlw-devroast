"use client";

import { Switch } from "@base-ui/react/switch";
import type { ComponentProps } from "react";

type ToggleProps = ComponentProps<typeof Switch.Root> & {
	label?: string;
};

function Toggle({ label, className, ...props }: ToggleProps) {
	return (
		<div className="inline-flex items-center gap-3">
			<Switch.Root
				aria-label={label}
				className="flex h-[22px] w-10 cursor-pointer items-center rounded-full bg-border-primary p-[3px] transition-colors data-[checked]:bg-accent-green"
				{...props}
			>
				<Switch.Thumb className="size-4 rounded-full bg-text-secondary transition-transform data-[checked]:translate-x-[18px] data-[checked]:bg-bg-page" />
			</Switch.Root>
			{label && (
				<span className="font-mono text-xs text-text-secondary select-none">
					{label}
				</span>
			)}
		</div>
	);
}

export { Toggle, type ToggleProps };
