import { fetchRequestHandler } from "@trpc/server/adapters/fetch";
import { createContext } from "@webvise-app/api/context";
import { appRouter } from "@webvise-app/api/routers/index";
import type { NextRequest } from "next/server";

function handler(req: NextRequest) {
	return fetchRequestHandler({
		endpoint: "/api/trpc",
		req,
		router: appRouter,
		createContext: () => createContext(req),
		onError({ error, path }) {
			if (error.code === "INTERNAL_SERVER_ERROR") {
				console.error(
					`[trpc] ${path ?? "<no path>"} failed:`,
					error.cause ?? error
				);
			}
		},
	});
}

export { handler as GET, handler as POST };
