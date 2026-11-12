"use client";

import dynamic from "next/dynamic";
import { useEffect, useState } from "react";

const ChatWidget = dynamic(() => import("./chat-widget"), { ssr: false });

const FIRST_SIGNS = ["pointermove", "scroll", "keydown", "touchstart"] as const;
const QUIET_LIMIT = 8000;

/** The chat widget brings a markdown renderer and the AI client with it, so
 * it stays out of the first load: it mounts on the visitor's first sign of
 * life, or after a few quiet seconds. */
export default function ChatWidgetMount() {
	const [show, setShow] = useState(false);

	useEffect(() => {
		const reveal = () => setShow(true);
		const timer = window.setTimeout(reveal, QUIET_LIMIT);
		for (const sign of FIRST_SIGNS) {
			window.addEventListener(sign, reveal, { once: true, passive: true });
		}
		return () => {
			window.clearTimeout(timer);
			for (const sign of FIRST_SIGNS) {
				window.removeEventListener(sign, reveal);
			}
		};
	}, []);

	if (!show) {
		return null;
	}
	return <ChatWidget />;
}
