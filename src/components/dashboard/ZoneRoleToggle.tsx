import { MapPin, User } from "lucide-react";
import { Button } from "@/components/ui/button";
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

const ZoneRoleToggle = ({ selectedZone, onZoneChange, viewRole, onRoleChange }: ZoneRoleToggleProps) => (
  <div className="flex flex-wrap items-center gap-3">
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

    <div className="flex items-center gap-1 p-1 rounded-lg bg-muted border border-border">
      <Button
        variant={viewRole === "operator" ? "default" : "ghost"}
        size="sm"
        className="h-7 text-xs px-3"
        onClick={() => onRoleChange("operator")}
      >
        <User className="w-3 h-3 mr-1" />
        Operator
      </Button>
      <Button
        variant={viewRole === "manager" ? "default" : "ghost"}
        size="sm"
        className="h-7 text-xs px-3"
        onClick={() => onRoleChange("manager")}
      >
        <User className="w-3 h-3 mr-1" />
        Manager
      </Button>
    </div>
  </div>
);

export default ZoneRoleToggle;
