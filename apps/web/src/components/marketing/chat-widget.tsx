"use client";

import { useChat } from "@ai-sdk/react";
import { DefaultChatTransport } from "ai";
import { MessageCircle, Send, X } from "lucide-react";
import { AnimatePresence, motion } from "motion/react";
import { useEffect, useRef, useState } from "react";
import { Streamdown } from "streamdown";

import Logo from "@/components/logo";
import { cn } from "@/lib/utils";

const SUGGESTED_QUESTIONS = [
	"What services do you offer?",
	"How much does an MVP cost?",
	"What's your tech stack?",
	"How fast can you ship?",
];

export default function ChatWidget() {
	const [open, setOpen] = useState(false);
	const [input, setInput] = useState("");
	const messagesEndRef = useRef<HTMLDivElement>(null);
	const inputRef = useRef<HTMLInputElement>(null);

	const { messages, sendMessage, status } = useChat({
		transport: new DefaultChatTransport({ api: "/api/ai/chat" }),
	});

	const isStreaming = status === "streaming";

	useEffect(() => {
		messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
	}, [messages.length, isStreaming]);

	useEffect(() => {
		if (open) inputRef.current?.focus();
	}, [open]);

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
		<div className="fixed right-6 bottom-6 z-40 flex flex-col items-end gap-3">
			<AnimatePresence>
				{open && (
					<motion.div
						initial={{ opacity: 0, y: 12, scale: 0.95 }}
						animate={{ opacity: 1, y: 0, scale: 1 }}
						exit={{ opacity: 0, y: 12, scale: 0.95 }}
						transition={{ duration: 0.2, ease: [0.25, 0.1, 0.25, 1] }}
						className="flex h-[min(520px,80svh)] w-[min(400px,calc(100vw-3rem))] flex-col overflow-hidden border border-border bg-background shadow-2xl"
					>
						<div className="flex items-center justify-between border-border/60 border-b bg-card px-4 py-3">
							<div className="flex items-center gap-2.5">
								<Logo className="h-5 w-5" />
								<div>
									<p className="font-medium text-sm leading-none">
										webvise AI
									</p>
									<p className="mt-0.5 text-muted-foreground text-xs">
										Ask us anything
									</p>
								</div>
							</div>
							<button
								type="button"
								onClick={() => setOpen(false)}
								className="flex h-7 w-7 items-center justify-center text-muted-foreground transition-colors hover:text-foreground"
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
												className="border border-border bg-card px-2.5 py-1 text-muted-foreground text-xs transition-colors hover:bg-muted hover:text-foreground"
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
							<div ref={messagesEndRef} />
						</div>

						<form
							onSubmit={handleSubmit}
							className="flex items-center gap-2 border-border/60 border-t px-3 py-2.5"
						>
							<input
								ref={inputRef}
								value={input}
								onChange={(e) => setInput(e.target.value)}
								placeholder="Type a message…"
								className="h-8 flex-1 bg-transparent px-1 text-sm outline-none placeholder:text-muted-foreground"
								autoComplete="off"
							/>
							<button
								type="submit"
								disabled={!input.trim() || isStreaming}
								className="flex h-7 w-7 shrink-0 items-center justify-center bg-brand text-white transition-opacity disabled:opacity-40"
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
				className="flex h-12 w-12 items-center justify-center bg-brand text-white shadow-lg transition-colors hover:bg-brand/80"
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
		</div>
	);
}
