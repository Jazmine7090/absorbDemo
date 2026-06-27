import { useState, useCallback, useRef } from "react";

export type Zone = "A" | "B" | "C";
export type ViewRole = "operator" | "manager";
export type AlertState = "active" | "acknowledged" | "resolved";
export type MicHealth = "healthy" | "degraded" | "offline";
export type MicConnectivity = "online" | "intermittent" | "offline";

export interface Machine {
  id: string;
  name: string;
  type: string;
  icon: string;
  status: "normal" | "anomaly";
  dbLevel: number;
  position: { x: number; y: number };
  zone: Zone;
}

export interface Microphone {
  id: string;
  name: string;
  zone: Zone;
  health: MicHealth;
  battery: number;
  processorBattery: number;
  connectivity: MicConnectivity;
  lastCalibration: string;
}

export interface LogEntry {
  id: string;
  time: string;
  message: string;
  type: "normal" | "anomaly" | "info" | "sensor";
  alertState?: AlertState;
  operatorNote?: string;
}

const INITIAL_MACHINES: Machine[] = [
  { id: "m1", name: "Excavator #1", type: "excavator", icon: "hardhat", status: "normal", dbLevel: 72, position: { x: 20, y: 30 }, zone: "A" },
  { id: "m2", name: "Crane #2", type: "crane", icon: "crane", status: "normal", dbLevel: 65, position: { x: 60, y: 20 }, zone: "B" },
  { id: "m3", name: "Bulldozer #3", type: "bulldozer", icon: "tractor", status: "normal", dbLevel: 78, position: { x: 40, y: 60 }, zone: "A" },
  { id: "m4", name: "Loader #4", type: "loader", icon: "truck", status: "normal", dbLevel: 68, position: { x: 75, y: 55 }, zone: "B" },
  { id: "m5", name: "Compactor #5", type: "compactor", icon: "wrench", status: "normal", dbLevel: 70, position: { x: 15, y: 70 }, zone: "C" },
];

const INITIAL_MICROPHONES: Microphone[] = [
  { id: "mic1", name: "Mic A – North Edge", zone: "A", health: "healthy", battery: 85, processorBattery: 78, connectivity: "online", lastCalibration: "2026-03-20" },
  { id: "mic2", name: "Mic B – East Side", zone: "A", health: "healthy", battery: 72, processorBattery: 65, connectivity: "online", lastCalibration: "2026-03-18" },
  { id: "mic3", name: "Mic C – South Edge", zone: "B", health: "degraded", battery: 45, processorBattery: 38, connectivity: "intermittent", lastCalibration: "2026-03-15" },
  { id: "mic4", name: "Mic D – West Side", zone: "B", health: "healthy", battery: 91, processorBattery: 88, connectivity: "online", lastCalibration: "2026-03-21" },
  { id: "mic6", name: "Mic F – North Side", zone: "C", health: "offline", battery: 5, processorBattery: 3, connectivity: "offline", lastCalibration: "2026-03-10" },
];

const getTimeString = () => {
  const now = new Date();
  return now.toLocaleTimeString("en-US", { hour: "2-digit", minute: "2-digit", second: "2-digit", hour12: false });
};

export function useDashboardState() {
  const [machines, setMachines] = useState<Machine[]>(INITIAL_MACHINES);
  const [microphones] = useState<Microphone[]>(INITIAL_MICROPHONES);
  const [logs, setLogs] = useState<LogEntry[]>([
    { id: "init", time: getTimeString(), message: "System initialized — All machines nominal", type: "info" },
  ]);
  const [anomalyMachineId, setAnomalyMachineId] = useState<string | null>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [isLoopingFault, setIsLoopingFault] = useState(false);
  const [confidence, setConfidence] = useState(0);
  const [selectedZone, setSelectedZone] = useState<Zone | "all">("all");
  const [viewRole, setViewRole] = useState<ViewRole>("operator");
  const [temperature] = useState(42);
  const [avgNoise, setAvgNoise] = useState(87);

  const audioCtxRef = useRef<AudioContext | null>(null);
  const replayTimeoutRef = useRef<number | null>(null);
  const faultLoopRef = useRef<number | null>(null);

  const addLog = useCallback((message: string, type: LogEntry["type"], alertState?: AlertState) => {
    setLogs((prev) => [{ id: crypto.randomUUID(), time: getTimeString(), message, type, alertState }, ...prev].slice(0, 50));
  }, []);

  const acknowledgeAlert = useCallback((logId: string, note?: string) => {
    setLogs((prev) =>
      prev.map((l) =>
        l.id === logId ? { ...l, alertState: "acknowledged" as AlertState, operatorNote: note || l.operatorNote } : l
      )
    );
  }, []);

  const resolveAlert = useCallback((logId: string) => {
    setLogs((prev) =>
      prev.map((l) => (l.id === logId ? { ...l, alertState: "resolved" as AlertState } : l))
    );
  }, []);

  // stopFaultLoop must be declared before any callback that depends on it
  const stopFaultLoop = useCallback(() => {
    if (faultLoopRef.current) {
      clearInterval(faultLoopRef.current);
      faultLoopRef.current = null;
    }
    setIsLoopingFault(false);
  }, []);

  const acknowledgeActiveAlert = useCallback(() => {
    stopFaultLoop();
    // Reset dashboard to normal
    setAnomalyMachineId(null);
    setMachines(INITIAL_MACHINES.map((m) => ({ ...m, dbLevel: 65 + Math.random() * 15 })));
    setConfidence(0);
    setAvgNoise(75 + Math.floor(Math.random() * 15));
    // Mark active alert as acknowledged in log
    setLogs((prev) => {
      const activeLog = prev.find((l) => l.alertState === "active");
      if (!activeLog) return prev;
      return prev.map((l) =>
        l.id === activeLog.id ? { ...l, alertState: "acknowledged" as AlertState } : l
      );
    });
  }, [stopFaultLoop]);

  const getAudioCtx = () => {
    if (!audioCtxRef.current) audioCtxRef.current = new AudioContext();
    return audioCtxRef.current;
  };

  const playSound = (faulty: boolean) => {
    const ctx = getAudioCtx();
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();
    osc.connect(gain);
    gain.connect(ctx.destination);

    if (faulty) {
      gain.gain.setValueAtTime(0.18, ctx.currentTime);
      osc.type = "sawtooth";
      osc.frequency.setValueAtTime(120, ctx.currentTime);
      osc.frequency.linearRampToValueAtTime(420, ctx.currentTime + 0.5);
      osc.frequency.linearRampToValueAtTime(80, ctx.currentTime + 1.0);
      osc.frequency.linearRampToValueAtTime(360, ctx.currentTime + 1.5);
      osc.frequency.linearRampToValueAtTime(90, ctx.currentTime + 2.0);
      osc.frequency.linearRampToValueAtTime(300, ctx.currentTime + 2.5);
      osc.frequency.linearRampToValueAtTime(60, ctx.currentTime + 3.0);
      osc.frequency.linearRampToValueAtTime(250, ctx.currentTime + 3.5);
      osc.start();
      gain.gain.setValueAtTime(0.18, ctx.currentTime + 3.0);
      gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 4.5);
      osc.stop(ctx.currentTime + 4.5);
    } else {
      gain.gain.value = 0.15;
      osc.type = "sine";
      osc.frequency.value = 180;
      osc.start();
      gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 1);
      osc.stop(ctx.currentTime + 1);
    }
  };

  const getMicConfidenceReduction = useCallback((zone?: Zone) => {
    const zoneMics = zone ? microphones.filter((m) => m.zone === zone) : microphones;
    const offlineOrLow = zoneMics.filter((m) => m.health === "offline" || m.battery < 30);
    return offlineOrLow.length * 5;
  }, [microphones]);

  const triggerNormal = useCallback(() => {
    stopFaultLoop();
    setIsPlaying(true);
    playSound(false);
    setMachines(INITIAL_MACHINES.map((m) => ({ ...m, dbLevel: 65 + Math.random() * 15 })));
    setAnomalyMachineId(null);
    setConfidence(0);
    setAvgNoise(75 + Math.floor(Math.random() * 15));
    addLog("Normal sound played — All systems nominal", "normal");
    setTimeout(() => setIsPlaying(false), 1000);
  }, [addLog, stopFaultLoop]);

  const triggerFault = useCallback(() => {
    stopFaultLoop();
    setIsPlaying(true);
    playSound(true);
    const targetIdx = Math.floor(Math.random() * INITIAL_MACHINES.length);
    const target = INITIAL_MACHINES[targetIdx];
    setMachines((prev) =>
      prev.map((m, i) =>
        i === targetIdx
          ? { ...m, status: "anomaly" as const, dbLevel: 92 + Math.random() * 8 }
          : { ...m, status: "normal" as const }
      )
    );
    setAnomalyMachineId(target.id);
    const baseConf = 88 + Math.floor(Math.random() * 10);
    const reduction = getMicConfidenceReduction(target.zone);
    setConfidence(Math.max(baseConf - reduction, 50));
    setAvgNoise(88 + Math.floor(Math.random() * 12));
    addLog(`Anomaly detected in ${target.name} (Zone ${target.zone})`, "anomaly", "active");
    setTimeout(() => setIsPlaying(false), 4500);
    // Loop fault audio every 5.5s until acknowledged
    setIsLoopingFault(true);
    faultLoopRef.current = window.setInterval(() => {
      playSound(true);
    }, 5500);
  }, [addLog, getMicConfidenceReduction, stopFaultLoop]);

  const replayScenario = useCallback(() => {
    if (replayTimeoutRef.current) return;
    addLog("Replay scenario started", "info");
    triggerNormal();
    replayTimeoutRef.current = window.setTimeout(() => {
      triggerFault();
      replayTimeoutRef.current = window.setTimeout(() => {
        triggerNormal();
        addLog("Replay scenario completed", "info");
        replayTimeoutRef.current = null;
      }, 5500);
    }, 3000);
  }, [triggerNormal, triggerFault, addLog]);

  const filteredMachines = selectedZone === "all" ? machines : machines.filter((m) => m.zone === selectedZone);
  const filteredMicrophones = selectedZone === "all" ? microphones : microphones.filter((m) => m.zone === selectedZone);

  const zonesMonitored = new Set(machines.map((m) => m.zone)).size;
  const machinesInAnomaly = machines.filter((m) => m.status === "anomaly").length;
  const activeAlerts = logs.filter((l) => l.alertState === "active").length;
  const microphonesOffline = microphones.filter((m) => m.health === "offline").length;

  return {
    machines: filteredMachines,
    allMachines: machines,
    microphones: filteredMicrophones,
    allMicrophones: microphones,
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
    kpis: { zonesMonitored, machinesInAnomaly, activeAlerts, microphonesOffline },
  };
}
