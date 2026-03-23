import { motion } from "framer-motion";
import { Play, AlertTriangle, RotateCcw } from "lucide-react";
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
      <CardTitle className="text-sm font-semibold text-foreground">Audio Simulation</CardTitle>
    </CardHeader>
    <CardContent className="space-y-3">
      <motion.div whileTap={{ scale: 0.97 }}>
        <Button
          onClick={onNormal}
          disabled={isPlaying}
          className="w-full bg-success hover:bg-success/90 text-success-foreground"
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
      <motion.div whileTap={{ scale: 0.97 }}>
        <Button
          onClick={onReplay}
          disabled={isPlaying}
          variant="secondary"
          className="w-full"
        >
          <RotateCcw className="w-4 h-4 mr-2" />
          Replay Scenario
        </Button>
      </motion.div>
    </CardContent>
  </Card>
);

export default AudioControls;
