import { useState } from "react";
import { motion } from "framer-motion";
import { HardHat, Truck, Wrench, Container, Layers } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import type { Machine } from "@/hooks/useDashboardState";

interface SiteMapProps {
  machines: Machine[];
  anomalyId: string | null;
}

const iconMap: Record<string, React.ElementType> = {
  hardhat: HardHat,
  crane: Container,
  tractor: Truck,
  truck: Truck,
  wrench: Wrench,
};

// Heatmap blobs: each has a position, radius, and intensity tied to a zone/machine area
const HEATMAP_ZONES = [
  { cx: 30, cy: 45, rx: 28, ry: 32, color: "rgba(255,200,0,0.22)" },   // Zone A – moderate
  { cx: 68, cy: 38, rx: 26, ry: 30, color: "rgba(255,100,0,0.25)" },   // Zone B – high
  { cx: 28, cy: 78, rx: 22, ry: 18, color: "rgba(20,181,217,0.18)" },  // Zone C – low
];

const SiteMap = ({ machines, anomalyId }: SiteMapProps) => {
  const [showHeatmap, setShowHeatmap] = useState(false);

  return (
    <Card>
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between">
          <CardTitle className="text-sm font-semibold text-foreground">Site Overview</CardTitle>
          <Button
            variant="outline"
            size="sm"
            onClick={() => setShowHeatmap((v) => !v)}
            className={`h-7 gap-1.5 text-[11px] px-2.5 transition-colors ${
              showHeatmap
                ? "bg-primary/15 border-primary/40 text-primary hover:bg-primary/20"
                : "text-muted-foreground hover:text-foreground"
            }`}
          >
            <Layers className="w-3.5 h-3.5" />
            {showHeatmap ? "Hide Heatmap" : "View Heatmap"}
          </Button>
        </div>
      </CardHeader>
      <CardContent>
        <div
          className="relative w-full h-[200px] rounded-lg overflow-hidden"
          style={{ background: "#113859", border: "1px solid rgba(20,181,217,0.2)" }}
        >
          {/* Grid lines */}
          <svg className="absolute inset-0 w-full h-full opacity-20">
            {Array.from({ length: 10 }, (_, i) => (
              <line key={`h${i}`} x1="0" y1={`${i * 10}%`} x2="100%" y2={`${i * 10}%`} stroke="#14B5D9" strokeWidth="0.5" />
            ))}
            {Array.from({ length: 10 }, (_, i) => (
              <line key={`v${i}`} x1={`${i * 10}%`} y1="0" x2={`${i * 10}%`} y2="100%" stroke="#14B5D9" strokeWidth="0.5" />
            ))}
          </svg>

          {/* Heatmap overlay */}
          {showHeatmap && (
            <motion.svg
              key="heatmap"
              className="absolute inset-0 w-full h-full pointer-events-none"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.4 }}
            >
              <defs>
                <filter id="heatblur" x="-50%" y="-50%" width="200%" height="200%">
                  <feGaussianBlur stdDeviation="6" />
                </filter>
              </defs>
              {HEATMAP_ZONES.map((z, i) => (
                <ellipse
                  key={i}
                  cx={`${z.cx}%`}
                  cy={`${z.cy}%`}
                  rx={`${z.rx}%`}
                  ry={`${z.ry}%`}
                  fill={z.color}
                  filter="url(#heatblur)"
                />
              ))}
              {/* Anomaly pulse blob */}
              {anomalyId && (() => {
                const m = machines.find((mc) => mc.id === anomalyId);
                if (!m) return null;
                return (
                  <ellipse
                    cx={`${m.position.x}%`}
                    cy={`${m.position.y}%`}
                    rx="16%"
                    ry="18%"
                    fill="rgba(220,38,38,0.3)"
                    filter="url(#heatblur)"
                  />
                );
              })()}
              {/* Noise legend */}
              <defs>
                <linearGradient id="legendGrad" x1="0" y1="0" x2="1" y2="0">
                  <stop offset="0%" stopColor="rgba(20,181,217,0.7)" />
                  <stop offset="50%" stopColor="rgba(255,200,0,0.8)" />
                  <stop offset="100%" stopColor="rgba(255,80,0,0.9)" />
                </linearGradient>
              </defs>
              <rect x="62%" y="88%" width="34%" height="5%" rx="3" fill="url(#legendGrad)" />
              <text x="62%" y="86.5%" fontSize="6" fill="rgba(242,242,242,0.6)" fontFamily="sans-serif">Low</text>
              <text x="91%" y="86.5%" fontSize="6" fill="rgba(242,242,242,0.6)" fontFamily="sans-serif" textAnchor="end">High</text>
            </motion.svg>
          )}

          {/* Zone labels */}
          <span className="absolute top-2 left-3 text-[10px] uppercase tracking-wider font-medium" style={{ color: "rgba(20,181,217,0.7)" }}>Zone A</span>
          <span className="absolute top-2 right-3 text-[10px] uppercase tracking-wider font-medium" style={{ color: "rgba(20,181,217,0.7)" }}>Zone B</span>
          <span className="absolute bottom-2 left-3 text-[10px] uppercase tracking-wider font-medium" style={{ color: "rgba(20,181,217,0.7)" }}>Zone C</span>

          {machines.map((m) => {
            const isAnomaly = m.id === anomalyId;
            const IconComp = iconMap[m.icon] || Wrench;
            return (
              <motion.div
                key={m.id}
                className="absolute flex flex-col items-center"
                style={{ left: `${m.position.x}%`, top: `${m.position.y}%`, transform: "translate(-50%, -50%)" }}
                animate={isAnomaly ? { scale: [1, 1.2, 1] } : {}}
                transition={{ repeat: isAnomaly ? Infinity : 0, duration: 1 }}
              >
                {isAnomaly && (
                  <motion.div
                    className="absolute w-10 h-10 rounded-full bg-danger/20"
                    animate={{ scale: [1, 2], opacity: [0.5, 0] }}
                    transition={{ repeat: Infinity, duration: 1.5 }}
                  />
                )}
                <div
                  className="w-8 h-8 rounded-full flex items-center justify-center"
                  style={{
                    background: isAnomaly ? "hsl(0,72%,50%)" : "rgba(20,181,217,0.2)",
                    color: isAnomaly ? "#fff" : "#14B5D9",
                    border: isAnomaly ? "none" : "1px solid rgba(20,181,217,0.4)",
                  }}
                >
                  <IconComp className="w-4 h-4" />
                </div>
                <span
                  className="text-[9px] mt-1 whitespace-nowrap font-medium"
                  style={{ color: isAnomaly ? "hsl(0,72%,50%)" : "rgba(242,242,242,0.7)" }}
                >
                  {m.name}
                </span>
              </motion.div>
            );
          })}
        </div>
      </CardContent>
    </Card>
  );
};

export default SiteMap;
