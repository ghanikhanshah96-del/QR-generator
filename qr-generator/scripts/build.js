import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { spawnSync } from 'node:child_process';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const ROOT = path.resolve(__dirname, '..');

function run(cmd, args) {
  const res = spawnSync(cmd, args, { cwd: ROOT, stdio: 'inherit', shell: process.platform === 'win32' });
  if (res.status !== 0) process.exit(res.status || 1);
}

console.log('Generating pages…');
run('node', ['scripts/generate-pages.js']);

console.log('Building CSS…');
run('npx', ['tailwindcss', '-i', './assets/css/input.css', '-o', './assets/css/output.css', '--minify']);

console.log('Generating sitemap & robots…');
run('node', ['scripts/generate-sitemap.js']);
run('node', ['scripts/generate-robots.js']);

console.log('Build complete.');
