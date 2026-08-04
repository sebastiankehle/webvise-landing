import { publicProcedure, router } from "../index";
import { contactRouter } from "./contact";
import { newsletterRouter } from "./newsletter";
import { partnerRouter } from "./partner";
import { reportDownloadRouter } from "./report-download";
import { wpHealthRouter } from "./wp-health";

export const appRouter = router({
	healthCheck: publicProcedure.query(() => "OK"),
	contact: contactRouter,
	newsletter: newsletterRouter,
	partner: partnerRouter,
	reportDownload: reportDownloadRouter,
	wpHealth: wpHealthRouter,
});
export type AppRouter = typeof appRouter;
