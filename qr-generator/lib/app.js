import { QR_TYPES } from './constants.js';
import { SITE } from './config.js';
import { createQrState } from './core/qr-state.js';
import { createQrRenderer } from './core/qr-renderer.js';
import { buildPayload } from './generators/index.js';
import { bindEditor } from './editor/editor.js';
import { exportPng, exportJpg, exportSvg } from './core/qr-export.js';
import { exportProjectJson } from './export/project-json.js';
import { parseProjectJson } from './core/qr-import.js';
import { saveDesign } from './storage/saved-designs.js';
import { pushRecentDesign } from './storage/recent-designs.js';
import { setRecentType, getRecentType } from './core/qr-storage.js';
import { createToast } from './ui/toast.js';
import { setText } from './utils/escape.js';
import { readFileAsText } from './utils/file.js';
import { renderTypeFields } from './ui/type-forms.js';

/**
 * Boot the main QR generator experience on a page.
 * @param {{ initialType?: string, lockType?: boolean }} options
 */
export function bootGenerator(options = {}) {
  const abort = new AbortController();
  const { signal } = abort;
  const toast = createToast();
  const typeSelect = document.getElementById('qr-type');
  const fieldsRoot = document.getElementById('qr-fields');
  const chipsHost = document.getElementById('qr-type-chips');
  const previewHost = document.getElementById('qr-preview-canvas');
  const statusEl = document.getElementById('qr-status');
  const warningEl = document.getElementById('qr-warning');
  const privacyEl = document.getElementById('qr-privacy-note');
  const presetsHost = document.querySelector('#qr-editor [data-presets]');

  const initialType =
    options.initialType ||
    document.body.dataset.qrType ||
    typeSelect?.value ||
    getRecentType() ||
    'url';

  const state = createQrState({ type: initialType });
  const renderer = createQrRenderer(previewHost);

  function refreshPayload() {
    const snap = state.get();
    const result = buildPayload(snap.type, snap.fields);
    state.setPayload(result.ok ? result.payload : '', {
      valid: Boolean(result.ok),
      error: result.error || null,
      empty: Boolean(result.empty),
      warning: result.warning || null,
      tip: result.tip || null,
    });
  }

  function updateStatus() {
    const snap = state.get();
    if (!statusEl) return;
    if (snap.status.empty) {
      setText(statusEl, 'Enter content to generate a live QR preview.');
      statusEl.className = 'text-sm text-ink-500';
    } else if (!snap.status.valid) {
      setText(statusEl, snap.status.error || 'Fix the highlighted fields.');
      statusEl.className = 'text-sm font-medium text-red-600';
    } else {
      setText(statusEl, 'Ready — encoded in your browser. No watermark.');
      statusEl.className = 'text-sm font-semibold text-brand-700';
    }
    if (warningEl) {
      const note = snap.status.warning || snap.status.tip || '';
      setText(warningEl, note);
      warningEl.hidden = !note;
      warningEl.className = snap.status.warning
        ? 'text-xs text-amber-700'
        : 'text-xs text-ink-500';
    }
  }

  function renderAll() {
    const snap = state.get();
    renderer.render(snap);
    updateStatus();
  }

  function mountFields() {
    if (!fieldsRoot) return;
    renderTypeFields(fieldsRoot, state.get().type, state.get().fields, (partial) => {
      state.patchFields(partial);
      refreshPayload();
    });
  }

  function syncChips(activeId) {
    if (!chipsHost) return;
    chipsHost.querySelectorAll('[data-qr-type]').forEach((btn) => {
      const on = btn.getAttribute('data-qr-type') === activeId;
      btn.setAttribute('aria-pressed', String(on));
    });
  }

  function selectType(type, { resetFields = true } = {}) {
    if (!QR_TYPES[type]) return;
    if (typeSelect) typeSelect.value = type;
    state.setType(type);
    if (resetFields) state.setFields({});
    setRecentType(type);
    syncChips(type);
    mountFields();
    refreshPayload();
  }

  if (typeSelect) {
    typeSelect.replaceChildren();
    Object.values(QR_TYPES).forEach((t) => {
      const opt = document.createElement('option');
      opt.value = t.id;
      opt.textContent = t.label;
      typeSelect.appendChild(opt);
    });
    typeSelect.value = initialType;

    typeSelect.addEventListener(
      'change',
      () => {
        selectType(typeSelect.value);
      },
      { signal }
    );
  }

  if (chipsHost) {
    chipsHost.replaceChildren();
    Object.values(QR_TYPES).forEach((t) => {
      const btn = document.createElement('button');
      btn.type = 'button';
      btn.className = 'type-chip';
      btn.setAttribute('data-qr-type', t.id);
      btn.setAttribute('aria-pressed', String(t.id === initialType));
      btn.textContent = t.label;
      btn.addEventListener('click', () => selectType(t.id), { signal });
      chipsHost.appendChild(btn);
    });
  }

  if (presetsHost) delete presetsHost.dataset.ready;

  const editor = bindEditor(state, {
    onChange: () => renderAll(),
  });

  const unsubscribe = state.subscribe((_snap, reason) => {
    if (reason === 'replace') {
      editor.syncFromState?.();
      if (typeSelect) {
        typeSelect.value = state.get().type;
        syncChips(state.get().type);
      }
      mountFields();
      refreshPayload();
    }
    renderAll();
  });

  mountFields();
  refreshPayload();
  renderAll();

  if (privacyEl) {
    setText(
      privacyEl,
      'Static QR codes generated here do not expire and do not depend on our servers. Your content stays in this browser unless you save or export it locally.'
    );
  }

  async function requireValid() {
    const snap = state.get();
    if (!snap.status.valid) {
      toast.show(snap.status.error || 'Complete the form first.', { tone: 'error' });
      return null;
    }
    renderer.renderNow(snap);
    return { snap, instance: renderer.getInstance() };
  }

  document.getElementById('download-png')?.addEventListener(
    'click',
    async () => {
      const ctx = await requireValid();
      if (!ctx) return;
      try {
        await exportPng(ctx.instance, ctx.snap);
        toast.show('PNG downloaded', { tone: 'success' });
      } catch (e) {
        toast.show(e.message || 'Download failed', { tone: 'error' });
      }
    },
    { signal }
  );

  document.getElementById('download-svg')?.addEventListener(
    'click',
    async () => {
      const ctx = await requireValid();
      if (!ctx) return;
      try {
        await exportSvg(ctx.instance, ctx.snap);
        toast.show('SVG downloaded', { tone: 'success' });
      } catch (e) {
        toast.show(e.message || 'Download failed', { tone: 'error' });
      }
    },
    { signal }
  );

  document.getElementById('download-jpg')?.addEventListener(
    'click',
    async () => {
      const ctx = await requireValid();
      if (!ctx) return;
      try {
        await exportJpg(ctx.instance, ctx.snap);
        toast.show('JPG downloaded', { tone: 'success' });
      } catch (e) {
        toast.show(e.message || 'Download failed', { tone: 'error' });
      }
    },
    { signal }
  );

  document.getElementById('save-design')?.addEventListener(
    'click',
    async () => {
      const snap = state.get();
      if (!snap.status.valid) {
        toast.show('Create a valid QR before saving.', { tone: 'error' });
        return;
      }
      const name = prompt('Name this design', snap.name || `${QR_TYPES[snap.type]?.label || 'QR'} design`);
      if (!name) return;
      state.setName(name);
      try {
        const record = await saveDesign(state.toProject());
        pushRecentDesign(record);
        toast.show('Saved locally in this browser', { tone: 'success' });
      } catch {
        toast.show('Could not save design', { tone: 'error' });
      }
    },
    { signal }
  );

  document.getElementById('export-project')?.addEventListener(
    'click',
    () => {
      exportProjectJson(state.toProject());
      toast.show('Project JSON exported', { tone: 'success' });
    },
    { signal }
  );

  document.getElementById('import-project')?.addEventListener(
    'change',
    async (e) => {
      const file = e.target.files?.[0];
      if (!file) return;
      try {
        const text = await readFileAsText(file);
        const parsed = parseProjectJson(text);
        if (!parsed.ok) {
          toast.show(parsed.error, { tone: 'error' });
          return;
        }
        state.replace(parsed.project);
        if (typeSelect) typeSelect.value = parsed.project.type;
        syncChips(parsed.project.type);
        mountFields();
        refreshPayload();
        toast.show('Project imported', { tone: 'success' });
      } catch {
        toast.show('Import failed', { tone: 'error' });
      } finally {
        e.target.value = '';
      }
    },
    { signal }
  );

  function destroy() {
    abort.abort();
    unsubscribe();
    renderer.destroy();
    fieldsRoot?.replaceChildren();
    chipsHost?.replaceChildren();
    if (presetsHost) delete presetsHost.dataset.ready;
  }

  return { state, renderer, site: SITE, destroy };
}
