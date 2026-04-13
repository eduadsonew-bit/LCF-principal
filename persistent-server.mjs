import { execSync, spawn } from 'child_process';

// Start Next.js
const server = spawn('npx', ['next', 'dev', '-p', '3000'], {
  env: { ...process.env, NODE_OPTIONS: '--max-old-space-size=256', PORT: '3000' },
  stdio: ['pipe', 'pipe', 'pipe']
});

server.stdout.on('data', (data) => {
  process.stdout.write(data);
});

server.stderr.on('data', (data) => {
  process.stderr.write(data);
});

// Keep-alive ping
const ping = () => {
  try {
    execSync('curl -s -o /dev/null http://localhost:3000/ 2>/dev/null', { timeout: 5000 });
  } catch {}
};

// Start pinging after 5 seconds
setTimeout(() => {
  ping();
  setInterval(ping, 2000);
}, 5000);

// Handle server exit
server.on('exit', () => {
  process.exit(1);
});

// Keep the process alive
process.stdin.resume();
