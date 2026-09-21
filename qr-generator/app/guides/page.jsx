import Link from 'next/link';
import { GUIDES } from '@/content/guides';

export const metadata = {
  title: 'QR Code Guides | EverQR',
  description: 'Practical guides on QR codes, printing, security, and business use cases.',
  alternates: { canonical: '/guides/' },
};

export default function GuidesIndexPage() {
  return (
    <div className="site-container py-10 sm:py-14">
      <h1 className="font-display text-3xl font-semibold text-ink-950">Guides</h1>
      <p className="mt-2 text-ink-600">Clear, practical articles — written for humans, not keyword stuffing.</p>
      <ul className="mt-8 grid gap-3 sm:grid-cols-2">
        {GUIDES.map((g) => (
          <li key={g.dir}>
            <Link className="panel block p-4 hover:border-brand-300" href={`/guides/${g.dir}/`}>
              <span className="font-semibold text-ink-900">{g.heading}</span>
            </Link>
          </li>
        ))}
      </ul>
    </div>
  );
}
