import { getEnvVar, getAppConfig } from "./env";

test("getEnvVar returns fallback for non-public names", () => {
  expect(getEnvVar("NODE_ENV", "dev")).toBe("dev");
});

test("getAppConfig has defaults", () => {
  const cfg = getAppConfig();
  expect(cfg.nodeEnv).toBeDefined();
  expect(typeof cfg.experimentsEnabled).toBe("boolean");
});
