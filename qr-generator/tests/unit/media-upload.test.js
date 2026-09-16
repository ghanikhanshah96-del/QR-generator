import test from 'node:test';
import assert from 'node:assert/strict';
import {
  validateMediaFile,
  toDirectTmpfilesUrl,
  formatExpiry,
  MEDIA_HOST,
} from '../../assets/js/storage/media-upload.js';

test('validateMediaFile accepts common image types', () => {
  const ok = validateMediaFile(
    { name: 'shot.png', type: 'image/png', size: 1024 },
    'image'
  );
  assert.equal(ok.ok, true);
});

test('validateMediaFile rejects oversized images', () => {
  const r = validateMediaFile(
    { name: 'huge.jpg', type: 'image/jpeg', size: MEDIA_HOST.maxImageBytes + 1 },
    'image'
  );
  assert.equal(r.ok, false);
});

test('validateMediaFile accepts mp4 video under limit', () => {
  const ok = validateMediaFile(
    { name: 'clip.mp4', type: 'video/mp4', size: 5 * 1024 * 1024 },
    'video'
  );
  assert.equal(ok.ok, true);
});

test('toDirectTmpfilesUrl inserts /dl/ path', () => {
  assert.equal(
    toDirectTmpfilesUrl('https://tmpfiles.org/12345/photo.png'),
    'https://tmpfiles.org/dl/12345/photo.png'
  );
  assert.equal(
    toDirectTmpfilesUrl('https://tmpfiles.org/dl/12345/photo.png'),
    'https://tmpfiles.org/dl/12345/photo.png'
  );
});

test('formatExpiry shows days for 48h', () => {
  assert.match(formatExpiry(172800), /day/);
  assert.match(formatExpiry(3600), /hour/);
});

test('image payload tip mentions hosted provider', async () => {
  const { buildImagePayload } = await import('../../assets/js/generators/image.js');
  const r = buildImagePayload({
    imageUrl: 'https://tmpfiles.org/dl/1/a.png',
    mediaHosted: true,
    mediaProvider: 'tmpfiles.org',
  });
  assert.equal(r.ok, true);
  assert.match(r.tip, /tmpfiles\.org/);
});
