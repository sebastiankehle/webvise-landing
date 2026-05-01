import { protectedProcedure, publicProcedure, router } from "../index";
import { contactRouter } from "./contact";
import { newsletterRouter } from "./newsletter";
import { reportDownloadRouter } from "./report-download";
import { todoRouter } from "./todo";
import { wpHealthRouter } from "./wp-health";

export const appRouter = router({
	healthCheck: publicProcedure.query(() => "OK"),
	privateData: protectedProcedure.query(({ ctx }) => ({
		message: "This is private",
		user: ctx.session.user,
	})),
	todo: todoRouter,
	contact: contactRouter,
	newsletter: newsletterRouter,
	reportDownload: reportDownloadRouter,
	wpHealth: wpHealthRouter,
});
export type AppRouter = typeof appRouter;
