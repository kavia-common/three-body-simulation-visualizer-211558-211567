// PUBLIC_INTERFACE
export function getEnvVar(name, fallback = "") {
  /** Retrieve a public frontend env var (must be prefixed with REACT_APP_). */
  if (!name.startsWith("REACT_APP_")) {
    console.warn(`[env] Attempt to read non-public var "${name}". Returning fallback.`);
    return fallback;
    }
  const v = process.env[name];
  return (v === undefined || v === null || v === "") ? fallback : v;
}

// PUBLIC_INTERFACE
export function getAppConfig() {
  /** Convenience wrapper to get commonly used env config with safe defaults. */
  return {
    apiBase: getEnvVar("REACT_APP_API_BASE", ""),
    backendUrl: getEnvVar("REACT_APP_BACKEND_URL", ""),
    frontendUrl: getEnvVar("REACT_APP_FRONTEND_URL", ""),
    wsUrl: getEnvVar("REACT_APP_WS_URL", ""),
    nodeEnv: getEnvVar("REACT_APP_NODE_ENV", "development"),
    logLevel: getEnvVar("REACT_APP_LOG_LEVEL", "info"),
    featureFlags: getEnvVar("REACT_APP_FEATURE_FLAGS", ""),
    experimentsEnabled: getEnvVar("REACT_APP_EXPERIMENTS_ENABLED", "false") === "true",
    port: getEnvVar("REACT_APP_PORT", "3000"),
    healthcheckPath: getEnvVar("REACT_APP_HEALTHCHECK_PATH", "/healthz"),
    trustProxy: getEnvVar("REACT_APP_TRUST_PROXY", "false") === "true",
    enableSourceMaps: getEnvVar("REACT_APP_ENABLE_SOURCE_MAPS", "true") === "true",
  };
}
