/** Analytics stub — never sends QR payload content. */
export function trackEvent(name, props = {}) {
  if (!window.__everqrAnalyticsEnabled) return;
  const safe = { ...props };
  delete safe.payload;
  delete safe.fields;
  delete safe.logoDataUrl;
  window.dispatchEvent(new CustomEvent('everqr:analytics', { detail: { name, props: safe } }));
}
