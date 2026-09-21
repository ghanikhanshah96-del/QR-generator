import GeneratorApp from '@/components/GeneratorApp';
import ToolGrid from '@/components/ToolGrid';
import { SITE } from '@/lib/config';

export const metadata = {
  title: `${SITE.name} — Free Permanent Private Unlimited QR Code Generator`,
  description:
    'Free, permanent, private, unlimited QR code generator. No signup, no expiration, no watermark. Create static QR codes in your browser.',
  alternates: { canonical: '/' },
};

export default function HomePage() {
  return (
    <>
      <section className="site-container pt-10 sm:pt-16">
        <div className="max-w-4xl animate-rise-in">
          <h1 className="hero-brand">EverQR</h1>
          <p className="mt-5 max-w-xl text-xl font-medium tracking-tight text-ink-800 sm:text-2xl">
            Free. Permanent. Private. Unlimited.
          </p>
          <p className="mt-4 max-w-xl text-base leading-relaxed text-ink-600 sm:text-lg">
            Create beautiful static QR codes in your browser — no signup, no watermark, nothing stored on our servers.
          </p>
          <div className="trust-row mt-6">
            <span>No signup</span>
            <span>No expiration</span>
            <span>No watermark</span>
            <span>Unlimited</span>
          </div>
        </div>
      </section>

      <GeneratorApp key="home" initialType="url" lockType={false} showTypeSelect />

      <section className="site-container py-6">
        <div className="grid gap-4 md:grid-cols-3">
          <article className="panel p-5">
            <p className="text-[11px] font-semibold uppercase tracking-[0.14em] text-brand-700">Private</p>
            <h3 className="mt-2 font-semibold text-ink-950">Processed on your device</h3>
            <p className="mt-2 text-sm leading-relaxed text-ink-600">
              Wi‑Fi passwords, contacts, and messages stay in the browser for generation.
            </p>
          </article>
          <article className="panel p-5">
            <p className="text-[11px] font-semibold uppercase tracking-[0.14em] text-brand-700">Permanent</p>
            <h3 className="mt-2 font-semibold text-ink-950">No server dependency</h3>
            <p className="mt-2 text-sm leading-relaxed text-ink-600">
              Static codes don’t expire because of us. Destinations must remain valid.
            </p>
          </article>
          <article className="panel p-5">
            <p className="text-[11px] font-semibold uppercase tracking-[0.14em] text-brand-700">Print-ready</p>
            <h3 className="mt-2 font-semibold text-ink-950">PNG, SVG, or JPG</h3>
            <p className="mt-2 text-sm leading-relaxed text-ink-600">
              Download high-quality files with your colors and logo — never a watermark.
            </p>
          </article>
        </div>
      </section>

      <section className="site-container py-14">
        <div className="flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <h2 className="section-title">All QR tools</h2>
            <p className="muted mt-2">Every tool encodes information directly in the QR whenever possible.</p>
          </div>
        </div>
        <div className="mt-8">
          <ToolGrid />
        </div>
      </section>
    </>
  );
}
