import { MapPin, HardHat, Briefcase, BarChart2, Eye } from "lucide-react";
import { Button } from "@/components/ui/button";
import { motion } from "framer-motion";
import type { Zone, ViewRole } from "@/hooks/useDashboardState";

interface ZoneRoleToggleProps {
  selectedZone: Zone | "all";
  onZoneChange: (zone: Zone | "all") => void;
  viewRole: ViewRole;
  onRoleChange: (role: ViewRole) => void;
}

const zones: { value: Zone | "all"; label: string }[] = [
  { value: "all", label: "All Zones" },
  { value: "A", label: "Zone A" },
  { value: "B", label: "Zone B" },
  { value: "C", label: "Zone C" },
];

const ZoneRoleToggle = ({ selectedZone, onZoneChange, viewRole, onRoleChange }: ZoneRoleToggleProps) => {
  const isManager = viewRole === "manager";

  return (
    <div className="flex flex-wrap items-center justify-between gap-4">
      {/* Zone filter */}
      <div className="flex items-center gap-2">
        <div className="flex items-center gap-1 p-1 rounded-lg bg-muted border border-border">
          {zones.map((z) => (
            <Button
              key={z.value}
              variant={selectedZone === z.value ? "default" : "ghost"}
              size="sm"
              className="h-7 text-xs px-3"
              onClick={() => onZoneChange(z.value)}
            >
              <MapPin className="w-3 h-3 mr-1" />
              {z.label}
            </Button>
          ))}
        </div>
      </div>

      {/* Role selector — visually distinct cards */}
      <div className="flex items-center gap-3">
        <span className="text-[10px] uppercase tracking-widest text-muted-foreground hidden sm:block">View as</span>
        <div className="flex gap-2">
          {/* Operator card */}
          <motion.button
            whileTap={{ scale: 0.97 }}
            onClick={() => onRoleChange("operator")}
            className="relative flex items-center gap-2.5 px-4 py-2.5 rounded-xl transition-all duration-200 text-left"
            style={
              !isManager
                ? {
                    background: "linear-gradient(135deg, #113A8C 0%, #1B578C 100%)",
                    border: "1px solid rgba(20,181,217,0.4)",
                    boxShadow: "0 0 12px rgba(17,58,140,0.35)",
                  }
                : {
                    background: "hsl(var(--muted))",
                    border: "1px solid hsl(var(--border))",
                  }
            }
          >
            <div
              className="w-7 h-7 rounded-lg flex items-center justify-center flex-shrink-0"
              style={
                !isManager
                  ? { background: "rgba(20,181,217,0.2)", color: "#14B5D9" }
                  : { background: "hsl(var(--secondary))", color: "hsl(var(--muted-foreground))" }
              }
            >
              <HardHat className="w-4 h-4" />
            </div>
            <div>
              <p
                className="text-xs font-bold tracking-wide leading-none"
                style={{ color: !isManager ? "#F2F2F2" : "hsl(var(--muted-foreground))" }}
              >
                Operator
              </p>
              <p
                className="text-[10px] leading-none mt-0.5 flex items-center gap-1"
                style={{ color: !isManager ? "rgba(242,242,242,0.55)" : "hsl(var(--muted-foreground))" }}
              >
                <Eye className="w-2.5 h-2.5" />
                Live monitoring
              </p>
            </div>
            {!isManager && (
              <motion.div
                layoutId="role-indicator"
                className="absolute -top-1 -right-1 w-3 h-3 rounded-full"
                style={{ background: "#14B5D9", boxShadow: "0 0 6px #14B5D9" }}
              />
            )}
          </motion.button>

          {/* Manager card */}
          <motion.button
            whileTap={{ scale: 0.97 }}
            onClick={() => onRoleChange("manager")}
            className="relative flex items-center gap-2.5 px-4 py-2.5 rounded-xl transition-all duration-200 text-left"
            style={
              isManager
                ? {
                    background: "linear-gradient(135deg, #7c4f0a 0%, #92600e 100%)",
                    border: "1px solid rgba(245,158,11,0.45)",
                    boxShadow: "0 0 12px rgba(245,158,11,0.2)",
                  }
                : {
                    background: "hsl(var(--muted))",
                    border: "1px solid hsl(var(--border))",
                  }
            }
          >
            <div
              className="w-7 h-7 rounded-lg flex items-center justify-center flex-shrink-0"
              style={
                isManager
                  ? { background: "rgba(245,158,11,0.2)", color: "#fbbf24" }
                  : { background: "hsl(var(--secondary))", color: "hsl(var(--muted-foreground))" }
              }
            >
              <Briefcase className="w-4 h-4" />
            </div>
            <div>
              <p
                className="text-xs font-bold tracking-wide leading-none"
                style={{ color: isManager ? "#fef3c7" : "hsl(var(--muted-foreground))" }}
              >
                Manager
              </p>
              <p
                className="text-[10px] leading-none mt-0.5 flex items-center gap-1"
                style={{ color: isManager ? "rgba(254,243,199,0.6)" : "hsl(var(--muted-foreground))" }}
              >
                <BarChart2 className="w-2.5 h-2.5" />
                Full analytics
              </p>
            </div>
            {isManager && (
              <motion.div
                layoutId="role-indicator"
                className="absolute -top-1 -right-1 w-3 h-3 rounded-full"
                style={{ background: "#f59e0b", boxShadow: "0 0 6px #f59e0b" }}
              />
            )}
          </motion.button>
        </div>
      </div>
    </div>
  );
};

export default ZoneRoleToggle;
