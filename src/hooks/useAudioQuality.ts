import { useMemo } from "react";
import type { Machine, Microphone, Zone } from "./useDashboardState";

export type QualityLabel = "Excellent" | "Good" | "Fair" | "Poor";

export interface ZoneAudioQuality {
  zone: Zone;
  zoneName: string;
  score: number;
  label: QualityLabel;
}

const ZONE_NAMES: Record<Zone, string> = {
  A: "Excavation",
  B: "Lifting",
  C: "Compaction",
};

function getLabel(score: number): QualityLabel {
  if (score >= 80) return "Excellent";
  if (score >= 60) return "Good";
  if (score >= 40) return "Fair";
  return "Poor";
}

export function useAudioQuality(
  machines: Machine[],
  microphones: Microphone[],
  avgNoise: number
): ZoneAudioQuality[] {
  return useMemo(() => {
    const zones: Zone[] = ["A", "B", "C"];
    return zones.map((zone) => {
      let score = 100;

      // Factor 1: background noise (high ambient → lower quality)
      if (avgNoise > 95) score -= 25;
      else if (avgNoise > 85) score -= 15;
      else if (avgNoise > 75) score -= 5;

      // Factor 2: overlapping loud machines in zone
      const zoneMachines = machines.filter((m) => m.zone === zone);
      const loudMachines = zoneMachines.filter((m) => m.dbLevel > 85);
      score -= loudMachines.length * 10;

      // Factor 3: anomalous machines in zone
      const anomalyMachines = zoneMachines.filter((m) => m.status === "anomaly");
      score -= anomalyMachines.length * 8;

      // Factor 4: microphone health in zone
      const zoneMics = microphones.filter((m) => m.zone === zone);
      const degradedMics = zoneMics.filter((m) => m.health === "degraded");
      const offlineMics = zoneMics.filter((m) => m.health === "offline");
      const lowBatteryMics = zoneMics.filter((m) => m.battery < 30);
      score -= degradedMics.length * 8;
      score -= offlineMics.length * 15;
      score -= lowBatteryMics.length * 5;

      // Clamp
      score = Math.max(0, Math.min(100, score));

      return {
        zone,
        zoneName: ZONE_NAMES[zone],
        score,
        label: getLabel(score),
      };
    });
  }, [machines, microphones, avgNoise]);
}
