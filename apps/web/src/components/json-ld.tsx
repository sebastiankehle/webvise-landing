interface JsonLdProps {
	// biome-ignore lint/suspicious/noExplicitAny: JSON-LD schemas are dynamic
	data: Record<string, any> | Record<string, any>[];
}

export default function JsonLd({ data }: JsonLdProps) {
	return (
		<script
			type="application/ld+json"
			// biome-ignore lint/security/noDangerouslySetInnerHtml: static JSON-LD from hardcoded content
			dangerouslySetInnerHTML={{ __html: JSON.stringify(data) }}
		/>
	);
}
