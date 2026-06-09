"use client";

import { useChat } from "@ai-sdk/react";
import { DefaultChatTransport } from "ai";
import { MessageCircle, Send, X } from "lucide-react";
import { AnimatePresence, motion } from "motion/react";
import { useTranslations } from "next-intl";
import { useCallback, useEffect, useRef, useState } from "react";
import { Streamdown } from "streamdown";

import Logo from "@/components/logo";
import { Body, Caption } from "@/components/ui/typography";
import { track } from "@/lib/track";
import { cn } from "@/lib/utils";

function ChatLink(props: React.AnchorHTMLAttributes<HTMLAnchorElement>) {
	const isExternal =
		props.href?.startsWith("http") || props.href?.startsWith("mailto:");
	return (
		<a
			{...props}
			className="font-medium text-brand-readable underline underline-offset-2 transition-colors hover:text-brand-readable"
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
						className={cn(
							"fixed z-50 flex flex-col overflow-hidden border border-border bg-background shadow-2xl",
							"inset-0 h-dvh",
							"md:inset-auto md:right-6 md:bottom-20 md:h-[min(520px,80svh)] md:w-[400px]"
						)}
						data-ai-disclosure="direct-interaction"
						data-ai-system="chatbot"
						exit={{ opacity: 0, y: 12, scale: 0.97 }}
						initial={{ opacity: 0, y: 12, scale: 0.97 }}
						ref={panelRef}
						transition={{ duration: 0.2, ease: [0.25, 0.1, 0.25, 1] }}
					>
						<div className="flex items-center justify-between border-border/60 border-b bg-card px-4 py-3">
							<div className="flex items-center gap-2.5">
								<Logo className="h-5 w-5" />
								<div>
									<Body className="font-medium text-sm leading-none">
										{t("title")}
									</Body>
									<Caption className="mt-0.5 block">{t("subtitle")}</Caption>
								</div>
							</div>
							<button
								aria-label={t("close")}
								className="flex h-8 w-8 items-center justify-center text-muted-foreground transition-colors hover:text-foreground md:h-7 md:w-7"
								onClick={() => setOpen(false)}
								type="button"
							>
								<X className="h-4 w-4" />
							</button>
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
												<button
													className="border border-border bg-card px-2.5 py-1.5 text-muted-foreground text-xs transition-colors hover:bg-muted hover:text-foreground md:py-1"
													key={key}
													onClick={() => handleSuggestion(question)}
													type="button"
												>
													{question}
												</button>
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
							<input
								autoCapitalize="off"
								autoComplete="one-time-code"
								autoCorrect="off"
								className="h-9 flex-1 bg-transparent px-1 text-base outline-none placeholder:text-muted-foreground md:h-8 md:text-sm"
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
							<button
								aria-label={t("send")}
								className="flex h-8 w-8 shrink-0 items-center justify-center bg-brand text-brand-foreground transition-colors disabled:bg-muted disabled:text-muted-foreground md:h-7 md:w-7"
								disabled={!input.trim() || isStreaming}
								type="submit"
							>
								<Send className="h-3.5 w-3.5" />
							</button>
						</form>
					</motion.div>
				)}
			</AnimatePresence>

			<motion.button
				aria-label={open ? t("close") : t("open")}
				className={cn(
					"hover:!bg-brand-hover fixed right-6 bottom-6 z-40 flex h-12 w-12 items-center justify-center bg-brand text-brand-foreground shadow-lg transition-colors",
					open && "max-md:hidden"
				)}
				onClick={() => {
					const next = !open;
					setOpen(next);
					if (next) {
						track("chat_opened");
					}
				}}
				type="button"
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
			</motion.button>
		</>
	);
}
