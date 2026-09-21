import { sanitizeText, stripControlChars } from '../validation/sanitize.js';
import { validateEmail } from '../validation/email.js';
import { normalizePhone } from '../validation/phone.js';
import { validateHttpUrl } from '../validation/url.js';

function fold(line) {
  return stripControlChars(sanitizeText(line, 200)).trim();
}

function escapeVcard(value) {
  return String(value).replace(/\\/g, '\\\\').replace(/;/g, '\\;').replace(/,/g, '\\,').replace(/\n/g, '\\n');
}

export function buildVcardPayload(fields) {
  const first = fold(fields.firstName);
  const last = fold(fields.lastName);
  if (!first && !last) {
    return { ok: false, error: 'Enter at least a first or last name.', empty: true };
  }

  const org = fold(fields.organization);
  const title = fold(fields.title);
  const phone = fields.phone ? normalizePhone(fields.phone) : null;
  if (fields.phone && phone && !phone.ok) {
    return { ok: false, error: phone.error, empty: false };
  }
  const email = fields.email ? validateEmail(fields.email) : null;
  if (fields.email && email && !email.ok) {
    return { ok: false, error: email.error, empty: false };
  }
  let website = '';
  if (fields.website) {
    const url = validateHttpUrl(fields.website);
    if (!url.ok) return { ok: false, error: url.error, empty: false };
    website = url.value;
  }

  const street = fold(fields.street);
  const city = fold(fields.city);
  const region = fold(fields.region);
  const postal = fold(fields.postal);
  const country = fold(fields.country);
  const note = fold(fields.note);

  const lines = ['BEGIN:VCARD', 'VERSION:3.0'];
  lines.push(`N:${escapeVcard(last)};${escapeVcard(first)};;;`);
  lines.push(`FN:${escapeVcard(`${first} ${last}`.trim())}`);
  if (org) lines.push(`ORG:${escapeVcard(org)}`);
  if (title) lines.push(`TITLE:${escapeVcard(title)}`);
  if (phone?.ok) lines.push(`TEL;TYPE=CELL:${escapeVcard(phone.value)}`);
  if (email?.ok) lines.push(`EMAIL;TYPE=INTERNET:${escapeVcard(email.value)}`);
  if (website) lines.push(`URL:${escapeVcard(website)}`);
  if (street || city || region || postal || country) {
    lines.push(
      `ADR;TYPE=WORK:;;${escapeVcard(street)};${escapeVcard(city)};${escapeVcard(region)};${escapeVcard(
        postal
      )};${escapeVcard(country)}`
    );
  }
  if (note) lines.push(`NOTE:${escapeVcard(note)}`);
  lines.push('END:VCARD');

  return { ok: true, payload: lines.join('\n'), empty: false };
}
