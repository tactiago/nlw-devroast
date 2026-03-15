import "server-only";
import { dehydrate, HydrationBoundary } from "@tanstack/react-query";
import { createTRPCOptionsProxy } from "@trpc/tanstack-react-query";
import { cache } from "react";
import { createTRPCContext } from "./init";
import { makeQueryClient } from "./query-client";
import type { AppRouter } from "./routers/_app";
import { appRouter } from "./routers/_app";

export const getQueryClient = cache(makeQueryClient);

export const trpc = createTRPCOptionsProxy<AppRouter>({
	ctx: createTRPCContext,
	router: appRouter,
	queryClient: getQueryClient,
});

export function HydrateClient(props: { children: React.ReactNode }) {
	const queryClient = getQueryClient();
	return (
		<HydrationBoundary state={dehydrate(queryClient)}>
			{props.children}
		</HydrationBoundary>
	);
}

function prefetchOne(queryOptions: { queryKey: unknown[] }): Promise<void> {
	const queryClient = getQueryClient();
	const key = queryOptions.queryKey[1] as { type?: string } | undefined;
	if (key?.type === "infinite") {
		return queryClient.prefetchInfiniteQuery(queryOptions as never);
	}
	return queryClient.prefetchQuery(queryOptions as never);
}

export function prefetch(queryOptions: { queryKey: unknown[] }): void {
	void prefetchOne(queryOptions);
}

export function prefetchAll(
	queryOptionsList: Array<{ queryKey: unknown[] }>,
): Promise<void[]> {
	return Promise.all(queryOptionsList.map((opts) => prefetchOne(opts)));
}

export const caller = appRouter.createCaller(createTRPCContext);
