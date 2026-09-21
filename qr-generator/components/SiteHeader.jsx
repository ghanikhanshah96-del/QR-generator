'use client';

import Link from 'next/link';
import { useEffect, useRef, useState } from 'react';
import { QR_TYPES } from '@/lib/constants';

function BrandLockup() {
  return (
    <Link href="/" className="flex items-center gap-2.5" aria-label="EverQR home">
      <span
        className="inline-flex size-9 items-center justify-center rounded-2xl bg-ink-950 text-brand-300 shadow-soft"
        aria-hidden="true"
      >
        <svg width="18" height="18" viewBox="0 0 24 24" fill="none">
          <path
            d="M4 4h6v6H4V4zm10 0h6v6h-6V4zM4 14h6v6H4v-6zm10 2h2v2h-2v-2zm4-2h2v6h-6v-2h4v-4zM14 14h2v2h-2v-2z"
            fill="currentColor"
          />
        </svg>
      </span>
      <span className="font-display text-xl font-semibold tracking-tight text-ink-950">EverQR</span>
    </Link>
  );
}

export default function SiteHeader() {
  const [open, setOpen] = useState(false);
  const [typesOpen, setTypesOpen] = useState(false);
  const typesRef = useRef(null);

  useEffect(() => {
    function onDoc(e) {
      if (!typesRef.current?.contains(e.target)) setTypesOpen(false);
    }
    document.addEventListener('click', onDoc);
    return () => document.removeEventListener('click', onDoc);
  }, []);

  useEffect(() => {
    document.body.style.overflow = open ? 'hidden' : '';
    return () => {
      document.body.style.overflow = '';
    };
  }, [open]);

  const types = Object.values(QR_TYPES);

  return (
    <header className="sticky top-0 z-40 border-b border-ink-200/50 bg-[#f7f8fa]/80 backdrop-blur-xl">
      <div className="site-container grid h-[4.25rem] grid-cols-[1fr_auto] items-center gap-3 md:grid-cols-[1fr_auto_1fr]">
        <BrandLockup />

        <nav className="hidden items-center justify-center gap-1 md:flex" aria-label="Primary">
          <Link className="nav-link" href="/">
            Create
          </Link>

          <div className="relative" ref={typesRef}>
            <button
              type="button"
              className="nav-link inline-flex items-center gap-1.5"
              aria-expanded={typesOpen}
              aria-haspopup="true"
              onClick={() => setTypesOpen((v) => !v)}
            >
              QR types
              <svg className="size-3.5 opacity-70" width="14" height="14" viewBox="0 0 24 24" fill="none" aria-hidden="true">
                <path d="M6 9l6 6 6-6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            </button>
            {typesOpen ? (
              <div className="nav-dropdown-menu" role="menu">
                {types.map((t) => (
                  <Link
                    key={t.id}
                    className="nav-dropdown-item"
                    role="menuitem"
                    href={t.path}
                    onClick={() => setTypesOpen(false)}
                  >
                    {t.label}
                  </Link>
                ))}
              </div>
            ) : null}
          </div>

          <Link className="nav-link" href="/guides/">
            Guides
          </Link>
          <Link className="nav-link" href="/saved-designs/">
            Saved
          </Link>
        </nav>

        <div className="flex items-center justify-end gap-2">
          <a href="/#generator-app" className="btn-primary hidden sm:inline-flex">
            Start free
          </a>
          <button
            type="button"
            className="btn-ghost md:hidden"
            aria-expanded={open}
            aria-controls="mobile-menu"
            aria-label="Open menu"
            onClick={() => setOpen((v) => !v)}
          >
            <svg width="22" height="22" viewBox="0 0 24 24" fill="none" aria-hidden="true">
              <path d="M4 7h16M4 12h16M4 17h16" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
            </svg>
          </button>
        </div>
      </div>

      {open ? (
        <div id="mobile-menu" className="border-t border-ink-100 bg-[#f7f8fa] md:hidden">
          <div className="site-container flex flex-col gap-1 py-4">
            <Link className="nav-link" href="/" onClick={() => setOpen(false)}>
              Create
            </Link>
            <p className="px-3 pt-2 text-[11px] font-semibold uppercase tracking-[0.14em] text-ink-400">QR types</p>
            <div className="grid grid-cols-2 gap-1 pb-2">
              {types.map((t) => (
                <Link key={t.id} className="nav-dropdown-item" href={t.path} onClick={() => setOpen(false)}>
                  {t.label}
                </Link>
              ))}
            </div>
            <Link className="nav-link" href="/guides/" onClick={() => setOpen(false)}>
              Guides
            </Link>
            <Link className="nav-link" href="/saved-designs/" onClick={() => setOpen(false)}>
              Saved
            </Link>
            <a href="/#generator-app" className="btn-primary mt-2" onClick={() => setOpen(false)}>
              Start free
            </a>
          </div>
        </div>
      ) : null}
    </header>
  );
}
