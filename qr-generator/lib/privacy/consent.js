import { STORAGE_KEYS } from '../config.js';
import { lsGet, lsSet } from '../storage/local-storage.js';

/** Optional consent flag for non-essential analytics (off by default). */
export function getConsent() {
  return lsGet(STORAGE_KEYS.consent, 'denied');
}

export function setConsent(value) {
  lsSet(STORAGE_KEYS.consent, value);
  window.__everqrAnalyticsEnabled = value === 'granted';
}

export function initConsent() {
  window.__everqrAnalyticsEnabled = getConsent() === 'granted';
}
