'use client';

import { useState } from 'react';

export default function FaqList({ items = [] }) {
  const [openId, setOpenId] = useState(null);

  return (
    <div className="space-y-3">
      {items.map((item, i) => {
        const id = `faq-${i + 1}`;
        const open = openId === id;
        return (
          <div key={id} className="panel overflow-hidden">
            <h3>
              <button
                type="button"
                className="flex w-full items-center justify-between gap-4 px-4 py-3 text-left text-sm font-semibold text-ink-900"
                aria-expanded={open}
                aria-controls={id}
                onClick={() => setOpenId(open ? null : id)}
              >
                <span>{item.q}</span>
                <span aria-hidden="true" className="text-ink-400">
                  {open ? '−' : '+'}
                </span>
              </button>
            </h3>
            {open ? (
              <div id={id} className="border-t border-ink-100 px-4 py-3 text-sm leading-relaxed text-ink-600">
                {item.a}
              </div>
            ) : null}
          </div>
        );
      })}
    </div>
  );
}
