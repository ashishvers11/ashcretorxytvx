"use client";

import * as React from "react";
import {
  Bot,
  Send,
  Sparkles,
  User,
  Trash2,
  Copy,
  CheckCircle2,
  Zap,
  Flame,
  ArrowRight,
} from "lucide-react";
import { useAuth } from "@/components/providers/auth-provider";
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";

interface Message {
  role: "assistant" | "user";
  content: string;
  time: string;
}

export default function CreatorAiAssistantPage() {
  const { channel, profile, activeChannelStyle } = useAuth();
  const channelTitle = channel?.channel_title || "Connected Channel";
  const niche = activeChannelStyle?.channelNiche || "Content Creation";
  const styleLabel = activeChannelStyle?.visualStyleLabel || "Original Style";
  const handle = channel?.custom_url
    ? `@${channel.custom_url}`
    : channel?.channel_title
    ? `@${channel.channel_title.toLowerCase().replace(/\s+/g, "")}`
    : "@channel";

  const storageKey = `ash_assistant_messages_${channel?.id || "default"}`;

  const initialWelcome = `Hello ${profile?.full_name?.split(" ")[0] || "Creator"}! I am your ASH Creator Growth Copilot.\n\nI have researched your connected channel **${channelTitle}** (${handle}) specializing in **${niche}** with the **${styleLabel}** visual format.\n\nHow can I help accelerate your audience velocity today? You can ask me to draft high-CTR hooks, critique your thumbnail concepts, or blueprint your next 30-day upload sprint.`;

  const [inputMessage, setInputMessage] = React.useState("");
  const [isTyping, setIsTyping] = React.useState(false);
  const [messages, setMessages] = React.useState<Message[]>([
    {
      role: "assistant",
      content: initialWelcome,
      time: "Just now",
    },
  ]);

  const messagesEndRef = React.useRef<HTMLDivElement>(null);

  // Load from localStorage on mount
  React.useEffect(() => {
    if (typeof window === "undefined") return;
    try {
      const saved = localStorage.getItem(storageKey);
      if (saved) {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed) && parsed.length > 0) {
          setMessages(parsed);
        }
      }
    } catch (e) {
      console.warn("Failed to load chat history:", e);
    }
  }, [storageKey]);

  React.useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, isTyping]);

  const saveMessages = (msgs: Message[]) => {
    setMessages(msgs);
    if (typeof window !== "undefined") {
      try {
        localStorage.setItem(storageKey, JSON.stringify(msgs));
      } catch (e) {
        console.warn("Failed to persist chat:", e);
      }
    }
  };

  const handleSend = async (userText?: string) => {
    const text = (userText || inputMessage).trim();
    if (!text) return;

    const userMsg: Message = {
      role: "user",
      content: text,
      time: "Just now",
    };

    const newHistory = [...messages, userMsg];
    saveMessages(newHistory);
    setInputMessage("");
    setIsTyping(true);

    try {
      const res = await fetch("/api/ai/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          message: text,
          channelTitle,
          channelNiche: niche,
          visualStyle: styleLabel,
          targetAudience: activeChannelStyle?.targetAudience || "YouTube Audience",
          history: newHistory.slice(-6),
        }),
      });

      const data = await res.json();
      const replyContent =
        data?.reply ||
        "I am analyzing your channel strategy. Please ask any specific question about your scripts, packaging, or retention!";

      const assistantMsg: Message = {
        role: "assistant",
        content: replyContent,
        time: "Just now",
      };

      saveMessages([...newHistory, assistantMsg]);
    } catch (err) {
      console.error("AI Assistant request failed:", err);
      const fallbackMsg: Message = {
        role: "assistant",
        content:
          "I am ready to help grow your channel! You can ask me for title ideas, script critiques, or retention strategies.",
        time: "Just now",
      };
      saveMessages([...newHistory, fallbackMsg]);
    } finally {
      setIsTyping(false);
    }
  };

  const handleClearChat = () => {
    if (confirm("Reset chat history?")) {
      const reset = [{ role: "assistant" as const, content: initialWelcome, time: "Just now" }];
      saveMessages(reset);
    }
  };

  const samplePrompts = [
    `Give me a 30-day growth plan for ${channelTitle}`,
    `Generate 5 high-CTR video concepts for ${styleLabel}`,
    "How do I fix a sharp drop-off in my first 30 seconds?",
    "How to double my CTR on thumbnails?",
  ];

  return (
    <div className="space-y-6 sm:space-y-8 pb-10 max-w-5xl mx-auto flex flex-col h-[calc(100vh-140px)]">
      {/* Header */}
      <div className="flex items-center justify-between pb-2 border-b border-slate-200 dark:border-navy-800">
        <div className="flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br from-brand-500 to-navy-900 text-white shadow-md">
            <Bot className="h-5 w-5" />
          </div>
          <div>
            <h2 className="text-lg font-bold text-slate-900 dark:text-white flex items-center gap-2">
              <span>Creator AI Assistant</span>
              <Badge variant="brand">Active Copilot</Badge>
            </h2>
            <p className="text-xs text-slate-400">
              Personalized for {channelTitle} ({handle})
            </p>
          </div>
        </div>

        <Button
          variant="ghost"
          size="sm"
          onClick={handleClearChat}
          className="text-xs text-slate-400 hover:text-rose-500 gap-1.5"
        >
          <Trash2 className="h-3.5 w-3.5" />
          <span>Clear Chat</span>
        </Button>
      </div>

      {/* Messages Scroll Area */}
      <div className="flex-1 overflow-y-auto space-y-4 pr-2">
        {messages.map((msg, index) => (
          <div
            key={index}
            className={`flex gap-3.5 ${
              msg.role === "user" ? "justify-end" : "justify-start"
            }`}
          >
            {msg.role === "assistant" && (
              <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-xl bg-brand-500 text-white font-bold text-xs shadow-sm">
                <Sparkles className="h-4 w-4" />
              </div>
            )}

            <div
              className={`rounded-2xl p-4 text-xs sm:text-sm max-w-2xl leading-relaxed space-y-2 ${
                msg.role === "user"
                  ? "bg-brand-500 text-white font-medium ml-12 rounded-br-sm shadow-md"
                  : "bg-white dark:bg-navy-900/90 text-slate-800 dark:text-slate-200 border border-slate-200/80 dark:border-navy-800 rounded-bl-sm shadow-sm"
              }`}
            >
              <div className="whitespace-pre-line prose dark:prose-invert text-xs sm:text-sm max-w-none">
                {msg.content}
              </div>
              <span
                className={`block text-[10px] pt-1 text-right ${
                  msg.role === "user" ? "text-brand-100" : "text-slate-400"
                }`}
              >
                {msg.time}
              </span>
            </div>

            {msg.role === "user" && (
              <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-xl bg-slate-200 dark:bg-navy-800 text-slate-700 dark:text-slate-300 font-bold text-xs">
                <User className="h-4 w-4" />
              </div>
            )}
          </div>
        ))}

        {isTyping && (
          <div className="flex gap-3 items-center text-xs text-slate-400 pl-11">
            <div className="flex gap-1">
              <span className="h-2 w-2 rounded-full bg-brand-500 animate-bounce" />
              <span className="h-2 w-2 rounded-full bg-brand-500 animate-bounce [animation-delay:0.2s]" />
              <span className="h-2 w-2 rounded-full bg-brand-500 animate-bounce [animation-delay:0.4s]" />
            </div>
            <span>Analyzing YouTube algorithm parameters...</span>
          </div>
        )}

        <div ref={messagesEndRef} />
      </div>

      {/* Quick Prompts Bar */}
      <div className="space-y-2 pt-2">
        <div className="flex items-center gap-2 overflow-x-auto pb-1 text-xs">
          <span className="text-[10px] uppercase font-bold text-slate-400 shrink-0">
            Suggested:
          </span>
          {samplePrompts.map((p, idx) => (
            <button
              key={idx}
              onClick={() => handleSend(p)}
              className="rounded-full border border-slate-200 dark:border-navy-700 bg-white dark:bg-navy-900 px-3 py-1 text-[11px] text-slate-700 dark:text-slate-300 hover:border-brand-500 hover:text-brand-500 transition-colors shrink-0 shadow-sm"
            >
              {p}
            </button>
          ))}
        </div>

        {/* Chat Input Bar */}
        <form
          onSubmit={(e) => {
            e.preventDefault();
            handleSend();
          }}
          className="flex items-center gap-2"
        >
          <input
            type="text"
            placeholder="Ask anything about growing your YouTube channel..."
            value={inputMessage}
            onChange={(e) => setInputMessage(e.target.value)}
            className="flex-1 rounded-xl border border-slate-300 dark:border-navy-700 bg-white dark:bg-navy-950 px-4 py-3 text-xs sm:text-sm text-slate-900 dark:text-slate-100 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-brand-500 shadow-sm"
          />

          <Button type="submit" className="h-11 px-5 gap-2 text-xs shrink-0 font-semibold shadow-md">
            <span>Send</span>
            <Send className="h-3.5 w-3.5" />
          </Button>
        </form>
      </div>
    </div>
  );
}
