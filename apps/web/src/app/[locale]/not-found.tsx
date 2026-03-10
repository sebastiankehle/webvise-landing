import { getTranslations } from "next-intl/server";

import { Button } from "@/components/ui/button";

export default async function NotFound() {
	const t = await getTranslations("notFound");

	return (
		<div className="flex min-h-screen flex-col items-center justify-center px-6">
			<p className="font-medium text-muted-foreground/50 text-sm uppercase tracking-wider">
				404
			</p>
			<h1 className="mt-4 font-normal text-4xl tracking-tight md:text-5xl">
				{t("title")}
			</h1>
			<p className="mt-4 max-w-md text-center font-light text-muted-foreground">
				{t("description")}
			</p>
			<div className="mt-8 flex gap-3">
				<Button
					// biome-ignore lint/a11y/useAnchorContent: content provided by Button children
					render={<a href="/" />}
				>
					{t("backHome")}
				</Button>
				<Button
					variant="outline"
					// biome-ignore lint/a11y/useAnchorContent: content provided by Button children
					render={<a href="/#contact" />}
				>
					{t("contact")}
				</Button>
			</div>
		</div>
	);
}
