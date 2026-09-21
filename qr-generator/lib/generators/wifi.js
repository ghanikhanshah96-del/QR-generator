import { validateWifi, escapeWifiField } from '../validation/wifi.js';

export function buildWifiPayload(fields) {
  const result = validateWifi(fields);
  if (!result.ok) {
    return { ok: false, error: result.error, empty: !String(fields.ssid || '').trim() };
  }
  const { ssid, password, security, hidden } = result.value;
  const payload = `WIFI:T:${security};S:${escapeWifiField(ssid)};P:${escapeWifiField(password)};H:${
    hidden ? 'true' : 'false'
  };;`;
  return { ok: true, payload, empty: false };
}
