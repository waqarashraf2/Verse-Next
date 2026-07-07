"use client";

import { FormEvent, useEffect, useRef, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { Bot, MessageCircle, Minus, Send, X } from "lucide-react";

type ChatMessage = {
  role: "assistant" | "user" | "system";
  text: string;
};

const apiBase = process.env.NEXT_PUBLIC_API_BASE_URL;

const quickSuggestions = [
  "I need a website",
  "Tell me about SEO",
  "Do you build login portals?",
  "How do articles help my website?",
];

const initialMessages: ChatMessage[] = [
  {
    role: "assistant",
    text: "Hi, I am Verse Next AI Assistant. Ask about websites, ecommerce, login portals, articles, SEO, software, apps, or AI automation. I will explain services first; project details can be discussed in a meeting.",
  },
];

function createSessionId() {
  if (typeof crypto !== "undefined" && typeof crypto.randomUUID === "function") {
    return `vn-${crypto.randomUUID()}`;
  }

  return `vn-${Date.now()}-${Math.random().toString(36).slice(2, 10)}`;
}

export default function FloatingAIChat() {
  const [open, setOpen] = useState(false);
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);
  const [sessionId, setSessionId] = useState("");
  const [messages, setMessages] = useState<ChatMessage[]>(initialMessages);
  const listRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    const stored = window.localStorage.getItem("versenext_chat_session");
    const nextSession = stored || createSessionId();
    window.localStorage.setItem("versenext_chat_session", nextSession);
    setSessionId(nextSession);
  }, []);

  useEffect(() => {
    if (!open) return;
    listRef.current?.scrollTo({ top: listRef.current.scrollHeight, behavior: "smooth" });
  }, [messages, loading, open]);

  async function sendToBackend(cleanMessage: string) {
    if (!apiBase) {
      return {
        reply: "The chatbot API URL is not configured yet. Please set NEXT_PUBLIC_API_BASE_URL so messages can go through the Laravel backend.",
      };
    }

    const response = await fetch(`${apiBase}/chatbot/respond`, {
      method: "POST",
      headers: { "Content-Type": "application/json", Accept: "application/json" },
      body: JSON.stringify({
        message: cleanMessage,
        session_id: sessionId,
        context: { source: "floating_widget" },
      }),
    });

    if (!response.ok) {
      throw new Error("Chatbot request failed");
    }

    const data = await response.json();

    if (data?.data?.session_id) {
      window.localStorage.setItem("versenext_chat_session", data.data.session_id);
      setSessionId(data.data.session_id);
    }

    return {
      reply: data?.data?.reply || "Thanks. I can help with that service. Please ask what you want to understand about the website, SEO, portal, content, app, or automation workflow.",
      service: data?.data?.service,
    };
  }

  async function submit(event?: FormEvent<HTMLFormElement>, overrideMessage?: string) {
    event?.preventDefault();
    const cleanMessage = (overrideMessage || message).trim();
    if (!cleanMessage || loading) return;

    setMessages((current) => [...current, { role: "user", text: cleanMessage }]);
    setMessage("");
    setLoading(true);

    try {
      const result = await sendToBackend(cleanMessage);
      setMessages((current) => [...current, { role: "assistant", text: result.reply }]);
    } catch {
      setMessages((current) => [
        ...current,
        {
          role: "system",
          text: "I could not reach the Laravel chatbot API right now. Please check the backend/API URL and try again.",
        },
      ]);
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="fixed bottom-5 right-5 z-[90]">
      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0, y: 18, scale: 0.96 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 18, scale: 0.96 }}
            transition={{ duration: 0.18 }}
            className="mb-4 flex h-[min(620px,calc(100vh-120px))] w-[min(390px,calc(100vw-24px))] flex-col overflow-hidden rounded-2xl border border-slate-200 bg-white text-slate-950 shadow-2xl"
          >
            <div className="flex items-center justify-between bg-slate-950 px-4 py-3 text-white">
              <div className="flex min-w-0 items-center gap-3">
                <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-white/10">
                  <Bot size={20} />
                </div>
                <div className="min-w-0">
                  <div className="truncate text-sm font-semibold">Verse Next AI Assistant</div>
                  <div className="text-xs text-slate-300">Online - English, Urdu, Roman Urdu</div>
                </div>
              </div>
              <div className="flex items-center gap-1">
                <button type="button" onClick={() => setOpen(false)} className="rounded-full p-2 hover:bg-white/10" aria-label="Minimize AI assistant">
                  <Minus size={17} />
                </button>
                <button type="button" onClick={() => setOpen(false)} className="rounded-full p-2 hover:bg-white/10" aria-label="Close AI assistant">
                  <X size={17} />
                </button>
              </div>
            </div>

            <div ref={listRef} className="min-h-0 flex-1 space-y-3 overflow-y-auto bg-slate-50 p-4">
              {messages.map((item, index) => (
                <div
                  key={`${item.role}-${index}`}
                  className={`max-w-[86%] whitespace-pre-line rounded-2xl px-4 py-2.5 text-sm leading-6 ${
                    item.role === "user"
                      ? "ml-auto rounded-br-md bg-blue-600 text-white"
                      : item.role === "system"
                        ? "mx-auto border border-amber-200 bg-amber-50 text-amber-800"
                        : "rounded-bl-md border border-slate-200 bg-white text-slate-800 shadow-sm"
                  }`}
                >
                  {item.text}
                </div>
              ))}

              {loading && (
                <div className="flex w-fit items-center gap-1 rounded-2xl rounded-bl-md border border-slate-200 bg-white px-4 py-3 shadow-sm">
                  <span className="h-2 w-2 animate-bounce rounded-full bg-slate-400" />
                  <span className="h-2 w-2 animate-bounce rounded-full bg-slate-400 [animation-delay:120ms]" />
                  <span className="h-2 w-2 animate-bounce rounded-full bg-slate-400 [animation-delay:240ms]" />
                </div>
              )}
            </div>

            <div className="border-t border-slate-200 bg-white p-3">
              <div className="mb-3 flex gap-2 overflow-x-auto pb-1">
                {quickSuggestions.map((suggestion) => (
                  <button
                    key={suggestion}
                    type="button"
                    onClick={() => submit(undefined, suggestion)}
                    className="shrink-0 rounded-full border border-slate-200 bg-slate-50 px-3 py-1.5 text-xs font-semibold text-slate-700 hover:border-blue-500 hover:text-blue-600"
                  >
                    {suggestion}
                  </button>
                ))}
              </div>

              <form onSubmit={submit} className="flex items-end gap-2">
                <textarea
                  value={message}
                  onChange={(event) => setMessage(event.target.value)}
                  onKeyDown={(event) => {
                    if (event.key === "Enter" && !event.shiftKey) {
                      event.preventDefault();
                      submit();
                    }
                  }}
                  rows={1}
                  placeholder="Ask about services, SEO, login portal..."
                  className="max-h-24 min-h-11 min-w-0 flex-1 resize-none rounded-xl border border-slate-200 bg-white px-3 py-3 text-sm text-slate-800 outline-none focus:border-blue-500"
                />
                <button
                  type="submit"
                  disabled={loading || !message.trim()}
                  className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-blue-600 text-white disabled:cursor-not-allowed disabled:opacity-50"
                  aria-label="Send message"
                >
                  <Send size={18} />
                </button>
              </form>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      <button
        type="button"
        onClick={() => setOpen((current) => !current)}
        className="ml-auto flex h-14 w-14 items-center justify-center rounded-full bg-blue-600 text-white shadow-2xl ring-4 ring-blue-100 transition hover:-translate-y-0.5"
        aria-label="Open AI assistant"
      >
        {open ? <X size={23} /> : <MessageCircle size={24} />}
      </button>
    </div>
  );
}
