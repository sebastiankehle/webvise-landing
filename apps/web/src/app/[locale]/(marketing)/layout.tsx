import Footer from "@/components/marketing/footer";
import Navbar from "@/components/marketing/navbar";

export default function MarketingLayout({
	children,
}: {
	children: React.ReactNode;
}) {
	return (
		<>
			{/* Preloader overlay - pure CSS, content stays in DOM for SEO */}
			<div
				aria-hidden="true"
				className="preloader-overlay pointer-events-none fixed inset-0 z-[200] flex items-center justify-center bg-background"
			>
				{/* Logo assembled clockwise from polygon segments */}
				<svg
					viewBox="0 0 32 32"
					fill="none"
					xmlns="http://www.w3.org/2000/svg"
					className="h-10 w-10"
				>
					<polygon className="preloader-seg preloader-seg-1" points="16,2 8,10 16,12" fill="#f97316" style={{ ['--seg-opacity' as string]: 0.9 }} />
					<polygon className="preloader-seg preloader-seg-2" points="16,2 24,10 16,12" fill="#fb923c" style={{ ['--seg-opacity' as string]: 0.85 }} />
					<polygon className="preloader-seg preloader-seg-3" points="24,10 28,18 16,12" fill="#f97316" style={{ ['--seg-opacity' as string]: 0.75 }} />
					<polygon className="preloader-seg preloader-seg-4" points="16,12 28,18 22,26" fill="#fdba74" style={{ ['--seg-opacity' as string]: 0.85 }} />
					<polygon className="preloader-seg preloader-seg-5" points="16,12 22,26 16,30" fill="#fb923c" style={{ ['--seg-opacity' as string]: 0.75 }} />
					<polygon className="preloader-seg preloader-seg-6" points="16,12 10,26 16,30" fill="#f97316" style={{ ['--seg-opacity' as string]: 0.8 }} />
					<polygon className="preloader-seg preloader-seg-7" points="16,12 4,18 10,26" fill="#fb923c" style={{ ['--seg-opacity' as string]: 0.9 }} />
					<polygon className="preloader-seg preloader-seg-8" points="8,10 4,18 16,12" fill="#fdba74" style={{ ['--seg-opacity' as string]: 0.8 }} />
				</svg>
			</div>

			<a
				href="#main-content"
				className="sr-only focus:not-sr-only fixed top-4 left-4 z-[100] border border-border bg-background px-4 py-2 font-medium text-sm focus:outline-none focus:ring-2 focus:ring-ring"
			>
				Skip to content
			</a>
			<Navbar />
			<main id="main-content">{children}</main>
			<Footer />
		</>
	);
}
