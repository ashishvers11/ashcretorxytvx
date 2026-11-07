"use client";

import React, { useState } from "react";
import { WelcomeSection } from "@/components/dashboard/welcome-section";
import { ChannelConnectCard } from "@/components/dashboard/channel-connect-card";
import { QuickAccessGrid } from "@/components/dashboard/quick-access-grid";
import { GettingStartedChecklist } from "@/components/dashboard/getting-started-checklist";
import { RecentActivityCard } from "@/components/dashboard/recent-activity-card";
import { WorkflowGuidance } from "@/components/dashboard/workflow-guidance";
import { ConnectChannelModal } from "@/components/dashboard/connect-channel-modal";

export default function DashboardPage() {
  const [isConnectModalOpen, setIsConnectModalOpen] = useState(false);

  const handleOpenConnectModal = () => {
    setIsConnectModalOpen(true);
  };

  const handleCloseConnectModal = () => {
    setIsConnectModalOpen(false);
  };

  const handleExploreClick = () => {
    const quickAccessElement = document.getElementById("quick-access");
    if (quickAccessElement) {
      quickAccessElement.scrollIntoView({ behavior: "smooth" });
    }
  };

  return (
    <div className="space-y-8 max-w-7xl mx-auto pb-12">
      {/* Section A: Welcome Heading & Useful Intro */}
      <section aria-label="Welcome Overview">
        <WelcomeSection
          onConnectClick={handleOpenConnectModal}
          onExploreClick={handleExploreClick}
        />
      </section>

      {/* Section B: YouTube Channel Connection Card (Unconnected state, explanation, visual placeholder) */}
      <section aria-label="YouTube Channel Setup">
        <ChannelConnectCard onConnectClick={handleOpenConnectModal} />
      </section>

      {/* Section C: Quick Access Section (Cards for 8 Core Modules) */}
      <section aria-label="Quick Access Modules">
        <QuickAccessGrid />
      </section>

      {/* Section D: Getting Started Onboarding Checklist (6 uncompleted onboarding steps) */}
      <section aria-label="Getting Started Checklist">
        <GettingStartedChecklist onConnectClick={handleOpenConnectModal} />
      </section>

      {/* Section E: Recent Activity Section (Polished empty state, zero fake entries) */}
      <section aria-label="Recent Activity">
        <RecentActivityCard />
      </section>

      {/* Section F: Dashboard Guidance (End-to-end creator workflow explanation) */}
      <section aria-label="Workflow Guidance">
        <WorkflowGuidance />
      </section>

      {/* Accessible Step 2 Placeholder Modal */}
      <ConnectChannelModal
        isOpen={isConnectModalOpen}
        onClose={handleCloseConnectModal}
      />
    </div>
  );
}
