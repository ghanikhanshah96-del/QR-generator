import { serializeProject } from '../core/qr-import.js';
import { downloadBlob } from '../utils/download.js';
import { slugify } from '../utils/format.js';

export function exportProjectJson(project, { includeLogo = true } = {}) {
  const json = serializeProject(project, { includeLogo });
  const blob = new Blob([json], { type: 'application/json' });
  downloadBlob(blob, `${slugify(project.name || 'qr-project')}.everqr.json`);
  return blob;
}
