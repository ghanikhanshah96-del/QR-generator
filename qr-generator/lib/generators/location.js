import { sanitizeText } from '../validation/sanitize.js';

/**
 * Location QR → Google Maps link so scanners open Maps directly.
 */
export function buildLocationPayload(fields) {
  const lat = Number(fields.latitude);
  const lng = Number(fields.longitude);
  const empty =
    fields.latitude === '' ||
    fields.latitude == null ||
    fields.longitude === '' ||
    fields.longitude == null;

  if (empty) {
    return { ok: false, error: 'Enter latitude and longitude.', empty: true };
  }
  if (!Number.isFinite(lat) || lat < -90 || lat > 90) {
    return { ok: false, error: 'Latitude must be between -90 and 90.', empty: false };
  }
  if (!Number.isFinite(lng) || lng < -180 || lng > 180) {
    return { ok: false, error: 'Longitude must be between -180 and 180.', empty: false };
  }

  const label = sanitizeText(fields.label || '', 120).trim();
  const coords = `${lat},${lng}`;
  const query = label ? `${label}@${coords}` : coords;
  const payload = `https://www.google.com/maps?q=${encodeURIComponent(query)}`;

  return { ok: true, payload, empty: false };
}
