import { isHexColor, contrastRatio } from './sanitize.js';
import { LIMITS } from '../config.js';

export function validateColors({ foreground, background, transparentBackground }) {
  if (!isHexColor(foreground)) return { ok: false, error: 'Foreground color must be a valid hex color.' };
  if (!transparentBackground && !isHexColor(background)) {
    return { ok: false, error: 'Background color must be a valid hex color.' };
  }
  if (!transparentBackground) {
    const ratio = contrastRatio(foreground, background);
    if (ratio < 1.5) {
      return {
        ok: false,
        error: 'Foreground and background are too similar. Increase contrast for reliable scans.',
        warning: true,
        ratio,
      };
    }
  }
  return { ok: true };
}

export function validateSize(size) {
  const n = Number(size);
  if (!Number.isFinite(n) || n < LIMITS.minQrSize || n > LIMITS.maxQrSize) {
    return {
      ok: false,
      error: `Size must be between ${LIMITS.minQrSize} and ${LIMITS.maxQrSize} px.`,
    };
  }
  return { ok: true, value: Math.round(n) };
}
