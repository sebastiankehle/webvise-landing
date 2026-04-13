import Image from "next/image";
import { ArrowUpRight } from "lucide-react";
import { getTranslations } from "next-intl/server";

import { Link } from "@/i18n/navigation";

export default async function FounderCard() {
	const t = await getTranslations("founderCard");

	return (
		<div className="flex items-start gap-5 border border-border/40 p-6 md:p-8">
			<Image
				src="/images/founder.jpeg"
				alt="Sebastian Kehle"
				width={64}
				height={64}
				className="h-16 w-16 shrink-0 object-cover"
				quality={80}
			/>
			<div className="min-w-0">
				<div className="flex items-center gap-3">
					<h3 className="font-display text-lg tracking-[-0.04em]">
						{t("name")}
					</h3>
					<span className="font-mono text-brand text-xs">{t("role")}</span>
				</div>
				<p className="mt-1 text-muted-foreground text-sm leading-relaxed">
					{t("description")}
				</p>
				<div className="mt-3 flex items-center gap-4">
					<Link
						href="/about"
						className="group inline-flex items-center gap-1.5 font-mono text-brand text-xs transition-opacity hover:opacity-80"
					>
						{t("link")}
						<ArrowUpRight className="h-3 w-3 transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
					</Link>
					<a
						href="https://linkedin.com/in/sebastiankehle"
						target="_blank"
						rel="noopener noreferrer"
						className="font-mono text-muted-foreground text-xs transition-colors hover:text-foreground"
					>
						LinkedIn
					</a>
				</div>
			</div>
		</div>
	);
}
