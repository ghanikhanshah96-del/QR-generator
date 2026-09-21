import { slugify } from '../utils/format.js';
import { downloadBlob } from '../utils/download.js';
import { canvasToBlob } from '../utils/canvas.js';

function baseName(state, format) {
  const type = state.type || 'qr';
  const name = slugify(state.name || `${type}-qr-code`);
  return `${name}.${format}`;
}

export async function exportPng(qrInstance, state) {
  if (!qrInstance) throw new Error('QR is not ready.');
  const blob = await qrInstance.getRawData('png');
  if (!blob) throw new Error('PNG export failed.');
  downloadBlob(blob, baseName(state, 'png'));
  return blob;
}

export async function exportSvg(qrInstance, state) {
  if (!qrInstance) throw new Error('QR is not ready.');
  const blob = await qrInstance.getRawData('svg');
  if (!blob) throw new Error('SVG export failed.');
  downloadBlob(blob, baseName(state, 'svg'));
  return blob;
}

export async function exportJpg(qrInstance, state, quality = 0.92) {
  if (!qrInstance) throw new Error('QR is not ready.');
  // Library may not support jpg directly — rasterize via canvas
  const pngBlob = await qrInstance.getRawData('png');
  if (!pngBlob) throw new Error('JPG export failed.');

  const bitmap = await createImageBitmap(pngBlob);
  const canvas = document.createElement('canvas');
  canvas.width = bitmap.width;
  canvas.height = bitmap.height;
  const ctx = canvas.getContext('2d');
  // JPG has no alpha — fill white (or design bg)
  const bg = state.design?.transparentBackground
    ? '#ffffff'
    : state.design?.background || '#ffffff';
  ctx.fillStyle = bg;
  ctx.fillRect(0, 0, canvas.width, canvas.height);
  ctx.drawImage(bitmap, 0, 0);
  bitmap.close?.();

  const blob = await canvasToBlob(canvas, 'image/jpeg', quality);
  downloadBlob(blob, baseName(state, 'jpg'));
  return blob;
}

export async function exportRaw(qrInstance, extension) {
  return qrInstance.getRawData(extension);
}
