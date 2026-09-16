/**
 * Site-wide configuration. Update SITE.url before production deploy.
 */
export const SITE = {
  name: 'EverQR',
  legalName: 'EverQR',
  tagline: 'Free, Permanent, Private, Unlimited QR Code Generator',
  description:
    'Create free static QR codes in your browser — no signup, no expiration, no watermark. Private, unlimited, and permanent.',
  url: 'https://everqr.app',
  locale: 'en_US',
  twitter: '@everqr',
  contactEmail: 'hello@everqr.app',
  version: '1.0.0',
};

export const PATHS = {
  home: '/',
  saved: '/saved-designs/',
  guides: '/guides/',
  privacy: '/privacy-policy/',
  terms: '/terms/',
  about: '/about/',
  contact: '/contact/',
  faq: '/faq/',
  accessibility: '/accessibility/',
  security: '/security/',
};

export const STORAGE_KEYS = {
  theme: 'everqr.theme',
  recentType: 'everqr.recentType',
  editorPrefs: 'everqr.editorPrefs',
  uiState: 'everqr.uiState',
  consent: 'everqr.consent',
};

export const IDB = {
  name: 'everqr',
  version: 1,
  stores: {
    designs: 'designs',
  },
};

export const LIMITS = {
  maxLogoBytes: 2 * 1024 * 1024,
  maxProjectBytes: 5 * 1024 * 1024,
  maxTextLength: 2000,
  maxWifiPassword: 63,
  maxWifiSsid: 32,
  minQrSize: 128,
  maxQrSize: 2048,
  defaultQrSize: 512,
};
