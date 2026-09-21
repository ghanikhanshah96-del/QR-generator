import Link from 'next/link';

export const metadata = {
  title: 'Page not found | EverQR',
  description: 'The page you requested could not be found.',
};

export default function NotFound() {
  return (
    <div className="site-container py-16">
      <h1 className="font-display text-3xl font-semibold text-ink-950">Page not found</h1>
      <p className="mt-4 text-ink-600">That link doesn’t exist.</p>
      <Link className="btn-primary mt-6 inline-flex" href="/">
        Return home
      </Link>
    </div>
  );
}
