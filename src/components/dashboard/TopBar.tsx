import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Clock, Radio, HardHat, Briefcase, ExternalLink } from "lucide-react";
import { useEffect, useState } from "react";
import type { ViewRole } from "@/hooks/useDashboardState";

interface TopBarProps {
  hasAnomaly: boolean;
  viewRole: ViewRole;
}

const TopBar = ({ hasAnomaly, viewRole }: TopBarProps) => {
  const [time, setTime] = useState(new Date());

  useEffect(() => {
    const t = setInterval(() => setTime(new Date()), 1000);
    return () => clearInterval(t);
  }, []);

  const isManager = viewRole === "manager";

  return (
    <header
      className="flex items-center justify-between px-6 py-3.5 border-b border-white/10 shadow-lg"
      style={{ background: "linear-gradient(90deg, #113859 0%, #1B578C 100%)" }}
    >
      {/* Brand */}
      <div className="flex items-center gap-5">
        <div className="flex items-center gap-2">
          <div
            className="w-8 h-8 rounded-lg flex items-center justify-center"
            style={{ background: "rgba(20,181,217,0.2)", border: "1px solid rgba(20,181,217,0.4)" }}
          >
            <Radio className="w-4 h-4" style={{ color: "#14B5D9" }} />
          </div>
          <div>
            <h1 className="text-lg font-bold tracking-tight leading-none" style={{ color: "#F2F2F2" }}>
              ABS<span style={{ color: "#14B5D9" }}>Ø</span>RB
            </h1>
            <p className="text-[9px] tracking-widest uppercase leading-none mt-0.5" style={{ color: "rgba(242,242,242,0.5)" }}>
              Smart Acoustic Safety
            </p>
          </div>
        </div>

        <div className="h-6 w-px hidden sm:block" style={{ background: "rgba(255,255,255,0.15)" }} />
        <span className="text-[11px] tracking-wider hidden sm:block" style={{ color: "rgba(242,242,242,0.6)" }}>
          Construction Site Monitor
        </span>
      </div>

      {/* Right side */}
      <div className="flex items-center gap-3">
        {/* Visit Website Button */}
        <Button
          onClick={() => window.open("https://absorb.website/", "_blank")}
          className="flex items-center gap-1 text-xs font-semibold"
          style={{
            background: "rgba(20,181,217,0.15)",
            border: "1px solid rgba(20,181,217,0.4)",
            color: "#14B5D9"
          }}
        >
          <ExternalLink className="w-3 h-3" />
          Website
        </Button>

        {/* Role badge */}
        <motion.div
          key={viewRole}
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg text-xs font-semibold tracking-wider"
          style={
            isManager
              ? { background: "rgba(245,158,11,0.18)", border: "1px solid rgba(245,158,11,0.4)", color: "#fbbf24" }
              : { background: "rgba(20,181,217,0.14)", border: "1px solid rgba(20,181,217,0.35)", color: "#14B5D9" }
          }
        >
          {isManager ? <Briefcase className="w-3 h-3" /> : <HardHat className="w-3 h-3" />}
          {isManager ? "MANAGER" : "OPERATOR"}
        </motion.div>

        {/* Clock */}
        <div className="flex items-center gap-1.5 text-xs font-mono" style={{ color: "rgba(242,242,242,0.6)" }}>
          <Clock className="w-3.5 h-3.5" />
          {time.toLocaleTimeString("en-US", { hour12: false })}
        </div>

        {/* Status pill */}
        <div
          className="flex items-center gap-2 px-3 py-1.5 rounded-full"
          style={{
            background: hasAnomaly ? "rgba(220,38,38,0.15)" : "rgba(20,181,217,0.12)",
            border: `1px solid ${hasAnomaly ? "rgba(220,38,38,0.4)" : "rgba(20,181,217,0.35)"}`,
          }}
        >
          <motion.div
            className="w-2 h-2 rounded-full"
            style={{ background: hasAnomaly ? "#ef4444" : "#14B5D9" }}
            animate={hasAnomaly ? { scale: [1, 1.5, 1], opacity: [1, 0.4, 1] } : {}}
            transition={{ repeat: Infinity, duration: 1.1 }}
          />
          <span
            className="text-xs font-semibold tracking-widest"
            style={{ color: hasAnomaly ? "#ef4444" : "#14B5D9" }}
          >
            {hasAnomaly ? "ANOMALY" : "NOMINAL"}
          </span>
        </div>
      </div>
    </header>
  );
};

export default TopBar;