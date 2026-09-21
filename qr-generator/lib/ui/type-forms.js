import { setText } from '../utils/escape.js';
import {
  validateMediaFile,
  uploadMediaForQr,
  formatExpiry,
  MEDIA_HOST,
} from '../storage/media-upload.js';

function fieldWrap() {
  const div = document.createElement('div');
  div.className = 'space-y-1.5';
  return div;
}

function label(forId, text) {
  const el = document.createElement('label');
  el.className = 'field-label';
  el.htmlFor = forId;
  el.textContent = text;
  return el;
}

function hint(text) {
  const p = document.createElement('p');
  p.className = 'field-hint';
  p.textContent = text;
  return p;
}

function input(opts) {
  const el = document.createElement(opts.multiline ? 'textarea' : 'input');
  if (!opts.multiline) el.type = opts.type || 'text';
  else el.rows = opts.rows || 4;
  el.id = opts.id;
  el.name = opts.name || opts.id;
  el.className = 'field-input';
  if (opts.placeholder) el.placeholder = opts.placeholder;
  if (opts.autocomplete) el.autocomplete = opts.autocomplete;
  if (opts.inputmode) el.inputMode = opts.inputmode;
  if (opts.value != null) el.value = opts.value;
  if (opts.multiline) el.classList.add('min-h-[96px]', 'py-3');
  el.addEventListener('input', () => opts.onInput?.(el.value));
  return el;
}

function select(opts) {
  const el = document.createElement('select');
  el.id = opts.id;
  el.name = opts.name || opts.id;
  el.className = 'field-input';
  opts.options.forEach((o) => {
    const opt = document.createElement('option');
    opt.value = o.id;
    opt.textContent = o.label;
    el.appendChild(opt);
  });
  if (opts.value) el.value = opts.value;
  el.addEventListener('change', () => opts.onInput?.(el.value));
  return el;
}

function checkbox(opts) {
  const wrap = document.createElement('label');
  wrap.className = 'flex items-center gap-2 text-sm text-ink-800 min-h-[44px]';
  const el = document.createElement('input');
  el.type = 'checkbox';
  el.id = opts.id;
  el.checked = Boolean(opts.value);
  el.className = 'size-4 rounded border-ink-300 text-brand-700 focus:ring-brand-500';
  el.addEventListener('change', () => opts.onInput?.(el.checked));
  wrap.append(el, document.createTextNode(opts.label));
  return wrap;
}

/**
 * Render type-specific form fields into a container.
 */
export function renderTypeFields(container, type, fields, onPatch) {
  container.replaceChildren();
  const f = fields || {};

  const add = (nodes) => {
    nodes.forEach((n) => container.appendChild(n));
  };

  if (type === 'url') {
    const w = fieldWrap();
    w.append(
      label('field-url', 'Website URL'),
      input({
        id: 'field-url',
        value: f.url || '',
        placeholder: 'https://example.com',
        autocomplete: 'url',
        onInput: (v) => onPatch({ url: v }),
      }),
      hint('We’ll add https:// if you leave the protocol out.')
    );
    add([w]);
    return;
  }

  if (type === 'text') {
    const w = fieldWrap();
    w.append(
      label('field-text', 'Text'),
      input({
        id: 'field-text',
        multiline: true,
        value: f.text || '',
        placeholder: 'Type any message to encode…',
        onInput: (v) => onPatch({ text: v }),
      })
    );
    add([w]);
    return;
  }

  if (type === 'wifi') {
    const ssid = fieldWrap();
    ssid.append(
      label('field-ssid', 'Network name (SSID)'),
      input({
        id: 'field-ssid',
        value: f.ssid || '',
        placeholder: 'Cafe_Guest',
        autocomplete: 'off',
        onInput: (v) => onPatch({ ssid: v }),
      })
    );
    const security = fieldWrap();
    security.append(
      label('field-security', 'Security'),
      select({
        id: 'field-security',
        value: f.security || 'WPA',
        options: [
          { id: 'WPA', label: 'WPA / WPA2 / WPA3' },
          { id: 'WEP', label: 'WEP' },
          { id: 'nopass', label: 'None' },
        ],
        onInput: (v) => onPatch({ security: v }),
      })
    );
    const password = fieldWrap();
    password.append(
      label('field-password', 'Password'),
      input({
        id: 'field-password',
        type: 'password',
        value: f.password || '',
        autocomplete: 'off',
        placeholder: 'Network password',
        onInput: (v) => onPatch({ password: v }),
      }),
      hint('Password stays in your browser and inside the QR payload — never uploaded to us.')
    );
    const hidden = checkbox({
      id: 'field-hidden',
      label: 'Hidden network',
      value: f.hidden,
      onInput: (v) => onPatch({ hidden: v }),
    });
    add([ssid, security, password, hidden]);
    return;
  }

  if (type === 'whatsapp') {
    const row = document.createElement('div');
    row.className = 'grid grid-cols-3 gap-3';
    const code = fieldWrap();
    code.classList.add('col-span-1');
    code.append(
      label('field-cc', 'Country'),
      input({
        id: 'field-cc',
        value: f.countryCode || '1',
        placeholder: '1',
        inputmode: 'numeric',
        onInput: (v) => onPatch({ countryCode: v }),
      })
    );
    const phone = fieldWrap();
    phone.classList.add('col-span-2');
    phone.append(
      label('field-phone', 'Phone number'),
      input({
        id: 'field-phone',
        value: f.phone || '',
        placeholder: '5551234567',
        inputmode: 'tel',
        onInput: (v) => onPatch({ phone: v }),
      })
    );
    row.append(code, phone);
    const msg = fieldWrap();
    msg.append(
      label('field-message', 'Prefill message (optional)'),
      input({
        id: 'field-message',
        multiline: true,
        rows: 3,
        value: f.message || '',
        onInput: (v) => onPatch({ message: v }),
      })
    );
    add([row, msg]);
    return;
  }

  if (type === 'google-review') {
    const w = fieldWrap();
    w.append(
      label('field-review', 'Google review / Place URL'),
      input({
        id: 'field-review',
        value: f.reviewUrl || '',
        placeholder: 'https://g.page/r/… or Google Maps link',
        onInput: (v) => onPatch({ reviewUrl: v }),
      }),
      hint('In Google Business Profile, open Share → review link, then paste it here.')
    );
    add([w]);
    return;
  }

  if (type === 'vcard') {
    const grid = document.createElement('div');
    grid.className = 'grid gap-3 sm:grid-cols-2';
    const fieldsSpec = [
      ['firstName', 'First name', 'Jane'],
      ['lastName', 'Last name', 'Doe'],
      ['organization', 'Organization', 'Acme Inc.'],
      ['title', 'Job title', 'Founder'],
      ['phone', 'Phone', '+1 555 0100'],
      ['email', 'Email', 'jane@example.com'],
      ['website', 'Website', 'https://example.com'],
      ['street', 'Street', '123 Main St'],
      ['city', 'City', 'Austin'],
      ['region', 'State / Region', 'TX'],
      ['postal', 'Postal code', '78701'],
      ['country', 'Country', 'USA'],
    ];
    fieldsSpec.forEach(([key, lab, ph]) => {
      const w = fieldWrap();
      w.append(
        label(`field-${key}`, lab),
        input({
          id: `field-${key}`,
          value: f[key] || '',
          placeholder: ph,
          onInput: (v) => onPatch({ [key]: v }),
        })
      );
      grid.appendChild(w);
    });
    const note = fieldWrap();
    note.append(
      label('field-note', 'Note'),
      input({
        id: 'field-note',
        multiline: true,
        rows: 2,
        value: f.note || '',
        onInput: (v) => onPatch({ note: v }),
      })
    );
    add([grid, note]);
    return;
  }

  if (type === 'email') {
    add([
      (() => {
        const w = fieldWrap();
        w.append(
          label('field-email', 'Email'),
          input({
            id: 'field-email',
            type: 'email',
            value: f.email || '',
            placeholder: 'hello@example.com',
            onInput: (v) => onPatch({ email: v }),
          })
        );
        return w;
      })(),
      (() => {
        const w = fieldWrap();
        w.append(
          label('field-subject', 'Subject (optional)'),
          input({
            id: 'field-subject',
            value: f.subject || '',
            onInput: (v) => onPatch({ subject: v }),
          })
        );
        return w;
      })(),
      (() => {
        const w = fieldWrap();
        w.append(
          label('field-body', 'Message (optional)'),
          input({
            id: 'field-body',
            multiline: true,
            value: f.body || '',
            onInput: (v) => onPatch({ body: v }),
          })
        );
        return w;
      })(),
    ]);
    return;
  }

  if (type === 'sms') {
    add([
      (() => {
        const w = fieldWrap();
        w.append(
          label('field-sms-phone', 'Phone number'),
          input({
            id: 'field-sms-phone',
            value: f.phone || '',
            placeholder: '+15550100',
            inputmode: 'tel',
            onInput: (v) => onPatch({ phone: v }),
          })
        );
        return w;
      })(),
      (() => {
        const w = fieldWrap();
        w.append(
          label('field-sms-message', 'Message (optional)'),
          input({
            id: 'field-sms-message',
            multiline: true,
            value: f.message || '',
            onInput: (v) => onPatch({ message: v }),
          })
        );
        return w;
      })(),
    ]);
    return;
  }

  if (type === 'phone') {
    const w = fieldWrap();
    w.append(
      label('field-tel', 'Phone number'),
      input({
        id: 'field-tel',
        value: f.phone || '',
        placeholder: '+15550100',
        inputmode: 'tel',
        onInput: (v) => onPatch({ phone: v }),
      }),
      hint('Include country code for best results across devices.')
    );
    add([w]);
    return;
  }

  if (type === 'location') {
    const grid = document.createElement('div');
    grid.className = 'grid gap-3 sm:grid-cols-2';
    const lat = fieldWrap();
    lat.append(
      label('field-lat', 'Latitude'),
      input({
        id: 'field-lat',
        value: f.latitude ?? '',
        placeholder: '30.2672',
        inputmode: 'decimal',
        onInput: (v) => onPatch({ latitude: v }),
      })
    );
    const lng = fieldWrap();
    lng.append(
      label('field-lng', 'Longitude'),
      input({
        id: 'field-lng',
        value: f.longitude ?? '',
        placeholder: '-97.7431',
        inputmode: 'decimal',
        onInput: (v) => onPatch({ longitude: v }),
      })
    );
    grid.append(lat, lng);
    const lab = fieldWrap();
    lab.append(
      label('field-label', 'Label (optional)'),
      input({
        id: 'field-label',
        value: f.label || '',
        placeholder: 'Store entrance',
        onInput: (v) => onPatch({ label: v }),
      }),
      hint('Paste latitude and longitude in separate fields. Scanning opens Google Maps at this pin.')
    );
    add([grid, lab]);
    return;
  }

  if (type === 'image') {
    const status = document.createElement('p');
    status.id = 'field-image-status';
    status.className = 'field-hint';
    status.textContent = f.imageUrl
      ? `Link ready${f.mediaHosted ? ` (via ${f.mediaProvider || MEDIA_HOST.name})` : ''}.`
      : 'Upload an image to create a public link, then we encode that link in the QR.';

    const preview = document.createElement('img');
    preview.id = 'field-image-preview';
    preview.alt = 'Selected image preview';
    preview.className = 'mt-2 max-h-32 rounded-xl border border-ink-200 bg-white object-contain';
    preview.hidden = !f.imagePreviewUrl;
    if (f.imagePreviewUrl) preview.src = f.imagePreviewUrl;

    const uploadWrap = fieldWrap();
    const fileInput = document.createElement('input');
    fileInput.id = 'field-image-file';
    fileInput.type = 'file';
    fileInput.accept = 'image/png,image/jpeg,image/webp,image/gif,image/svg+xml';
    fileInput.className =
      'block w-full text-sm text-ink-700 file:mr-3 file:rounded-xl file:border-0 file:bg-ink-950 file:px-3 file:py-2.5 file:text-sm file:font-semibold file:text-white';

    fileInput.addEventListener('change', async () => {
      const file = fileInput.files?.[0];
      if (!file) return;

      const check = validateMediaFile(file, 'image');
      if (!check.ok) {
        status.className = 'field-error';
        status.textContent = check.error;
        fileInput.value = '';
        return;
      }

      const localPreview = URL.createObjectURL(file);
      preview.src = localPreview;
      preview.hidden = false;
      status.className = 'field-hint';
      status.textContent = 'Uploading to create a public link…';

      try {
        const hosted = await uploadMediaForQr(file);
        onPatch({
          imageUrl: hosted.url,
          imagePreviewUrl: localPreview,
          imageFileName: hosted.fileName,
          mediaHosted: true,
          mediaProvider: hosted.provider,
          mediaExpiresIn: hosted.expiresInSeconds,
        });
        const urlInput = document.getElementById('field-image-url');
        if (urlInput) urlInput.value = hosted.url;
        status.className = 'field-hint';
        status.textContent = `Uploaded to ${hosted.provider}. Link expires in ~${formatExpiry(
          hosted.expiresInSeconds
        )}. QR encodes this public URL (not stored on EverQR).`;
      } catch (err) {
        status.className = 'field-error';
        status.textContent = err.message || 'Upload failed.';
        onPatch({
          imageUrl: '',
          imagePreviewUrl: localPreview,
          imageFileName: file.name,
          mediaHosted: false,
          mediaProvider: '',
        });
      }
    });

    uploadWrap.append(
      label('field-image-file', 'Upload image'),
      fileInput,
      status,
      preview,
      hint('Max size: 15 MB (PNG, JPG, WebP, GIF, SVG).')
    );

    const or = document.createElement('p');
    or.className = 'text-center text-xs font-semibold uppercase tracking-[0.14em] text-ink-400';
    or.textContent = 'or paste a lasting link';

    const urlWrap = fieldWrap();
    urlWrap.append(
      label('field-image-url', 'Image URL'),
      input({
        id: 'field-image-url',
        value: f.imageUrl || '',
        placeholder: 'https://example.com/photo.jpg',
        autocomplete: 'url',
        onInput: (v) => {
          onPatch({
            imageUrl: v,
            mediaHosted: false,
            mediaProvider: '',
            mediaExpiresIn: null,
            imageFileName: '',
          });
          status.className = 'field-hint';
          status.textContent = v.trim()
            ? 'Using your pasted URL (best for permanent print QRs).'
            : 'Upload an image to create a public link, then we encode that link in the QR.';
        },
      }),
      hint('For permanent QRs, host on your own CDN/Drive and paste the URL here.')
    );

    add([uploadWrap, or, urlWrap]);
    return;
  }

  if (type === 'video') {
    const status = document.createElement('p');
    status.id = 'field-video-status';
    status.className = 'field-hint';
    status.textContent = f.videoUrl
      ? `Link ready${f.mediaHosted ? ` (via ${f.mediaProvider || MEDIA_HOST.name})` : ''}.`
      : 'Upload a video to create a public link, or paste YouTube/Vimeo/Drive.';

    const uploadWrap = fieldWrap();
    const fileInput = document.createElement('input');
    fileInput.id = 'field-video-file';
    fileInput.type = 'file';
    fileInput.accept = 'video/mp4,video/webm,video/quicktime,video/*';
    fileInput.className =
      'block w-full text-sm text-ink-700 file:mr-3 file:rounded-xl file:border-0 file:bg-ink-950 file:px-3 file:py-2.5 file:text-sm file:font-semibold file:text-white';

    fileInput.addEventListener('change', async () => {
      const file = fileInput.files?.[0];
      if (!file) return;

      const check = validateMediaFile(file, 'video');
      if (!check.ok) {
        status.className = 'field-error';
        status.textContent = check.error;
        fileInput.value = '';
        return;
      }

      status.className = 'field-hint';
      status.textContent = 'Uploading video to create a public link…';

      try {
        const hosted = await uploadMediaForQr(file);
        onPatch({
          videoUrl: hosted.url,
          videoFileName: hosted.fileName,
          mediaHosted: true,
          mediaProvider: hosted.provider,
          mediaExpiresIn: hosted.expiresInSeconds,
        });
        const urlInput = document.getElementById('field-video-url');
        if (urlInput) urlInput.value = hosted.url;
        status.className = 'field-hint';
        status.textContent = `Uploaded to ${hosted.provider}. Link expires in ~${formatExpiry(
          hosted.expiresInSeconds
        )}. QR encodes this public URL (not stored on EverQR).`;
      } catch (err) {
        status.className = 'field-error';
        status.textContent = err.message || 'Upload failed.';
        onPatch({
          videoFileName: file.name,
          mediaHosted: false,
        });
      }
    });

    uploadWrap.append(
      label('field-video-file', 'Upload video'),
      fileInput,
      status,
      hint('Max size: 80 MB (MP4, WebM, MOV).')
    );

    const or = document.createElement('p');
    or.className = 'text-center text-xs font-semibold uppercase tracking-[0.14em] text-ink-400';
    or.textContent = 'or paste YouTube / Vimeo / Drive';

    const urlWrap = fieldWrap();
    urlWrap.append(
      label('field-video-url', 'Video URL'),
      input({
        id: 'field-video-url',
        value: f.videoUrl || '',
        placeholder: 'https://www.youtube.com/watch?v=…',
        autocomplete: 'url',
        onInput: (v) => {
          onPatch({
            videoUrl: v,
            mediaHosted: false,
            mediaProvider: '',
            mediaExpiresIn: null,
          });
          status.className = 'field-hint';
          status.textContent = v.trim()
            ? 'Using your pasted video URL.'
            : 'Upload a video to create a public link, or paste YouTube/Vimeo/Drive.';
        },
      })
    );

    add([uploadWrap, or, urlWrap]);
    return;
  }

  if (type === 'file') {
    const status = document.createElement('p');
    status.id = 'field-file-status';
    status.className = 'field-hint';
    status.textContent = f.fileUrl
      ? `Link ready${f.mediaHosted ? ` (via ${f.mediaProvider || MEDIA_HOST.name})` : ''}.`
      : 'Upload a PDF, DOC, TXT, or similar file to create a public link.';

    const nameHint = document.createElement('p');
    nameHint.id = 'field-file-name';
    nameHint.className = 'field-hint';
    nameHint.hidden = !f.fileName;
    if (f.fileName) nameHint.textContent = `Selected: ${f.fileName}`;

    const uploadWrap = fieldWrap();
    const fileInput = document.createElement('input');
    fileInput.id = 'field-file-upload';
    fileInput.type = 'file';
    fileInput.accept =
      '.pdf,.doc,.docx,.txt,.csv,.rtf,.xls,.xlsx,.ppt,.pptx,.odt,.json,.xml,application/pdf,text/plain';
    fileInput.className =
      'block w-full text-sm text-ink-700 file:mr-3 file:rounded-xl file:border-0 file:bg-ink-950 file:px-3 file:py-2.5 file:text-sm file:font-semibold file:text-white';

    fileInput.addEventListener('change', async () => {
      const file = fileInput.files?.[0];
      if (!file) return;

      const check = validateMediaFile(file, 'file');
      if (!check.ok) {
        status.className = 'field-error';
        status.textContent = check.error;
        fileInput.value = '';
        return;
      }

      nameHint.textContent = `Selected: ${file.name}`;
      nameHint.hidden = false;
      status.className = 'field-hint';
      status.textContent = 'Uploading file to create a public link…';

      try {
        const hosted = await uploadMediaForQr(file);
        onPatch({
          fileUrl: hosted.url,
          fileName: hosted.fileName,
          mediaHosted: true,
          mediaProvider: hosted.provider,
          mediaExpiresIn: hosted.expiresInSeconds,
        });
        const urlInput = document.getElementById('field-file-url');
        if (urlInput) urlInput.value = hosted.url;
        status.className = 'field-hint';
        status.textContent = `Uploaded. Link expires in ~${formatExpiry(
          hosted.expiresInSeconds
        )}.`;
      } catch (err) {
        status.className = 'field-error';
        status.textContent = err.message || 'Upload failed.';
        onPatch({
          fileName: file.name,
          mediaHosted: false,
        });
      }
    });

    uploadWrap.append(
      label('field-file-upload', 'Upload file'),
      fileInput,
      status,
      nameHint,
      hint('Max size: 25 MB (PDF, DOC, DOCX, TXT, CSV, RTF, XLS, PPT, and similar).')
    );

    const or = document.createElement('p');
    or.className = 'text-center text-xs font-semibold uppercase tracking-[0.14em] text-ink-400';
    or.textContent = 'or paste a lasting link';

    const urlWrap = fieldWrap();
    urlWrap.append(
      label('field-file-url', 'File URL'),
      input({
        id: 'field-file-url',
        value: f.fileUrl || '',
        placeholder: 'https://example.com/document.pdf',
        autocomplete: 'url',
        onInput: (v) => {
          onPatch({
            fileUrl: v,
            mediaHosted: false,
            mediaProvider: '',
            mediaExpiresIn: null,
            fileName: '',
          });
          nameHint.hidden = true;
          status.className = 'field-hint';
          status.textContent = v.trim()
            ? 'Using your pasted file URL.'
            : 'Upload a PDF, DOC, TXT, or similar file to create a public link.';
        },
      }),
      hint('For permanent QRs, host the file on Drive/Dropbox/your site and paste the URL.')
    );

    add([uploadWrap, or, urlWrap]);
    return;
  }

  setText(container, 'Unsupported type.');
}
