import { useMemo } from "react";
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, ResponsiveContainer, Tooltip, BarChart, Bar } from "recharts";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

interface SoundChartProps {
  hasAnomaly: boolean;
}

const SoundChart = ({ hasAnomaly }: SoundChartProps) => {
  const areaData = useMemo(() => {
    return Array.from({ length: 30 }, (_, i) => {
      const normal = 50 + Math.sin(i * 0.4) * 15 + Math.random() * 5;
      const current = hasAnomaly
        ? i > 15
          ? normal + (i - 15) * 3 + Math.random() * 10
          : normal + Math.random() * 3
        : normal + Math.random() * 3;
      return { t: i, normal: +normal.toFixed(1), current: +current.toFixed(1) };
    });
  }, [hasAnomaly]);

  const freqData = useMemo(() => {
    return Array.from({ length: 16 }, (_, i) => ({
      freq: `${(i + 1) * 500}`,
      amplitude: hasAnomaly
        ? 30 + Math.random() * 60 + (i > 8 ? 20 : 0)
        : 20 + Math.sin(i * 0.5) * 15 + Math.random() * 10,
    }));
  }, [hasAnomaly]);

  return (
    <Card>
      <CardHeader className="pb-2">
        <CardTitle className="text-sm font-semibold text-foreground">Sound Analysis</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="h-[180px]">
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={areaData}>
              <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--chart-grid))" />
              <XAxis dataKey="t" tick={{ fontSize: 10, fill: "hsl(var(--chart-text))" }} />
              <YAxis tick={{ fontSize: 10, fill: "hsl(var(--chart-text))" }} />
              <Tooltip
                contentStyle={{
                  backgroundColor: "hsl(var(--card))",
                  border: "1px solid hsl(var(--border))",
                  borderRadius: "8px",
                  fontSize: 12,
                }}
              />
              <Area
                type="monotone"
                dataKey="normal"
                stroke="hsl(var(--primary))"
                fill="hsl(var(--primary))"
                fillOpacity={0.15}
                strokeWidth={2}
                name="Normal Pattern"
              />
              <Area
                type="monotone"
                dataKey="current"
                stroke={hasAnomaly ? "hsl(var(--danger))" : "hsl(var(--accent))"}
                fill={hasAnomaly ? "hsl(var(--danger))" : "hsl(var(--accent))"}
                fillOpacity={0.1}
                strokeWidth={2}
                name="Current Pattern"
              />
            </AreaChart>
          </ResponsiveContainer>
        </div>

        <div>
          <p className="text-xs text-muted-foreground mb-2">Frequency Spectrum (Hz)</p>
          <div className="h-[100px]">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={freqData}>
                <Bar
                  dataKey="amplitude"
                  fill={hasAnomaly ? "hsl(var(--danger))" : "hsl(var(--primary))"}
                  radius={[2, 2, 0, 0]}
                  fillOpacity={0.7}
                />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default SoundChart;
