import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const htmlFiles = [];

function walk(dir) {
  for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
    if (['node_modules', 'dist', '.git'].includes(entry.name)) continue;
    const full = path.join(dir, entry.name);
    if (entry.isDirectory()) walk(full);
    else if (entry.name.endsWith('.html')) htmlFiles.push(full);
  }
}

walk(ROOT);
let missing = 0;
for (const file of htmlFiles) {
  const html = fs.readFileSync(file, 'utf8');
  const hrefs = [...html.matchAll(/href="([^"]+)"/g)].map((m) => m[1]);
  for (const href of hrefs) {
    if (!href.startsWith('.') && !href.startsWith('/')) continue;
    if (href.startsWith('mailto:') || href.startsWith('http')) continue;
    const target = path.resolve(path.dirname(file), href.replace(/\/$/, '/index.html'));
    const alt = path.resolve(path.dirname(file), href);
    if (!fs.existsSync(target) && !fs.existsSync(alt)) {
      console.warn(`Missing: ${href} from ${path.relative(ROOT, file)}`);
      missing += 1;
    }
  }
}
console.log(missing ? `Found ${missing} potential missing links` : 'No missing local links detected');
process.exit(missing ? 1 : 0);
