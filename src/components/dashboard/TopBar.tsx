import { motion } from "framer-motion";
import { Activity, Thermometer, Volume2, Clock } from "lucide-react";
import { useEffect, useState } from "react";

interface TopBarProps {
  hasAnomaly: boolean;
}

const TopBar = ({ hasAnomaly }: TopBarProps) => {
  const [time, setTime] = useState(new Date());

  useEffect(() => {
    const t = setInterval(() => setTime(new Date()), 1000);
    return () => clearInterval(t);
  }, []);

  return (
    <header className="flex items-center justify-between px-6 py-4 border-b border-border bg-card shadow-sm">
      <div className="flex items-center gap-4">
        <h1 className="text-xl font-bold tracking-tight text-foreground">
          ABSORB
        </h1>
        <span className="text-xs text-muted-foreground tracking-widest uppercase">
          AI Sound Monitoring
        </span>
      </div>

      <div className="flex items-center gap-6">
        <div className="flex items-center gap-2 text-sm text-muted-foreground">
          <Clock className="w-4 h-4" />
          <span>{time.toLocaleTimeString("en-US", { hour12: false })}</span>
        </div>
        <div className="flex items-center gap-2">
          <motion.div
            className={`w-2.5 h-2.5 rounded-full ${hasAnomaly ? "bg-danger" : "bg-success"}`}
            animate={hasAnomaly ? { scale: [1, 1.4, 1], opacity: [1, 0.5, 1] } : {}}
            transition={{ repeat: Infinity, duration: 1.2 }}
          />
          <span className={`text-sm font-medium ${hasAnomaly ? "text-danger" : "text-success"}`}>
            {hasAnomaly ? "ANOMALY" : "NORMAL"}
          </span>
        </div>
      </div>
    </header>
  );
};

export default TopBar;
