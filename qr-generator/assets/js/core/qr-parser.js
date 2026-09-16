/** Lightweight payload format helpers shared across generators. */
export function parseMaybeJson(value) {
  if (typeof value !== 'string') return null;
  try {
    return JSON.parse(value);
  } catch {
    return null;
  }
}

export function encodeQuery(params) {
  const usp = new URLSearchParams();
  for (const [k, v] of Object.entries(params)) {
    if (v == null || v === '') continue;
    usp.set(k, String(v));
  }
  return usp.toString();
}
