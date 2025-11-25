import React from "react";

// PUBLIC_INTERFACE
export default function Controls({
  masses,
  onMassChange,
  params,
  onParamsChange,
  playing,
  onPlayPause,
  onStep,
  onReset
}) {
  /** UI controls for masses and simulation parameters. */

  const massField = (idx, color, label) => (
    <div className="field" key={idx}>
      <label>
        {label} mass
      </label>
      <div className="input">
        <span
          aria-hidden="true"
          style={{
            width: 10,
            height: 10,
            borderRadius: 999,
            background: color,
            display: "inline-block"
          }}
        />
        <input
          type="number"
          min="0.1"
          step="0.1"
          value={masses[idx]}
          onChange={(e) => onMassChange(idx, Number(e.target.value || 0))}
          aria-label={`${label} mass`}
        />
      </div>
    </div>
  );

  return (
    <div className="card" style={{ padding: 16 }}>
      <div className="header">
        <div>
          <div className="title">Simulation Controls</div>
          <p className="subtitle">Adjust masses and parameters</p>
        </div>
        <div className="badge">Ocean Professional</div>
      </div>

      <div className="controls-grid">
        <div className="section">
          <div className="row">
            <div className="legend">
              <div className="item"><span className="dot" style={{ background: "#2563EB" }} /> Body A</div>
              <div className="item"><span className="dot" style={{ background: "#F59E0B" }} /> Body B</div>
              <div className="item"><span className="dot" style={{ background: "#10B981" }} /> Body C</div>
            </div>
            <div className="row" style={{ gridTemplateColumns: "repeat(3, 1fr)", display: "grid", gap: 12 }}>
              {massField(0, "#2563EB", "Body A")}
              {massField(1, "#F59E0B", "Body B")}
              {massField(2, "#10B981", "Body C")}
            </div>
          </div>
          <div className="hr" />
          <div className="row">
            <div className="field">
              <label>Time step (dt)</label>
              <div className="range-row">
                <input
                  type="range"
                  min="0.001"
                  max="0.05"
                  step="0.001"
                  value={params.dt}
                  onChange={(e) => onParamsChange({ ...params, dt: Number(e.target.value) })}
                />
                <div className="badge">{params.dt.toFixed(3)}</div>
              </div>
            </div>

            <div className="field">
              <label>Gravity (G)</label>
              <div className="range-row">
                <input
                  type="range"
                  min="0.1"
                  max="5"
                  step="0.1"
                  value={params.G}
                  onChange={(e) => onParamsChange({ ...params, G: Number(e.target.value) })}
                />
                <div className="badge">{params.G.toFixed(1)}</div>
              </div>
            </div>

            <div className="field">
              <label>Softening</label>
              <div className="range-row">
                <input
                  type="range"
                  min="0"
                  max="5"
                  step="0.1"
                  value={params.softening}
                  onChange={(e) => onParamsChange({ ...params, softening: Number(e.target.value) })}
                />
                <div className="badge">{params.softening.toFixed(1)}</div>
              </div>
            </div>

            <div className="field">
              <label>Damping</label>
              <div className="range-row">
                <input
                  type="range"
                  min="0"
                  max="0.05"
                  step="0.001"
                  value={params.damping}
                  onChange={(e) => onParamsChange({ ...params, damping: Number(e.target.value) })}
                />
                <div className="badge">{params.damping.toFixed(3)}</div>
              </div>
            </div>
          </div>
        </div>

        <div className="section">
          <div className="row">
            <div className="field">
              <label>Trail length</label>
              <div className="range-row">
                <input
                  type="range"
                  min="20"
                  max="1000"
                  step="5"
                  value={params.trailLength}
                  onChange={(e) => onParamsChange({ ...params, trailLength: Number(e.target.value) })}
                />
                <div className="badge">{params.trailLength}</div>
              </div>
            </div>

            <div className="field">
              <label>Simulation speed</label>
              <div className="range-row">
                <input
                  type="range"
                  min="0.25"
                  max="3"
                  step="0.25"
                  value={params.speed}
                  onChange={(e) => onParamsChange({ ...params, speed: Number(e.target.value) })}
                />
                <div className="badge">{params.speed.toFixed(2)}x</div>
              </div>
            </div>

            <div className="btn-row" style={{ marginTop: 8 }}>
              <button className={`btn ${playing ? "ghost" : "primary"}`} onClick={onPlayPause}>
                {playing ? "Pause" : "Play"}
              </button>
              <button className="btn" onClick={onStep} aria-label="Step one frame">Step</button>
              <button className="btn secondary" onClick={onReset} aria-label="Reset simulation">Reset</button>
            </div>
          </div>
        </div>
      </div>

      <p className="footer-note">
        Tip: increase softening to reduce chaotic spikes; damping helps with numerical stability.
      </p>
    </div>
  );
}
