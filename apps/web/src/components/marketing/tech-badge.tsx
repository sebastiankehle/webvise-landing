import { MarketingTag } from "./marketing-tag";

export function TechBadge({ name }: { name: string }) {
	return <MarketingTag variant="subtle">{name}</MarketingTag>;
}
