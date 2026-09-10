import { useEffect, useRef, useState } from "react";
import type { FormEvent, KeyboardEvent } from "react";
import ReactMarkdown from "react-markdown";
import { SendIcon } from "@animateicons/react/lucide";
import SiriOrb from "./SiriOrb"
import { askAI } from "../services/aiService";

type ChatMessage = {
    id: number;
    role: "user" | "assistant";
    content: string;
};

const FALLBACK_ANSWER = "AI cannot answer that question at this moment.";
const MAX_TEXTAREA_HEIGHT = 120; // px, ~5 lines before it scrolls instead of growing further

function CloseIcon() {
    return (
        <svg
            width="20"
            height="20"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
        >
            <line x1="18" y1="6" x2="6" y2="18" />
            <line x1="6" y1="6" x2="18" y2="18" />
        </svg>
    );
}

export default function AIChat() {
    const [isOpen, setIsOpen] = useState(false);
    const [message, setMessage] = useState("");
    const [isLoading, setIsLoading] = useState(false);
    const [messages, setMessages] = useState<ChatMessage[]>([]);

    const textareaRef = useRef<HTMLTextAreaElement>(null);

    // Auto-grow the textarea as content wraps, up to MAX_TEXTAREA_HEIGHT, then scroll
    useEffect(() => {
        const el = textareaRef.current;
        if (!el) return;
        el.style.height = "auto";
        el.style.height = `${Math.min(el.scrollHeight, MAX_TEXTAREA_HEIGHT)}px`;
    }, [message]);

    const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
        event.preventDefault();
        const question = message.trim();

        if (!question || isLoading) return;

        setMessages((current) => [
            ...current,
            { id: Date.now(), role: "user", content: question },
        ]);
        setMessage("");
        setIsLoading(true);

        try {
            const answer = await askAI(question);
            setMessages((current) => [
                ...current,
                { id: Date.now() + 1, role: "assistant", content: answer || FALLBACK_ANSWER },
            ]);
        } catch {
            setMessages((current) => [
                ...current,
                { id: Date.now() + 1, role: "assistant", content: FALLBACK_ANSWER },
            ]);
        } finally {
            setIsLoading(false);
        }
    };

    const handleKeyDown = (event: KeyboardEvent<HTMLTextAreaElement>) => {
        if (event.key === "Enter" && !event.shiftKey) {
            event.preventDefault();
            event.currentTarget.form?.requestSubmit();
        }
    };

    return (
        <div className="fixed bottom-6 right-6 z-50 flex flex-col items-end gap-3">
            {isOpen && (
                <section className="flex h-[min(32rem,calc(100vh-7rem))] w-[min(24rem,calc(100vw-2rem))] flex-col overflow-hidden rounded-xl border border-slate-200 bg-white shadow-2xl ">
                    <header className="flex items-center gap-2 border-b border-slate-200 px-4 py-3">
                        <span className="bg-zinc-950 rounded-full">
                            <SiriOrb size="30px" animationDuration={6} />
                        </span>
                        <h2 className="font-semibold text-slate-900">Ask AI</h2>
                    </header>

                    <div className="flex-1 space-y-3 overflow-y-auto bg-slate-50 p-4 scrollbar-hide">
                        {messages.length === 0 && (
                            <p className="text-sm text-slate-500">
                                Ask about reports, projects, or your team.
                            </p>
                        )}
                        {messages.map((chatMessage) => (
                            <div
                                key={chatMessage.id}
                                className={`rounded-lg px-3 py-2 text-sm ${chatMessage.role === "user"
                                    ? "ml-6 border border-cyan-100 bg-cyan-50 text-cyan-900"
                                    : "mr-6 border border-slate-200 bg-white text-slate-800"
                                    }`}
                            >
                                {chatMessage.role === "assistant" ? (
                                    <ReactMarkdown>{chatMessage.content}</ReactMarkdown>
                                ) : (
                                    chatMessage.content
                                )}
                            </div>
                        ))}
                        {isLoading && (
                            <div className="flex items-center gap-2 text-sm text-slate-500">
                                <span className="bg-zinc-950 rounded-full">
                                    <SiriOrb size="24px" animationDuration={2} />
                                </span>
                                Thinking...
                            </div>
                        )}
                    </div>

                    <form onSubmit={handleSubmit} className="flex items-end gap-2 border-t border-slate-200 bg-white p-3">
                        <textarea
                            ref={textareaRef}
                            value={message}
                            onChange={(event) => setMessage(event.target.value)}
                            onKeyDown={handleKeyDown}
                            placeholder="Ask a question..."
                            disabled={isLoading}
                            rows={1}
                            className="min-w-0 flex-1 resize-none overflow-y-auto rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm text-slate-900 outline-none placeholder:text-slate-400 focus:border-cyan-400"
                            style={{ maxHeight: MAX_TEXTAREA_HEIGHT }}
                        />
                        <button
                            type="submit"
                            disabled={isLoading || !message.trim()}
                            aria-label="Send"
                            className="flex shrink-0 items-center justify-center rounded-lg bg-cyan-500 p-2 transition-colors hover:bg-cyan-400 disabled:cursor-not-allowed disabled:opacity-50"
                        >
                            <SendIcon size={20} duration={1} color="#ffffff" />
                        </button>
                    </form>
                </section>
            )}

            <button
                type="button"
                onClick={() => setIsOpen((current) => !current)}
                aria-expanded={isOpen}
                aria-label={isOpen ? "Close AI chat" : "Ask AI"}
                className={`cursor-pointer m-2 flex items-center justify-center gap-3 border border-cyan-800/10 rounded-full bg-cyan-50 font-semibold text-slate-950 shadow-lg transition-transform hover:scale-105 ${isOpen ? "p-3" : "px-2 py-2"
                    }`}
            >
                {isOpen ? (
                    <CloseIcon />
                ) : (
                    <>
                        <span className="bg-zinc-950 rounded-full">
                            <SiriOrb size="30px" animationDuration={4} />
                        </span>
                        <span>Ask AI</span>
                    </>
                )}
            </button>
        </div>
    );
}