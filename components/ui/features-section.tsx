"use client";

import { Zap, Repeat, Shield, DollarSign, Globe } from "lucide-react";
import { GlowingEffect } from "@/components/ui/glowing-effect";
import { cn } from "@/lib/utils";

export function FeaturesSection() {
  return (
    <ul className="grid grid-cols-1 grid-rows-none gap-4 md:grid-cols-12 md:grid-rows-3 lg:gap-6 xl:max-h-[34rem] xl:grid-rows-2 max-w-6xl mx-auto">
      <GridItem
        area="md:[grid-area:1/1/2/7] xl:[grid-area:1/1/2/5]"
        icon={<Zap className="h-4 w-4" />}
        title="Instant Settlements"
        description="Execute and settle transactions in milliseconds. No more waiting for traditional banking hours or blockchain confirmations."
      />
      <GridItem
        area="md:[grid-area:1/7/2/13] xl:[grid-area:2/1/3/5]"
        icon={<Repeat className="h-4 w-4" />}
        title="Decentralized Trading"
        description="Trade directly with peers across the globe. No intermediaries, no unnecessary fees, complete control over your assets."
      />
      <GridItem
        area="md:[grid-area:2/1/3/7] xl:[grid-area:1/5/3/9]"
        icon={<Shield className="h-4 w-4" />}
        title="Bank-Grade Security"
        description="Military-grade encryption and multi-signature technology protect your assets. Your keys, your coins, your future."
      />
      <GridItem
        area="md:[grid-area:2/7/3/13] xl:[grid-area:1/9/2/13]"
        icon={<DollarSign className="h-4 w-4" />}
        title="Zero Gas Fees"
        description="Say goodbye to excessive transaction costs. Our optimized infrastructure ensures minimal fees for all operations."
      />
      <GridItem
        area="md:[grid-area:3/1/4/13] xl:[grid-area:2/9/3/13]"
        icon={<Globe className="h-4 w-4" />}
        title="24/7 Global Access"
        description="Markets never sleep, and neither do we. Trade anytime, anywhere with our globally distributed network."
      />
    </ul>
  );
}

interface GridItemProps {
  area: string;
  icon: React.ReactNode;
  title: string;
  description: React.ReactNode;
}

const GridItem = ({ area, icon, title, description }: GridItemProps) => {
  return (
    <li className={cn("min-h-[14rem] list-none", area)}>
      <div className="relative h-full rounded-[1.25rem] border-[0.75px] border-border p-2 md:rounded-[1.5rem] md:p-3">
        <GlowingEffect
          spread={40}
          glow={true}
          disabled={false}
          proximity={64}
          inactiveZone={0.01}
          borderWidth={3}
        />
        <div className="relative flex h-full flex-col justify-between gap-6 overflow-hidden rounded-xl border-[0.75px] bg-card backdrop-blur-sm p-6 shadow-lg md:p-6 dark:bg-night-sky/30">
          <div className="relative flex flex-1 flex-col justify-between gap-3">
            <div className="w-fit rounded-lg border-[0.75px] border-border bg-muted p-2">
              <div className="text-foreground">{icon}</div>
            </div>
            <div className="space-y-3">
              <h3 className="pt-0.5 text-xl leading-[1.375rem] font-semibold font-sans tracking-[-0.04em] md:text-2xl md:leading-[1.875rem] text-balance text-foreground">
                {title}
              </h3>
              <p className="font-sans text-sm leading-[1.125rem] md:text-base md:leading-[1.375rem] text-muted-foreground">
                {description}
              </p>
            </div>
          </div>
        </div>
      </div>
    </li>
  );
};

