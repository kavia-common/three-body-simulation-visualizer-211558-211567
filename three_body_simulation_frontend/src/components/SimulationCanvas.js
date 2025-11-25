import React, { useEffect, useRef } from "react";

// PUBLIC_INTERFACE
export default function SimulationCanvas({
  bodies,
  trails,
  setCanvasSize,
  playing,
  colors = ["#2563EB", "#F59E0B", "#10B981"],
  background = "#0b1220"
}) {
  /** Renders the three-body simulation on a high-DPI canvas with trails. */
  const canvasRef = useRef(null);

  // Resize observer to keep canvas crisp and responsive
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const parent = canvas.parentElement;
    const resize = () => {
      const rect = parent.getBoundingClientRect();
      const dpr = Math.min(window.devicePixelRatio || 1, 2);
      canvas.width = Math.max(1, Math.floor(rect.width * dpr));
      canvas.height = Math.max(1, Math.floor(rect.height * dpr));
      canvas.style.width = `${rect.width}px`;
      canvas.style.height = `${rect.height}px`;
      const ctx = canvas.getContext("2d");
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      setCanvasSize && setCanvasSize({ width: rect.width, height: rect.height, dpr });
      draw();
    };
    const ro = new ResizeObserver(resize);
    ro.observe(parent);
    resize();
    return () => ro.disconnect();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [setCanvasSize]);

  // Draw whenever bodies/trails change
  useEffect(() => {
    draw();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [bodies, trails, playing]);

  function draw() {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    const { width, height } = canvas.getBoundingClientRect();

    // background
    ctx.clearRect(0, 0, width, height);
    // vignette background
    const grad = ctx.createLinearGradient(0, 0, width, height);
    grad.addColorStop(0, "#0b1220");
    grad.addColorStop(1, "#0e1628");
    ctx.fillStyle = grad;
    ctx.fillRect(0, 0, width, height);

    // translate to center
    ctx.save();
    ctx.translate(width / 2, height / 2);

    // trails
    trails.forEach((track, i) => {
      if (track.length < 2) return;
      const color = colors[i % colors.length];
      ctx.beginPath();
      for (let j = 0; j < track.length; j++) {
        const p = track[j];
        if (j === 0) ctx.moveTo(p.x, p.y);
        else ctx.lineTo(p.x, p.y);
      }
      ctx.strokeStyle = color + "cc";
      ctx.lineWidth = 1.5;
      ctx.stroke();
    });

    // bodies
    bodies.forEach((b, i) => {
      const color = colors[i % colors.length];
      const r = Math.max(3, Math.sqrt(b.mass));
      ctx.beginPath();
      ctx.arc(b.pos.x, b.pos.y, r, 0, Math.PI * 2);
      ctx.fillStyle = color;
      ctx.shadowColor = color;
      ctx.shadowBlur = 10;
      ctx.fill();
      ctx.shadowBlur = 0;
    });

    ctx.restore();
  }

  return (
    <div className="canvas-wrap">
      <canvas ref={canvasRef} aria-label="Three body simulation canvas" />
      <div className="canvas-overlay" />
      {!playing && (
        <div
          aria-hidden="true"
          style={{
            position: "absolute",
            inset: 0,
            display: "grid",
            placeItems: "center",
            pointerEvents: "none"
          }}
        >
          <div className="badge">Paused</div>
        </div>
      )}
    </div>
  );
}
