import { lsGetJson, lsSetJson } from './local-storage.js';

const KEY = 'everqr.recentDesigns';

export function getRecentDesigns() {
  return lsGetJson(KEY, []) || [];
}

export function pushRecentDesign(summary) {
  const list = getRecentDesigns().filter((d) => d.id !== summary.id);
  list.unshift({
    id: summary.id,
    name: summary.name,
    type: summary.type,
    updatedAt: summary.updatedAt || new Date().toISOString(),
  });
  lsSetJson(KEY, list.slice(0, 8));
}
