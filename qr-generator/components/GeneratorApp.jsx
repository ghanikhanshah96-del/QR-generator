'use client';

import { useEffect } from 'react';

/**
 * Mounts the existing vanilla generator (bootGenerator) into a stable DOM shell
 * so Next.js owns routing/SEO while QR logic stays client-side and private.
 *
 * Important: do not use a "booted" ref that survives React Strict Mode's
 * effect remount — that skips the second boot and leaves empty form fields.
 */
export default function GeneratorApp({ initialType = 'url', lockType = false, showTypeSelect = true }) {
  useEffect(() => {
    let cancelled = false;
    let api = null;

    async function start() {
      const QRCodeStylingMod = await import('qr-code-styling');
      const QRCodeStyling = QRCodeStylingMod.default || QRCodeStylingMod;
      const { setQrCodeStyling } = await import('@/lib/core/qr-engine.js');
      const { bootGenerator } = await import('@/lib/app.js');

      setQrCodeStyling(QRCodeStyling);
      const instance = bootGenerator({ initialType, lockType });
      // Strict Mode may have already cleaned up while we were importing.
      if (cancelled) {
        instance.destroy?.();
        return;
      }
      api = instance;
    }

    start().catch((err) => {
      console.error('Failed to boot QR generator', err);
    });

    return () => {
      cancelled = true;
      api?.destroy?.();
    };
  }, [initialType, lockType]);

  return (
    <section id="generator-app" className="site-container pb-10 pt-2 sm:pb-14">
      <div className="editor-shell">
        <div className="animate-rise-in space-y-5">
          <div className="panel-strong space-y-6 p-5 sm:p-7">
            <div className="space-y-4">
              <div>
                <p className="text-[11px] font-semibold uppercase tracking-[0.16em] text-brand-700">Content</p>
                <h2 className="mt-1 text-xl font-semibold tracking-tight text-ink-950">What should this QR open?</h2>
              </div>
              {showTypeSelect ? (
                <div>
                  <label className="field-label" htmlFor="qr-type">
                    QR type
                  </label>
                  <select id="qr-type" className="sr-only" tabIndex={-1} aria-hidden="true" defaultValue={initialType} />
                  <div id="qr-type-chips" className="flex flex-wrap gap-2" role="group" aria-label="Choose QR type" />
                </div>
              ) : (
                <input type="hidden" id="qr-type" defaultValue={initialType} />
              )}
              <div id="qr-fields" className="space-y-4" />
            </div>
          </div>

          <div className="panel p-5 sm:p-7">
            <div className="flex items-start justify-between gap-4">
              <div>
                <p className="text-[11px] font-semibold uppercase tracking-[0.16em] text-ink-500">Design</p>
                <h2 className="mt-1 text-lg font-semibold text-ink-950">Make it yours</h2>
                <p className="mt-1 text-sm text-ink-500">Start simple. Open advanced options only when you need them.</p>
              </div>
            </div>
            <div className="mt-5">
              <EditorControls />
            </div>
          </div>
        </div>

        <PreviewPanel />
      </div>
      <div id="toast-host" className="toast-host" aria-live="polite" />
    </section>
  );
}

function EditorControls() {
  return (
    <section id="qr-editor" className="space-y-5" aria-label="Design controls">
      <div>
        <h3 className="text-xs font-semibold uppercase tracking-[0.14em] text-ink-500">Quick styles</h3>
        <div className="mt-3 flex flex-wrap gap-2" data-presets />
      </div>

      <details className="group rounded-2xl border border-ink-100 bg-ink-50/50 open:bg-white" open>
        <summary className="cursor-pointer list-none px-4 py-3 text-sm font-semibold text-ink-900 marker:content-none [&::-webkit-details-marker]:hidden">
          <span className="flex items-center justify-between gap-3">
            Colors &amp; pattern
            <span className="text-ink-400 transition group-open:rotate-45" aria-hidden="true">
              +
            </span>
          </span>
        </summary>
        <div className="space-y-5 border-t border-ink-100 px-4 py-4">
          <div>
            <h4 className="text-xs font-semibold uppercase tracking-[0.12em] text-ink-500">Pattern</h4>
            <div className="mt-3 grid grid-cols-2 gap-2 sm:grid-cols-3" data-dots-options />
          </div>
          <div className="grid gap-4 sm:grid-cols-2">
            <div>
              <h4 className="text-xs font-semibold uppercase tracking-[0.12em] text-ink-500">Corner eyes</h4>
              <div className="mt-3 grid grid-cols-1 gap-2" data-corner-square-options />
            </div>
            <div>
              <h4 className="text-xs font-semibold uppercase tracking-[0.12em] text-ink-500">Eye centers</h4>
              <div className="mt-3 grid grid-cols-1 gap-2" data-corner-dot-options />
            </div>
          </div>
          <div className="grid gap-4 sm:grid-cols-2">
            <div>
              <label className="field-label" htmlFor="design-foreground">
                Foreground
              </label>
              <input id="design-foreground" className="field-input h-12 p-1" type="color" defaultValue="#111827" />
            </div>
            <div>
              <label className="field-label" htmlFor="design-background">
                Background
              </label>
              <input id="design-background" className="field-input h-12 p-1" type="color" defaultValue="#ffffff" />
            </div>
          </div>
          <div className="flex flex-col gap-3">
            <label className="flex min-h-[44px] items-center gap-2 text-sm text-ink-800">
              <input id="design-transparent" type="checkbox" className="size-4 rounded border-ink-300 text-brand-700" />
              Transparent background
            </label>
            <label className="flex min-h-[44px] items-center gap-2 text-sm text-ink-800">
              <input id="design-gradient" type="checkbox" className="size-4 rounded border-ink-300 text-brand-700" />
              Gradient foreground
            </label>
            <div>
              <label className="field-label" htmlFor="design-gradient-color">
                Gradient end color
              </label>
              <input id="design-gradient-color" className="field-input h-12 p-1" type="color" defaultValue="#1fa392" />
            </div>
          </div>
        </div>
      </details>

      <details className="group rounded-2xl border border-ink-100 bg-ink-50/50">
        <summary className="cursor-pointer list-none px-4 py-3 text-sm font-semibold text-ink-900 marker:content-none [&::-webkit-details-marker]:hidden">
          <span className="flex items-center justify-between gap-3">
            Size, logo &amp; error correction
            <span className="text-ink-400 transition group-open:rotate-45" aria-hidden="true">
              +
            </span>
          </span>
        </summary>
        <div className="space-y-5 border-t border-ink-100 px-4 py-4">
          <div>
            <div className="flex items-center justify-between gap-3">
              <label className="field-label mb-0" htmlFor="design-size">
                Export size
              </label>
              <span id="design-size-value" className="text-xs font-medium text-ink-500">
                512px
              </span>
            </div>
            <input
              id="design-size"
              type="range"
              min="128"
              max="2048"
              step="32"
              defaultValue="512"
              className="mt-2 w-full accent-brand-600"
            />
          </div>
          <div>
            <h4 className="text-xs font-semibold uppercase tracking-[0.12em] text-ink-500">Error correction</h4>
            <div className="mt-3 grid grid-cols-2 gap-2" data-ecc-options />
            <p className="field-hint">Use H when adding a logo or printing small.</p>
          </div>
          <div className="space-y-3 rounded-2xl border border-ink-100 bg-white p-4">
            <h4 className="text-sm font-semibold text-ink-900">Logo</h4>
            <input
              id="design-logo"
              type="file"
              accept="image/png,image/jpeg,image/webp,image/svg+xml"
              className="block w-full text-sm text-ink-700 file:mr-3 file:rounded-xl file:border-0 file:bg-ink-950 file:px-3 file:py-2 file:text-sm file:font-semibold file:text-white"
            />
            <p id="design-logo-status" className="text-xs text-ink-500">
              No logo uploaded
            </p>
            <div className="grid gap-3 sm:grid-cols-2">
              <div>
                <label className="field-label" htmlFor="design-logo-size">
                  Logo size (%)
                </label>
                <input id="design-logo-size" type="range" min="12" max="28" defaultValue="22" className="w-full accent-brand-600" />
                <p className="field-hint">Kept small so phones can still read the code.</p>
              </div>
              <div>
                <label className="field-label" htmlFor="design-logo-margin">
                  Logo margin
                </label>
                <input id="design-logo-margin" type="range" min="0" max="16" defaultValue="8" className="w-full accent-brand-600" />
              </div>
            </div>
            <button type="button" id="design-remove-logo" className="btn-secondary text-xs" hidden>
              Remove logo
            </button>
          </div>
        </div>
      </details>
    </section>
  );
}

function PreviewPanel() {
  return (
    <aside className="sticky-preview animate-preview-in" aria-label="QR preview and downloads">
      <div className="panel-strong overflow-hidden">
        <div className="border-b border-ink-100 bg-gradient-to-br from-ink-950 via-ink-900 to-brand-900 px-5 py-4 text-white">
          <div className="flex items-center justify-between gap-3">
            <div>
              <p className="text-[11px] font-semibold uppercase tracking-[0.16em] text-brand-200">Live preview</p>
              <p className="mt-1 text-sm text-white/70">Updates as you type</p>
            </div>
            <span className="rounded-full bg-white/10 px-3 py-1 text-[11px] font-semibold text-brand-100">No watermark</span>
          </div>
        </div>
        <div className="space-y-5 p-5 sm:p-6">
          <div className="qr-preview-frame" id="qr-preview-canvas" role="img" aria-label="QR code preview" />
          <div className="space-y-2 text-center">
            <p id="qr-status" className="text-sm text-ink-500">
              Enter content to generate a live QR preview.
            </p>
            <p id="qr-warning" className="text-xs text-amber-700" hidden />
          </div>
          <div className="space-y-3" aria-label="Download options">
            <h2 className="text-sm font-semibold text-ink-900">Download</h2>
            <div className="grid grid-cols-3 gap-2">
              <button type="button" id="download-png" className="btn-download">
                PNG
              </button>
              <button type="button" id="download-svg" className="btn-secondary">
                SVG
              </button>
              <button type="button" id="download-jpg" className="btn-secondary">
                JPG
              </button>
            </div>
            <div className="flex flex-wrap gap-2 pt-1">
              <button type="button" id="save-design" className="btn-secondary text-xs">
                Save locally
              </button>
              <button type="button" id="export-project" className="btn-ghost text-xs">
                Export JSON
              </button>
              <label className="btn-ghost cursor-pointer text-xs">
                Import
                <input id="import-project" type="file" accept="application/json,.json,.everqr.json" className="sr-only" />
              </label>
            </div>
            <p className="text-xs text-ink-500">Created on your device. Forever yours — no account needed.</p>
          </div>
          <p id="qr-privacy-note" className="text-center text-xs leading-relaxed text-ink-500" />
        </div>
      </div>
    </aside>
  );
}
