import {
  DOT_TYPES,
  CORNER_SQUARE_TYPES,
  CORNER_DOT_TYPES,
  ERROR_CORRECTION,
} from '../constants.js';
import { STYLE_PRESETS } from '../core/qr-presets.js';
import { validateImageFile, readFileAsDataUrl } from '../utils/file.js';
import { LIMITS } from '../config.js';

function optionButtons(container, items, current, attr, onPick) {
  if (!container) return;
  container.replaceChildren();
  items.forEach((item) => {
    const btn = document.createElement('button');
    btn.type = 'button';
    btn.className =
      'rounded-lg border px-3 py-2 text-xs font-semibold transition min-h-[40px] ' +
      (current === item.id
        ? 'border-brand-500 bg-brand-50 text-brand-800'
        : 'border-ink-200 bg-white text-ink-700 hover:border-brand-300');
    btn.textContent = item.label;
    btn.setAttribute(attr, item.id);
    btn.setAttribute('aria-pressed', String(current === item.id));
    btn.addEventListener('click', () => onPick(item.id));
    container.appendChild(btn);
  });
}

/**
 * Bind design controls to QR state.
 */
export function bindEditor(state, { onChange } = {}) {
  const root = document.getElementById('qr-editor');
  if (!root) return { destroy() {} };

  const dotsHost = root.querySelector('[data-dots-options]');
  const cornerSqHost = root.querySelector('[data-corner-square-options]');
  const cornerDotHost = root.querySelector('[data-corner-dot-options]');
  const eccHost = root.querySelector('[data-ecc-options]');
  const presetsHost = root.querySelector('[data-presets]');

  const fg = root.querySelector('#design-foreground');
  const bg = root.querySelector('#design-background');
  const transparent = root.querySelector('#design-transparent');
  const gradient = root.querySelector('#design-gradient');
  const gradientColor = root.querySelector('#design-gradient-color');
  const size = root.querySelector('#design-size');
  const sizeValue = root.querySelector('#design-size-value');
  const logoInput = root.querySelector('#design-logo');
  const logoSize = root.querySelector('#design-logo-size');
  const logoMargin = root.querySelector('#design-logo-margin');
  const removeLogo = root.querySelector('#design-remove-logo');
  const logoStatus = root.querySelector('#design-logo-status');

  function syncFromState() {
    const d = state.get().design;
    optionButtons(dotsHost, DOT_TYPES, d.dotsType, 'data-dot', (id) => {
      state.setDesign({ dotsType: id });
      syncFromState();
      onChange?.();
    });
    optionButtons(cornerSqHost, CORNER_SQUARE_TYPES, d.cornersSquareType, 'data-cs', (id) => {
      state.setDesign({ cornersSquareType: id });
      syncFromState();
      onChange?.();
    });
    optionButtons(cornerDotHost, CORNER_DOT_TYPES, d.cornersDotType, 'data-cd', (id) => {
      state.setDesign({ cornersDotType: id });
      syncFromState();
      onChange?.();
    });
    optionButtons(eccHost, ERROR_CORRECTION, d.errorCorrectionLevel, 'data-ecc', (id) => {
      state.setDesign({ errorCorrectionLevel: id });
      syncFromState();
      onChange?.();
    });

    if (presetsHost && !presetsHost.dataset.ready) {
      presetsHost.dataset.ready = '1';
      STYLE_PRESETS.forEach((preset) => {
        const btn = document.createElement('button');
        btn.type = 'button';
        btn.className = 'btn-secondary text-xs';
        btn.textContent = preset.label;
        btn.addEventListener('click', () => {
          state.setDesign({ ...preset.design });
          syncFromState();
          onChange?.();
        });
        presetsHost.appendChild(btn);
      });
    }

    if (fg) fg.value = d.foreground;
    if (bg) {
      bg.value = d.background;
      bg.disabled = Boolean(d.transparentBackground);
    }
    if (transparent) transparent.checked = Boolean(d.transparentBackground);
    if (gradient) gradient.checked = Boolean(d.useGradient);
    if (gradientColor) {
      gradientColor.value = d.gradientColor;
      gradientColor.disabled = !d.useGradient;
    }
    if (size) size.value = String(d.size);
    if (sizeValue) sizeValue.textContent = `${d.size}px`;
    if (logoSize) logoSize.value = String(Math.round((d.logoSize || 0.22) * 100));
    if (logoMargin) logoMargin.value = String(d.logoMargin ?? 8);
    if (logoStatus) {
      logoStatus.textContent = d.logoDataUrl
        ? `Logo: ${d.logoName || 'uploaded'}`
        : 'No logo uploaded';
    }
    if (removeLogo) removeLogo.hidden = !d.logoDataUrl;
  }

  fg?.addEventListener('input', () => {
    state.setDesign({ foreground: fg.value });
    onChange?.();
  });
  bg?.addEventListener('input', () => {
    state.setDesign({ background: bg.value });
    onChange?.();
  });
  transparent?.addEventListener('change', () => {
    state.setDesign({ transparentBackground: transparent.checked });
    syncFromState();
    onChange?.();
  });
  gradient?.addEventListener('change', () => {
    state.setDesign({ useGradient: gradient.checked });
    syncFromState();
    onChange?.();
  });
  gradientColor?.addEventListener('input', () => {
    state.setDesign({ gradientColor: gradientColor.value });
    onChange?.();
  });
  size?.addEventListener('input', () => {
    const value = Number(size.value);
    state.setDesign({ size: value });
    if (sizeValue) sizeValue.textContent = `${value}px`;
    onChange?.();
  });
  logoSize?.addEventListener('input', () => {
    const pct = Math.min(28, Math.max(12, Number(logoSize.value)));
    state.setDesign({ logoSize: pct / 100 });
    onChange?.();
  });
  logoMargin?.addEventListener('input', () => {
    state.setDesign({ logoMargin: Number(logoMargin.value) });
    onChange?.();
  });
  removeLogo?.addEventListener('click', () => {
    state.setDesign({ logoDataUrl: null, logoName: null });
    if (logoInput) logoInput.value = '';
    syncFromState();
    onChange?.();
  });
  logoInput?.addEventListener('change', async () => {
    const file = logoInput.files?.[0];
    if (!file) return;
    const check = validateImageFile(file, { maxBytes: LIMITS.maxLogoBytes });
    if (!check.ok) {
      logoStatus.textContent = check.error;
      logoInput.value = '';
      return;
    }
    try {
      const dataUrl = await readFileAsDataUrl(file);
      state.setDesign({
        logoDataUrl: dataUrl,
        logoName: file.name,
        errorCorrectionLevel: 'H',
        logoSize: Math.min(0.28, state.get().design.logoSize || 0.22),
        logoHideBackgroundDots: true,
      });
      syncFromState();
      onChange?.();
    } catch {
      if (logoStatus) logoStatus.textContent = 'Could not read logo file.';
    }
  });

  syncFromState();
  return { syncFromState, destroy() {} };
}

// Submodule re-exports for structure compatibility
export { bindEditor as default };
