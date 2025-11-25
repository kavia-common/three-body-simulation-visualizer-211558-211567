import React, { useCallback, useEffect, useMemo, useRef, useState } from "react";
import "./styles/theme.css";
import "./App.css";
import SimulationCanvas from "./components/SimulationCanvas";
import Controls from "./components/Controls";
import { createDefaultScenario, rk4Step } from "./physics/threeBody";
import { getAppConfig } from "./utils/env";

// PUBLIC_INTERFACE
function App() {
  /** Three-body simulation with controls and canvas rendering. */
  const config = useMemo(() => getAppConfig(), []);
  const [playing, setPlaying] = useState(true);

  // State for bodies and trails
  const [bodies, setBodies] = useState(() => createDefaultScenario());
  const [masses, setMasses] = useState([bodies[0].mass, bodies[1].mass, bodies[2].mass]);
  const [trails, setTrails] = useState([[], [], []]);
  const [canvasSize, setCanvasSize] = useState({ width: 0, height: 0, dpr: 1 });

  // Simulation parameters
  const [params, setParams] = useState({
    dt: 0.01,
    G: 1.0,
    softening: 2.0,
    damping: 0.001,
    trailLength: 300,
    speed: 1.0
  });

  // Keep refs for RAF loop
  const lastTimeRef = useRef(0);
  const rafRef = useRef(0);

  // Update masses effect
  useEffect(() => {
    setBodies((prev) => prev.map((b, i) => ({ ...b, mass: masses[i] })));
  }, [masses]);

  // Reset trails when length changes
  useEffect(() => {
    setTrails(([t0, t1, t2]) => [
      t0.slice(-params.trailLength),
      t1.slice(-params.trailLength),
      t2.slice(-params.trailLength),
    ]);
  }, [params.trailLength]);

  const stepSimulation = useCallback((dt) => {
    setBodies((prev) => rk4Step(prev, dt, params.G, params.softening, params.damping));
    setTrails((prev) => {
      const next = prev.map((arr, i) => {
        const p = { x: bodies[i].pos.x, y: bodies[i].pos.y };
        const updated = [...arr, p];
        if (updated.length > params.trailLength) {
          updated.shift();
        }
        return updated;
      });
      return next;
    });
  }, [params.G, params.softening, params.damping, params.trailLength, bodies]);

  // Animation loop
  const loop = useCallback((t) => {
    if (!playing) return;
    const last = lastTimeRef.current || t;
    const deltaMs = Math.min(50, t - last);
    lastTimeRef.current = t;

    // simulate scaled speed: multiple sub-steps for stability
    const simDt = params.dt * params.speed;
    const subSteps = Math.max(1, Math.floor(1 + params.speed));
    for (let i = 0; i < subSteps; i++) {
      stepSimulation(simDt / subSteps);
    }

    rafRef.current = requestAnimationFrame(loop);
  }, [playing, params.dt, params.speed, stepSimulation]);

  useEffect(() => {
    if (playing) {
      rafRef.current = requestAnimationFrame(loop);
    }
    return () => {
      if (rafRef.current) cancelAnimationFrame(rafRef.current);
    };
  }, [playing, loop]);

  // Controls handlers
  const handleMassChange = (idx, val) => {
    setMasses((m) => {
      const next = [...m];
      next[idx] = Math.max(0.1, val || 0.1);
      return next;
    });
  };

  const handleParamsChange = (p) => setParams(p);

  const handlePlayPause = () => setPlaying((v) => !v);

  const handleStep = () => {
    if (playing) return;
    stepSimulation(params.dt);
  };

  const handleReset = () => {
    const initial = createDefaultScenario();
    setBodies(initial);
    setMasses([initial[0].mass, initial[1].mass, initial[2].mass]);
    setTrails([[], [], []]);
    setPlaying(false);
  };

  // Initialize trails with current positions on mount
  useEffect(() => {
    setTrails(bodies.map((b) => [{ x: b.pos.x, y: b.pos.y }]));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <div className="container">
      <div className="row two" style={{ gap: 16 }}>
        <div className="card" style={{ padding: 16 }}>
          <div className="header">
            <div>
              <h1 className="title">Three-Body Simulation</h1>
              <p className="subtitle">Visualize chaotic orbits with RK4 integration</p>
            </div>
            <div className="badge">
              G {params.G.toFixed(2)} • dt {params.dt.toFixed(3)}
            </div>
          </div>
          <SimulationCanvas
            bodies={bodies}
            trails={trails}
            setCanvasSize={setCanvasSize}
            playing={playing}
          />
          <div className="legend" style={{ marginTop: 12 }}>
            <div className="item"><span className="dot" style={{ background: "#2563EB" }} /> Body A</div>
            <div className="item"><span className="dot" style={{ background: "#F59E0B" }} /> Body B</div>
            <div className="item"><span className="dot" style={{ background: "#10B981" }} /> Body C</div>
          </div>
        </div>

        <Controls
          masses={masses}
          onMassChange={handleMassChange}
          params={params}
          onParamsChange={handleParamsChange}
          playing={playing}
          onPlayPause={handlePlayPause}
          onStep={handleStep}
          onReset={handleReset}
        />
      </div>

      <p className="footer-note">
        Env: {config.nodeEnv} • Port: {config.port}
      </p>
    </div>
  );
}

export default App;
