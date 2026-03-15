import { ImageResponse } from "@takumi-rs/image-response";
import { caller } from "@/trpc/server";

function getScoreColor(score: number) {
	if (score <= 3) return "#ef4444";
	if (score <= 6) return "#f59e0b";
	return "#10b981";
}

function truncateQuote(quote: string, maxLen = 90) {
	if (quote.length <= maxLen) return quote;
	return `${quote.slice(0, maxLen - 3).trim()}...`;
}

export async function GET(
	_request: Request,
	{ params }: { params: Promise<{ id: string }> },
) {
	const { id } = await params;

	let roast: Awaited<ReturnType<typeof caller.roast.getById>>;
	try {
		roast = await caller.roast.getById({ id });
	} catch {
		return new Response("Bad request", { status: 400 });
	}

	if (!roast) {
		return new Response("Not found", { status: 404 });
	}

	const scoreColor = getScoreColor(roast.score);
	const quote = truncateQuote(roast.roastQuote);
	const langInfo = `lang: ${roast.language} · ${roast.lineCount} lines`;

	return new ImageResponse(
		<div
			style={{
				display: "flex",
				width: "100%",
				height: "100%",
				backgroundColor: "#0a0a0a",
				border: "1px solid #2a2a2a",
				flexDirection: "column",
				alignItems: "center",
				justifyContent: "center",
				padding: 64,
				gap: 28,
			}}
		>
			<div style={{ display: "flex", gap: 8, alignItems: "center" }}>
				<span style={{ color: "#10b981", fontSize: 24, fontWeight: 700 }}>
					{">"}
				</span>
				<span style={{ color: "#fafafa", fontSize: 20, fontWeight: 500 }}>
					devroast
				</span>
			</div>
			<div style={{ display: "flex", gap: 4, alignItems: "flex-end" }}>
				<span
					style={{
						color: scoreColor,
						fontSize: 160,
						fontWeight: 900,
						lineHeight: 1,
					}}
				>
					{roast.score}
				</span>
				<span
					style={{
						color: "#4b5563",
						fontSize: 56,
						fontWeight: 400,
						lineHeight: 1,
					}}
				>
					/10
				</span>
			</div>
			<div style={{ display: "flex", gap: 8, alignItems: "center" }}>
				<div
					style={{
						width: 12,
						height: 12,
						borderRadius: "50%",
						backgroundColor: "#ef4444",
					}}
				/>
				<span style={{ color: "#ef4444", fontSize: 20, fontWeight: 400 }}>
					{roast.verdict}
				</span>
			</div>
			<span style={{ color: "#4b5563", fontSize: 16, fontWeight: 400 }}>
				{langInfo}
			</span>
			<span
				style={{
					color: "#fafafa",
					fontSize: 22,
					fontWeight: 400,
					lineHeight: 1.5,
					textAlign: "center",
					maxWidth: "100%",
				}}
			>
				"{quote}"
			</span>
		</div>,
		{
			width: 1200,
			height: 630,
			format: "png",
			headers: {
				"Cache-Control": "public, max-age=3600, s-maxage=3600",
			},
		},
	);
}
