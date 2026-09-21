import { LIMITS } from '../config.js';
import { MAX_LOGO_SIZE, MIN_QUIET_ZONE_RATIO } from '../constants.js';
import { validateColors, validateSize } from '../validation/colors.js';
import { normalizeHex } from '../validation/sanitize.js';

/**
 * Quiet zone must stay large enough for phone cameras (QR spec ~4 modules).
 */
export function resolveQuietZone(size, requestedMargin) {
  const floor = Math.max(24, Math.round(size * MIN_QUIET_ZONE_RATIO));
  const requested = Number.isFinite(requestedMargin) ? requestedMargin : floor;
  return Math.max(requested, floor);
}

/**
 * Build qr-code-styling options from app design + payload.
 * Library-agnostic shape kept here so generators stay payload-only.
 */
export function buildStylingOptions({ payload, design }) {
  const sizeCheck = validateSize(design.size ?? LIMITS.defaultQrSize);
  const size = sizeCheck.ok ? sizeCheck.value : LIMITS.defaultQrSize;
  const margin = resolveQuietZone(size, design.margin);

  const fg = normalizeHex(design.foreground, '#111827');
  // Transparent BG often fails phone scans against busy UIs — keep true transparency
  // only when requested; otherwise force a solid light background.
  const bg = design.transparentBackground
    ? '#ffffff'
    : normalizeHex(design.background, '#ffffff');

  const colorCheck = validateColors({
    foreground: fg,
    background: bg,
    transparentBackground: false,
  });

  const dotsOptions = {
    type: design.dotsType || 'square',
    color: fg,
  };

  if (design.useGradient) {
    dotsOptions.gradient = {
      type: 'linear',
      rotation: ((Number(design.gradientRotation) || 0) * Math.PI) / 180,
      colorStops: [
        { offset: 0, color: fg },
        { offset: 1, color: normalizeHex(design.gradientColor, '#36827b') },
      ],
    };
    delete dotsOptions.color;
  }

  let errorCorrectionLevel = design.errorCorrectionLevel || 'M';

  const options = {
    width: size,
    height: size,
    type: 'canvas',
    data: payload || ' ',
    margin,
    qrOptions: {
      errorCorrectionLevel,
      typeNumber: 0,
    },
    dotsOptions,
    backgroundOptions: {
      // Always paint an opaque quiet-zone-friendly background for scan reliability.
      // "Transparent background" is approximated as white for camera scanning.
      color: bg,
    },
    cornersSquareOptions: {
      type: design.cornersSquareType || 'square',
      color: fg,
    },
    cornersDotOptions: {
      type: design.cornersDotType || 'square',
      color: fg,
    },
  };

  if (design.logoDataUrl) {
    // Logos require high ECC for reliable phone scans.
    options.qrOptions.errorCorrectionLevel = 'H';
    options.image = design.logoDataUrl;
    options.imageOptions = {
      hideBackgroundDots: design.logoHideBackgroundDots !== false,
      imageSize: Math.min(MAX_LOGO_SIZE, Math.max(0.12, Number(design.logoSize) || 0.22)),
      margin: Number.isFinite(design.logoMargin) ? Math.max(4, design.logoMargin) : 8,
      crossOrigin: 'anonymous',
    };
  }

  return {
    options,
    warnings: [
      colorCheck.warning || (!colorCheck.ok && colorCheck.error) ? colorCheck.error : null,
      design.transparentBackground
        ? 'Transparent background is rendered white so phone cameras can scan reliably.'
        : null,
    ].filter(Boolean),
  };
}

let QRCodeStylingCtor = null;

/** Register the QR library (call from client before rendering). */
export function setQrCodeStyling(Ctor) {
  QRCodeStylingCtor = Ctor;
  if (typeof window !== 'undefined' && Ctor) {
    window.QRCodeStyling = Ctor;
  }
}

export function getQrCodeStyling() {
  if (typeof window === 'undefined') return null;
  return QRCodeStylingCtor || window.QRCodeStyling || null;
}
