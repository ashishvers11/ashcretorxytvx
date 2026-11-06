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
  const { channel, profile } = useAuth();
  const channelTitle = channel?.channel_title || "Connected Channel";
  const handle = channel?.custom_url
    ? `@${channel.custom_url}`
    : channel?.channel_title
    ? `@${channel.channel_title.toLowerCase().replace(/\s+/g, "")}`
    : "@channel";

  const [inputMessage, setInputMessage] = React.useState("");
  const [isTyping, setIsTyping] = React.useState(false);

  const [messages, setMessages] = React.useState<Message[]>([
    {
      role: "assistant",
      content: `Hello ${profile?.full_name?.split(" ")[0] || "Ashish"}! I am your ASH Creator Growth Copilot. I have analyzed your channel **${channelTitle}** (${handle}) in the Education, Science Facts & Curious Mysteries niche.\n\nHow can I help accelerate your channel today? You can ask me to draft curiosity hooks, critique video packaging, or blueprint your next 30-day upload sprint.`,
      time: "Just now",
    },
  ]);

  const messagesEndRef = React.useRef<HTMLDivElement>(null);

  React.useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, isTyping]);

  const handleSend = (userText?: string) => {
    const text = (userText || inputMessage).trim();
    if (!text) return;

    const userMsg: Message = {
      role: "user",
      content: text,
      time: "Just now",
    };

    setMessages((prev) => [...prev, userMsg]);
    setInputMessage("");
    setIsTyping(true);

    // Simulated contextual AI response based on query
    setTimeout(() => {
      let aiReply = "";

      const lower = text.toLowerCase();
      if (lower.includes("30-day") || lower.includes("growth plan")) {
        aiReply = `### 30-Day Growth Blueprint for **${channelTitle}** (Education & Science Facts):\n\n1. **Week 1 (Curiosity Packaging):**\n   - Update your channel bio with 5 high-volume search terms (*Hindi Science Facts, Daily Curiosities, Biology Truth, Mysteries Explained*).\n   - Pin a themed playlist (*"Daily Life Curiosities"*).\n\n2. **Week 2 (Shorts-to-Long-form Funnel):**\n   - Release 3 high-retention 60s curiosity Shorts (*"लौंग असल में क्या है?", "हवाई जहाज सफेद क्यों होता है?"*) directing viewers to your full breakdowns.\n\n3. **Week 3 (Micro-Payoff Scripting):**\n   - Use our AI Script Studio to ensure every video has a 15-second opening hook, 3 visual B-Roll beats, and zero filler.\n\n4. **Week 4 (End Screen Binge Loop):**\n   - At the end of every video, never say goodbye — hook the viewer directly into your next science mystery!`;
      } else if (lower.includes("title") || lower.includes("ideas") || lower.includes("topic")) {
        aiReply = `### 5 High-CTR Science & Curiosity Concepts for **${handle}**:\n\n1. *"लौंग असल में फूल है या फल? (The Truth About Cloves)"*\n   - **Predicted CTR:** 15.4% • Daily Curiosity Mystery\n\n2. *"अगर धरती सिर्फ 5 सेकंड के लिए घूमना बंद कर दे तो क्या होगा?"*\n   - **Predicted CTR:** 18.2% • Viral Physics What-If\n\n3. *"हवाई जहाज का रंग हमेशा सफेद ही क्यों होता है?"*\n   - **Predicted CTR:** 13.6% • Aviation Thermal Science\n\n4. *"मोबाइल की बैटरी को 80% पर ही क्यों रोक देना चाहिए?"*\n   - **Predicted CTR:** 14.8% • Battery Chemistry Practical\n\n5. *"क्या पौधे सच में दर्द महसूस करते हैं? Science Experiment"*\n   - **Predicted CTR:** 16.9% • Botanical Biology Wonder`;
      } else if (lower.includes("drop") || lower.includes("retention") || lower.includes("30 seconds")) {
        aiReply = `### How to Fix 30-Second Audience Drop-off on Science Channels:\n\n- **Rule 1: Eliminate Slow Animated Intros.** Never show a 5-second logo animation. Deliver the mystery hook in the first 3 seconds.\n- **Rule 2: Challenge a Common Misconception.** Start with *"99% लोग सोचते हैं कि X सच है, लेकिन विज्ञान कुछ और ही कहता है..."*\n- **Rule 3: Visual B-Roll Every 3-4 Seconds.** In science videos, use macro footage, animations, and bold text callouts to keep viewers glued.\n- **Rule 4: Withhold the Ultimate Payoff.** Promise the surprising scientific conclusion at the end of Beat 3.`;
      } else {
        aiReply = `Great question for **${channelTitle}**! In the YouTube Education & Science algorithm, viral reach is driven by 3 pillars:\n\n1. **Relatable Curiosity Hook:** Frame your topic around something viewers touch or see every day (like cloves, airplanes, or batteries).\n2. **Visual Pacing:** Explain complex science in simple Hindi/English with clear visual diagrams and B-roll cues.\n3. **Seamless Outro:** Avoid saying "Thanks for watching!" — tease the next mystery to multiply watch time sessions!`;
      }

      setMessages((prev) => [
        ...prev,
        {
          role: "assistant",
          content: aiReply,
          time: "Just now",
        },
      ]);
      setIsTyping(false);
    }, 1000);
  };

  const samplePrompts = [
    `Give me a 30-day growth plan for ${channel?.channel_title || "my channel"}`,
    "Generate 5 high-CTR titles for Science Facts & Curiosities",
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
          onClick={() =>
            setMessages([
              {
                role: "assistant",
                content: `Chat session reset. How can I help grow **${channelTitle}** today?`,
                time: "Just now",
              },
            ])
          }
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
