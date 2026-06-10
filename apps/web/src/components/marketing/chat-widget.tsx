"use client";

import { useChat } from "@ai-sdk/react";
import { DefaultChatTransport } from "ai";
import { MessageCircle, Send, X } from "lucide-react";
import { AnimatePresence, motion } from "motion/react";
import { useTranslations } from "next-intl";
import { useCallback, useEffect, useId, useRef, useState } from "react";
import { Streamdown } from "streamdown";

import Logo from "@/components/logo";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Body, Caption, inlineLinkClassName } from "@/components/ui/typography";
import { track } from "@/lib/track";
import { cn } from "@/lib/utils";

function ChatLink(props: React.AnchorHTMLAttributes<HTMLAnchorElement>) {
	const isExternal =
		props.href?.startsWith("http") || props.href?.startsWith("mailto:");
	return (
		<a
			{...props}
			className={inlineLinkClassName}
			{...(isExternal ? { target: "_blank", rel: "noopener noreferrer" } : {})}
		/>
	);
}

const suggestedQuestionKeys = ["services", "mvp", "stack", "timeline"];

function useIsMobile() {
	const [mobile, setMobile] = useState(false);
	useEffect(() => {
		const check = () => setMobile(window.innerWidth < 768);
		check();
		window.addEventListener("resize", check);
		return () => window.removeEventListener("resize", check);
	}, []);
	return mobile;
}

export default function ChatWidget() {
	const t = useTranslations("chatWidget");
	const [open, setOpen] = useState(false);
	const [input, setInput] = useState("");
	const messagesEndRef = useRef<HTMLDivElement>(null);
	const inputRef = useRef<HTMLInputElement>(null);
	const panelRef = useRef<HTMLDivElement>(null);
	const triggerRef = useRef<HTMLButtonElement>(null);
	const titleId = useId();
	const isMobile = useIsMobile();

	const { messages, sendMessage, status } = useChat({
		transport: new DefaultChatTransport({ api: "/api/ai/chat" }),
	});

	const isStreaming = status === "streaming";
	const isThinking = status === "submitted";

	// biome-ignore lint/correctness/useExhaustiveDependencies: deps are intentional scroll triggers
	useEffect(() => {
		messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
	}, [messages.length, isStreaming, isThinking]);

	useEffect(() => {
		if (open) {
			inputRef.current?.focus();
		}
	}, [open]);

	const closeChat = useCallback(() => {
		setOpen(false);
		window.requestAnimationFrame(() => {
			triggerRef.current?.focus({ preventScroll: true });
		});
	}, []);

	useEffect(() => {
		if (!open) {
			return;
		}

		const onKeyDown = (event: KeyboardEvent) => {
			if (event.key === "Escape") {
				closeChat();
			}
		};

		window.addEventListener("keydown", onKeyDown);
		return () => window.removeEventListener("keydown", onKeyDown);
	}, [closeChat, open]);

	useEffect(() => {
		if (!(open && isMobile)) {
			return;
		}
		const scrollY = window.scrollY;
		document.body.style.position = "fixed";
		document.body.style.top = `-${scrollY}px`;
		document.body.style.left = "0";
		document.body.style.right = "0";
		document.body.style.overflow = "hidden";
		return () => {
			document.body.style.position = "";
			document.body.style.top = "";
			document.body.style.left = "";
			document.body.style.right = "";
			document.body.style.overflow = "";
			window.scrollTo(0, scrollY);
		};
	}, [open, isMobile]);

	const syncViewport = useCallback(() => {
		const el = panelRef.current;
		if (!(el && isMobile)) {
			return;
		}
		const vv = window.visualViewport;
		if (!vv) {
			return;
		}
		el.style.height = `${vv.height}px`;
		el.style.top = `${vv.offsetTop}px`;
	}, [isMobile]);

	useEffect(() => {
		if (!(open && isMobile)) {
			return;
		}
		const vv = window.visualViewport;
		if (!vv) {
			return;
		}
		syncViewport();
		vv.addEventListener("resize", syncViewport);
		vv.addEventListener("scroll", syncViewport);
		return () => {
			vv.removeEventListener("resize", syncViewport);
			vv.removeEventListener("scroll", syncViewport);
		};
	}, [open, isMobile, syncViewport]);

	const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
		e.preventDefault();
		const text = input.trim();
		if (!text || isStreaming) {
			return;
		}
		track("chat_message_sent");
		sendMessage({ text });
		setInput("");
	};

	const handleSuggestion = (question: string) => {
		track("chat_suggestion_clicked", { question });
		sendMessage({ text: question });
	};

	return (
		<>
			<AnimatePresence>
				{open && (
					<motion.div
						animate={{ opacity: 1, y: 0, scale: 1 }}
						aria-labelledby={titleId}
						aria-modal="true"
						className={cn(
							"fixed z-50 flex flex-col overflow-hidden border border-border bg-background shadow-2xl",
							"inset-0 h-dvh",
							"md:inset-auto md:right-6 md:bottom-20 md:h-[min(520px,80svh)] md:w-[400px]"
						)}
						data-ai-disclosure="direct-interaction"
						data-ai-system="chatbot"
						data-marketing-floating="true"
						exit={{ opacity: 0, y: 12, scale: 0.97 }}
						id="webvise-chat-widget"
						initial={{ opacity: 0, y: 12, scale: 0.97 }}
						ref={panelRef}
						role="dialog"
						transition={{ duration: 0.2, ease: [0.25, 0.1, 0.25, 1] }}
					>
						<div className="flex items-center justify-between border-border/60 border-b bg-card px-4 py-3">
							<div className="flex items-center gap-2.5">
								<Logo className="h-5 w-5" />
								<div>
									<Body
										className="font-medium text-sm leading-none"
										id={titleId}
									>
										{t("title")}
									</Body>
									<Caption className="mt-0.5 block">{t("subtitle")}</Caption>
								</div>
							</div>
							<Button
								aria-label={t("close")}
								onClick={closeChat}
								size="icon"
								type="button"
								variant="ghost"
							>
								<X className="h-4 w-4" />
							</Button>
						</div>

						<div
							className="border-border/60 border-b bg-muted/30 px-4 py-2"
							data-ai-disclosure="true"
							role="note"
						>
							<Caption className="block text-center text-foreground/75 leading-snug">
								{t("disclosure")}
							</Caption>
						</div>

						<div className="flex-1 space-y-3 overflow-y-auto px-4 py-4">
							{messages.length === 0 ? (
								<div className="flex h-full flex-col justify-end gap-3">
									<Caption className="text-center">{t("intro")}</Caption>
									<div className="flex flex-wrap justify-center gap-1.5">
										{suggestedQuestionKeys.map((key) => {
											const question = t(`suggestions.${key}`);

											return (
												<Button
													key={key}
													onClick={() => handleSuggestion(question)}
													size="xs"
													type="button"
													variant="outline"
												>
													{question}
												</Button>
											);
										})}
									</div>
								</div>
							) : (
								messages.map((message) => (
									<div
										className={cn(
											"max-w-[85%] px-3 py-2 text-sm",
											message.role === "user"
												? "ml-auto bg-primary/10"
												: "mr-auto bg-secondary/40"
										)}
										key={message.id}
									>
										{message.parts?.map((part) => {
											if (part.type === "text") {
												return (
													<Streamdown
														components={{ a: ChatLink }}
														isAnimating={
															isStreaming && message.role === "assistant"
														}
														key={part.text}
													>
														{part.text}
													</Streamdown>
												);
											}
											return null;
										})}
									</div>
								))
							)}
							{isThinking && (
								<div className="mr-auto flex items-center gap-1.5 bg-secondary/40 px-3 py-2.5">
									<span className="h-1.5 w-1.5 animate-pulse rounded-full bg-muted-foreground/50" />
									<span className="h-1.5 w-1.5 animate-pulse rounded-full bg-muted-foreground/50 [animation-delay:150ms]" />
									<span className="h-1.5 w-1.5 animate-pulse rounded-full bg-muted-foreground/50 [animation-delay:300ms]" />
								</div>
							)}
							<div ref={messagesEndRef} />
						</div>

						<form
							autoComplete="off"
							className="flex items-center gap-2 border-border/60 border-t px-3 py-2.5 pb-[max(0.625rem,env(safe-area-inset-bottom))]"
							onSubmit={handleSubmit}
						>
							<Input
								autoCapitalize="off"
								autoComplete="one-time-code"
								autoCorrect="off"
								className="h-9 flex-1 border-transparent bg-transparent px-1 text-base focus-visible:border-transparent focus-visible:ring-0 md:h-8 md:text-sm dark:bg-transparent"
								data-1p-ignore="true"
								data-form-type="other"
								data-lpignore="true"
								enterKeyHint="send"
								name={`msg-${Date.now()}`}
								onChange={(e) => setInput(e.target.value)}
								placeholder={t("placeholder")}
								ref={inputRef}
								spellCheck={false}
								type="search"
								value={input}
							/>
							<Button
								aria-label={t("send")}
								disabled={!input.trim() || isStreaming}
								size="icon"
								type="submit"
								variant="brand"
							>
								<Send className="h-3.5 w-3.5" />
							</Button>
						</form>
					</motion.div>
				)}
			</AnimatePresence>

			<Button
				aria-controls="webvise-chat-widget"
				aria-expanded={open}
				aria-label={open ? t("close") : t("open")}
				className={cn(
					"fixed right-6 bottom-6 z-40 size-12 shadow-lg",
					open && "max-md:hidden"
				)}
				data-marketing-floating="true"
				nativeButton
				onClick={() => {
					const next = !open;
					setOpen(next);
					if (next) {
						track("chat_opened");
					}
				}}
				ref={triggerRef}
				render={<motion.button />}
				size="icon-lg"
				type="button"
				variant="brand"
			>
				<AnimatePresence mode="wait">
					{open ? (
						<motion.span
							animate={{ rotate: 0, opacity: 1 }}
							exit={{ rotate: 90, opacity: 0 }}
							initial={{ rotate: -90, opacity: 0 }}
							key="close"
							transition={{ duration: 0.15 }}
						>
							<X className="h-5 w-5" />
						</motion.span>
					) : (
						<motion.span
							animate={{ rotate: 0, opacity: 1 }}
							exit={{ rotate: -90, opacity: 0 }}
							initial={{ rotate: 90, opacity: 0 }}
							key="open"
							transition={{ duration: 0.15 }}
						>
							<MessageCircle className="h-5 w-5" />
						</motion.span>
					)}
				</AnimatePresence>
			</Button>
		</>
	);
}
