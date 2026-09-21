import { SITE } from '@/lib/config';

export const dynamic = 'force-static';

export default function robots() {
  const base = SITE.url.replace(/\/$/, '');
  return {
    rules: {
      userAgent: '*',
      allow: '/',
    },
    sitemap: `${base}/sitemap.xml`,
  };
}
