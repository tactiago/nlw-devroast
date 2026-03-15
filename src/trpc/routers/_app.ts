import { createTRPCRouter } from "../init";
import { metricsRouter } from "./metrics";
import { submissionRouter } from "./submission";

export const appRouter = createTRPCRouter({
	metrics: metricsRouter,
	submission: submissionRouter,
});

export type AppRouter = typeof appRouter;
