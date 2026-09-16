import { STORAGE_KEYS } from '../config.js';
import { lsGetJson, lsSetJson } from './local-storage.js';

export function getPreferences() {
  return (
    lsGetJson(STORAGE_KEYS.editorPrefs, {
      advancedOpen: false,
      lastDownloadFormat: 'png',
    }) || {}
  );
}

export function setPreferences(partial) {
  const next = { ...getPreferences(), ...partial };
  lsSetJson(STORAGE_KEYS.editorPrefs, next);
  return next;
}
