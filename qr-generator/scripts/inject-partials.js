/**
 * Partials are injected during generate-pages.
 * This script re-runs page generation for convenience.
 */
import { spawnSync } from 'node:child_process';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const res = spawnSync('node', ['scripts/generate-pages.js'], { cwd: ROOT, stdio: 'inherit' });
process.exit(res.status || 0);
