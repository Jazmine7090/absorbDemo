import { useState, useMemo } from "react";
import { motion } from "framer-motion";
import TopBar from "@/components/dashboard/TopBar";
import MachineCard from "@/components/dashboard/MachineCard";
import AudioControls from "@/components/dashboard/AudioControls";
import SoundChart from "@/components/dashboard/SoundChart";
import AIInsight from "@/components/dashboard/AIInsight";
import SiteMap from "@/components/dashboard/SiteMap";
import AlertLog from "@/components/dashboard/AlertLog";
import AnomalyBanner from "@/components/dashboard/AnomalyBanner";
import { useDashboardState } from "@/hooks/useDashboardState";

const Index = () => {
  const {
    machines,
    logs,
    anomalyMachineId,
    isPlaying,
    confidence,
    triggerNormal,
    triggerFault,
    replayScenario,
  } = useDashboardState();

  const [bannerDismissed, setBannerDismissed] = useState(false);

  const anomalyMachine = useMemo(
    () => machines.find((m) => m.id === anomalyMachineId),
    [machines, anomalyMachineId]
  );

  const hasAnomaly = !!anomalyMachineId;

  const handleFault = () => {
    setBannerDismissed(false);
    triggerFault();
  };

  return (
    <div className="min-h-screen bg-background">
      <TopBar hasAnomaly={hasAnomaly} />

      {!bannerDismissed && (
        <AnomalyBanner
          machineName={anomalyMachine?.name || null}
          onDismiss={() => setBannerDismissed(true)}
        />
      )}

      <main className="p-6 space-y-6">
        {/* Machine Grid */}
        <section>
          <h2 className="text-xs uppercase tracking-widest text-muted-foreground mb-3">
            Machine Monitoring
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
            {machines.map((m) => (
              <MachineCard key={m.id} machine={m} />
            ))}
          </div>
        </section>

        {/* Bottom Panels */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          {/* Left column */}
          <div className="lg:col-span-3 space-y-6">
            <AudioControls
              onNormal={triggerNormal}
              onFault={handleFault}
              onReplay={replayScenario}
              isPlaying={isPlaying}
            />
            <AIInsight
              hasAnomaly={hasAnomaly}
              confidence={confidence}
              machineName={anomalyMachine?.name}
            />
          </div>

          {/* Center column */}
          <div className="lg:col-span-5">
            <SoundChart hasAnomaly={hasAnomaly} />
          </div>

          {/* Right column */}
          <div className="lg:col-span-4 space-y-6">
            <SiteMap machines={machines} anomalyId={anomalyMachineId} />
            <AlertLog logs={logs} />
          </div>
        </div>
      </main>
    </div>
  );
};

export default Index;
