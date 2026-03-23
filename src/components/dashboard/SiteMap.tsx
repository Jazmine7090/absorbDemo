import { motion } from "framer-motion";
import { HardHat, Truck, Wrench, Container } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
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

const SiteMap = ({ machines, anomalyId }: SiteMapProps) => (
  <Card>
    <CardHeader className="pb-3">
      <CardTitle className="text-sm font-semibold text-foreground">Site Overview</CardTitle>
    </CardHeader>
    <CardContent>
      <div className="relative w-full h-[200px] bg-muted/50 rounded-lg border border-border overflow-hidden">
        {/* Grid lines */}
        <svg className="absolute inset-0 w-full h-full opacity-15">
          {Array.from({ length: 10 }, (_, i) => (
            <line key={`h${i}`} x1="0" y1={`${i * 10}%`} x2="100%" y2={`${i * 10}%`} stroke="hsl(215, 12%, 50%)" strokeWidth="0.5" />
          ))}
          {Array.from({ length: 10 }, (_, i) => (
            <line key={`v${i}`} x1={`${i * 10}%`} y1="0" x2={`${i * 10}%`} y2="100%" stroke="hsl(215, 12%, 50%)" strokeWidth="0.5" />
          ))}
        </svg>

        {/* Zone labels */}
        <span className="absolute top-2 left-3 text-[10px] text-muted-foreground uppercase tracking-wider font-medium">Zone A</span>
        <span className="absolute top-2 right-3 text-[10px] text-muted-foreground uppercase tracking-wider font-medium">Zone B</span>
        <span className="absolute bottom-2 left-3 text-[10px] text-muted-foreground uppercase tracking-wider font-medium">Zone C</span>

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
              <div className={`w-8 h-8 rounded-full flex items-center justify-center ${
                isAnomaly ? "bg-danger text-danger-foreground" : "bg-primary/15 text-primary"
              }`}>
                <IconComp className="w-4 h-4" />
              </div>
              <span className={`text-[9px] mt-1 whitespace-nowrap font-medium ${
                isAnomaly ? "text-danger" : "text-muted-foreground"
              }`}>
                {m.name}
              </span>
            </motion.div>
          );
        })}
      </div>
    </CardContent>
  </Card>
);

export default SiteMap;
