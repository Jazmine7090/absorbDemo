import { Thermometer, Volume2, Wind } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

interface EnvironmentalCardProps {
  temperature: number;
  avgNoise: number;
}

const EnvironmentalCard = ({ temperature, avgNoise }: EnvironmentalCardProps) => {
  const isHighTemp = temperature > 45;
  const isHighNoise = avgNoise > 90;

  return (
    <Card>
      <CardHeader className="pb-3">
        <CardTitle className="text-sm font-semibold text-foreground flex items-center gap-2">
          <Wind className="w-4 h-4 text-primary" />
          Environmental Data
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-3">
        <div className="flex items-center justify-between p-2.5 rounded-lg bg-muted/30 border border-border">
          <div className="flex items-center gap-2">
            <Thermometer className={`w-4 h-4 ${isHighTemp ? "text-danger" : "text-muted-foreground"}`} />
            <span className="text-xs text-muted-foreground">Temperature</span>
          </div>
          <span className={`text-sm font-bold ${isHighTemp ? "text-danger" : "text-foreground"}`}>{temperature}°C</span>
        </div>

        <div className="flex items-center justify-between p-2.5 rounded-lg bg-muted/30 border border-border">
          <div className="flex items-center gap-2">
            <Volume2 className={`w-4 h-4 ${isHighNoise ? "text-warning" : "text-muted-foreground"}`} />
            <span className="text-xs text-muted-foreground">Avg Noise Level</span>
          </div>
          <span className={`text-sm font-bold ${isHighNoise ? "text-warning" : "text-foreground"}`}>{avgNoise} dB</span>
        </div>

        {(isHighTemp || isHighNoise) && (
          <div className="p-2 rounded-md bg-warning/10 border border-warning/25">
            <p className="text-[11px] text-warning">
              {isHighTemp && isHighNoise
                ? "High temperature and noise detected — AI analysis may require adjustment."
                : isHighTemp
                  ? "High ambient temperature — monitor equipment closely."
                  : "High ambient noise — may affect acoustic analysis accuracy."}
            </p>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default EnvironmentalCard;
