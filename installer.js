import { spawn, exec } from 'child_process';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const appDir = __dirname;

const startServer = () => {
  const server = spawn(process.execPath, [path.join(appDir, 'server.js')], {
    cwd: appDir,
    stdio: 'inherit',
    shell: false,
  });

  server.on('exit', (code) => {
    if (code !== 0) {
      console.error('O servidor encerrou com erro.');
    }
  });
};

const openApp = () => {
  const target = 'http://localhost:3000';
  const command = process.platform === 'win32'
    ? `start "" "${target}"`
    : process.platform === 'darwin'
      ? `open "${target}"`
      : `xdg-open "${target}"`;

  exec(command, () => {});
};

startServer();
setTimeout(openApp, 2000);
