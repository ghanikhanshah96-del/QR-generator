import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const content = `User-agent: *
Allow: /

Sitemap: https://everqr.app/sitemap.xml
`;
fs.writeFileSync(path.join(ROOT, 'robots.txt'), content);
console.log('robots.txt written');
