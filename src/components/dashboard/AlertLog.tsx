import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { CheckCircle, Clock, AlertTriangle, Filter, MessageSquare } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import type { LogEntry } from "@/hooks/useDashboardState";

interface AlertLogProps {
  logs: LogEntry[];
  onAcknowledge?: (logId: string, note?: string) => void;
  onResolve?: (logId: string) => void;
  canResolve?: boolean;
}

type LogFilter = "all" | "alerts" | "sensor";

const AlertLog = ({ logs, onAcknowledge, onResolve, canResolve = false }: AlertLogProps) => {
  const [filter, setFilter] = useState<LogFilter>("all");
  const [noteInput, setNoteInput] = useState<Record<string, string>>({});
  const [showNoteFor, setShowNoteFor] = useState<string | null>(null);

  const filtered = logs.filter((l) => {
    if (filter === "alerts") return l.type === "anomaly";
    if (filter === "sensor") return l.type === "sensor";
    return true;
  });

  const getAlertStateIcon = (state?: string) => {
    switch (state) {
      case "active":
        return <AlertTriangle className="w-3 h-3 text-danger" />;
      case "acknowledged":
        return <Clock className="w-3 h-3 text-warning" />;
      case "resolved":
        return <CheckCircle className="w-3 h-3 text-success" />;
      default:
        return null;
    }
  };

  const getAlertStateBadge = (state?: string) => {
    switch (state) {
      case "active":
        return <Badge className="bg-danger/15 text-danger border-danger/30 text-[9px] h-4">Active</Badge>;
      case "acknowledged":
        return <Badge className="bg-warning/15 text-warning border-warning/30 text-[9px] h-4">Acknowledged</Badge>;
      case "resolved":
        return <Badge className="bg-success/15 text-success border-success/30 text-[9px] h-4">Resolved</Badge>;
      default:
        return null;
    }
  };

  return (
    <Card>
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between">
          <CardTitle className="text-sm font-semibold text-foreground flex items-center gap-2">
            <Clock className="w-4 h-4 text-primary" />
            Maintenance & Event Log
            {!canResolve && (
              <span className="text-[9px] font-normal px-1.5 py-0.5 rounded bg-muted text-muted-foreground border border-border">
                Acknowledge only
              </span>
            )}
          </CardTitle>
          <div className="flex items-center gap-1">
            <Filter className="w-3 h-3 text-muted-foreground" />
            {(["all", "alerts", "sensor"] as LogFilter[]).map((f) => (
              <Button
                key={f}
                variant={filter === f ? "default" : "ghost"}
                size="sm"
                className="h-5 text-[10px] px-2"
                onClick={() => setFilter(f)}
              >
                {f === "all" ? "All" : f === "alerts" ? "Alerts" : "Sensor"}
              </Button>
            ))}
          </div>
        </div>
      </CardHeader>
      <CardContent>
        <ScrollArea className="h-[260px] pr-2">
          <AnimatePresence initial={false}>
            {filtered.map((log) => (
              <motion.div
                key={log.id}
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                className={`py-2 border-b border-border/50 last:border-0 ${
                  log.type === "anomaly" ? "text-danger" : log.type === "normal" ? "text-success" : log.type === "sensor" ? "text-warning" : "text-muted-foreground"
                }`}
              >
                <div className="flex items-start gap-2">
                  <div className="flex items-center gap-1 flex-shrink-0 mt-0.5">
                    {getAlertStateIcon(log.alertState)}
                    <span className="text-[10px] font-mono whitespace-nowrap opacity-70">{log.time}</span>
                  </div>
                  <div className="flex-1 min-w-0">
                    <span className="text-xs">{log.message}</span>
                    {log.operatorNote && (
                      <p className="text-[10px] text-muted-foreground mt-0.5 italic flex items-center gap-1">
                        <MessageSquare className="w-2.5 h-2.5" /> {log.operatorNote}
                      </p>
                    )}
                  </div>
                  <div className="flex items-center gap-1 flex-shrink-0">
                    {getAlertStateBadge(log.alertState)}
                  </div>
                </div>

                {log.alertState === "active" && onAcknowledge && (
                  <div className="flex items-center gap-1 mt-1.5 ml-6">
                    {showNoteFor === log.id ? (
                      <div className="flex items-center gap-1 flex-1">
                        <input
                          className="flex-1 text-[10px] px-2 py-1 rounded border border-border bg-muted text-foreground"
                          placeholder="Operator note..."
                          value={noteInput[log.id] || ""}
                          onChange={(e) => setNoteInput((p) => ({ ...p, [log.id]: e.target.value }))}
                          onKeyDown={(e) => {
                            if (e.key === "Enter") {
                              onAcknowledge(log.id, noteInput[log.id]);
                              setShowNoteFor(null);
                            }
                          }}
                        />
                        <Button
                          size="sm"
                          className="h-5 text-[9px] px-2"
                          onClick={() => {
                            onAcknowledge(log.id, noteInput[log.id]);
                            setShowNoteFor(null);
                          }}
                        >
                          Submit
                        </Button>
                      </div>
                    ) : (
                      <>
                        <Button
                          size="sm"
                          variant="outline"
                          className="h-5 text-[9px] px-2"
                          onClick={() => onAcknowledge(log.id)}
                        >
                          Acknowledge
                        </Button>
                        <Button
                          size="sm"
                          variant="ghost"
                          className="h-5 text-[9px] px-2"
                          onClick={() => setShowNoteFor(log.id)}
                        >
                          <MessageSquare className="w-2.5 h-2.5 mr-0.5" />
                          Add Note
                        </Button>
                      </>
                    )}
                  </div>
                )}

                {log.alertState === "acknowledged" && onResolve && canResolve && (
                  <div className="ml-6 mt-1.5">
                    <Button
                      size="sm"
                      variant="outline"
                      className="h-5 text-[9px] px-2 text-success border-success/30"
                      onClick={() => onResolve(log.id)}
                    >
                      <CheckCircle className="w-2.5 h-2.5 mr-0.5" />
                      Mark Resolved
                    </Button>
                  </div>
                )}
                {log.alertState === "acknowledged" && !canResolve && (
                  <p className="ml-6 mt-1 text-[9px] text-muted-foreground italic">
                    Manager approval required to resolve
                  </p>
                )}
              </motion.div>
            ))}
          </AnimatePresence>
        </ScrollArea>
      </CardContent>
    </Card>
  );
};

export default AlertLog;
