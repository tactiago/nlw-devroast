import { createGoogleGenerativeAI } from "@ai-sdk/google";
import { generateText, Output } from "ai";
import { z } from "zod";

const google = createGoogleGenerativeAI({
	apiKey: process.env.GEMINI_API_KEY,
});

const roastOutputSchema = z.object({
	score: z.number().min(0).max(10).describe("Score from 0 to 10"),
	roastQuote: z
		.string()
		.describe("One sarcastic or honest quote summarizing the code quality"),
	verdict: z
		.enum([
			"needs_serious_help",
			"below_average",
			"average",
			"above_average",
			"impressive",
			"legendary",
		])
		.describe("Overall verdict category"),
	issues: z.array(
		z.object({
			severity: z.enum(["critical", "warning", "good"]),
			title: z.string().describe("Short issue title"),
			description: z.string().describe("Detailed explanation"),
		}),
	),
	diff: z.object({
		filename: z
			.string()
			.describe("Diff header like 'your_code.ts → improved_code.ts'"),
		lines: z.array(
			z.object({
				variant: z.enum(["context", "added", "removed"]),
				code: z.string(),
			}),
		),
	}),
});

export type RoastOutput = z.infer<typeof roastOutputSchema>;

const ROAST_MODE_SYSTEM = `You are a code reviewer. Be honest and constructive. Point out issues clearly but professionally. 
Identify: bugs, bad practices, style issues, missing error handling, performance problems.
Also highlight what the code does well.
Return a structured JSON object matching the schema.`;

const ROAST_MODE_SARCASM = `You are a brutally sarcastic code reviewer. Maximum roast mode.
Use humor, exaggerated criticism, and witty burns. Be savage but still technically accurate.
Identify: bugs, bad practices, style issues, missing error handling, performance problems.
Also sarcastically acknowledge anything decent.
Return a structured JSON object matching the schema.`;

export async function generateRoast(
	code: string,
	language: string,
	roastMode: boolean,
): Promise<RoastOutput> {
	const systemPrompt = roastMode ? ROAST_MODE_SARCASM : ROAST_MODE_SYSTEM;

	const { output } = await generateText({
		model: google("gemini-2.5-flash"),
		system: systemPrompt,
		prompt: `Analyze this ${language} code:

\`\`\`${language}
${code}
\`\`\`

Return the analysis as a structured object with: score (0-10), roastQuote (one punchy quote), verdict, issues (array of severity/title/description), and diff (filename + lines with variant: context|added|removed).`,
		output: Output.object({
			name: "RoastAnalysis",
			description: "Code review analysis with score, verdict, issues, and diff",
			schema: roastOutputSchema,
		}),
	});

	return output as RoastOutput;
}
