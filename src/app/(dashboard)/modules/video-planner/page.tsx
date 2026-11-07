"use client";

import * as React from "react";
import {
  CalendarDays,
  PlusCircle,
  MoveRight,
  Clock,
  Sparkles,
  CheckCircle2,
  Trash2,
} from "lucide-react";
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { useAuth } from "@/components/providers/auth-provider";

interface VideoTask {
  id: string;
  title: string;
  stage: "backlog" | "scripting" | "filming" | "editing" | "ready";
  targetDate: string;
  type: string;
}

export default function VideoPlannerPage() {
  const { channel, activeChannelStyle } = useAuth();
  const storageKey = `ash_video_tasks_${channel?.id || "default"}`;

  const defaultTopic1 = activeChannelStyle?.popularTopics?.[0] || "द ग्रेट लाइब्रेरी ऑफ अलेक्जेंड्रिया कैसे जली?";
  const defaultTopic2 = activeChannelStyle?.popularTopics?.[1] || "रोम की 9वीं सेना रहस्यमयी तरीके से कहाँ गायब हो गई?";
  const defaultTopic3 = activeChannelStyle?.popularTopics?.[2] || "वाइकिंग्स बादलों में सूर्य की दिशा कैसे पहचानते थे?";

  const [tasks, setTasks] = React.useState<VideoTask[]>([
    {
      id: "1",
      title: defaultTopic1,
      stage: "editing",
      targetDate: "This Friday",
      type: "Explainer",
    },
    {
      id: "2",
      title: defaultTopic2,
      stage: "scripting",
      targetDate: "Next Tuesday",
      type: "Curiosity",
    },
    {
      id: "3",
      title: defaultTopic3,
      stage: "filming",
      targetDate: "Next Sunday",
      type: "Investigation",
    },
    {
      id: "4",
      title: "मोबाइल बैटरी को 80% पर ही क्यों रोकना चाहिए?",
      stage: "backlog",
      targetDate: "TBD",
      type: "Tech Science",
    },
    {
      id: "5",
      title: "Secret Unreal Rotation Strategy Breakdown",
      stage: "ready",
      targetDate: "Tomorrow 6:00 PM",
      type: "Shorts",
    },
  ]);

  const [newTitle, setNewTitle] = React.useState("");

  // Load from localStorage
  React.useEffect(() => {
    if (typeof window === "undefined") return;
    try {
      const saved = localStorage.getItem(storageKey);
      if (saved) {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed) && parsed.length > 0) {
          setTasks(parsed);
        }
      }
    } catch (e) {
      console.warn("Failed to load tasks from storage:", e);
    }
  }, [storageKey]);

  const saveTasks = (updated: VideoTask[]) => {
    setTasks(updated);
    if (typeof window !== "undefined") {
      try {
        localStorage.setItem(storageKey, JSON.stringify(updated));
      } catch (e) {
        console.warn("Failed to persist tasks to storage:", e);
      }
    }
  };

  const stages = [
    { id: "backlog", title: "Idea Backlog", color: "border-slate-300 dark:border-navy-700" },
    { id: "scripting", title: "Scripting & Hooks", color: "border-blue-500/30" },
    { id: "filming", title: "Filming / Recording", color: "border-amber-500/30" },
    { id: "editing", title: "Editing & Packaging", color: "border-purple-500/30" },
    { id: "ready", title: "Ready to Publish", color: "border-emerald-500/30" },
  ];

  const moveTask = (taskId: string, direction: "next" | "prev") => {
    const order: VideoTask["stage"][] = ["backlog", "scripting", "filming", "editing", "ready"];
    const updated = tasks.map((t) => {
      if (t.id === taskId) {
        const currentIndex = order.indexOf(t.stage);
        const nextIndex = direction === "next" ? currentIndex + 1 : currentIndex - 1;
        if (nextIndex >= 0 && nextIndex < order.length) {
          return { ...t, stage: order[nextIndex] };
        }
      }
      return t;
    });
    saveTasks(updated);
  };

  const handleAddTask = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTitle.trim()) return;

    const updated = [
      ...tasks,
      {
        id: String(Date.now()),
        title: newTitle.trim(),
        stage: "backlog" as const,
        targetDate: "Next Week",
        type: "Shorts",
      },
    ];
    saveTasks(updated);
    setNewTitle("");
  };

  const deleteTask = (taskId: string) => {
    const updated = tasks.filter((t) => t.id !== taskId);
    saveTasks(updated);
  };

  return (
    <div className="space-y-6 sm:space-y-8 pb-10 max-w-7xl mx-auto">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <h2 className="text-xl sm:text-2xl font-bold text-slate-900 dark:text-white">
              Video Production Pipeline
            </h2>
            <Badge variant="brand">Kanban Studio</Badge>
          </div>
          <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 mt-1">
            End-to-end workflow from concept brainstorming to publishing day
          </p>
        </div>

        {/* Quick Add Form */}
        <form onSubmit={handleAddTask} className="flex items-center gap-2">
          <Input
            placeholder="New video title..."
            value={newTitle}
            onChange={(e) => setNewTitle(e.target.value)}
            className="w-64 text-xs h-9"
          />
          <Button type="submit" size="sm" className="gap-1.5 text-xs h-9 shrink-0">
            <PlusCircle className="h-4 w-4" />
            <span>Add Card</span>
          </Button>
        </form>
      </div>

      {/* Kanban Board Columns */}
      <div className="grid grid-cols-1 md:grid-cols-5 gap-4 overflow-x-auto pb-4">
        {stages.map((col) => {
          const colTasks = tasks.filter((t) => t.stage === col.id);

          return (
            <div
              key={col.id}
              className="flex flex-col rounded-xl border border-slate-200/80 dark:border-navy-800 bg-slate-50/50 dark:bg-navy-950/40 p-3 min-w-[220px]"
            >
              <div className="flex items-center justify-between pb-3 border-b border-slate-200 dark:border-navy-800 mb-3">
                <span className="text-xs font-bold text-slate-900 dark:text-white">
                  {col.title}
                </span>
                <span className="flex h-5 w-5 items-center justify-center rounded-full bg-slate-200 dark:bg-navy-800 text-[11px] font-bold">
                  {colTasks.length}
                </span>
              </div>

              <div className="space-y-2.5 flex-1">
                {colTasks.map((task) => (
                  <Card
                    key={task.id}
                    className="border-slate-200 dark:border-navy-800 p-3 space-y-2 hover:shadow-md transition-shadow"
                  >
                    <div className="flex items-center justify-between">
                      <span className="text-[10px] font-semibold px-1.5 py-0.5 rounded bg-brand-500/10 text-brand-600 dark:text-brand-400">
                        {task.type}
                      </span>
                      <button
                        onClick={() => deleteTask(task.id)}
                        className="text-slate-400 hover:text-rose-500 transition-colors"
                        title="Delete card"
                      >
                        <Trash2 className="h-3 w-3" />
                      </button>
                    </div>

                    <h5 className="text-xs font-bold text-slate-900 dark:text-white line-clamp-2">
                      {task.title}
                    </h5>

                    <div className="flex items-center justify-between pt-2 border-t border-slate-100 dark:border-navy-800/80 text-[10px] text-slate-400">
                      <span>{task.targetDate}</span>

                      {/* Direction Move Buttons */}
                      <div className="flex items-center gap-1">
                        {col.id !== "backlog" && (
                          <button
                            onClick={() => moveTask(task.id, "prev")}
                            className="px-1 py-0.5 rounded bg-slate-100 dark:bg-navy-800 hover:bg-slate-200"
                            title="Move left"
                          >
                            ←
                          </button>
                        )}
                        {col.id !== "ready" && (
                          <button
                            onClick={() => moveTask(task.id, "next")}
                            className="px-1 py-0.5 rounded bg-slate-100 dark:bg-navy-800 hover:bg-slate-200"
                            title="Move right"
                          >
                            →
                          </button>
                        )}
                      </div>
                    </div>
                  </Card>
                ))}

                {colTasks.length === 0 && (
                  <div className="flex h-24 items-center justify-center rounded-lg border border-dashed border-slate-200 dark:border-navy-800 text-[11px] text-slate-400">
                    No cards
                  </div>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
