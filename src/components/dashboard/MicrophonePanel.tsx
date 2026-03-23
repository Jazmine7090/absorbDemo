import { motion } from "framer-motion";
import { Mic, Battery, Wifi, WifiOff, AlertTriangle, Calendar } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import type { Microphone } from "@/hooks/useDashboardState";

interface MicrophonePanelProps {
  microphones: Microphone[];
}

const getBatteryColor = (battery: number) => {
  if (battery > 60) return "text-success";
  if (battery >= 30) return "text-warning";
  return "text-danger";
};

const getBatteryBg = (battery: number) => {
  if (battery > 60) return "bg-success";
  if (battery >= 30) return "bg-warning";
  return "bg-danger";
};

const getHealthBadge = (health: Microphone["health"]) => {
  switch (health) {
    case "healthy":
      return <Badge className="bg-success/15 text-success border-success/30 text-[10px]">Healthy</Badge>;
    case "degraded":
      return <Badge className="bg-warning/15 text-warning border-warning/30 text-[10px]">Degraded</Badge>;
    case "offline":
      return <Badge className="bg-danger/15 text-danger border-danger/30 text-[10px]">Offline</Badge>;
  }
};

const getConnectivityIcon = (connectivity: Microphone["connectivity"]) => {
  switch (connectivity) {
    case "online":
      return <Wifi className="w-3.5 h-3.5 text-success" />;
    case "intermittent":
      return <Wifi className="w-3.5 h-3.5 text-warning" />;
    case "offline":
      return <WifiOff className="w-3.5 h-3.5 text-danger" />;
  }
};

const MicrophonePanel = ({ microphones }: MicrophonePanelProps) => {
  const hasIssues = microphones.some((m) => m.health === "offline" || m.battery < 30);

  return (
    <Card>
      <CardHeader className="pb-3">
        <CardTitle className="text-sm font-semibold text-foreground flex items-center gap-2">
          <Mic className="w-4 h-4 text-primary" />
          Microphone Health & Battery
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-2">
        {hasIssues && (
          <motion.div
            initial={{ opacity: 0, y: -8 }}
            animate={{ opacity: 1, y: 0 }}
            className="flex items-center gap-2 p-2 rounded-md bg-warning/10 border border-warning/25 mb-3"
          >
            <AlertTriangle className="w-3.5 h-3.5 text-warning flex-shrink-0" />
            <p className="text-[11px] text-warning">Some sensors have low battery or are offline — confidence may be reduced.</p>
          </motion.div>
        )}

        {microphones.map((mic) => (
          <motion.div
            key={mic.id}
            initial={{ opacity: 0, x: -10 }}
            animate={{ opacity: 1, x: 0 }}
            className={`flex items-center gap-3 p-2.5 rounded-lg border transition-colors ${
              mic.health === "offline" ? "border-danger/30 bg-danger/5" : "border-border bg-muted/30"
            }`}
          >
            <div className="flex-shrink-0">
              <Mic className={`w-4 h-4 ${mic.health === "offline" ? "text-danger" : "text-muted-foreground"}`} />
            </div>

            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-2 mb-1">
                <p className="text-xs font-semibold text-foreground truncate">{mic.name}</p>
                <span className="text-[10px] text-muted-foreground">Zone {mic.zone}</span>
              </div>
              <div className="flex items-center gap-3">
                {getHealthBadge(mic.health)}
                <div className="flex items-center gap-1">
                  {getConnectivityIcon(mic.connectivity)}
                  <span className="text-[10px] text-muted-foreground capitalize">{mic.connectivity}</span>
                </div>
              </div>
            </div>

            <div className="flex flex-col items-end gap-1">
              <div className="flex items-center gap-1.5">
                <Battery className={`w-4 h-4 ${getBatteryColor(mic.battery)}`} />
                <span className={`text-xs font-bold ${getBatteryColor(mic.battery)}`}>{mic.battery}%</span>
              </div>
              <div className="w-14 h-1.5 bg-secondary rounded-full overflow-hidden">
                <div className={`h-full rounded-full ${getBatteryBg(mic.battery)}`} style={{ width: `${mic.battery}%` }} />
              </div>
              <div className="flex items-center gap-1">
                <Calendar className="w-2.5 h-2.5 text-muted-foreground" />
                <span className="text-[9px] text-muted-foreground">{mic.lastCalibration}</span>
              </div>
            </div>
          </motion.div>
        ))}
      </CardContent>
    </Card>
  );
};

export default MicrophonePanel;
