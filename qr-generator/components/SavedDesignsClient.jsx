'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { QR_TYPES } from '@/lib/constants';

export default function SavedDesignsClient() {
  const [items, setItems] = useState([]);
  const [ready, setReady] = useState(false);
  const [error, setError] = useState('');

  async function refresh() {
    const { listDesigns } = await import('@/lib/storage/saved-designs.js');
    const list = await listDesigns();
    setItems(list || []);
    setReady(true);
  }

  useEffect(() => {
    refresh().catch(() => {
      setError('Could not load saved designs from this browser.');
      setReady(true);
    });
  }, []);

  async function remove(id) {
    const { deleteDesign } = await import('@/lib/storage/saved-designs.js');
    await deleteDesign(id);
    await refresh();
  }

  function typeHref(type) {
    return QR_TYPES[type]?.path || '/';
  }

  return (
    <div className="site-container py-10 sm:py-14">
      <h1 className="font-display text-3xl font-semibold text-ink-950">Saved designs</h1>
      <p className="mt-2 max-w-2xl text-ink-600">
        Designs are stored in this browser with IndexedDB. Nothing is uploaded to an EverQR account — there isn’t one.
      </p>

      {!ready ? <p className="mt-8 text-sm text-ink-500">Loading…</p> : null}
      {error ? <p className="mt-8 text-sm text-red-600">{error}</p> : null}

      {ready && !error && items.length === 0 ? (
        <div className="panel mt-8 p-6">
          <p className="text-ink-700">No saved designs yet.</p>
          <Link className="btn-primary mt-4 inline-flex" href="/">
            Create a QR code
          </Link>
        </div>
      ) : null}

      <div className="mt-8 grid gap-3">
        {items.map((item) => (
          <article key={item.id} className="panel flex flex-wrap items-center justify-between gap-3 p-4">
            <div>
              <p className="font-semibold text-ink-950">{item.name || 'Untitled design'}</p>
              <p className="text-xs text-ink-500">
                {item.type || 'qr'} · updated{' '}
                {item.meta?.updatedAt ? new Date(item.meta.updatedAt).toLocaleString() : '—'}
              </p>
            </div>
            <div className="flex gap-2">
              <Link className="btn-secondary text-xs" href={typeHref(item.type)}>
                Open type
              </Link>
              <button type="button" className="btn-ghost text-xs" onClick={() => remove(item.id)}>
                Delete
              </button>
            </div>
          </article>
        ))}
      </div>
    </div>
  );
}
