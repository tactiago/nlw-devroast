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

export function prefetch(queryOptions: { queryKey: unknown[] }): void {
	const queryClient = getQueryClient();
	const key = queryOptions.queryKey[1] as { type?: string } | undefined;
	if (key?.type === "infinite") {
		void queryClient.prefetchInfiniteQuery(queryOptions as never);
	} else {
		void queryClient.prefetchQuery(queryOptions as never);
	}
}

export const caller = appRouter.createCaller(createTRPCContext);
