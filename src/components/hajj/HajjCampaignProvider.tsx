"use client";

import { createContext, useContext } from "react";
import type { HajjCampaign } from "@/data/hajj-campaign-types";
import { hajjCampaignLandingPath, hajjCampaignPreRegPath } from "@/data/hajj-campaign-types";

type HajjCampaignContextValue = {
  campaign: HajjCampaign;
  landingPath: string;
  preRegPath: string;
};

const HajjCampaignContext = createContext<HajjCampaignContextValue | null>(null);

export function HajjCampaignProvider({
  campaign,
  children,
}: {
  campaign: HajjCampaign;
  children: React.ReactNode;
}) {
  return (
    <HajjCampaignContext.Provider
      value={{
        campaign,
        landingPath: hajjCampaignLandingPath(campaign.slug),
        preRegPath: hajjCampaignPreRegPath(campaign.slug),
      }}
    >
      {children}
    </HajjCampaignContext.Provider>
  );
}

export function useHajjCampaign() {
  const ctx = useContext(HajjCampaignContext);
  if (!ctx) {
    throw new Error("useHajjCampaign must be used within HajjCampaignProvider");
  }
  return ctx;
}

export function useHajjCampaignOptional() {
  return useContext(HajjCampaignContext);
}
