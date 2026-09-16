import test from 'node:test';
import assert from 'node:assert/strict';
import { buildStylingOptions, resolveQuietZone } from '../../assets/js/core/qr-engine.js';
import { DEFAULT_DESIGN } from '../../assets/js/constants.js';

test('qr engine builds styling options', () => {
  const { options } = buildStylingOptions({
    payload: 'https://example.com',
    design: { ...DEFAULT_DESIGN, size: 256, dotsType: 'dots' },
  });
  assert.equal(options.width, 256);
  assert.equal(options.dotsOptions.type, 'dots');
  assert.equal(options.data, 'https://example.com');
  assert.ok(options.margin >= 24);
});

test('quiet zone enforces minimum for phone cameras', () => {
  assert.equal(resolveQuietZone(512, 8), 51);
  assert.equal(resolveQuietZone(512, 80), 80);
  assert.ok(resolveQuietZone(512, 8) >= Math.round(512 * 0.1));
});

test('logo forces image options and raises L to H', () => {
  const { options } = buildStylingOptions({
    payload: 'hello',
    design: {
      ...DEFAULT_DESIGN,
      errorCorrectionLevel: 'L',
      logoDataUrl: 'data:image/png;base64,aaa',
      logoSize: 0.5,
    },
  });
  assert.equal(options.qrOptions.errorCorrectionLevel, 'H');
  assert.ok(options.image);
  assert.ok(options.imageOptions.imageSize <= 0.28);
});

test('defaults prefer square modules for scan reliability', () => {
  assert.equal(DEFAULT_DESIGN.dotsType, 'square');
  assert.equal(DEFAULT_DESIGN.cornersSquareType, 'square');
  assert.ok(DEFAULT_DESIGN.margin >= 48);
});
