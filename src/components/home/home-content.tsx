"use client";

import { useMutation } from "@tanstack/react-query";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useCallback, useState } from "react";
import { Button } from "@/components/ui/button";
import { CodeEditor } from "@/components/ui/code-editor";
import { Toggle } from "@/components/ui/toggle";
import { useTRPC } from "@/trpc/client";

const placeholderCode = `function calculateTotal(items) {
  var total = 0;
  for (var i = 0; i < items.length; i++) {
    total = total + items[i].price;
  }

  if (total > 100) {
    console.log("discount applied");
    total = total * 0.9;
  }

  // TODO: handle tax calculation
  // TODO: handle currency conversion

  return total;
}`;

type HomeContentProps = {
	metrics?: React.ReactNode;
	leaderboard?: React.ReactNode;
};

export function HomeContent({ metrics, leaderboard }: HomeContentProps) {
	const router = useRouter();
	const trpc = useTRPC();
	const [code, setCode] = useState(placeholderCode);
	const [language, setLanguage] = useState("javascript");
	const [roastMode, setRoastMode] = useState(true);
	const [overLimit, setOverLimit] = useState(false);

	const roastMutation = useMutation({
		...trpc.roast.create.mutationOptions(),
		onSuccess: (data) => {
			router.push(`/roast/${data.id}`);
		},
	});

	const handleEditorChange = useCallback(
		(newCode: string, newLanguage: string) => {
			setCode(newCode);
			setLanguage(newLanguage);
		},
		[],
	);

	const handleRoast = useCallback(() => {
		roastMutation.mutate({ code, language, roastMode });
	}, [code, language, roastMode, roastMutation]);

	return (
		<div className="flex flex-col items-center gap-8 px-10 py-20">
			<div className="flex flex-col items-center gap-3">
				<h1 className="flex items-center gap-3 font-mono text-4xl font-bold">
					<span className="text-accent-green">{"$"}</span>
					<span className="text-text-primary">
						paste your code. get roasted.
					</span>
				</h1>
				<p className="font-mono text-sm text-text-secondary">
					{
						"// drop your code below and we'll rate it — brutally honest or full roast mode"
					}
				</p>
			</div>

			<div className="w-full max-w-3xl">
				<CodeEditor
					defaultValue={placeholderCode}
					onChange={handleEditorChange}
					onOverLimit={setOverLimit}
				/>
			</div>

			<div className="flex w-full max-w-3xl flex-col gap-2">
				<div className="flex items-center justify-between">
					<div className="flex items-center gap-4">
						<Toggle
							checked={roastMode}
							onCheckedChange={(checked) => setRoastMode(checked === true)}
							label="roast mode"
						/>
						<span className="font-mono text-xs text-text-tertiary">
							{"// maximum sarcasm enabled"}
						</span>
					</div>
					<Button
						variant="primary"
						size="md"
						disabled={overLimit || roastMutation.isPending}
						onClick={handleRoast}
					>
						{roastMutation.isPending ? "roasting..." : "$ roast_my_code"}
					</Button>
				</div>
				{roastMutation.error && (
					<p className="font-mono text-xs text-accent-red">
						{roastMutation.error.message}
					</p>
				)}
			</div>

			{metrics ?? (
				<div className="flex items-center gap-6 font-mono text-xs text-text-tertiary">
					<span>2,847 codes roasted</span>
					<span>·</span>
					<span>avg score: 4.2/10</span>
				</div>
			)}

			<div className="mt-8 flex w-full max-w-4xl flex-col gap-6">
				<div className="flex items-center justify-between">
					<div className="flex items-center gap-2">
						<span className="font-mono text-sm font-bold text-accent-green">
							{"//"}
						</span>
						<span className="font-mono text-sm font-bold text-text-primary">
							shame_leaderboard
						</span>
					</div>
					<Link href="/leaderboard">
						<Button variant="outline" size="sm">
							{"$ view_all >>"}
						</Button>
					</Link>
				</div>

				<p className="font-mono text-[13px] text-text-tertiary">
					{"// the worst code on the internet, ranked by shame"}
				</p>

				{leaderboard ?? (
					<p className="font-mono text-xs text-text-tertiary">
						{"// loading..."}
					</p>
				)}
			</div>
		</div>
	);
}
