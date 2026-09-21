import { LIMITS } from '../config.js';

const ALLOWED_IMAGE_TYPES = new Set(['image/png', 'image/jpeg', 'image/jpg', 'image/webp', 'image/svg+xml']);

export function validateImageFile(file, { maxBytes = LIMITS.maxLogoBytes } = {}) {
  if (!file) return { ok: false, error: 'No file selected.' };
  if (!ALLOWED_IMAGE_TYPES.has(file.type)) {
    return { ok: false, error: 'Use PNG, JPG, WebP, or SVG images only.' };
  }
  if (file.size > maxBytes) {
    return { ok: false, error: `Image must be under ${Math.round(maxBytes / (1024 * 1024))} MB.` };
  }
  return { ok: true };
}

export function readFileAsDataUrl(file) {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve(String(reader.result));
    reader.onerror = () => reject(new Error('Could not read file.'));
    reader.readAsDataURL(file);
  });
}

export function readFileAsText(file) {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve(String(reader.result));
    reader.onerror = () => reject(new Error('Could not read file.'));
    reader.readAsText(file);
  });
}
