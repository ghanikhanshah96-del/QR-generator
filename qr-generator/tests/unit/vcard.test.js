import test from 'node:test';
import assert from 'node:assert/strict';
import { buildVcardPayload } from '../../assets/js/generators/vcard.js';

test('vcard includes org', () => {
  const r = buildVcardPayload({ firstName: 'A', lastName: 'B', organization: 'Org' });
  assert.match(r.payload, /ORG:Org/);
});
