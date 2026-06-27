import { useEffect, useRef } from "react";

interface WaveformProps {
  isAnomaly: boolean;
  width?: number;
  height?: number;
}

const Waveform = ({ isAnomaly, width = 120, height = 40 }: WaveformProps) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const frameRef = useRef(0);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d")!;
    let animId: number;

    const draw = () => {
      frameRef.current += 1;
      ctx.clearRect(0, 0, width, height);
      const bars = 20;
      const barW = width / bars - 1;

      for (let i = 0; i < bars; i++) {
        const t = frameRef.current * 0.08 + i * 0.5;
        let h: number;
        if (isAnomaly) {
          h = Math.abs(Math.sin(t * 2.3) * Math.cos(t * 0.7)) * height * 0.9 + height * 0.1;
        } else {
          h = (Math.sin(t) * 0.3 + 0.5) * height * 0.6 + height * 0.1;
        }
        const x = i * (barW + 1);
        const color = isAnomaly ? "hsl(0, 72%, 50%)" : "hsl(191, 83%, 46%)";
        ctx.fillStyle = color;
        ctx.fillRect(x, height - h, barW, h);
      }
      animId = requestAnimationFrame(draw);
    };

    draw();
    return () => cancelAnimationFrame(animId);
  }, [isAnomaly, width, height]);

  return <canvas ref={canvasRef} width={width} height={height} className="opacity-80" />;
};

export default Waveform;
