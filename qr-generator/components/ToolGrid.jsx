import Link from 'next/link';
import { QR_TYPES } from '@/lib/constants';

export default function ToolGrid() {
  const tools = Object.values(QR_TYPES);

  return (
    <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
      {tools.map((t) => (
        <Link key={t.id} href={t.path} className="tool-card">
          <span className="tool-card-icon" aria-hidden="true">
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none">
              <path
                d="M4 4h6v6H4V4zm10 0h6v6h-6V4zM4 14h6v6H4v-6zm10 2h2v2h-2v-2zm4-2h2v6h-6v-2h4v-4zM14 14h2v2h-2v-2z"
                fill="currentColor"
              />
            </svg>
          </span>
          <p className="font-semibold text-ink-950">{t.label}</p>
          <p className="mt-1 text-sm text-ink-600">{t.description}</p>
        </Link>
      ))}
    </div>
  );
}
