import { useState, useCallback, useRef } from "react";

export interface Machine {
  id: string;
  name: string;
  type: string;
  icon: string;
  status: "normal" | "anomaly";
  dbLevel: number;
  position: { x: number; y: number };
}

export interface LogEntry {
  id: string;
  time: string;
  message: string;
  type: "normal" | "anomaly" | "info";
}

const INITIAL_MACHINES: Machine[] = [
  { id: "m1", name: "Excavator #1", type: "excavator", icon: "🏗️", status: "normal", dbLevel: 72, position: { x: 20, y: 30 } },
  { id: "m2", name: "Crane #2", type: "crane", icon: "🏗️", status: "normal", dbLevel: 65, position: { x: 60, y: 20 } },
  { id: "m3", name: "Bulldozer #3", type: "bulldozer", icon: "🚜", status: "normal", dbLevel: 78, position: { x: 40, y: 60 } },
  { id: "m4", name: "Loader #4", type: "loader", icon: "🚛", status: "normal", dbLevel: 68, position: { x: 75, y: 55 } },
  { id: "m5", name: "Compactor #5", type: "compactor", icon: "🔧", status: "normal", dbLevel: 70, position: { x: 15, y: 70 } },
];

const getTimeString = () => {
  const now = new Date();
  return now.toLocaleTimeString("en-US", { hour: "2-digit", minute: "2-digit", second: "2-digit", hour12: false });
};

export function useDashboardState() {
  const [machines, setMachines] = useState<Machine[]>(INITIAL_MACHINES);
  const [logs, setLogs] = useState<LogEntry[]>([
    { id: "init", time: getTimeString(), message: "System initialized — All machines nominal", type: "info" },
  ]);
  const [anomalyMachineId, setAnomalyMachineId] = useState<string | null>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [confidence, setConfidence] = useState(0);
  const audioCtxRef = useRef<AudioContext | null>(null);
  const replayTimeoutRef = useRef<number | null>(null);

  const addLog = useCallback((message: string, type: LogEntry["type"]) => {
    setLogs((prev) => [{ id: crypto.randomUUID(), time: getTimeString(), message, type }, ...prev].slice(0, 50));
  }, []);

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
    gain.gain.value = 0.15;

    if (faulty) {
      osc.type = "sawtooth";
      osc.frequency.setValueAtTime(120, ctx.currentTime);
      osc.frequency.linearRampToValueAtTime(400, ctx.currentTime + 0.3);
      osc.frequency.linearRampToValueAtTime(80, ctx.currentTime + 0.6);
    } else {
      osc.type = "sine";
      osc.frequency.value = 180;
    }

    osc.start();
    gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 1);
    osc.stop(ctx.currentTime + 1);
  };

  const triggerNormal = useCallback(() => {
    setIsPlaying(true);
    playSound(false);
    setMachines(INITIAL_MACHINES.map((m) => ({ ...m, dbLevel: 65 + Math.random() * 15 })));
    setAnomalyMachineId(null);
    setConfidence(0);
    addLog("Normal sound played — All systems nominal", "normal");
    setTimeout(() => setIsPlaying(false), 1000);
  }, [addLog]);

  const triggerFault = useCallback(() => {
    setIsPlaying(true);
    playSound(true);
    const targetIdx = Math.floor(Math.random() * INITIAL_MACHINES.length);
    const target = INITIAL_MACHINES[targetIdx];
    setMachines((prev) =>
      prev.map((m, i) =>
        i === targetIdx ? { ...m, status: "anomaly" as const, dbLevel: 92 + Math.random() * 8 } : { ...m, status: "normal" as const }
      )
    );
    setAnomalyMachineId(target.id);
    setConfidence(88 + Math.floor(Math.random() * 10));
    addLog(`⚠️ Anomaly detected in ${target.name}`, "anomaly");
    setTimeout(() => setIsPlaying(false), 1000);
  }, [addLog]);

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
      }, 4000);
    }, 3000);
  }, [triggerNormal, triggerFault, addLog]);

  return {
    machines,
    logs,
    anomalyMachineId,
    isPlaying,
    confidence,
    triggerNormal,
    triggerFault,
    replayScenario,
  };
}
