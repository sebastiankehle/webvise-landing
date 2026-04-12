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
					<h3 className="font-display text-[16px] leading-[21px] tracking-[-0.011em]">
						{t("name")}
					</h3>
					<span className="font-[510] text-brand text-xs tracking-[-0.011em]">{t("role")}</span>
				</div>
				<p className="mt-1 text-muted-foreground text-sm leading-[1.5]">
					{t("description")}
				</p>
				<div className="mt-3 flex items-center gap-4">
					<Link
						href="/about"
						className="group inline-flex items-center gap-1.5 text-brand text-xs tracking-[-0.011em] transition-opacity hover:opacity-80"
					>
						{t("link")}
						<ArrowUpRight className="h-3 w-3 transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
					</Link>
					<a
						href="https://linkedin.com/in/sebastiankehle"
						target="_blank"
						rel="noopener noreferrer"
						className="text-muted-foreground text-xs tracking-[-0.011em] transition-colors hover:text-foreground"
					>
						LinkedIn
					</a>
				</div>
			</div>
		</div>
	);
}
