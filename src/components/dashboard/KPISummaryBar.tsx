import { motion } from "framer-motion";
import { MapPin, AlertTriangle, Activity, Mic } from "lucide-react";

interface KPISummaryBarProps {
  zonesMonitored: number;
  machinesInAnomaly: number;
  activeAlerts: number;
  microphonesOffline: number;
}

const KPISummaryBar = ({ zonesMonitored, machinesInAnomaly, activeAlerts, microphonesOffline }: KPISummaryBarProps) => {
  const items = [
    { label: "Zones Monitored", value: zonesMonitored, icon: MapPin, color: "text-primary" },
    { label: "Machines in Anomaly", value: machinesInAnomaly, icon: AlertTriangle, color: machinesInAnomaly > 0 ? "text-danger" : "text-success" },
    { label: "Active Alerts", value: activeAlerts, icon: Activity, color: activeAlerts > 0 ? "text-danger" : "text-success" },
    { label: "Mics Offline", value: microphonesOffline, icon: Mic, color: microphonesOffline > 0 ? "text-warning" : "text-success" },
  ];

  return (
    <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
      {items.map((item) => (
        <motion.div
          key={item.label}
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex items-center gap-3 p-3 rounded-lg bg-card border border-border shadow-sm"
        >
          <div className={`p-2 rounded-md bg-muted ${item.color}`}>
            <item.icon className="w-4 h-4" />
          </div>
          <div>
            <motion.p
              key={item.value}
              initial={{ scale: 1.3 }}
              animate={{ scale: 1 }}
              className={`text-xl font-bold ${item.color}`}
            >
              {item.value}
            </motion.p>
            <p className="text-[10px] text-muted-foreground uppercase tracking-wider">{item.label}</p>
          </div>
        </motion.div>
      ))}
    </div>
  );
};

export default KPISummaryBar;
