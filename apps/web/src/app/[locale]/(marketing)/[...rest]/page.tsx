import { notFound } from "next/navigation";

/** An address no page matches ends here, so its 404 renders inside the site,
 * with navigation, banner and footer, in the visitor's language. Without this
 * catch-all Next falls back to the bare root not-found page. */
export default function UnknownPage() {
	notFound();
}
