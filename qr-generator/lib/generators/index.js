import { buildUrlPayload } from './url.js';
import { buildTextPayload } from './text.js';
import { buildWifiPayload } from './wifi.js';
import { buildWhatsappPayload } from './whatsapp.js';
import { buildGoogleReviewPayload } from './google-review.js';
import { buildVcardPayload } from './vcard.js';
import { buildEmailPayload } from './email.js';
import { buildSmsPayload } from './sms.js';
import { buildPhonePayload } from './phone.js';
import { buildLocationPayload } from './location.js';
import { buildImagePayload } from './image.js';
import { buildVideoPayload } from './video.js';
import { buildFilePayload } from './file.js';

const BUILDERS = {
  url: buildUrlPayload,
  text: buildTextPayload,
  wifi: buildWifiPayload,
  whatsapp: buildWhatsappPayload,
  'google-review': buildGoogleReviewPayload,
  vcard: buildVcardPayload,
  email: buildEmailPayload,
  sms: buildSmsPayload,
  phone: buildPhonePayload,
  location: buildLocationPayload,
  image: buildImagePayload,
  video: buildVideoPayload,
  file: buildFilePayload,
};

export function buildPayload(type, fields) {
  const builder = BUILDERS[type];
  if (!builder) return { ok: false, error: 'Unsupported QR type.', empty: true };
  return builder(fields || {});
}

export { BUILDERS };
