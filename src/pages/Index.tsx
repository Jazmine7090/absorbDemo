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
import KPISummaryBar from "@/components/dashboard/KPISummaryBar";
import MicrophonePanel from "@/components/dashboard/MicrophonePanel";
import EnvironmentalCard from "@/components/dashboard/EnvironmentalCard";
import ZoneRoleToggle from "@/components/dashboard/ZoneRoleToggle";
import AudioQualityPanel from "@/components/dashboard/AudioQualityPanel";
import { useDashboardState } from "@/hooks/useDashboardState";
import { useAudioQuality } from "@/hooks/useAudioQuality";

const Index = () => {
  const {
    machines,
    allMachines,
    microphones,
    allMicrophones,
    logs,
    anomalyMachineId,
    isPlaying,
    confidence,
    selectedZone,
    setSelectedZone,
    viewRole,
    setViewRole,
    temperature,
    avgNoise,
    triggerNormal,
    triggerFault,
    replayScenario,
    acknowledgeAlert,
    resolveAlert,
    kpis,
  } = useDashboardState();

  const [bannerDismissed, setBannerDismissed] = useState(false);

  const anomalyMachine = useMemo(
    () => allMachines.find((m) => m.id === anomalyMachineId),
    [allMachines, anomalyMachineId]
  );

  const hasAnomaly = !!anomalyMachineId;
  const micIssues = microphones.some((m) => m.health === "offline" || m.battery < 30);

  const handleFault = () => {
    setBannerDismissed(false);
    triggerFault();
  };

  const isOperator = viewRole === "operator";

  // Audio quality uses all machines/mics (not filtered) for zone-level assessment
  const audioQualities = useAudioQuality(allMachines, allMicrophones, avgNoise);

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
        {/* Zone/Role Toggle + KPI Bar */}
        <div className="space-y-4">
          <ZoneRoleToggle
            selectedZone={selectedZone}
            onZoneChange={setSelectedZone}
            viewRole={viewRole}
            onRoleChange={setViewRole}
          />
          <KPISummaryBar {...kpis} />
        </div>

        {/* Machine Grid */}
        <section>
          <h2 className="text-xs uppercase tracking-widest text-muted-foreground mb-3">
            Machine Monitoring {selectedZone !== "all" ? `— Zone ${selectedZone}` : ""}
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
            {machines.map((m) => (
              <MachineCard key={m.id} machine={m} />
            ))}
          </div>
        </section>

        {/* Audio Quality Assessment */}
        <AudioQualityPanel qualities={audioQualities} />

        {/* Bottom Panels */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          {/* Left column */}
          <div className="lg:col-span-3 space-y-6">
            {isOperator && (
              <AudioControls
                onNormal={triggerNormal}
                onFault={handleFault}
                onReplay={replayScenario}
                isPlaying={isPlaying}
              />
            )}
            <AIInsight
              hasAnomaly={hasAnomaly}
              confidence={confidence}
              machineName={anomalyMachine?.name}
              micIssues={micIssues}
            />
            <EnvironmentalCard temperature={temperature} avgNoise={avgNoise} />
          </div>

          {/* Center column */}
          <div className="lg:col-span-5 space-y-6">
            {isOperator && <SoundChart hasAnomaly={hasAnomaly} />}
            <MicrophonePanel microphones={microphones} />
          </div>

          {/* Right column */}
          <div className="lg:col-span-4 space-y-6">
            <SiteMap machines={machines} anomalyId={anomalyMachineId} />
            <AlertLog
              logs={logs}
              onAcknowledge={acknowledgeAlert}
              onResolve={resolveAlert}
            />
          </div>
        </div>
      </main>
    </div>
  );
};

export default Index;
