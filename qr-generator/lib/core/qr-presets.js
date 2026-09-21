import { DEFAULT_DESIGN } from '../constants.js';

export const STYLE_PRESETS = [
  {
    id: 'classic',
    label: 'Classic',
    design: {
      ...DEFAULT_DESIGN,
      dotsType: 'square',
      cornersSquareType: 'square',
      cornersDotType: 'square',
      foreground: '#111827',
      background: '#ffffff',
    },
  },
  {
    id: 'soft',
    label: 'Soft',
    design: {
      ...DEFAULT_DESIGN,
      dotsType: 'rounded',
      cornersSquareType: 'extra-rounded',
      cornersDotType: 'dot',
      foreground: '#1d3938',
      background: '#ffffff',
      errorCorrectionLevel: 'Q',
    },
  },
  {
    id: 'ink',
    label: 'Ink',
    design: {
      ...DEFAULT_DESIGN,
      dotsType: 'classy',
      cornersSquareType: 'extra-rounded',
      cornersDotType: 'dot',
      foreground: '#0f172a',
      background: '#ffffff',
      errorCorrectionLevel: 'Q',
    },
  },
  {
    id: 'brand',
    label: 'Brand',
    design: {
      ...DEFAULT_DESIGN,
      dotsType: 'extra-rounded',
      useGradient: true,
      foreground: '#245451',
      gradientColor: '#4f9f97',
      background: '#ffffff',
      errorCorrectionLevel: 'H',
    },
  },
];

export function getPreset(id) {
  return STYLE_PRESETS.find((p) => p.id === id) || STYLE_PRESETS[0];
}
