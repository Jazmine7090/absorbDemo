import { motion } from "framer-motion";
import { BarChart3, Signal, Info } from "lucide-react";
import { BarChart, Bar, XAxis, YAxis, ResponsiveContainer, Cell, Tooltip } from "recharts";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import type { ZoneAudioQuality, QualityLabel } from "@/hooks/useAudioQuality";

interface AudioQualityPanelProps {
  qualities: ZoneAudioQuality[];
}

const qualityConfig: Record<QualityLabel, { color: string; bg: string; border: string; bar: string }> = {
  Excellent: { color: "text-quality-excellent", bg: "bg-quality-excellent/10", border: "border-quality-excellent/30", bar: "hsl(var(--quality-excellent))" },
  Good: { color: "text-quality-good", bg: "bg-quality-good/10", border: "border-quality-good/30", bar: "hsl(var(--quality-good))" },
  Fair: { color: "text-quality-fair", bg: "bg-quality-fair/10", border: "border-quality-fair/30", bar: "hsl(var(--quality-fair))" },
  Poor: { color: "text-quality-poor", bg: "bg-quality-poor/10", border: "border-quality-poor/30", bar: "hsl(var(--quality-poor))" },
};

const getBarColor = (score: number) => {
  if (score >= 80) return "hsl(var(--quality-excellent))";
  if (score >= 60) return "hsl(var(--quality-good))";
  if (score >= 40) return "hsl(var(--quality-fair))";
  return "hsl(var(--quality-poor))";
};

const AudioQualityPanel = ({ qualities }: AudioQualityPanelProps) => {
  const poorZones = qualities.filter((q) => q.label === "Poor");
  const chartData = qualities.map((q) => ({
    name: `Zone ${q.zone}`,
    score: q.score,
  }));

  return (
    <Card>
      <CardHeader className="pb-3">
        <CardTitle className="text-sm font-semibold text-foreground flex items-center gap-2">
          <Signal className="w-4 h-4 text-accent" />
          Zone Audio Quality
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Advisory for poor zones */}
        {poorZones.length > 0 && (
          <motion.div
            initial={{ opacity: 0, y: -6 }}
            animate={{ opacity: 1, y: 0 }}
            className="flex items-start gap-2 p-2.5 rounded-lg bg-quality-fair/10 border border-quality-fair/30"
          >
            <Info className="w-4 h-4 text-quality-fair flex-shrink-0 mt-0.5" />
            <div className="text-[11px] text-foreground">
              {poorZones.map((z) => (
                <p key={z.zone}>
                  Audio Quality in Zone {z.zone} ({z.zoneName}) is <span className="font-semibold text-quality-poor">Poor</span>. Consider adjusting microphone placement or reducing background noise.
                </p>
              ))}
            </div>
          </motion.div>
        )}

        {/* Zone cards */}
        <div className="grid grid-cols-3 gap-3">
          {qualities.map((q) => {
            const cfg = qualityConfig[q.label];
            return (
              <motion.div
                key={q.zone}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                className={`p-3 rounded-lg border ${cfg.bg} ${cfg.border}`}
              >
                <p className="text-[10px] text-muted-foreground uppercase tracking-wider mb-1">
                  Zone {q.zone} – {q.zoneName}
                </p>
                <div className="flex items-center gap-2 mb-2">
                  <span className={`text-xl font-bold ${cfg.color}`}>{q.score}</span>
                  <span className="text-[10px] text-muted-foreground">/100</span>
                </div>
                <Badge className={`${cfg.bg} ${cfg.color} ${cfg.border} text-[10px]`}>
                  {q.label}
                </Badge>
                {/* Score bar */}
                <div className="w-full h-1.5 bg-secondary rounded-full mt-2 overflow-hidden">
                  <motion.div
                    className="h-full rounded-full"
                    style={{ backgroundColor: cfg.bar }}
                    initial={{ width: 0 }}
                    animate={{ width: `${q.score}%` }}
                    transition={{ duration: 0.6 }}
                  />
                </div>
              </motion.div>
            );
          })}
        </div>

        {/* Comparative bar chart */}
        <div>
          <p className="text-xs text-muted-foreground mb-2 flex items-center gap-1">
            <BarChart3 className="w-3 h-3" />
            Audio Quality by Zone
          </p>
          <div className="h-[100px]">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={chartData}>
                <XAxis dataKey="name" tick={{ fontSize: 10, fill: "hsl(var(--chart-text))" }} />
                <YAxis domain={[0, 100]} tick={{ fontSize: 10, fill: "hsl(var(--chart-text))" }} />
                <Tooltip
                  contentStyle={{
                    backgroundColor: "hsl(var(--card))",
                    border: "1px solid hsl(var(--border))",
                    borderRadius: "8px",
                    fontSize: 12,
                  }}
                />
                <Bar dataKey="score" radius={[4, 4, 0, 0]}>
                  {chartData.map((entry, index) => (
                    <Cell key={index} fill={getBarColor(entry.score)} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default AudioQualityPanel;
