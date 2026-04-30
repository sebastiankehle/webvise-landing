"use client";

import dynamic from "next/dynamic";
import { useEffect, useState } from "react";

const ChatWidget = dynamic(() => import("./chat-widget"), { ssr: false });

export default function ChatWidgetMount() {
	const [show, setShow] = useState(false);

	useEffect(() => {
		const win = window as Window & {
			requestIdleCallback?: (cb: () => void) => number;
		};
		const handle =
			typeof win.requestIdleCallback === "function"
				? win.requestIdleCallback(() => setShow(true))
				: window.setTimeout(() => setShow(true), 1500);
		return () => {
			if (typeof win.requestIdleCallback === "function") {
				(
					win as unknown as { cancelIdleCallback?: (h: number) => void }
				).cancelIdleCallback?.(handle as number);
			} else {
				window.clearTimeout(handle as number);
			}
		};
	}, []);

	if (!show) {
		return null;
	}
	return <ChatWidget />;
}
