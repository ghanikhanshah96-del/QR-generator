import test from 'node:test';
import assert from 'node:assert/strict';
import { buildWifiPayload } from '../../assets/js/generators/wifi.js';

test('wifi engine payload format', () => {
  const r = buildWifiPayload({
    ssid: 'Home',
    password: 'secret',
    security: 'WPA',
    hidden: true,
  });
  assert.equal(r.payload, 'WIFI:T:WPA;S:Home;P:secret;H:true;;');
});
