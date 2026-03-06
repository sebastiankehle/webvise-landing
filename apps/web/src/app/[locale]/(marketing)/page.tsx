import Benefits from "@/components/marketing/sections/benefits";
import Contact from "@/components/marketing/sections/contact";
import FAQ from "@/components/marketing/sections/faq";
import Hero from "@/components/marketing/sections/hero";
import Metrics from "@/components/marketing/sections/metrics";
import Pricing from "@/components/marketing/sections/pricing";
import Process from "@/components/marketing/sections/process";
import Services from "@/components/marketing/sections/services";
import TechStack from "@/components/marketing/sections/tech-stack";
import Testimonials from "@/components/marketing/sections/testimonials";

export default function HomePage() {
	return (
		<>
			<Hero />
			<TechStack />
			<Benefits />
			<Metrics />
			<Services />
			<Process />
			<Testimonials />
			<Pricing />
			<Contact />
			<FAQ />
		</>
	);
}
