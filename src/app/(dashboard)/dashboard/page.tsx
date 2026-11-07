"use client";

import * as React from "react";
import { WelcomeBanner } from "@/components/dashboard/welcome-banner";
import { ChannelSection } from "@/components/dashboard/channel-section";
import { MetricsGrid } from "@/components/dashboard/metrics-grid";
import { DailyTrendOverview } from "@/components/dashboard/daily-trend-overview";
import { ContentWorkflowOverview } from "@/components/dashboard/content-workflow-overview";
import { GettingStartedChecklist } from "@/components/dashboard/getting-started";
import { QuickActions } from "@/components/dashboard/quick-actions";
import { RecentActivity } from "@/components/dashboard/recent-activity";
import { ConnectChannelModal } from "@/components/dashboard/connect-channel-modal";

export default function DashboardPage() {
  const [isConnectModalOpen, setIsConnectModalOpen] = React.useState(false);

  return (
    <div className="space-y-6 sm:space-y-8 pb-10">
      {/* 1. Header: Welcome Banner & Quick Status */}
      <WelcomeBanner onConnectClick={() => setIsConnectModalOpen(true)} />

      {/* 2. Connected Channel Section & Auto-Researched DNA */}
      <ChannelSection onConnectClick={() => setIsConnectModalOpen(true)} />

      {/* 3. PRD 3.2.B: 6 Core Channel Overview Cards (Subscribers, Views, Videos, Shorts, Audit, Sync) */}
      <MetricsGrid onConnectClick={() => setIsConnectModalOpen(true)} />

      {/* 4. PRD 3.2.C: Daily Trend Overview (Channel-aware breakout trends with "Write Script" handoff) */}
      <DailyTrendOverview />

      {/* 5. PRD 3.2.D: Content Workflow Overview (6-stage production tracking from Script to Published) */}
      <ContentWorkflowOverview />

      {/* 6. Getting Started Checklist & PRD 3.2.E Recent Activity */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2">
          <GettingStartedChecklist onConnectClick={() => setIsConnectModalOpen(true)} />
        </div>
        <div className="lg:col-span-1">
          <RecentActivity />
        </div>
      </div>

      {/* 7. Quick Action Cards */}
      <QuickActions />

      {/* Connect Channel Modal */}
      <ConnectChannelModal
        isOpen={isConnectModalOpen}
        onClose={() => setIsConnectModalOpen(false)}
      />
    </div>
  );
}
