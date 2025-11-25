# Three-Body Simulation Frontend

A modern React app that simulates the three-body problem using an RK4 integrator and renders to a responsive canvas with motion trails.

## Quick start

- npm start — run the development server at http://localhost:3000
- npm test — run tests
- npm run build — production build

## Features

- RK4 physics integration with configurable gravity, softening, and damping
- Responsive, high-DPI canvas renderer with trails
- Mass inputs for three bodies
- Play, pause, step, reset controls
- Ocean Professional theme (blue and amber accents)

## Environment variables

Set these optional public variables (prefixed with REACT_APP_):
- REACT_APP_API_BASE
- REACT_APP_BACKEND_URL
- REACT_APP_FRONTEND_URL
- REACT_APP_WS_URL
- REACT_APP_NODE_ENV
- REACT_APP_ENABLE_SOURCE_MAPS
- REACT_APP_PORT
- REACT_APP_TRUST_PROXY
- REACT_APP_LOG_LEVEL
- REACT_APP_HEALTHCHECK_PATH
- REACT_APP_FEATURE_FLAGS
- REACT_APP_EXPERIMENTS_ENABLED

Create a .env.local if needed. Do not commit secrets.
