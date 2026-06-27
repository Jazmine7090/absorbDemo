import { motion, AnimatePresence } from "framer-motion";
import { AlertTriangle, BellOff, Volume2 } from "lucide-react";
import { useEffect, useState } from "react";

interface FaultAlarmBannerProps {
  isActive: boolean;
  machineName: string | null;
  onAcknowledge: () => void;
}

const FaultAlarmBanner = ({ isActive, machineName, onAcknowledge }: FaultAlarmBannerProps) => {
  const [elapsed, setElapsed] = useState(0);

  // Track how long the alarm has been active
  useEffect(() => {
    if (!isActive) {
      setElapsed(0);
      return;
    }
    setElapsed(0);
    const t = setInterval(() => setElapsed((s) => s + 1), 1000);
    return () => clearInterval(t);
  }, [isActive]);

  const formatElapsed = (s: number) => {
    const m = Math.floor(s / 60);
    const sec = s % 60;
    return m > 0 ? `${m}m ${sec}s` : `${sec}s`;
  };

  return (
    <AnimatePresence>
      {isActive && (
        <motion.div
          initial={{ height: 0, opacity: 0 }}
          animate={{ height: "auto", opacity: 1 }}
          exit={{ height: 0, opacity: 0 }}
          transition={{ duration: 0.25 }}
          className="overflow-hidden"
          style={{ zIndex: 50, position: "relative" }}
        >
          {/* Pulsing red background */}
          <motion.div
            animate={{ opacity: [1, 0.88, 1] }}
            transition={{ repeat: Infinity, duration: 1.2, ease: "easeInOut" }}
            className="w-full px-6 py-3 flex items-center justify-between gap-4"
            style={{
              background: "linear-gradient(90deg, #7f1d1d 0%, #991b1b 50%, #7f1d1d 100%)",
              borderBottom: "1px solid rgba(239,68,68,0.5)",
            }}
          >
            {/* Left: icon + message */}
            <div className="flex items-center gap-3 min-w-0">
              <motion.div
                animate={{ scale: [1, 1.3, 1] }}
                transition={{ repeat: Infinity, duration: 0.9 }}
              >
                <AlertTriangle className="w-5 h-5 flex-shrink-0" style={{ color: "#fca5a5" }} />
              </motion.div>

              <div className="min-w-0">
                <p className="text-sm font-bold tracking-wide" style={{ color: "#fef2f2" }}>
                  FAULT ALARM ACTIVE
                  {machineName && (
                    <span className="font-normal ml-2" style={{ color: "#fca5a5" }}>
                      — {machineName}
                    </span>
                  )}
                </p>
                <div className="flex items-center gap-3 mt-0.5">
                  <div className="flex items-center gap-1">
                    <Volume2 className="w-3 h-3" style={{ color: "#fca5a5" }} />
                    <span className="text-[11px]" style={{ color: "#fca5a5" }}>
                      Audio alarm repeating
                    </span>
                  </div>
                  <span className="text-[11px]" style={{ color: "rgba(252,165,165,0.6)" }}>
                    Active for {formatElapsed(elapsed)}
                  </span>
                </div>
              </div>
            </div>

            {/* Right: acknowledge button */}
            <motion.button
              whileHover={{ scale: 1.03 }}
              whileTap={{ scale: 0.97 }}
              onClick={onAcknowledge}
              className="flex items-center gap-2 px-5 py-2.5 rounded-lg font-bold text-sm tracking-wide flex-shrink-0 transition-colors"
              style={{
                background: "#fef2f2",
                color: "#991b1b",
                border: "2px solid rgba(239,68,68,0.6)",
                boxShadow: "0 0 16px rgba(239,68,68,0.4)",
              }}
            >
              <BellOff className="w-4 h-4" />
              Acknowledge Alert
            </motion.button>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default FaultAlarmBanner;
