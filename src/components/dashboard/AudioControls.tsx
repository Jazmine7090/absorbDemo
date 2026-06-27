import { motion } from "framer-motion";
import { Play, AlertTriangle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

interface AudioControlsProps {
  onNormal: () => void;
  onFault: () => void;
  onReplay: () => void;
  isPlaying: boolean;
}

const AudioControls = ({ onNormal, onFault, onReplay, isPlaying }: AudioControlsProps) => (
  <Card>
    <CardHeader className="pb-3">
      <CardTitle className="text-sm font-semibold text-foreground flex items-center gap-2">
        <span className="inline-block w-2 h-2 rounded-full bg-accent" />
        Audio Simulation
      </CardTitle>
    </CardHeader>
    <CardContent className="space-y-3">
      <motion.div whileTap={{ scale: 0.97 }}>
        <Button
          onClick={onNormal}
          disabled={isPlaying}
          className="w-full bg-primary hover:bg-primary/90 text-primary-foreground"
        >
          <Play className="w-4 h-4 mr-2" />
          Play Normal Sound
        </Button>
      </motion.div>
      <motion.div whileTap={{ scale: 0.97 }}>
        <Button
          onClick={onFault}
          disabled={isPlaying}
          variant="destructive"
          className="w-full"
        >
          <AlertTriangle className="w-4 h-4 mr-2" />
          Play Faulty Sound
        </Button>
      </motion.div>
    </CardContent>
  </Card>
);

export default AudioControls;
