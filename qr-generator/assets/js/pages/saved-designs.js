import { listDesigns, deleteDesign, duplicateDesign, renameDesign } from '../storage/saved-designs.js';
import { createToast } from '../ui/toast.js';
import { initShell } from '../init.js';
import { formatDate } from '../utils/format.js';
import { escapeHtml } from '../utils/escape.js';

initShell();
const toast = createToast();
const root = document.getElementById('saved-designs-root');

async function render() {
  const designs = await listDesigns();
  if (!root) return;
  if (!designs.length) {
    root.innerHTML =
      '<div class="panel p-6 text-ink-600">No saved designs yet. Create a QR on the <a class="text-brand-800 underline" href="../">homepage</a> and click “Save locally”.</div>';
    return;
  }

  root.replaceChildren();
  for (const d of designs) {
    const card = document.createElement('article');
    card.className = 'panel p-4 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between';
    card.innerHTML = `
      <div>
        <h2 class="font-semibold text-ink-950">${escapeHtml(d.name)}</h2>
        <p class="text-xs text-ink-500 mt-1">${escapeHtml(d.type)} · Updated ${escapeHtml(
      formatDate(d.updatedAt)
    )}</p>
      </div>
      <div class="flex flex-wrap gap-2">
        <a class="btn-primary text-xs" href="../${d.type === 'google-review' ? 'google-review' : d.type}-qr-code/">Open tool</a>
        <button type="button" data-rename class="btn-secondary text-xs">Rename</button>
        <button type="button" data-dup class="btn-secondary text-xs">Duplicate</button>
        <button type="button" data-del class="btn-ghost text-xs text-red-700">Delete</button>
      </div>`;
    card.querySelector('[data-rename]').addEventListener('click', async () => {
      const name = prompt('Rename design', d.name);
      if (!name) return;
      await renameDesign(d.id, name);
      toast.show('Renamed', { tone: 'success' });
      render();
    });
    card.querySelector('[data-dup]').addEventListener('click', async () => {
      await duplicateDesign(d.id);
      toast.show('Duplicated', { tone: 'success' });
      render();
    });
    card.querySelector('[data-del]').addEventListener('click', async () => {
      if (!confirm('Delete this local design?')) return;
      await deleteDesign(d.id);
      toast.show('Deleted', { tone: 'success' });
      render();
    });
    root.appendChild(card);
  }
}

render().catch(() => {
  if (root) root.textContent = 'Could not load local designs.';
});
