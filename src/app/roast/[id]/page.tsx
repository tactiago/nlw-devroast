import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { CodeBlock } from "@/components/ui/code-block";
import { DiffBlock } from "@/components/ui/diff-block";
import { IssueCard } from "@/components/ui/issue-card";
import { ScoreRing } from "@/components/ui/score-ring";
import { caller } from "@/trpc/server";

type Props = {
	params: Promise<{ id: string }>;
};

export async function generateMetadata({ params }: Props): Promise<Metadata> {
	const { id } = await params;
	const roast = await caller.roast.getById({ id });

	if (!roast) {
		return {
			title: "Roast Results | Dev Roast",
		};
	}

	const description =
		roast.roastQuote.length > 120
			? `${roast.roastQuote.slice(0, 117)}...`
			: roast.roastQuote;

	const baseUrl = process.env.VERCEL_URL
		? `https://${process.env.VERCEL_URL}`
		: (process.env.NEXT_PUBLIC_APP_URL ?? "http://localhost:3000");

	return {
		title: "Roast Results | Dev Roast",
		description,
		openGraph: {
			title: "Roast Results | Dev Roast",
			description,
			images: [
				{
					url: `${baseUrl}/api/og/roast/${id}`,
					width: 1200,
					height: 630,
					alt: `Roast score: ${roast.score}/10 - ${roast.verdict}`,
				},
			],
		},
		twitter: {
			card: "summary_large_image",
			title: "Roast Results | Dev Roast",
			description,
			images: [`${baseUrl}/api/og/roast/${id}`],
		},
	};
}

function SectionTitle({ children }: { children: React.ReactNode }) {
	return (
		<div className="flex items-center gap-2">
			<span className="font-mono text-sm font-bold text-accent-green">
				{"//"}
			</span>
			<span className="font-mono text-sm font-bold text-text-primary">
				{children}
			</span>
		</div>
	);
}

export default async function RoastResultPage({
	params,
}: {
	params: Promise<{ id: string }>;
}) {
	const { id } = await params;

	const roast = await caller.roast.getById({ id });

	if (!roast) {
		notFound();
	}

	return (
		<div className="mx-auto flex w-full max-w-5xl flex-col gap-10 px-10 py-10">
			{/* Score Hero */}
			<section className="flex items-center gap-12">
				<ScoreRing score={roast.score} />

				<div className="flex flex-col gap-4">
					<div className="flex items-center gap-2">
						<span className="size-2 rounded-full bg-accent-red" />
						<span className="font-mono text-[13px] font-medium text-accent-red">
							verdict: {roast.verdict}
						</span>
					</div>

					<p className="font-mono text-xl leading-relaxed text-text-primary">
						{roast.roastQuote}
					</p>

					<div className="flex items-center gap-4 font-mono text-xs text-text-tertiary">
						<span>lang: {roast.language}</span>
						<span>·</span>
						<span>{roast.lineCount} lines</span>
					</div>
				</div>
			</section>

			<hr className="border-border-primary" />

			{/* Submitted Code */}
			<section className="flex flex-col gap-4">
				<SectionTitle>your_submission</SectionTitle>
				<div className="overflow-hidden border border-border-primary bg-bg-input">
					<CodeBlock code={roast.code} language={roast.language} />
				</div>
			</section>

			<hr className="border-border-primary" />

			{/* Detailed Analysis */}
			<section className="flex flex-col gap-6">
				<SectionTitle>detailed_analysis</SectionTitle>
				<div className="grid grid-cols-2 gap-5">
					{roast.issues.map((issue) => (
						<IssueCard
							key={issue.position}
							severity={issue.severity}
							title={issue.title}
							description={issue.description}
						/>
					))}
				</div>
			</section>

			<hr className="border-border-primary" />

			{/* Suggested Fix */}
			<section className="flex flex-col gap-6">
				<SectionTitle>suggested_fix</SectionTitle>
				<DiffBlock filename={roast.diff.filename} lines={roast.diff.lines} />
			</section>
		</div>
	);
}
