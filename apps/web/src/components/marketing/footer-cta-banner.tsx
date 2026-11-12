import Image from "next/image";

import { ActionLink } from "@/components/marketing/action";
import { H2 } from "@/components/ui/typography";

interface FooterCtaBannerProps {
	buttonText: string;
	/** Screens of real projects, laid out as the picture behind the message. */
	covers?: string[];
	headline: string;
	subtext: string;
}

/** The shared close of every inner page: one sentence, one action, set on a
 * wall of the studio's own project screens. */
export default function FooterCtaBanner({
	headline,
	subtext,
	buttonText,
	covers = [],
}: FooterCtaBannerProps) {
	return (
		<div className="border-border border-b">
			<div className="mx-auto max-w-[1320px] px-6 py-14 md:py-20">
				<div className="relative isolate overflow-hidden rounded-[24px] bg-[#0b0f14] px-6 py-20 text-center shadow-[0_0_0_1px_rgba(255,255,255,0.08)] md:py-28">
					{covers.length > 0 && (
						<div
							aria-hidden="true"
							className="pointer-events-none absolute -inset-x-[12%] -inset-y-[40%] -z-10 grid -rotate-6 grid-cols-3 content-center gap-4 opacity-45"
						>
							{covers.map((cover) => (
								<span
									className="relative aspect-[16/10] overflow-hidden rounded-[14px]"
									key={cover}
								>
									<Image
										alt=""
										className="object-cover object-top"
										fill
										sizes="(min-width: 768px) 34vw, 50vw"
										src={cover}
									/>
								</span>
							))}
						</div>
					)}
					{/* Darkens the wall towards the middle so the words stay readable */}
					<div
						aria-hidden="true"
						className="absolute inset-0 -z-10 bg-[radial-gradient(ellipse_at_center,rgba(11,15,20,0.9)_0%,rgba(11,15,20,0.78)_45%,rgba(11,15,20,0.55)_100%)]"
					/>
					<H2 className="mx-auto max-w-[20ch] text-white">{headline}</H2>
					<p className="mx-auto mt-4 max-w-[46ch] text-lg text-white/75 leading-[1.6]">
						{subtext}
					</p>
					<ActionLink arrow className="mt-9" href="/book" location="footer">
						{buttonText}
					</ActionLink>
				</div>
			</div>
		</div>
	);
}
