import { initTRPC } from "@trpc/server";
import type { NodePgDatabase } from "drizzle-orm/node-postgres";
import { cache } from "react";
import { db } from "@/db";

export const createTRPCContext = cache(async () => {
	return { db };
});

const t = initTRPC
	.context<{
		db: NodePgDatabase;
	}>()
	.create();

export const createTRPCRouter = t.router;
export const createCallerFactory = t.createCallerFactory;
export const baseProcedure = t.procedure;
