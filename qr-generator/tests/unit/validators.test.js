import test from 'node:test';
import assert from 'node:assert/strict';
import { buildWifiPayload } from '../../assets/js/generators/wifi.js';
import { buildUrlPayload } from '../../assets/js/generators/url.js';
import { buildTextPayload } from '../../assets/js/generators/text.js';
import { buildEmailPayload } from '../../assets/js/generators/email.js';
import { buildSmsPayload } from '../../assets/js/generators/sms.js';
import { buildVcardPayload } from '../../assets/js/generators/vcard.js';
import { buildWhatsappPayload } from '../../assets/js/generators/whatsapp.js';
import { buildPhonePayload } from '../../assets/js/generators/phone.js';
import { buildLocationPayload } from '../../assets/js/generators/location.js';
import { buildGoogleReviewPayload } from '../../assets/js/generators/google-review.js';
import { buildImagePayload } from '../../assets/js/generators/image.js';
import { buildVideoPayload, normalizeVideoUrl } from '../../assets/js/generators/video.js';
import { parseProjectJson } from '../../assets/js/core/qr-import.js';
import { validateHttpUrl } from '../../assets/js/validation/url.js';

test('url payload normalizes https', () => {
  const r = buildUrlPayload({ url: 'example.com' });
  assert.equal(r.ok, true);
  assert.match(r.payload, /^https:\/\/example\.com\/?$/);
});

test('url rejects javascript protocol', () => {
  const r = validateHttpUrl('javascript:alert(1)');
  assert.equal(r.ok, false);
});

test('text payload trims and encodes', () => {
  const r = buildTextPayload({ text: '  hello  ' });
  assert.equal(r.ok, true);
  assert.equal(r.payload, 'hello');
});

test('wifi payload escapes special characters', () => {
  const r = buildWifiPayload({
    ssid: 'Cafe;Guest',
    password: 'p@ss;1',
    security: 'WPA',
    hidden: false,
  });
  assert.equal(r.ok, true);
  assert.match(r.payload, /^WIFI:T:WPA;S:Cafe\\;Guest;P:p@ss\\;1;H:false;;$/);
});

test('wifi requires password unless open', () => {
  const r = buildWifiPayload({ ssid: 'OpenNet', password: '', security: 'WPA' });
  assert.equal(r.ok, false);
  const open = buildWifiPayload({ ssid: 'OpenNet', password: '', security: 'nopass' });
  assert.equal(open.ok, true);
});

test('whatsapp builds wa.me link', () => {
  const r = buildWhatsappPayload({ countryCode: '1', phone: '5551234567', message: 'Hi' });
  assert.equal(r.ok, true);
  assert.equal(r.payload, 'https://wa.me/15551234567?text=Hi');
});

test('google review accepts maps link', () => {
  const r = buildGoogleReviewPayload({
    reviewUrl: 'https://maps.google.com/?cid=123',
  });
  assert.equal(r.ok, true);
});

test('google review rejects random domains', () => {
  const r = buildGoogleReviewPayload({ reviewUrl: 'https://example.com/review' });
  assert.equal(r.ok, false);
});

test('vcard requires a name', () => {
  assert.equal(buildVcardPayload({ firstName: '', lastName: '' }).ok, false);
  const r = buildVcardPayload({ firstName: 'Ada', lastName: 'Lovelace', email: 'ada@example.com' });
  assert.equal(r.ok, true);
  assert.match(r.payload, /BEGIN:VCARD/);
  assert.match(r.payload, /FN:Ada Lovelace/);
});

test('email mailto payload', () => {
  const r = buildEmailPayload({ email: 'a@b.com', subject: 'Hi', body: 'Hello' });
  assert.equal(r.ok, true);
  assert.match(r.payload, /^mailto:a@b\.com\?/);
});

test('sms payload', () => {
  const r = buildSmsPayload({ phone: '+15550100', message: 'Ping' });
  assert.equal(r.ok, true);
  assert.match(r.payload, /^sms:\+15550100/);
});

test('phone payload', () => {
  const r = buildPhonePayload({ phone: '+15550100' });
  assert.equal(r.ok, true);
  assert.equal(r.payload, 'tel:+15550100');
});

test('location payload', () => {
  const r = buildLocationPayload({ latitude: '30.26', longitude: '-97.74', label: 'Shop' });
  assert.equal(r.ok, true);
  assert.match(r.payload, /^geo:30\.26,-97\.74/);
});

test('image payload requires public https url', () => {
  assert.equal(buildImagePayload({ imageUrl: '' }).ok, false);
  const r = buildImagePayload({ imageUrl: 'cdn.example.com/photo.png' });
  assert.equal(r.ok, true);
  assert.match(r.payload, /^https:\/\/cdn\.example\.com\/photo\.png/);
  assert.ok(r.tip);
});

test('video payload normalizes youtube short links', () => {
  const r = buildVideoPayload({ videoUrl: 'https://youtu.be/dQw4w9WgXcQ' });
  assert.equal(r.ok, true);
  assert.equal(r.payload, 'https://www.youtube.com/watch?v=dQw4w9WgXcQ');
  assert.equal(
    normalizeVideoUrl('https://www.youtube.com/shorts/abc123XYZ00'),
    'https://www.youtube.com/watch?v=abc123XYZ00'
  );
});

test('project import rejects prototype pollution keys and unknown types', () => {
  const bad = parseProjectJson('{"type":"url","__proto__":{"x":1}}');
  assert.equal(bad.ok, false);
  const unknown = parseProjectJson('{"type":"not-a-type","fields":{}}');
  assert.equal(unknown.ok, false);
  const good = parseProjectJson(
    JSON.stringify({
      type: 'url',
      name: 'Test',
      fields: { url: 'https://example.com' },
      design: { foreground: '#112233', background: '#ffffff', dotsType: 'rounded' },
    })
  );
  assert.equal(good.ok, true);
  assert.equal(good.project.type, 'url');
});
