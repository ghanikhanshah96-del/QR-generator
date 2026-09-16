import { IDB } from '../config.js';
import { idbDelete, idbGet, idbGetAll, idbPut } from './indexed-db.js';
import { randomId } from '../utils/random-id.js';
import { sanitizeText } from '../validation/sanitize.js';

export async function listDesigns() {
  const items = await idbGetAll(IDB.stores.designs);
  return items.sort((a, b) => String(b.updatedAt).localeCompare(String(a.updatedAt)));
}

export async function getDesign(id) {
  return idbGet(IDB.stores.designs, id);
}

export async function saveDesign(project, { asNew = false } = {}) {
  const now = new Date().toISOString();
  const record = {
    id: asNew ? randomId('project') : project.id || randomId('project'),
    name: sanitizeText(project.name || 'Untitled design', 80),
    type: project.type,
    fields: project.fields || {},
    design: project.design || {},
    createdAt: project.meta?.createdAt || project.createdAt || now,
    updatedAt: now,
    schemaVersion: project.schemaVersion || project.meta?.schemaVersion || 1,
  };
  await idbPut(IDB.stores.designs, record);
  return record;
}

export async function renameDesign(id, name) {
  const existing = await getDesign(id);
  if (!existing) throw new Error('Design not found.');
  existing.name = sanitizeText(name, 80);
  existing.updatedAt = new Date().toISOString();
  await idbPut(IDB.stores.designs, existing);
  return existing;
}

export async function duplicateDesign(id) {
  const existing = await getDesign(id);
  if (!existing) throw new Error('Design not found.');
  return saveDesign(
    {
      ...existing,
      name: `${existing.name} copy`,
    },
    { asNew: true }
  );
}

export async function deleteDesign(id) {
  await idbDelete(IDB.stores.designs, id);
}
