import { createDefaultScenario, rk4Step } from "./threeBody";

test("rk4 step updates positions", () => {
  const init = createDefaultScenario();
  const next = rk4Step(init, 0.01, 1.0, 2.0, 0.0);
  // positions should change slightly
  for (let i = 0; i < init.length; i++) {
    expect(next[i].pos.x).not.toBe(init[i].pos.x);
    expect(next[i].pos.y).not.toBe(init[i].pos.y);
  }
});
