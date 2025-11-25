#!/bin/bash
cd /home/kavia/workspace/code-generation/three-body-simulation-visualizer-211558-211567/three_body_simulation_frontend
npm run build
EXIT_CODE=$?
if [ $EXIT_CODE -ne 0 ]; then
   exit 1
fi

