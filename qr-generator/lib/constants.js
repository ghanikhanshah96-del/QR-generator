export const QR_TYPES = {
  url: {
    id: 'url',
    label: 'URL',
    path: '/url-qr-code/',
    description: 'Link to any website or online destination.',
  },
  text: {
    id: 'text',
    label: 'Text',
    path: '/text-qr-code/',
    description: 'Encode plain text directly in the QR code.',
  },
  wifi: {
    id: 'wifi',
    label: 'WiFi',
    path: '/wifi-qr-code/',
    description: 'Let people join a Wi-Fi network by scanning.',
  },
  whatsapp: {
    id: 'whatsapp',
    label: 'WhatsApp',
    path: '/whatsapp-qr-code/',
    description: 'Open a WhatsApp chat with an optional message.',
  },
  'google-review': {
    id: 'google-review',
    label: 'Google Review',
    path: '/google-review-qr-code/',
    description: 'Send customers to your Google review page.',
  },
  vcard: {
    id: 'vcard',
    label: 'vCard',
    path: '/vcard-qr-code/',
    description: 'Share contact details as a digital business card.',
  },
  email: {
    id: 'email',
    label: 'Email',
    path: '/email-qr-code/',
    description: 'Start an email with address, subject, and body.',
  },
  sms: {
    id: 'sms',
    label: 'SMS',
    path: '/sms-qr-code/',
    description: 'Open a text message with a prefilled body.',
  },
  phone: {
    id: 'phone',
    label: 'Phone',
    path: '/phone-number-qr-code/',
    description: 'Trigger a phone call when scanned.',
  },
  location: {
    id: 'location',
    label: 'Location',
    path: '/location-qr-code/',
    description: 'Share map coordinates or a place pin.',
  },
  image: {
    id: 'image',
    label: 'Image',
    path: '/image-to-qr-code/',
    description: 'Upload an image or paste a link — QR opens the photo.',
  },
  video: {
    id: 'video',
    label: 'Video',
    path: '/video-to-qr-code/',
    description: 'Upload a video or paste YouTube/Vimeo/Drive.',
  },
  file: {
    id: 'file',
    label: 'File',
    path: '/file-qr-code/',
    description: 'Upload PDF, DOC, TXT, and more — QR opens the file.',
  },
};

export const DOT_TYPES = [
  { id: 'square', label: 'Square' },
  { id: 'dots', label: 'Dots' },
  { id: 'rounded', label: 'Rounded' },
  { id: 'classy', label: 'Classy' },
  { id: 'classy-rounded', label: 'Classy Rounded' },
  { id: 'extra-rounded', label: 'Extra Rounded' },
];

export const CORNER_SQUARE_TYPES = [
  { id: 'square', label: 'Square' },
  { id: 'dot', label: 'Dot' },
  { id: 'extra-rounded', label: 'Rounded' },
];

export const CORNER_DOT_TYPES = [
  { id: 'square', label: 'Square' },
  { id: 'dot', label: 'Dot' },
];

export const ERROR_CORRECTION = [
  { id: 'L', label: 'L (~7%)', hint: 'Best for small dense codes' },
  { id: 'M', label: 'M (~15%)', hint: 'Balanced default' },
  { id: 'Q', label: 'Q (~25%)', hint: 'Good with light logos' },
  { id: 'H', label: 'H (~30%)', hint: 'Best with logos / print damage' },
];

export const WIFI_SECURITY = [
  { id: 'WPA', label: 'WPA / WPA2 / WPA3' },
  { id: 'WEP', label: 'WEP' },
  { id: 'nopass', label: 'None' },
];

/** Defaults tuned for phone-camera reliability (square modules + large quiet zone). */
export const DEFAULT_DESIGN = {
  size: 512,
  margin: 48,
  errorCorrectionLevel: 'M',
  dotsType: 'square',
  cornersSquareType: 'square',
  cornersDotType: 'square',
  foreground: '#111827',
  background: '#ffffff',
  transparentBackground: false,
  useGradient: false,
  gradientColor: '#36827b',
  gradientRotation: 0,
  logoDataUrl: null,
  logoName: null,
  logoSize: 0.22,
  logoMargin: 8,
  logoHideBackgroundDots: true,
};

/** Minimum quiet-zone ratio of canvas size (~4 modules for typical versions). */
export const MIN_QUIET_ZONE_RATIO = 0.1;
/** Hard cap so logos do not cover finder patterns / data. */
export const MAX_LOGO_SIZE = 0.28;

export const PROJECT_SCHEMA_VERSION = 1;
