import { LIMITS } from '../config.js';
import { sanitizeText, stripControlChars } from './sanitize.js';

export function validateWifi({ ssid, password, security, hidden }) {
  const cleanSsid = stripControlChars(sanitizeText(ssid, LIMITS.maxWifiSsid)).trim();
  if (!cleanSsid) return { ok: false, error: 'Enter the network name (SSID).' };

  const sec = ['WPA', 'WEP', 'nopass'].includes(security) ? security : 'WPA';
  const pass = stripControlChars(sanitizeText(password, LIMITS.maxWifiPassword));

  if (sec !== 'nopass' && !pass) {
    return { ok: false, error: 'Enter the Wi-Fi password, or choose “None” security.' };
  }

  return {
    ok: true,
    value: {
      ssid: cleanSsid,
      password: sec === 'nopass' ? '' : pass,
      security: sec,
      hidden: Boolean(hidden),
    },
  };
}

/** Escape special characters for WIFI: QR payload format. */
export function escapeWifiField(value) {
  return String(value).replace(/([\\;,:"])/g, '\\$1');
}
