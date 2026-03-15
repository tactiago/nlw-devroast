import { asc, eq } from "drizzle-orm";
import { z } from "zod";
import { issues, submissions } from "@/db/schema";
import { generateRoast } from "@/lib/ai/roast";
import { baseProcedure, createTRPCRouter } from "../init";

const MAX_CODE_LENGTH = 2500;

const createInputSchema = z.object({
	code: z
		.string()
		.min(1, "Code cannot be empty")
		.refine(
			(s) => s.trim().length <= MAX_CODE_LENGTH,
			`Code must be at most ${MAX_CODE_LENGTH} characters`,
		),
	language: z.string().min(1).max(50),
	roastMode: z.boolean(),
});

export const roastRouter = createTRPCRouter({
	create: baseProcedure
		.input(createInputSchema)
		.mutation(async ({ ctx, input }) => {
			const result = await generateRoast(
				input.code,
				input.language,
				input.roastMode,
			);

			const lineCount = input.code.split("\n").length;
			const diffJson = JSON.stringify(result.diff);

			const [submission] = await ctx.db
				.insert(submissions)
				.values({
					code: input.code,
					language: input.language,
					lineCount,
					roastMode: input.roastMode,
					score: String(result.score),
					roastQuote: result.roastQuote,
					verdict: result.verdict,
					suggestedFix: diffJson,
				})
				.returning({ id: submissions.id });

			if (!submission) {
				throw new Error("Failed to create submission");
			}

			await ctx.db.insert(issues).values(
				result.issues.map((issue, i) => ({
					submissionId: submission.id,
					severity: issue.severity,
					title: issue.title,
					description: issue.description,
					position: i,
				})),
			);

			return { id: submission.id };
		}),

	getById: baseProcedure
		.input(z.object({ id: z.string().uuid() }))
		.query(async ({ ctx, input }) => {
			const [submission] = await ctx.db
				.select()
				.from(submissions)
				.where(eq(submissions.id, input.id));

			if (!submission) return null;

			const issuesRows = await ctx.db
				.select()
				.from(issues)
				.where(eq(issues.submissionId, input.id))
				.orderBy(asc(issues.position));

			let diff: {
				filename: string;
				lines: { variant: string; code: string }[];
			} = {
				filename: "your_code.ts → improved_code.ts",
				lines: [],
			};
			if (submission.suggestedFix) {
				try {
					diff = JSON.parse(submission.suggestedFix) as typeof diff;
				} catch {
					// fallback to empty diff
				}
			}

			return {
				id: submission.id,
				code: submission.code,
				language: submission.language,
				lineCount: submission.lineCount,
				score: Number(submission.score),
				roastQuote: submission.roastQuote,
				verdict: submission.verdict,
				issues: issuesRows.map((i) => ({
					position: i.position,
					severity: i.severity,
					title: i.title,
					description: i.description,
				})),
				diff: {
					filename: diff.filename,
					lines: diff.lines.map((l) => ({
						variant: l.variant as "context" | "added" | "removed",
						code: l.code,
					})),
				},
			};
		}),
});

export type RoastRouter = typeof roastRouter;
