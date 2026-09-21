import { STORAGE_KEYS } from '../config.js';

export function getJson(key, fallback = null) {
  try {
    const raw = localStorage.getItem(key);
    if (raw == null) return fallback;
    return JSON.parse(raw);
  } catch {
    return fallback;
  }
}

export function setJson(key, value) {
  localStorage.setItem(key, JSON.stringify(value));
}

export function getEditorPrefs() {
  return getJson(STORAGE_KEYS.editorPrefs, {});
}

export function setEditorPrefs(prefs) {
  setJson(STORAGE_KEYS.editorPrefs, prefs);
}

export function getRecentType() {
  return localStorage.getItem(STORAGE_KEYS.recentType) || 'url';
}

export function setRecentType(type) {
  localStorage.setItem(STORAGE_KEYS.recentType, type);
}
