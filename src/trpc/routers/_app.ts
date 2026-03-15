import { createTRPCRouter } from "../init";
import { metricsRouter } from "./metrics";
import { roastRouter } from "./roast";
import { submissionRouter } from "./submission";

export const appRouter = createTRPCRouter({
	metrics: metricsRouter,
	roast: roastRouter,
	submission: submissionRouter,
});

export type AppRouter = typeof appRouter;
