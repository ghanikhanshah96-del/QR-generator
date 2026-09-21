const KEY = 'everqr.history';
const MAX = 12;

export function loadHistory() {
  try {
    const raw = localStorage.getItem(KEY);
    const list = raw ? JSON.parse(raw) : [];
    return Array.isArray(list) ? list : [];
  } catch {
    return [];
  }
}

export function pushHistory(entry) {
  const list = loadHistory().filter((item) => item.type !== entry.type || item.label !== entry.label);
  list.unshift({
    type: entry.type,
    label: entry.label,
    at: new Date().toISOString(),
  });
  localStorage.setItem(KEY, JSON.stringify(list.slice(0, MAX)));
}
