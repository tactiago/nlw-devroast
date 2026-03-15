import { asc } from "drizzle-orm";
import { z } from "zod";
import { submissions } from "@/db/schema";
import { baseProcedure, createTRPCRouter } from "../init";

export const submissionRouter = createTRPCRouter({
	leaderboard: baseProcedure
		.input(
			z.object({ limit: z.number().min(1).max(100).optional() }).optional(),
		)
		.query(async ({ ctx, input }) => {
			const limit = input?.limit ?? 3;
			const rows = await ctx.db
				.select({
					id: submissions.id,
					code: submissions.code,
					language: submissions.language,
					score: submissions.score,
				})
				.from(submissions)
				.orderBy(asc(submissions.score))
				.limit(limit);

			return rows.map((row, i) => ({
				id: row.id,
				rank: i + 1,
				score: String(row.score),
				code: row.code,
				language: row.language,
			}));
		}),
});

export type SubmissionRouter = typeof submissionRouter;
