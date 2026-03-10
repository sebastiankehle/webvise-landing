"use client";

import { useChat } from "@ai-sdk/react";
import { DefaultChatTransport } from "ai";
import { MessageCircle, Send, X } from "lucide-react";
import { AnimatePresence, motion } from "motion/react";
import { useCallback, useEffect, useRef, useState } from "react";
import { Streamdown } from "streamdown";

import Logo from "@/components/logo";
import { cn } from "@/lib/utils";

function ChatLink(props: React.AnchorHTMLAttributes<HTMLAnchorElement>) {
	const isExternal =
		props.href?.startsWith("http") || props.href?.startsWith("mailto:");
	return (
		<a
			{...props}
			className="font-medium text-brand underline underline-offset-2 transition-colors hover:text-brand/80"
			{...(isExternal ? { target: "_blank", rel: "noopener noreferrer" } : {})}
		/>
	);
}

const SUGGESTED_QUESTIONS = [
	"What services do you offer?",
	"How much does an MVP cost?",
	"What's your tech stack?",
	"How fast can you ship?",
];

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
		if (open) inputRef.current?.focus();
	}, [open]);

	useEffect(() => {
		if (!open || !isMobile) return;
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
		if (!el || !isMobile) return;
		const vv = window.visualViewport;
		if (!vv) return;
		el.style.height = `${vv.height}px`;
		el.style.top = `${vv.offsetTop}px`;
	}, [isMobile]);

	useEffect(() => {
		if (!open || !isMobile) return;
		const vv = window.visualViewport;
		if (!vv) return;
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
		if (!text || isStreaming) return;
		sendMessage({ text });
		setInput("");
	};

	const handleSuggestion = (question: string) => {
		sendMessage({ text: question });
	};

	return (
		<>
			<AnimatePresence>
				{open && (
					<motion.div
						ref={panelRef}
						initial={{ opacity: 0, y: 12, scale: 0.97 }}
						animate={{ opacity: 1, y: 0, scale: 1 }}
						exit={{ opacity: 0, y: 12, scale: 0.97 }}
						transition={{ duration: 0.2, ease: [0.25, 0.1, 0.25, 1] }}
						className={cn(
							"fixed z-50 flex flex-col overflow-hidden border border-border bg-background shadow-2xl",
							"inset-0 h-dvh",
							"md:inset-auto md:right-6 md:bottom-20 md:h-[min(520px,80svh)] md:w-[400px]",
						)}
					>
						<div className="flex items-center justify-between border-border/60 border-b bg-card px-4 py-3">
							<div className="flex items-center gap-2.5">
								<Logo className="h-5 w-5" />
								<div>
									<p className="font-medium text-sm leading-none">webvise AI</p>
									<p className="mt-0.5 text-muted-foreground text-xs">
										Ask us anything
									</p>
								</div>
							</div>
							<button
								type="button"
								onClick={() => setOpen(false)}
								className="flex h-8 w-8 items-center justify-center text-muted-foreground transition-colors hover:text-foreground md:h-7 md:w-7"
								aria-label="Close chat"
							>
								<X className="h-4 w-4" />
							</button>
						</div>

						<div className="flex-1 space-y-3 overflow-y-auto px-4 py-4">
							{messages.length === 0 ? (
								<div className="flex h-full flex-col justify-end gap-3">
									<p className="text-center text-muted-foreground text-xs">
										Hi! I can answer questions about our services, pricing,
										process, and tech stack.
									</p>
									<div className="flex flex-wrap justify-center gap-1.5">
										{SUGGESTED_QUESTIONS.map((q) => (
											<button
												key={q}
												type="button"
												onClick={() => handleSuggestion(q)}
												className="border border-border bg-card px-2.5 py-1.5 text-muted-foreground text-xs transition-colors hover:bg-muted hover:text-foreground md:py-1"
											>
												{q}
											</button>
										))}
									</div>
								</div>
							) : (
								messages.map((message) => (
									<div
										key={message.id}
										className={cn(
											"max-w-[85%] px-3 py-2 text-sm",
											message.role === "user"
												? "ml-auto bg-primary/10"
												: "mr-auto bg-secondary/40",
										)}
									>
										{message.parts?.map((part) => {
											if (part.type === "text") {
												return (
												<Streamdown
													key={part.text}
													isAnimating={
														isStreaming && message.role === "assistant"
													}
													components={{ a: ChatLink }}
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
							onSubmit={handleSubmit}
							autoComplete="off"
							className="flex items-center gap-2 border-border/60 border-t px-3 py-2.5 pb-[max(0.625rem,env(safe-area-inset-bottom))]"
						>
							<input
								ref={inputRef}
								name={`msg-${Date.now()}`}
								value={input}
								onChange={(e) => setInput(e.target.value)}
								placeholder="Type a message…"
								className="h-9 flex-1 bg-transparent px-1 text-base outline-none placeholder:text-muted-foreground md:h-8 md:text-sm"
								type="search"
								autoComplete="one-time-code"
								autoCorrect="off"
								autoCapitalize="off"
								spellCheck={false}
								enterKeyHint="send"
								data-form-type="other"
								data-lpignore="true"
								data-1p-ignore="true"
							/>
							<button
								type="submit"
								disabled={!input.trim() || isStreaming}
								className="flex h-8 w-8 shrink-0 items-center justify-center bg-brand text-white transition-opacity disabled:opacity-40 md:h-7 md:w-7"
								aria-label="Send message"
							>
								<Send className="h-3.5 w-3.5" />
							</button>
						</form>
					</motion.div>
				)}
			</AnimatePresence>

			<motion.button
				type="button"
				onClick={() => setOpen(!open)}
				className={cn(
					"fixed right-6 bottom-6 z-40 flex h-12 w-12 items-center justify-center bg-brand text-white shadow-lg transition-colors hover:bg-brand/80",
					open && "max-md:hidden",
				)}
				whileHover={{ scale: 1.05 }}
				whileTap={{ scale: 0.95 }}
				aria-label={open ? "Close chat" : "Open AI chat"}
			>
				<AnimatePresence mode="wait">
					{open ? (
						<motion.span
							key="close"
							initial={{ rotate: -90, opacity: 0 }}
							animate={{ rotate: 0, opacity: 1 }}
							exit={{ rotate: 90, opacity: 0 }}
							transition={{ duration: 0.15 }}
						>
							<X className="h-5 w-5" />
						</motion.span>
					) : (
						<motion.span
							key="open"
							initial={{ rotate: 90, opacity: 0 }}
							animate={{ rotate: 0, opacity: 1 }}
							exit={{ rotate: -90, opacity: 0 }}
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
