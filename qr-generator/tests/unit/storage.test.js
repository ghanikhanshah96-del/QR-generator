import test from 'node:test';
import assert from 'node:assert/strict';
import { parseProjectJson, serializeProject } from '../../assets/js/core/qr-import.js';

test('round-trip serialize/parse', () => {
  const json = serializeProject({
    name: 'Demo',
    type: 'text',
    fields: { text: 'hi' },
    design: { foreground: '#000000', background: '#ffffff', dotsType: 'square', size: 512 },
  });
  const parsed = parseProjectJson(json);
  assert.equal(parsed.ok, true);
  assert.equal(parsed.project.fields.text, 'hi');
});
