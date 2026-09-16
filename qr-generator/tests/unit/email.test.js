import test from 'node:test';
import assert from 'node:assert/strict';
import { buildEmailPayload } from '../../assets/js/generators/email.js';

test('email validation', () => {
  assert.equal(buildEmailPayload({ email: 'nope' }).ok, false);
  assert.equal(buildEmailPayload({ email: 'ok@example.com' }).ok, true);
});
