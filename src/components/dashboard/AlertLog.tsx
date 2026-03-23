import { motion, AnimatePresence } from "framer-motion";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ScrollArea } from "@/components/ui/scroll-area";
import type { LogEntry } from "@/hooks/useDashboardState";

interface AlertLogProps {
  logs: LogEntry[];
}

const AlertLog = ({ logs }: AlertLogProps) => (
  <Card>
    <CardHeader className="pb-3">
      <CardTitle className="text-sm font-semibold text-foreground">Event Log</CardTitle>
    </CardHeader>
    <CardContent>
      <ScrollArea className="h-[200px] pr-2">
        <AnimatePresence initial={false}>
          {logs.map((log) => (
            <motion.div
              key={log.id}
              initial={{ opacity: 0, x: -10 }}
              animate={{ opacity: 1, x: 0 }}
              className={`flex items-start gap-2 py-1.5 border-b border-border/50 last:border-0 ${
                log.type === "anomaly" ? "text-danger" : log.type === "normal" ? "text-success" : "text-muted-foreground"
              }`}
            >
              <span className="text-[10px] font-mono whitespace-nowrap opacity-70">{log.time}</span>
              <span className="text-xs">{log.message}</span>
            </motion.div>
          ))}
        </AnimatePresence>
      </ScrollArea>
    </CardContent>
  </Card>
);

export default AlertLog;
