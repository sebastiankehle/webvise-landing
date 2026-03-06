import { Button } from "@/components/ui/button";

export default function NotFound() {
	return (
		<div className="flex min-h-screen flex-col items-center justify-center px-6">
			<p className="font-medium text-muted-foreground/50 text-sm uppercase tracking-wider">
				404
			</p>
			<h1 className="mt-4 font-normal text-4xl tracking-tight md:text-5xl">
				Page not found
			</h1>
			<p className="mt-4 max-w-md text-center font-light text-muted-foreground">
				The page you're looking for doesn't exist or has been moved.
			</p>
			<div className="mt-8 flex gap-3">
				<Button
					// biome-ignore lint/a11y/useAnchorContent: content provided by Button children
					render={<a href="/" />}
				>
					Back to Home
				</Button>
				<Button
					variant="outline"
					// biome-ignore lint/a11y/useAnchorContent: content provided by Button children
					render={<a href="/#contact" />}
				>
					Contact Us
				</Button>
			</div>
		</div>
	);
}
