

## Construction Machinery Sound Monitoring Dashboard

A visually impressive demo dashboard simulating real-time AI-powered sound analysis for construction site machinery, following ABSØRB dark branding.

### Pages & Layout
Single-page dashboard with a dark theme, soft shadows, rounded cards, and smooth Framer Motion animations throughout.

### Top Bar
- ABSØRB logo/brand name with tagline "AI Sound Monitoring"
- System status indicator (green dot = Normal, red pulse = Anomaly)
- Environmental stats: Temperature (42°C), Noise Level (87 dB), Time

### Machine Monitoring Panel (Main Grid)
5 machine cards (Excavator #1, Crane #2, Bulldozer #3, Loader #4, Compactor #5):
- Machine icon, name, status badge (Normal/Anomaly)
- Simulated live dB meter with animated value
- Small animated waveform visualization (canvas-based)
- On anomaly: card border glows red with pulse animation

### Audio Simulation Controls
- "Play Normal Sound" button (green) — resets all machines to normal
- "Play Faulty Sound" button (red) — triggers anomaly on a random machine
- "Replay Scenario" button — auto-plays a normal→fault→resolve sequence
- Uses Web Audio API to generate simulated machine sounds (no external files needed)

### Sound Analysis Chart (Recharts)
- Dual-line area chart: "Normal Pattern" vs "Current Pattern"
- On fault, the current pattern diverges visibly from normal
- Frequency bar visualization below the chart

### AI Insight Panel
- Card showing: System Status, Confidence % (e.g., 92%), Recommended Action
- Animates between states when fault is triggered

### Site Overview Map
- Simple top-down construction site layout with positioned machine icons
- Affected machine pulses red on anomaly detection

### Alert System
- Toast/banner notification on fault: "⚠️ Anomaly detected in [Machine Name]"
- Alert log panel showing timestamped history (e.g., "12:01 – Normal", "12:03 – Anomaly detected in Excavator #1")

### Tech
- React + TypeScript + Tailwind (dark theme via CSS variables)
- Framer Motion for all animations (card transitions, pulse effects, panel reveals)
- Recharts for sound analysis charts
- Web Audio API for generating demo sounds
- All data simulated client-side, no backend

