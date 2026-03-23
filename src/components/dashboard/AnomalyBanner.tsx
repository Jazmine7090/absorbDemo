import { motion, AnimatePresence } from "framer-motion";
import { AlertTriangle, X } from "lucide-react";

interface AnomalyBannerProps {
  machineName: string | null;
  onDismiss: () => void;
}

const AnomalyBanner = ({ machineName, onDismiss }: AnomalyBannerProps) => (
  <AnimatePresence>
    {machineName && (
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: -20 }}
        className="mx-6 mt-4 p-3 rounded-lg bg-danger/15 border border-danger/30 flex items-center justify-between"
      >
        <div className="flex items-center gap-3">
          <motion.div
            animate={{ rotate: [0, 10, -10, 0] }}
            transition={{ repeat: Infinity, duration: 0.6 }}
          >
            <AlertTriangle className="w-5 h-5 text-danger" />
          </motion.div>
          <p className="text-sm font-medium text-danger">
            ⚠️ Anomaly detected in {machineName} — Immediate inspection recommended
          </p>
        </div>
        <button onClick={onDismiss} className="text-danger/60 hover:text-danger transition-colors">
          <X className="w-4 h-4" />
        </button>
      </motion.div>
    )}
  </AnimatePresence>
);

export default AnomalyBanner;
