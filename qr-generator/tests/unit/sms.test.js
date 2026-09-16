import test from 'node:test';
import assert from 'node:assert/strict';
import { buildSmsPayload } from '../../assets/js/generators/sms.js';

test('sms requires phone', () => {
  assert.equal(buildSmsPayload({ phone: '' }).ok, false);
  assert.equal(buildSmsPayload({ phone: '5551112222' }).ok, true);
});
