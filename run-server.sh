#!/bin/bash
cd /home/z/my-project

# Start the server in background
NODE_OPTIONS="--max-old-space-size=256" npx next dev -p 3000 &
SERVER_PID=$!

# Keep-alive loop in the same process
while kill -0 $SERVER_PID 2>/dev/null; do
  curl -s -o /dev/null http://localhost:3000/ 2>/dev/null
  sleep 3
done

echo "Server died, restarting..." >> /home/z/my-project/dev.log
exec bash $0
