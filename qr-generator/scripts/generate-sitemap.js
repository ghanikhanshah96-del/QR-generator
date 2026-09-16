import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const SITE = 'https://everqr.app';

const urls = [
  '/',
  '/url-qr-code/',
  '/text-qr-code/',
  '/wifi-qr-code/',
  '/whatsapp-qr-code/',
  '/google-review-qr-code/',
  '/vcard-qr-code/',
  '/email-qr-code/',
  '/sms-qr-code/',
  '/phone-qr-code/',
  '/location-qr-code/',
  '/image-qr-code/',
  '/video-qr-code/',
  '/saved-designs/',
  '/guides/',
  '/guides/what-is-a-qr-code/',
  '/guides/how-qr-codes-work/',
  '/guides/static-vs-dynamic-qr-codes/',
  '/guides/do-qr-codes-expire/',
  '/guides/qr-code-error-correction/',
  '/guides/qr-code-size-guide/',
  '/guides/qr-code-printing-guide/',
  '/guides/qr-code-best-practices/',
  '/guides/qr-code-security/',
  '/guides/qr-code-for-business/',
  '/guides/qr-code-for-restaurants/',
  '/guides/qr-code-for-wifi/',
  '/guides/qr-code-for-google-reviews/',
  '/guides/qr-code-with-logo/',
  '/about.html',
  '/privacy-policy.html',
  '/terms.html',
  '/faq.html',
  '/contact.html',
  '/accessibility.html',
  '/security.html',
  '/changelog.html',
];

const today = new Date().toISOString().slice(0, 10);
const body = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${urls
  .map(
    (u) => `  <url>
    <loc>${SITE}${u}</loc>
    <lastmod>${today}</lastmod>
  </url>`
  )
  .join('\n')}
</urlset>
`;

fs.writeFileSync(path.join(ROOT, 'sitemap.xml'), body);
console.log('sitemap.xml written');
