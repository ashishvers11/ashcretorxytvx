"use client";

import * as React from "react";
import {
  Calendar as CalendarIcon,
  Clock,
  PlusCircle,
  Video,
  Sparkles,
  Flame,
  CheckCircle2,
} from "lucide-react";
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";

export default function ContentCalendarPage() {
  const [scheduledItems, setScheduledItems] = React.useState([
    {
      id: "1",
      day: "Friday",
      date: "Nov 7",
      time: "6:30 PM",
      title: "लौंग असल में फूल है या फल? (The Science Behind Cloves)",
      type: "Long-form",
      status: "Scheduled",
      isPeakWindow: true,
    },
    {
      id: "2",
      day: "Sunday",
      date: "Nov 9",
      time: "7:00 PM",
      title: "अगर धरती 5 सेकंड के लिए घूमना बंद कर दे तो क्या होगा?",
      type: "Shorts",
      status: "Scheduled",
      isPeakWindow: true,
    },
    {
      id: "3",
      day: "Wednesday",
      date: "Nov 12",
      time: "5:00 PM",
      title: "हवाई जहाज का रंग हमेशा सफेद क्यों होता है? (Aviation Truth)",
      type: "Long-form",
      status: "Planned",
      isPeakWindow: false,
    },
    {
      id: "4",
      day: "Friday",
      date: "Nov 14",
      time: "6:30 PM",
      title: "मोबाइल बैटरी को 80% पर ही क्यों रोकना चाहिए? Chemistry Explainer",
      type: "Long-form",
      status: "Planned",
      isPeakWindow: true,
    },
  ]);

  const [newTitle, setNewTitle] = React.useState("");
  const [newDay, setNewDay] = React.useState("Friday");
  const [newTime, setNewTime] = React.useState("6:30 PM");
  const [newType, setNewType] = React.useState("Long-form");

  const handleSchedule = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTitle.trim()) return;

    setScheduledItems([
      ...scheduledItems,
      {
        id: String(Date.now()),
        day: newDay,
        date: "Upcoming",
        time: newTime,
        title: newTitle.trim(),
        type: newType,
        status: "Scheduled",
        isPeakWindow: newDay === "Friday" || newDay === "Sunday",
      },
    ]);
    setNewTitle("");
  };

  return (
    <div className="space-y-6 sm:space-y-8 pb-10 max-w-6xl mx-auto">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <h2 className="text-xl sm:text-2xl font-bold text-slate-900 dark:text-white">
              Content Cadence & Publishing Calendar
            </h2>
            <Badge variant="brand">Algorithm Sync</Badge>
          </div>
          <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 mt-1">
            Maintain optimal upload rhythm to trigger YouTube algorithm subscriber push notifications
          </p>
        </div>

        {/* Streak Badge */}
        <div className="flex items-center gap-2 rounded-xl border border-amber-500/20 bg-amber-500/10 px-3 py-1.5 text-xs font-bold text-amber-600 dark:text-amber-400">
          <Flame className="h-4 w-4" />
          <span>3-Week Upload Streak Active</span>
        </div>
      </div>

      {/* Schedule Form */}
      <Card className="border-slate-200/80 dark:border-navy-800 p-5">
        <form onSubmit={handleSchedule} className="space-y-3">
          <h4 className="text-xs font-bold uppercase tracking-wider text-slate-400">
            Schedule Upcoming Release
          </h4>

          <div className="grid grid-cols-1 sm:grid-cols-4 gap-3">
            <div className="sm:col-span-2">
              <Input
                placeholder="Video title to schedule..."
                value={newTitle}
                onChange={(e) => setNewTitle(e.target.value)}
                required
              />
            </div>

            <div>
              <select
                value={newDay}
                onChange={(e) => setNewDay(e.target.value)}
                className="flex h-10 w-full rounded-lg border border-slate-300 dark:border-navy-700 bg-white dark:bg-navy-950 px-3 text-xs text-slate-900 dark:text-slate-100"
              >
                <option value="Friday">Friday (Peak Window)</option>
                <option value="Sunday">Sunday (Peak Window)</option>
                <option value="Wednesday">Wednesday</option>
                <option value="Saturday">Saturday</option>
                <option value="Monday">Monday</option>
              </select>
            </div>

            <div>
              <Button type="submit" className="w-full gap-2 text-xs">
                <PlusCircle className="h-4 w-4" />
                <span>Schedule Video</span>
              </Button>
            </div>
          </div>
        </form>
      </Card>

      {/* Calendar Scheduled Feed */}
      <div className="space-y-3">
        <h3 className="text-sm font-bold uppercase tracking-wider text-slate-400">
          Upcoming Publishing Schedule
        </h3>

        <div className="space-y-3">
          {scheduledItems.map((item) => (
            <Card
              key={item.id}
              className="border-slate-200/80 dark:border-navy-800 p-5 flex flex-col sm:flex-row sm:items-center justify-between gap-4"
            >
              <div className="flex items-start gap-4">
                <div className="flex h-12 w-12 shrink-0 flex-col items-center justify-center rounded-xl bg-slate-100 dark:bg-navy-800 text-center">
                  <span className="text-[10px] uppercase font-bold text-slate-400">
                    {item.day.slice(0, 3)}
                  </span>
                  <span className="text-xs font-black text-slate-900 dark:text-white">
                    {item.date.split(" ")[1] || "1"}
                  </span>
                </div>

                <div className="space-y-1">
                  <div className="flex flex-wrap items-center gap-2">
                    <span className="text-xs font-bold text-slate-900 dark:text-white">
                      {item.title}
                    </span>
                    <Badge variant="outline" className="text-[10px]">
                      {item.type}
                    </Badge>
                    {item.isPeakWindow && (
                      <Badge variant="brand" className="text-[10px]">
                        ★ Peak Audience Window
                      </Badge>
                    )}
                  </div>

                  <p className="text-xs text-slate-400 flex items-center gap-1.5">
                    <Clock className="h-3 w-3" />
                    <span>Scheduled for {item.day} at {item.time}</span>
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-3 self-end sm:self-auto shrink-0">
                <span className="flex items-center gap-1.5 text-xs text-emerald-500 font-semibold">
                  <CheckCircle2 className="h-4 w-4" />
                  <span>{item.status}</span>
                </span>
              </div>
            </Card>
          ))}
        </div>
      </div>
    </div>
  );
}
