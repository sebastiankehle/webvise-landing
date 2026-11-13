import { createTRPCClient, httpBatchLink } from "@trpc/client";
import type { AppRouter } from "@webvise-app/api/routers/index";

export const trpcClient = createTRPCClient<AppRouter>({
	links: [
		httpBatchLink({
			url: "/api/trpc",
			fetch(url, options) {
				return fetch(url, {
					...options,
					credentials: "include",
				});
			},
		}),
	],
});
