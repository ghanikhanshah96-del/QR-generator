import Link from 'next/link';
import GeneratorApp from '@/components/GeneratorApp';
import FaqList from '@/components/FaqList';
import ToolGrid from '@/components/ToolGrid';
import { TOOLS, getToolByDir } from '@/content/tools';
import { LEGAL_PAGES } from '@/content/legal';

const LEGAL_BY_FILE = Object.fromEntries(LEGAL_PAGES.map((p) => [p.file, p]));

export function generateStaticParams() {
  return [
    ...TOOLS.map((t) => ({ segment: t.dir })),
    ...LEGAL_PAGES.map((p) => ({ segment: p.file })),
  ];
}

export async function generateMetadata({ params }) {
  const { segment } = await params;
  const tool = getToolByDir(segment);
  if (tool) {
    return {
      title: tool.title,
      description: tool.description,
      alternates: { canonical: `/${tool.dir}/` },
    };
  }
  const legal = LEGAL_BY_FILE[segment];
  if (legal) {
    return {
      title: legal.title,
      description: legal.description,
      alternates: { canonical: `/${legal.file}` },
    };
  }
  return {};
}

export default async function SegmentPage({ params }) {
  const { segment } = await params;
  const tool = getToolByDir(segment);
  if (tool) return <ToolPageView tool={tool} />;
  const legal = LEGAL_BY_FILE[segment];
  if (legal) return <LegalPageView page={legal} />;

  return (
    <div className="site-container py-16">
      <h1 className="section-title">Page not found</h1>
      <Link className="btn-primary mt-6 inline-flex" href="/">
        Back home
      </Link>
    </div>
  );
}

function ToolPageView({ tool }) {
  return (
    <>
      <section className="site-container pt-8 sm:pt-12">
        <nav className="text-sm text-ink-500" aria-label="Breadcrumb">
          <ol className="flex flex-wrap items-center gap-2">
            <li>
              <Link className="hover:text-brand-700" href="/">
                Home
              </Link>
            </li>
            <li aria-hidden="true">/</li>
            <li className="font-medium text-ink-800">{tool.h1}</li>
          </ol>
        </nav>
        <div className="mt-6 max-w-3xl animate-rise-in">
          <p className="font-display text-4xl font-semibold tracking-tight text-ink-950 sm:text-5xl">EverQR</p>
          <h1 className="mt-3 text-2xl font-semibold tracking-tight text-ink-800 sm:text-3xl">{tool.h1}</h1>
          <p className="mt-3 max-w-2xl text-base text-ink-600 sm:text-lg">{tool.intro}</p>
          <div className="trust-row mt-5">
            <span>Free</span>
            <span>Private</span>
            <span>No watermark</span>
            <span>No signup</span>
          </div>
        </div>
      </section>

      <GeneratorApp key={tool.id} initialType={tool.id} lockType showTypeSelect />

      <section className="site-container grid gap-10 py-12 lg:grid-cols-2">
        <div className="panel p-6">
          <h2 className="section-title">How to use</h2>
          <ol className="mt-4 list-decimal space-y-2 pl-5 text-ink-700">
            {tool.instructions.map((step) => (
              <li key={step}>{step}</li>
            ))}
          </ol>
        </div>
        <div className="panel p-6">
          <h2 className="section-title">Privacy</h2>
          <p className="mt-4 leading-relaxed text-ink-600">
            Static QR codes generated here do not expire and do not depend on our servers. The encoded destination or
            information must remain valid for the QR code to remain useful. Your inputs are processed in the browser for
            generation.
          </p>
        </div>
      </section>

      <section className="site-container pb-16">
        <h2 className="section-title">Frequently asked questions</h2>
        <div className="mt-6">
          <FaqList items={tool.faqs} />
        </div>
        <div className="mt-10">
          <h2 className="text-lg font-semibold text-ink-950">Related tools</h2>
          <div className="mt-4">
            <ToolGrid />
          </div>
        </div>
      </section>
    </>
  );
}

function LegalPageView({ page }) {
  return (
    <div className="site-container py-10 sm:py-14">
      <article className="mx-auto max-w-3xl">
        <h1 className="font-display text-3xl font-semibold tracking-tight text-ink-950 sm:text-4xl">{page.heading}</h1>
        <div
          className="prose-ever mt-6 space-y-4 leading-relaxed text-ink-700 [&_a]:text-brand-800 [&_a]:underline [&_strong]:text-ink-950"
          dangerouslySetInnerHTML={{ __html: page.content }}
        />
      </article>
    </div>
  );
}
