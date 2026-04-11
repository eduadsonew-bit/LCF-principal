#!/bin/bash
while true; do
  cd /home/z/my-project
  bun run dev 2>&1 | tee -a /home/z/my-project/dev.log
  echo "Server died at $(date), restarting..." >> /home/z/my-project/dev.log
  sleep 2
done
