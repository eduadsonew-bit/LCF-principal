const { spawn } = require('child_process');
const http = require('http');

function start() {
  console.log('[guardian] starting...');
  const child = spawn('node', ['node_modules/.bin/next', 'dev', '-p', '3000', '-H', '0.0.0.0'], {
    stdio: ['pipe', 'pipe', 'pipe'],
    env: { ...process.env, NODE_OPTIONS: '--max-old-space-size=256' }
  });
  child.stdout.on('data', d => process.stdout.write(d));
  child.stderr.on('data', d => process.stderr.write(d));
  child.on('exit', (code, sig) => {
    console.log(`[guardian] exited code=${code} signal=${sig}, restarting in 2s...`);
    setTimeout(start, 2000);
  });
  child.on('error', e => {
    console.log(`[guardian] error: ${e.message}, restarting in 2s...`);
    setTimeout(start, 2000);
  });
}
start();
