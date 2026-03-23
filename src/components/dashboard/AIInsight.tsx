import { motion, AnimatePresence } from "framer-motion";
import { Brain, Shield, AlertTriangle } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

interface AIInsightProps {
  hasAnomaly: boolean;
  confidence: number;
  machineName?: string;
}

const AIInsight = ({ hasAnomaly, confidence, machineName }: AIInsightProps) => (
  <Card>
    <CardHeader className="pb-3">
      <CardTitle className="text-sm font-semibold text-foreground flex items-center gap-2">
        <Brain className="w-4 h-4 text-primary" />
        AI Insight
      </CardTitle>
    </CardHeader>
    <CardContent className="space-y-4">
      <AnimatePresence mode="wait">
        <motion.div
          key={hasAnomaly ? "anomaly" : "normal"}
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -10 }}
          className="space-y-3"
        >
          <div className="flex items-center gap-2">
            {hasAnomaly ? (
              <AlertTriangle className="w-5 h-5 text-danger" />
            ) : (
              <Shield className="w-5 h-5 text-success" />
            )}
            <div>
              <p className="text-xs text-muted-foreground">System Status</p>
              <p className={`text-sm font-semibold ${hasAnomaly ? "text-danger" : "text-success"}`}>
                {hasAnomaly ? "Anomaly Detected" : "Normal Operation"}
              </p>
            </div>
          </div>

          {hasAnomaly && (
            <>
              <div>
                <p className="text-xs text-muted-foreground">Confidence</p>
                <div className="flex items-center gap-2 mt-1">
                  <div className="flex-1 h-2 bg-secondary rounded-full overflow-hidden">
                    <motion.div
                      className="h-full bg-danger rounded-full"
                      initial={{ width: 0 }}
                      animate={{ width: `${confidence}%` }}
                      transition={{ duration: 0.8 }}
                    />
                  </div>
                  <span className="text-sm font-bold text-danger">{confidence}%</span>
                </div>
              </div>

              <div className="p-3 rounded-lg bg-danger/10 border border-danger/20">
                <p className="text-xs text-muted-foreground mb-1">Recommended Action</p>
                <p className="text-sm text-foreground">
                  Inspect {machineName || "affected machine"} immediately. Unusual sound pattern detected — possible bearing failure.
                </p>
              </div>
            </>
          )}

          {!hasAnomaly && (
            <div className="p-3 rounded-lg bg-success/10 border border-success/20">
              <p className="text-xs text-muted-foreground mb-1">Status</p>
              <p className="text-sm text-foreground">
                All machines operating within normal sound parameters. No action required.
              </p>
            </div>
          )}
        </motion.div>
      </AnimatePresence>
    </CardContent>
  </Card>
);

export default AIInsight;
