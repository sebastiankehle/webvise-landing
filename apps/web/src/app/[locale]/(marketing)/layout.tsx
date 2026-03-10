import ChatWidget from "@/components/marketing/chat-widget";
import Footer from "@/components/marketing/footer";
import Navbar from "@/components/marketing/navbar";

export default function MarketingLayout({
	children,
}: {
	children: React.ReactNode;
}) {
	return (
		<>
			<a
				href="#main-content"
				className="sr-only focus:not-sr-only fixed top-4 left-4 z-[100] border border-border bg-background px-4 py-2 font-medium text-sm focus:outline-none focus:ring-2 focus:ring-ring"
			>
				Skip to content
			</a>
			<Navbar />
			<main id="main-content">{children}</main>
			<Footer />
			<ChatWidget />
		</>
	);
}
