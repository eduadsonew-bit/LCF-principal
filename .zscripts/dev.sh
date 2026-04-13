#!/bin/bash
cd /home/z/my-project

# Install dependencies
bun install

# Push database schema
bun run db:push

# Start the dev server (keep running)
NODE_OPTIONS="--max-old-space-size=256" bun run dev
