"use client";

import * as React from "react";
import { WelcomeBanner } from "@/components/dashboard/welcome-banner";
import { ChannelSection } from "@/components/dashboard/channel-section";
import { MetricsGrid } from "@/components/dashboard/metrics-grid";
import { GettingStartedChecklist } from "@/components/dashboard/getting-started";
import { QuickActions } from "@/components/dashboard/quick-actions";
import { RecentActivity } from "@/components/dashboard/recent-activity";
import { ConnectChannelModal } from "@/components/dashboard/connect-channel-modal";

export default function DashboardPage() {
  const [isConnectModalOpen, setIsConnectModalOpen] = React.useState(false);

  return (
    <div className="space-y-6 sm:space-y-8 pb-10">
      {/* 1. Welcome Message & Quick Status */}
      <WelcomeBanner onConnectClick={() => setIsConnectModalOpen(true)} />

      {/* 2. Connected Channel Section */}
      <ChannelSection onConnectClick={() => setIsConnectModalOpen(true)} />

      {/* 3. 3 Core Metric Cards (Views, Subscribers, Videos with empty states) */}
      <MetricsGrid onConnectClick={() => setIsConnectModalOpen(true)} />

      {/* 4. Getting Started Checklist & Recent Activity */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2">
          <GettingStartedChecklist onConnectClick={() => setIsConnectModalOpen(true)} />
        </div>
        <div className="lg:col-span-1">
          <RecentActivity />
        </div>
      </div>

      {/* 5. Quick Action Cards */}
      <QuickActions />

      {/* Connect Channel Modal */}
      <ConnectChannelModal
        isOpen={isConnectModalOpen}
        onClose={() => setIsConnectModalOpen(false)}
      />
    </div>
  );
}
