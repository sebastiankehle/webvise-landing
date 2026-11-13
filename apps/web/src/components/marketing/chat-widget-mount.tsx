"use client";

import { MessageCircle } from "lucide-react";
import dynamic from "next/dynamic";
import { useTranslations } from "next-intl";
import { useState } from "react";

import { Button } from "@/components/ui/button";

function Launcher({
	disabled,
	onClick,
	onPrefetch,
}: {
	disabled?: boolean;
	onClick?: () => void;
	onPrefetch?: () => void;
}) {
	const t = useTranslations("chatWidget");
	return (
		<Button
			aria-controls="webvise-chat-widget"
			aria-expanded={false}
			aria-label={t("open")}
			className="fixed right-6 bottom-6 z-40 size-13 rounded-full shadow-[0_12px_28px_-10px_rgba(14,18,23,0.6)]"
			data-marketing-floating="true"
			disabled={disabled}
			onClick={onClick}
			onFocus={onPrefetch}
			onPointerEnter={onPrefetch}
			onTouchStart={onPrefetch}
			size="icon-lg"
			type="button"
			variant="brand"
		>
			<MessageCircle className="h-5 w-5" />
		</Button>
	);
}

const ChatWidget = dynamic(() => import("./chat-widget"), {
	loading: () => <Launcher disabled />,
	ssr: false,
});

const loadChat = () => import("./chat-widget");

/** Only this launcher ships with the page. The chat widget brings a markdown
 * renderer and the AI client, so it loads when the visitor hovers, focuses or
 * clicks the button. */
export default function ChatWidgetMount() {
	const [ready, setReady] = useState(false);

	if (ready) {
		return <ChatWidget defaultOpen />;
	}
	return (
		<Launcher
			onClick={() => setReady(true)}
			onPrefetch={() => {
				loadChat();
			}}
		/>
	);
}
