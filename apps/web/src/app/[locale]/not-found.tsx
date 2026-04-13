import { getTranslations } from "next-intl/server";

import { Button } from "@/components/ui/button";
import { Link } from "@/i18n/navigation";

export default async function NotFound() {
	const t = await getTranslations("notFound");

	return (
		<div className="flex min-h-screen flex-col items-center justify-center px-6">
			<p className="font-mono text-muted-foreground/50 text-sm">
				404
			</p>
			<h1 className="mt-4 font-display text-[32px] leading-[1.05] md:text-[48px]">
				{t("title")}
			</h1>
			<p className="mt-4 max-w-md text-center font-light text-muted-foreground">
				{t("description")}
			</p>
			<div className="mt-8 flex gap-3">
				<Button
					className=""
					// biome-ignore lint/a11y/useAnchorContent: content provided by Button children
					render={<Link href="/" />}
				>
					{t("backHome")}
				</Button>
				<Button
					variant="outline"
					className=""
					// biome-ignore lint/a11y/useAnchorContent: content provided by Button children
					render={<Link href={{ pathname: "/", hash: "contact" }} />}
				>
					{t("contact")}
				</Button>
			</div>
		</div>
	);
}
