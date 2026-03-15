import { avg, count } from "drizzle-orm";
import { submissions } from "@/db/schema";
import { baseProcedure, createTRPCRouter } from "../init";

export const metricsRouter = createTRPCRouter({
	get: baseProcedure.query(async ({ ctx }) => {
		const [row] = await ctx.db
			.select({
				count: count(),
				avgScore: avg(submissions.score),
			})
			.from(submissions);

		return {
			roastedCount: row?.count ?? 0,
			avgScore: row?.avgScore ? Number.parseFloat(row.avgScore) : 0,
		};
	}),
});

export type MetricsRouter = typeof metricsRouter;
