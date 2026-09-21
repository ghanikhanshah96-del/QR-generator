import Link from 'next/link';

export const metadata = {
  title: 'QR Templates | EverQR',
  description: 'Starting points for business, restaurant, Wi‑Fi, review, and social QR designs.',
  alternates: { canonical: '/templates/' },
};

export default function TemplatesPage() {
  return (
    <div className="site-container py-10">
      <h1 className="font-display text-3xl font-semibold">Templates</h1>
      <p className="mt-2 text-ink-600">
        Use the generator presets for now — curated template packs expand in a later release.
      </p>
      <p className="mt-6">
        <Link className="btn-primary" href="/">
          Open generator
        </Link>
      </p>
    </div>
  );
}
