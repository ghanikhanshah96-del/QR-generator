import { STORAGE_KEYS } from '../config.js';
import { lsGet, lsSet } from '../storage/local-storage.js';

export function initTheme() {
  // Light professional theme is the product default; hook kept for prefs.
  const pref = lsGet(STORAGE_KEYS.theme, 'light');
  document.documentElement.dataset.theme = pref;
  lsSet(STORAGE_KEYS.theme, pref);
}
