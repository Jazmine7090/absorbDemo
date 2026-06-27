import { useState, useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Briefcase, HardHat, Activity, Radio, BarChart2, ShieldCheck, Lock } from "lucide-react";
import TopBar from "@/components/dashboard/TopBar";
import FaultAlarmBanner from "@/components/dashboard/FaultAlarmBanner";
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

// Section heading component for consistent styling
const SectionHeader = ({
  icon: Icon,
  title,
  accent = false,
}: {
  icon: React.ElementType;
  title: string;
  accent?: boolean;
}) => (
  <div className="flex items-center gap-2 mb-3">
    <div
      className="w-5 h-5 rounded flex items-center justify-center"
      style={{
        background: accent ? "rgba(20,181,217,0.15)" : "rgba(17,58,140,0.1)",
        color: accent ? "#14B5D9" : "#113A8C",
      }}
    >
      <Icon className="w-3 h-3" />
    </div>
    <h2 className="text-xs uppercase tracking-widest text-muted-foreground">{title}</h2>
    <div className="flex-1 h-px bg-border/60" />
  </div>
);

// Locked feature placeholder for operators
const LockedFeature = ({ label }: { label: string }) => (
  <motion.div
    initial={{ opacity: 0 }}
    animate={{ opacity: 1 }}
    className="flex flex-col items-center justify-center gap-2 p-6 rounded-xl border border-dashed border-border bg-muted/30 text-center"
  >
    <Lock className="w-5 h-5 text-muted-foreground/50" />
    <p className="text-xs text-muted-foreground/70">{label}</p>
    <p className="text-[10px] text-muted-foreground/50">Switch to Manager view to access</p>
  </motion.div>
);

const Index = () => {
  const {
    machines,
    allMachines,
    microphones,
    allMicrophones,
    logs,
    anomalyMachineId,
    isPlaying,
    isLoopingFault,
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
    acknowledgeActiveAlert,
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
  const isManager = viewRole === "manager";

  const handleFault = () => {
    setBannerDismissed(false);
    triggerFault();
  };

  const handleAcknowledgeActive = () => {
    setBannerDismissed(true);
    acknowledgeActiveAlert();
  };

  // Audio quality uses all machines/mics (not filtered) for zone-level assessment
  const audioQualities = useAudioQuality(allMachines, allMicrophones, avgNoise);

  return (
    <div className="min-h-screen bg-background">
      <TopBar hasAnomaly={hasAnomaly} viewRole={viewRole} />

      {/* Persistent fault alarm — stays until acknowledged */}
      <FaultAlarmBanner
        isActive={isLoopingFault}
        machineName={anomalyMachine?.name ?? null}
        onAcknowledge={handleAcknowledgeActive}
      />

      {/* Role context banner */}
      <AnimatePresence mode="wait">
        <motion.div
          key={viewRole}
          initial={{ opacity: 0, y: -6 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -6 }}
          className="px-6 py-2 flex items-center gap-2 border-b border-border/50"
          style={{
            background: isManager
              ? "linear-gradient(90deg, rgba(124,79,10,0.07) 0%, transparent 60%)"
              : "linear-gradient(90deg, rgba(17,58,140,0.06) 0%, transparent 60%)",
          }}
        >
          {isManager ? (
            <>
              <Briefcase className="w-3.5 h-3.5" style={{ color: "#f59e0b" }} />
              <span className="text-[11px] font-medium" style={{ color: "#f59e0b" }}>Manager View</span>
              <span className="text-[11px] text-muted-foreground">— Full analytics, audio simulation, and alert resolution enabled</span>
            </>
          ) : (
            <>
              <HardHat className="w-3.5 h-3.5 text-accent" />
              <span className="text-[11px] font-medium text-accent">Operator View</span>
              <span className="text-[11px] text-muted-foreground">— Live machine monitoring and alert acknowledgement</span>
            </>
          )}
        </motion.div>
      </AnimatePresence>

      {/* Secondary info banner — only when anomaly exists but alarm is already acknowledged */}
      {!bannerDismissed && !isLoopingFault && (
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

        {/* Machine Grid — visible to all */}
        <section>
          <SectionHeader icon={Activity} title={`Machine Monitoring${selectedZone !== "all" ? ` — Zone ${selectedZone}` : ""}`} />
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
            {machines.map((m) => (
              <MachineCard key={m.id} machine={m} />
            ))}
          </div>
        </section>

        {/* Manager-only: Audio Quality Assessment */}
        {isManager && (
          <motion.section
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
          >
            <SectionHeader icon={BarChart2} title="Zone Audio Quality Assessment" accent />
            <AudioQualityPanel qualities={audioQualities} />
          </motion.section>
        )}

        {/* Bottom Panels */}
        <AnimatePresence mode="wait">
          <motion.div
            key={viewRole}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="grid grid-cols-1 lg:grid-cols-12 gap-6"
          >
            {/* Left column */}
            <div className="lg:col-span-3 space-y-6">
              {isManager ? (
                <>
                  {/* Managers get audio simulation */}
                  <div>
                    <SectionHeader icon={Radio} title="Audio Simulation" accent />
                    <AudioControls
                      onNormal={triggerNormal}
                      onFault={handleFault}
                      onReplay={replayScenario}
                      isPlaying={isPlaying}
                    />
                  </div>
                  <AIInsight
                    hasAnomaly={hasAnomaly}
                    confidence={confidence}
                    machineName={anomalyMachine?.name}
                    micIssues={micIssues}
                  />
                </>
              ) : (
                <>
                  {/* Operators see locked analytics */}
                  <div>
                    <SectionHeader icon={Radio} title="Audio Simulation" />
                    <LockedFeature label="Audio Simulation" />
                  </div>
                  <div>
                    <SectionHeader icon={ShieldCheck} title="AI Insight" />
                    <LockedFeature label="AI Anomaly Analysis" />
                  </div>
                </>
              )}
              <EnvironmentalCard temperature={temperature} avgNoise={avgNoise} />
            </div>

            {/* Center column */}
            <div className="lg:col-span-5 space-y-6">
              {isManager ? (
                <>
                  <div>
                    <SectionHeader icon={BarChart2} title="Sound Analysis" accent />
                    <SoundChart hasAnomaly={hasAnomaly} />
                  </div>
                </>
              ) : null}
              <MicrophonePanel microphones={microphones} />
            </div>

            {/* Right column */}
            <div className="lg:col-span-4 space-y-6">
              <SiteMap machines={machines} anomalyId={anomalyMachineId} />
              <AlertLog
                logs={logs}
                onAcknowledge={acknowledgeAlert}
                onResolve={resolveAlert}
                canResolve={isManager}
              />
            </div>
          </motion.div>
        </AnimatePresence>
      </main>
    </div>
  );
};

export default Index;
