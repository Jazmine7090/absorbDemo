import { motion } from "framer-motion";
import { HardHat, Truck, Wrench, Container } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import Waveform from "./Waveform";
import type { Machine } from "@/hooks/useDashboardState";

const iconMap: Record<string, React.ElementType> = {
  hardhat: HardHat,
  crane: Container,
  tractor: Truck,
  truck: Truck,
  wrench: Wrench,
};

interface MachineCardProps {
  machine: Machine;
}

const MachineCard = ({ machine }: MachineCardProps) => {
  const isAnomaly = machine.status === "anomaly";
  const IconComp = iconMap[machine.icon] || Wrench;

  return (
    <motion.div
      layout
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
    >
      <Card
        className={`relative overflow-hidden transition-all duration-500 ${
          isAnomaly ? "border-danger glow-red" : "border-border"
        }`}
      >
        {isAnomaly && (
          <motion.div
            className="absolute inset-0 bg-danger/5"
            animate={{ opacity: [0, 0.15, 0] }}
            transition={{ repeat: Infinity, duration: 1.5 }}
          />
        )}
        <CardContent className="p-4 space-y-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <div className={`p-1.5 rounded-md ${isAnomaly ? "bg-danger/10" : "bg-primary/10"}`}>
                <IconComp className={`w-5 h-5 ${isAnomaly ? "text-danger" : "text-primary"}`} />
              </div>
              <div>
                <p className="text-sm font-semibold text-foreground">{machine.name}</p>
                <p className="text-[10px] text-muted-foreground capitalize">Zone {machine.zone} · {machine.type}</p>
              </div>
            </div>
            <Badge
              variant={isAnomaly ? "destructive" : "default"}
              className={isAnomaly ? "" : "bg-accent text-accent-foreground"}
            >
              {isAnomaly ? "Anomaly" : "Normal"}
            </Badge>
          </div>

          <div className="flex items-center justify-between">
            <div>
              <p className="text-xs text-muted-foreground">Sound Level</p>
              <motion.p
                className={`text-lg font-bold ${isAnomaly ? "text-danger" : "text-foreground"}`}
                key={machine.dbLevel}
                initial={{ scale: 1.2 }}
                animate={{ scale: 1 }}
              >
                {machine.dbLevel.toFixed(1)} dB
              </motion.p>
            </div>
            <Waveform isAnomaly={isAnomaly} />
          </div>

          <div className="w-full bg-secondary rounded-full h-1.5">
            <motion.div
              className={`h-1.5 rounded-full ${isAnomaly ? "bg-danger" : "bg-accent"}`}
              initial={{ width: 0 }}
              animate={{ width: `${Math.min((machine.dbLevel / 100) * 100, 100)}%` }}
              transition={{ duration: 0.6 }}
            />
          </div>
        </CardContent>
      </Card>
    </motion.div>
  );
};

export default MachineCard;
