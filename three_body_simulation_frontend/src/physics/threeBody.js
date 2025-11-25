/**
 * Three-body simulation with RK4 integrator.
 * Positions/velocities are in canvas-space units; G is configurable.
 */

// Vector helpers
const vAdd = (a, b) => ({ x: a.x + b.x, y: a.y + b.y });
const vSub = (a, b) => ({ x: a.x - b.x, y: a.y - b.y });
const vMul = (a, s) => ({ x: a.x * s, y: a.y * s });
const vLenSq = (a) => a.x * a.x + a.y * a.y;

// PUBLIC_INTERFACE
export function computeAccelerations(bodies, G = 1, softening = 0.0) {
  /**
   * Compute acceleration on each body due to all others.
   * softening adds epsilon^2 to distance^2 to avoid singularities.
   */
  return bodies.map((bi, i) => {
    let acc = { x: 0, y: 0 };
    for (let j = 0; j < bodies.length; j++) {
      if (i === j) continue;
      const bj = bodies[j];
      const r = vSub(bj.pos, bi.pos);
      const distSq = vLenSq(r) + softening * softening;
      const invDist3 = 1 / Math.pow(distSq, 1.5);
      const factor = G * bj.mass * invDist3;
      acc = vAdd(acc, vMul(r, factor));
    }
    return acc;
  });
}

// PUBLIC_INTERFACE
export function rk4Step(state, dt, G = 1, softening = 0.0, damping = 0.0) {
  /**
   * Perform a single RK4 integration step.
   * state: array of { pos: {x,y}, vel: {x,y}, mass }
   * damping: 0..1 small factor to scale velocities (numerical damping)
   */
  const n = state.length;

  // Flatten to arrays for ease
  const y0 = state.map(b => ({ pos: { ...b.pos }, vel: { ...b.vel }, mass: b.mass }));

  const acc = (arr) => computeAccelerations(arr.map((b, i) => ({
    pos: b.pos, vel: b.vel, mass: state[i].mass
  })), G, softening);

  const k1_v = acc(y0);
  const k1_p = y0.map((b, i) => ({ x: b.vel.x, y: b.vel.y }));

  const y1 = y0.map((b, i) => ({
    pos: vAdd(b.pos, vMul(k1_p[i], dt / 2)),
    vel: vAdd(b.vel, vMul(k1_v[i], dt / 2)),
  }));
  const k2_v = acc(y1);
  const k2_p = y1.map((b) => ({ x: b.vel.x, y: b.vel.y }));

  const y2 = y0.map((b, i) => ({
    pos: vAdd(b.pos, vMul(k2_p[i], dt / 2)),
    vel: vAdd(b.vel, vMul(k2_v[i], dt / 2)),
  }));
  const k3_v = acc(y2);
  const k3_p = y2.map((b) => ({ x: b.vel.x, y: b.vel.y }));

  const y3 = y0.map((b, i) => ({
    pos: vAdd(b.pos, vMul(k3_p[i], dt)),
    vel: vAdd(b.vel, vMul(k3_v[i], dt)),
  }));
  const k4_v = acc(y3);
  const k4_p = y3.map((b) => ({ x: b.vel.x, y: b.vel.y }));

  const next = y0.map((b, i) => {
    const dp = vMul(vAdd(vAdd(k1_p[i], vMul(vAdd(k2_p[i], k3_p[i]), 2)), k4_p[i]), dt / 6);
    const dv = vMul(vAdd(vAdd(k1_v[i], vMul(vAdd(k2_v[i], k3_v[i]), 2)), k4_v[i]), dt / 6);
    let vel = vAdd(b.vel, dv);
    if (damping !== 0) {
      vel = vMul(vel, Math.max(0, 1 - damping));
    }
    return {
      mass: state[i].mass,
      pos: vAdd(b.pos, dp),
      vel
    };
  });

  return next;
}

// PUBLIC_INTERFACE
export function createDefaultScenario() {
  /** Return a stable-ish initial configuration for visual appeal. */
  return [
    { mass: 12, pos: { x: -120, y: 0 }, vel: { x: 0, y: 0.6 } },
    { mass: 14, pos: { x: 120, y: 0 }, vel: { x: 0, y: -0.6 } },
    { mass: 6, pos: { x: 0, y: 0 }, vel: { x: 1.1, y: 0 } },
  ];
}
