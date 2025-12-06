"use client";

import { useEffect } from "react";
import { Coins, ArrowLeftRight, Shield, Compass, Briefcase, Trophy } from "lucide-react";
import RadialOrbitalTimeline from "@/components/ui/radial-orbital-timeline";
import { analytics, MIXPANEL_EVENTS } from "@/lib/mixpanel";

const timelineData = [
  {
    id: 1,
    title: "Earn",
    date: "Live",
    content: "Put your idle assets to work. Auto-compounding vaults, liquidity mining, and native staking — all optimized for MegaETH's blazing speed.",
    category: "Earn",
    icon: Coins,
    relatedIds: [2],
    status: "completed" as const,
    energy: 100,
  },
  {
    id: 2,
    title: "Swap",
    date: "Live",
    content: "Trade any token in milliseconds. Zero MEV, near-zero slippage. This is what DeFi feels like at 100k TPS.",
    category: "Swap",
    icon: ArrowLeftRight,
    relatedIds: [1, 3],
    status: "completed" as const,
    energy: 95,
  },
  {
    id: 3,
    title: "Hedge",
    date: "Coming Soon",
    content: "Protect your gains with perpetuals and options. Real-time liquidation protection powered by MegaETH's sub-second finality.",
    category: "Hedge",
    icon: Shield,
    relatedIds: [2, 4],
    status: "in-progress" as const,
    energy: 75,
  },
  {
    id: 4,
    title: "Explore",
    date: "Coming Soon",
    content: "Discover alpha before everyone else. Curated opportunities, trending pools, and emerging protocols — all in one place.",
    category: "Explore",
    icon: Compass,
    relatedIds: [3, 5],
    status: "pending" as const,
    energy: 50,
  },
  {
    id: 5,
    title: "Portfolio",
    date: "Coming Soon",
    content: "Your entire DeFi life, unified. Track positions, analyze performance, and manage risk across every protocol on MegaETH.",
    category: "Portfolio",
    icon: Briefcase,
    relatedIds: [4, 6],
    status: "pending" as const,
    energy: 30,
  },
  {
    id: 6,
    title: "Leaderboard",
    date: "Coming Soon",
    content: "Compete for glory. Climb the ranks, earn rewards, and prove you're the best trader on the fastest chain.",
    category: "Leaderboard",
    icon: Trophy,
    relatedIds: [5],
    status: "pending" as const,
    energy: 15,
  },
];

export default function Home() {
  useEffect(() => {
    // Track landing page view
    analytics.track(MIXPANEL_EVENTS.PAGE_VIEW_LANDING);
  }, []);

  return <RadialOrbitalTimeline timelineData={timelineData} />;
}
 