const { spawn } = require('child_process');

function start() {
  const child = spawn('node', ['.next/standalone/server.js'], {
    stdio: ['pipe', 'pipe', 'pipe'],
    env: { ...process.env, PORT: '3000', HOSTNAME: '0.0.0.0', NODE_OPTIONS: '--max-old-space-size=256' },
    cwd: '/home/z/my-project'
  });
  child.stdout.on('data', d => process.stdout.write(d));
  child.stderr.on('data', d => process.stderr.write(d));
  child.on('exit', (code, sig) => {
    console.log(`[guardian] server exited (code=${code} sig=${sig}), restarting in 2s...`);
    setTimeout(start, 2000);
  });
}
start();
