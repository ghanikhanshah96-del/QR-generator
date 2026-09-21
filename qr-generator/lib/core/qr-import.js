import { PROJECT_SCHEMA_VERSION, DEFAULT_DESIGN, QR_TYPES } from '../constants.js';
import { sanitizeText } from '../validation/sanitize.js';
import { isHexColor } from '../validation/sanitize.js';
import { randomId } from '../utils/random-id.js';

const ALLOWED_TYPES = new Set(Object.keys(QR_TYPES));
const ALLOWED_ECC = new Set(['L', 'M', 'Q', 'H']);
const ALLOWED_DOTS = new Set([
  'square',
  'dots',
  'rounded',
  'classy',
  'classy-rounded',
  'extra-rounded',
]);

/**
 * Validate imported project JSON. Never execute content as code.
 */
export function parseProjectJson(raw) {
  let data;
  try {
    data = typeof raw === 'string' ? JSON.parse(raw) : raw;
  } catch {
    return { ok: false, error: 'File is not valid JSON.' };
  }

  if (!data || typeof data !== 'object' || Array.isArray(data)) {
    return { ok: false, error: 'Project root must be an object.' };
  }

  // Reject suspicious keys that look like executable payloads
  const banned = ['__proto__', 'constructor', 'prototype', 'script', 'eval'];
  for (const key of Object.keys(data)) {
    if (banned.includes(key)) {
      return { ok: false, error: 'Project contains disallowed keys.' };
    }
  }

  const type = String(data.type || '');
  if (!ALLOWED_TYPES.has(type)) {
    return { ok: false, error: 'Unknown or unsupported QR type in project.' };
  }

  const designIn = data.design && typeof data.design === 'object' ? data.design : {};
  const design = { ...DEFAULT_DESIGN };

  if (typeof designIn.size === 'number') design.size = designIn.size;
  if (typeof designIn.margin === 'number') design.margin = designIn.margin;
  if (ALLOWED_ECC.has(designIn.errorCorrectionLevel)) {
    design.errorCorrectionLevel = designIn.errorCorrectionLevel;
  }
  if (ALLOWED_DOTS.has(designIn.dotsType)) design.dotsType = designIn.dotsType;
  if (designIn.cornersSquareType) design.cornersSquareType = String(designIn.cornersSquareType);
  if (designIn.cornersDotType) design.cornersDotType = String(designIn.cornersDotType);
  if (isHexColor(designIn.foreground)) design.foreground = designIn.foreground;
  if (isHexColor(designIn.background)) design.background = designIn.background;
  design.transparentBackground = Boolean(designIn.transparentBackground);
  design.useGradient = Boolean(designIn.useGradient);
  if (isHexColor(designIn.gradientColor)) design.gradientColor = designIn.gradientColor;
  if (typeof designIn.gradientRotation === 'number') {
    design.gradientRotation = designIn.gradientRotation;
  }
  if (typeof designIn.logoDataUrl === 'string' && designIn.logoDataUrl.startsWith('data:image/')) {
    design.logoDataUrl = designIn.logoDataUrl.slice(0, 3_500_000);
    design.logoName = sanitizeText(designIn.logoName || 'logo', 120);
  }
  if (typeof designIn.logoSize === 'number') design.logoSize = designIn.logoSize;
  if (typeof designIn.logoMargin === 'number') design.logoMargin = designIn.logoMargin;
  design.logoHideBackgroundDots = designIn.logoHideBackgroundDots !== false;

  const fields = {};
  if (data.fields && typeof data.fields === 'object') {
    for (const [k, v] of Object.entries(data.fields)) {
      if (typeof k !== 'string' || k.length > 64) continue;
      if (typeof v === 'string') fields[k] = sanitizeText(v, 4000);
      else if (typeof v === 'boolean' || typeof v === 'number') fields[k] = v;
    }
  }

  return {
    ok: true,
    project: {
      schemaVersion: PROJECT_SCHEMA_VERSION,
      id: randomId('project'),
      name: sanitizeText(data.name || 'Imported design', 80),
      type,
      fields,
      design,
      meta: {
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
        schemaVersion: PROJECT_SCHEMA_VERSION,
        imported: true,
      },
    },
  };
}

export function serializeProject(project, { includeLogo = true } = {}) {
  const design = { ...project.design };
  if (!includeLogo) {
    design.logoDataUrl = null;
    design.logoName = null;
  }
  return JSON.stringify(
    {
      schemaVersion: PROJECT_SCHEMA_VERSION,
      name: project.name,
      type: project.type,
      fields: project.fields,
      design,
      meta: {
        exportedAt: new Date().toISOString(),
        schemaVersion: PROJECT_SCHEMA_VERSION,
      },
    },
    null,
    2
  );
}
