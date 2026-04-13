#!/bin/bash
while true; do
  PORT=3000 bun .next/standalone/server.js >> /home/z/my-project/dev.log 2>&1
  echo "[Keeper] Server exited at $(date), restarting in 1s..." >> /home/z/my-project/dev.log
  sleep 1
done
