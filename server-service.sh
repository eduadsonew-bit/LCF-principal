#!/bin/bash
cd /home/z/my-project
while true; do
  # Start the server
  NODE_OPTIONS="--max-old-space-size=256" npx next dev -p 3000 >> /home/z/my-project/dev.log 2>&1 &
  SERVER_PID=$!
  
  # Keep pinging until server dies
  while kill -0 $SERVER_PID 2>/dev/null; do
    curl -s -o /dev/null http://localhost:3000/ 2>/dev/null
    sleep 2
  done
  
  echo "[Service] Server died at $(date), restarting..." >> /home/z/my-project/dev.log
  sleep 1
done
