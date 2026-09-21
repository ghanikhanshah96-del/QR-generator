import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const ROOT = path.resolve(__dirname, '..');
const PARTIALS = path.join(ROOT, 'partials');

function read(file) {
  return fs.readFileSync(file, 'utf8');
}

function write(file, content) {
  fs.mkdirSync(path.dirname(file), { recursive: true });
  fs.writeFileSync(file, content);
}

function loadPartial(name) {
  return read(path.join(PARTIALS, name));
}

function injectIncludes(html, base) {
  let out = html;
  let guard = 0;
  while (out.includes('<!-- include:') && guard < 20) {
    out = out.replace(/<!--\s*include:([\w./-]+)\s*-->/g, (_, name) => {
      const partial = loadPartial(name.trim());
      return injectIncludes(partial, base);
    });
    guard += 1;
  }
  return out.replaceAll('{{BASE}}', base);
}

function faqItems(items) {
  return items
    .map((item, i) => {
      const id = `faq-${i + 1}`;
      return `<div class="panel overflow-hidden">
  <h3>
    <button type="button" class="flex w-full items-center justify-between gap-4 px-4 py-3 text-left text-sm font-semibold text-ink-900" data-accordion-trigger aria-expanded="false" aria-controls="${id}">
      <span>${item.q}</span>
      <span aria-hidden="true" class="text-ink-400">+</span>
    </button>
  </h3>
  <div id="${id}" class="border-t border-ink-100 px-4 py-3 text-sm text-ink-600 leading-relaxed" hidden>
    ${item.a}
  </div>
</div>`;
    })
    .join('\n');
}

function head({ title, description, path: pagePath, base, type }) {
  const canonical = `https://everqr.app${pagePath}`;
  return `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="utf-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1" />
  <title>${title}</title>
  <meta name="description" content="${description}" />
  <link rel="canonical" href="${canonical}" />
  <meta name="robots" content="index,follow" />
  <meta property="og:type" content="website" />
  <meta property="og:site_name" content="EverQR" />
  <meta property="og:title" content="${title}" />
  <meta property="og:description" content="${description}" />
  <meta property="og:url" content="${canonical}" />
  <meta name="twitter:card" content="summary_large_image" />
  <meta name="twitter:title" content="${title}" />
  <meta name="twitter:description" content="${description}" />
  <link rel="icon" href="${base}/assets/icons/favicon-32x32.png" sizes="32x32" />
  <link rel="apple-touch-icon" href="${base}/assets/icons/apple-touch-icon.png" />
  <link rel="manifest" href="${base}/manifest.webmanifest" />
  <link rel="preconnect" href="https://fonts.googleapis.com" />
  <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin />
  <link href="https://fonts.googleapis.com/css2?family=Fraunces:opsz,wght@9..144,600;9..144,700&family=Plus+Jakarta+Sans:wght@400;500;600;700;800&display=swap" rel="stylesheet" />
  <link rel="stylesheet" href="${base}/assets/css/output.css" />
  <script type="application/ld+json">
  ${JSON.stringify({
    '@context': 'https://schema.org',
    '@type': type === 'guide' ? 'Article' : 'WebApplication',
    name: title,
    description,
    url: canonical,
    applicationCategory: 'UtilitiesApplication',
    offers: { '@type': 'Offer', price: '0', priceCurrency: 'USD' },
  })}
  </script>
</head>`;
}

function generatorBlock({ lockType, showTypeSelect = true }) {
  return `
<section id="generator-app" class="site-container pb-10 pt-2 sm:pb-14">
  <div class="editor-shell">
    <div class="space-y-5 animate-rise-in">
      <div class="panel-strong p-5 sm:p-7 space-y-6">
        <div class="space-y-4">
          <div>
            <p class="text-[11px] font-semibold uppercase tracking-[0.16em] text-brand-700">Content</p>
            <h2 class="mt-1 text-xl font-semibold tracking-tight text-ink-950">What should this QR open?</h2>
          </div>
          ${
            showTypeSelect
              ? `<div>
            <label class="field-label" for="qr-type">QR type</label>
            <select id="qr-type" class="sr-only" tabindex="-1" aria-hidden="true"></select>
            <div id="qr-type-chips" class="flex flex-wrap gap-2" role="group" aria-label="Choose QR type"></div>
          </div>`
              : `<input type="hidden" id="qr-type" />`
          }
          <div id="qr-fields" class="space-y-4"></div>
        </div>
      </div>
      <div class="panel p-5 sm:p-7">
        <div class="flex items-start justify-between gap-4">
          <div>
            <p class="text-[11px] font-semibold uppercase tracking-[0.16em] text-ink-500">Design</p>
            <h2 class="mt-1 text-lg font-semibold text-ink-950">Make it yours</h2>
            <p class="mt-1 text-sm text-ink-500">Start simple. Open advanced options only when you need them.</p>
          </div>
        </div>
        <div class="mt-5">
          <!-- include:qr-editor.html -->
        </div>
      </div>
    </div>
    <!-- include:qr-preview.html -->
  </div>
</section>`;
}

const TOOLS = [
  {
    id: 'url',
    dir: 'url-qr-code',
    title: 'Free URL QR Code Generator | EverQR',
    h1: 'URL QR Code Generator',
    description:
      'Create a free static URL QR code in your browser. No signup, no expiration, no watermark. Private and unlimited.',
    intro:
      'Encode any website link directly into a permanent static QR code. Generation happens on your device — we never need the destination URL on our servers.',
    instructions: [
      'Paste or type your website URL.',
      'Watch the live preview update automatically.',
      'Customize colors, style, and optional logo.',
      'Download PNG, SVG, or JPG — watermark-free.',
    ],
    faqs: [
      {
        q: 'Do URL QR codes expire?',
        a: 'Static QR codes generated here do not expire and do not depend on our servers. The website you encode must remain online for the QR to stay useful.',
      },
      {
        q: 'Is the URL sent to EverQR?',
        a: 'No. For normal static generation, your URL is processed in the browser and encoded into the QR locally.',
      },
      {
        q: 'Can I add my logo?',
        a: 'Yes. Upload a logo client-side and we recommend error correction level H for reliable scanning.',
      },
    ],
  },
  {
    id: 'text',
    dir: 'text-qr-code',
    title: 'Free Text QR Code Generator | EverQR',
    h1: 'Text QR Code Generator',
    description: 'Encode plain text into a free static QR code. Private, unlimited, no signup, no watermark.',
    intro: 'Put a message, note, code, or instructions directly inside a QR — no short link required.',
    instructions: [
      'Enter the text you want to encode.',
      'Preview updates live as you type.',
      'Style the QR for print or screen.',
      'Download in PNG, SVG, or JPG.',
    ],
    faqs: [
      {
        q: 'How much text can I encode?',
        a: 'QR capacity depends on error correction and content. Keep messages concise for easier scanning.',
      },
      {
        q: 'Is my text stored on a server?',
        a: 'No. Text is processed in your browser for static QR generation.',
      },
    ],
  },
  {
    id: 'wifi',
    dir: 'wifi-qr-code',
    title: 'Free WiFi QR Code Generator | EverQR',
    h1: 'WiFi QR Code Generator',
    description:
      'Create a free WiFi QR code so guests can join your network by scanning. Private, no signup, no watermark.',
    intro:
      'Share network access without spelling passwords aloud. The WiFi payload is encoded statically in the QR and never uploaded to us for generation.',
    instructions: [
      'Enter SSID, security type, and password.',
      'Optionally mark the network as hidden.',
      'Customize the design for table tents or posters.',
      'Download and print — guests scan to join.',
    ],
    faqs: [
      {
        q: 'Is my Wi‑Fi password uploaded?',
        a: 'No. Password and SSID stay in your browser and inside the QR payload on your device.',
      },
      {
        q: 'Which security types are supported?',
        a: 'WPA/WPA2/WPA3, WEP, and open (none) networks.',
      },
    ],
  },
  {
    id: 'whatsapp',
    dir: 'whatsapp-qr-code',
    title: 'Free WhatsApp QR Code Generator | EverQR',
    h1: 'WhatsApp QR Code Generator',
    description: 'Generate a WhatsApp chat QR with optional prefilled message. Free, permanent, private.',
    intro: 'Help customers start a WhatsApp conversation instantly. The wa.me link is encoded statically in the QR.',
    instructions: [
      'Enter country code and phone number.',
      'Optionally add a prefilled message.',
      'Customize branding colors or logo.',
      'Download and place on packaging, posters, or cards.',
    ],
    faqs: [
      {
        q: 'Does this create a WhatsApp business account?',
        a: 'No. It only encodes a chat link to an existing WhatsApp number.',
      },
    ],
  },
  {
    id: 'google-review',
    dir: 'google-review-qr-code',
    title: 'Free Google Review QR Code Generator | EverQR',
    h1: 'Google Review QR Code Generator',
    description:
      'Create a QR code that opens your Google review page. Free, static, no signup, no watermark.',
    intro:
      'Make it effortless for happy customers to leave a Google review. Paste your Google Place or review short link — encoded permanently in the QR.',
    instructions: [
      'Open Google Business Profile and copy your review/share link.',
      'Paste the link into the generator.',
      'Style the QR for table cards or receipts.',
      'Download and print.',
    ],
    faqs: [
      {
        q: 'What links are accepted?',
        a: 'Google Maps, g.page, and Google Place review links.',
      },
      {
        q: 'Will the QR stop working if Google changes the link?',
        a: 'Static QR codes do not expire on our side, but they still depend on the third-party URL remaining valid.',
      },
    ],
  },
  {
    id: 'vcard',
    dir: 'vcard-qr-code',
    title: 'Free vCard QR Code Generator — Digital Business Card | EverQR',
    h1: 'vCard QR Code Generator',
    description: 'Create a contact QR (vCard) for networking. Free, private, unlimited, no watermark.',
    intro: 'Share name, phone, email, and company details as a scannable digital business card.',
    instructions: [
      'Fill in contact fields you want to share.',
      'Preview the QR live.',
      'Add brand colors or a logo.',
      'Download for print on cards or badges.',
    ],
    faqs: [
      {
        q: 'Which phones can save the contact?',
        a: 'Most modern smartphones recognize vCard QR payloads and offer to add a contact.',
      },
    ],
  },
  {
    id: 'email',
    dir: 'email-qr-code',
    title: 'Free Email QR Code Generator | EverQR',
    h1: 'Email QR Code Generator',
    description: 'Create a mailto QR with subject and message. Free, static, private, no signup.',
    intro: 'Let people compose an email to you with one scan — address, subject, and body included.',
    instructions: [
      'Enter the destination email.',
      'Optionally add subject and message.',
      'Customize the design.',
      'Download PNG, SVG, or JPG.',
    ],
    faqs: [
      {
        q: 'Will every phone open email apps?',
        a: 'Most devices open the default mail app from mailto QR codes. Behavior can vary by OS.',
      },
    ],
  },
  {
    id: 'sms',
    dir: 'sms-qr-code',
    title: 'Free SMS QR Code Generator | EverQR',
    h1: 'SMS QR Code Generator',
    description: 'Generate an SMS QR with optional prefilled text. Free, permanent, no watermark.',
    intro: 'Start a text message conversation from a poster, packaging, or flyer.',
    instructions: [
      'Enter the phone number.',
      'Add an optional message.',
      'Style and download your QR.',
    ],
    faqs: [
      {
        q: 'Are SMS charges applied?',
        a: 'Standard carrier rates may apply when the user sends the message. EverQR does not send SMS.',
      },
    ],
  },
  {
    id: 'phone',
    dir: 'phone-number-qr-code',
    title: 'Free Phone Number QR Code Generator | EverQR',
    h1: 'Phone Number QR Code Generator',
    description: 'Create a free phone number QR code for click-to-call. Private, unlimited, no signup.',
    intro: 'Encode a telephone number so scanning starts a call on supported devices.',
    instructions: [
      'Enter a phone number with country code.',
      'Preview and customize.',
      'Download for print or digital use.',
    ],
    faqs: [
      {
        q: 'Do desktop scanners call the number?',
        a: 'Desktop apps may show the number instead of placing a call. Mobile devices typically offer Call.',
      },
    ],
  },
  {
    id: 'location',
    dir: 'location-qr-code',
    title: 'Free Location QR Code Generator | EverQR',
    h1: 'Location QR Code Generator',
    description: 'Create a free location QR code generator pin for Google Maps. Static, private, no watermark.',
    intro: 'Share a precise map pin. Enter latitude and longitude — scanning opens that place in Google Maps.',
    instructions: [
      'Enter latitude and longitude (separate fields — not both in one box).',
      'Optionally add a label.',
      'Customize and download — scan opens Google Maps.',
    ],
    faqs: [
      {
        q: 'What happens when someone scans?',
        a: 'The QR encodes a Google Maps link for your coordinates, so phones open Google Maps at that pin.',
      },
    ],
  },
  {
    id: 'image',
    dir: 'image-to-qr-code',
    title: 'Free Image to QR Code Generator | EverQR',
    h1: 'Image to QR Code Generator',
    description:
      'Convert an image to QR code for free — upload or paste a URL. No signup, no watermark.',
    intro:
      'Upload your photo (temporary public link) or paste a lasting image URL. EverQR encodes that https link in the QR — not the image bytes.',
    instructions: [
      'Upload an image (PNG, JPG, WebP, GIF, SVG) or paste a public https URL.',
      'We host uploads briefly on tmpfiles.org so scanners get a real link (EverQR has no media server).',
      'Customize colors, logo, and size.',
      'Download PNG, SVG, or JPG — no watermark.',
    ],
    faqs: [
      {
        q: 'How does image upload work?',
        a: 'Like QR.io: your file is sent to a third-party host (tmpfiles.org) to get a public URL. That URL is what goes into the QR. EverQR does not store your image.',
      },
      {
        q: 'Does an uploaded image QR expire?',
        a: 'The QR graphic itself does not expire. Temporary upload links expire after about 48 hours. For print or long-term use, paste a permanent URL from your own CDN, Drive, or website.',
      },
      {
        q: 'What kind of links work best?',
        a: 'Direct image URLs ending in .png, .jpg, or .webp usually open most reliably. Share-page links also work if they stay publicly accessible.',
      },
    ],
  },
  {
    id: 'video',
    dir: 'video-to-qr-code',
    title: 'Free Video to QR Code Generator | EverQR',
    h1: 'Video to QR Code Generator',
    description:
      'Convert a video to QR code for free — upload or paste YouTube/Vimeo/Drive. No signup, no watermark.',
    intro:
      'Upload a short video for a temporary public link, or paste YouTube, Vimeo, or Drive. The QR opens that link — video files are too large to embed inside a QR.',
    instructions: [
      'Upload MP4/WebM/MOV (temporary third-party link) or paste YouTube, Vimeo, or Drive.',
      'Confirm the public URL appears in the form.',
      'Customize the design.',
      'Download and share — no watermark.',
    ],
    faqs: [
      {
        q: 'Why can’t the video live inside the QR?',
        a: 'QR capacity is only a few KB. Videos are megabytes. The standard approach (same as QR.io) is a QR that opens the video’s public URL.',
      },
      {
        q: 'Do you host my video?',
        a: 'EverQR has no media backend. Optional uploads go to tmpfiles.org (~48h). For lasting QRs, use YouTube, Vimeo, Drive, or your own host.',
      },
      {
        q: 'Which platforms are supported?',
        a: 'Any https video URL works. YouTube and Vimeo links are normalized to a clean watch URL when possible.',
      },
      {
        q: 'Will the QR stop working if I delete the video?',
        a: 'The QR itself does not expire on our side, but it still needs a valid destination URL to remain useful.',
      },
    ],
  },
  {
    id: 'file',
    dir: 'file-qr-code',
    title: 'Free File QR Code Generator — PDF, DOC, TXT | EverQR',
    h1: 'File QR Code Generator',
    description:
      'Upload a PDF, DOC, TXT, or other document and create a free file QR code. No signup, no watermark.',
    intro:
      'Upload PDF, Word, text, and similar files (or paste a lasting link). The QR opens the public download link — files are too large to embed inside a QR.',
    instructions: [
      'Upload PDF, DOC, DOCX, TXT, CSV, RTF, XLS, PPT (or paste a public https URL).',
      'Confirm the public link appears in the form.',
      'Customize colors and logo.',
      'Download PNG, SVG, or JPG — no watermark.',
    ],
    faqs: [
      {
        q: 'Which file types are supported?',
        a: 'PDF, DOC, DOCX, TXT, CSV, RTF, XLS/XLSX, PPT/PPTX, ODT, JSON, and XML — up to 25 MB per upload.',
      },
      {
        q: 'Can the PDF live inside the QR?',
        a: 'No. QR capacity is only a few KB. The QR encodes a public URL that opens or downloads the file.',
      },
      {
        q: 'Does an uploaded file QR expire?',
        a: 'The QR image itself does not expire. Temporary upload links last about 48 hours. For print, paste a permanent Drive or website URL.',
      },
    ],
  },
];

function toolPage(tool) {
  const base = '..';
  const pagePath = `/${tool.dir}/`;
  const crumbs = loadPartial('breadcrumbs.html').replaceAll('{{CRUMB}}', tool.h1);
  const faq = loadPartial('faq.html').replace('{{FAQ_ITEMS}}', faqItems(tool.faqs));
  const body = `${head({
    title: tool.title,
    description: tool.description,
    path: pagePath,
    base,
  })}
<body data-qr-type="${tool.id}" data-lock-type="true">
  <!-- include:header.html -->
  <main>
    <section class="site-container pt-8 sm:pt-12">
      ${crumbs}
      <div class="mt-6 max-w-3xl animate-rise-in">
        <p class="font-display text-4xl font-semibold tracking-tight text-ink-950 sm:text-5xl">EverQR</p>
        <h1 class="mt-3 text-2xl font-semibold tracking-tight text-ink-800 sm:text-3xl">${tool.h1}</h1>
        <p class="mt-3 max-w-2xl text-base text-ink-600 sm:text-lg">${tool.intro}</p>
        <div class="trust-row mt-5">
          <span>Free</span>
          <span>Private</span>
          <span>No watermark</span>
          <span>No signup</span>
        </div>
      </div>
    </section>
    ${generatorBlock({ lockType: true, showTypeSelect: true })}
    <section class="site-container py-12 grid gap-10 lg:grid-cols-2">
      <div class="panel p-6">
        <h2 class="section-title">How to use</h2>
        <ol class="mt-4 list-decimal space-y-2 pl-5 text-ink-700">
          ${tool.instructions.map((step) => `<li>${step}</li>`).join('\n')}
        </ol>
      </div>
      <div class="panel p-6">
        <h2 class="section-title">Privacy</h2>
        <p class="mt-4 text-ink-600 leading-relaxed">Static QR codes generated here do not expire and do not depend on our servers. The encoded destination or information must remain valid for the QR code to remain useful. Your inputs are processed in the browser for generation.</p>
      </div>
    </section>
    <section class="site-container pb-16">
      <h2 class="section-title">Frequently asked questions</h2>
      <div class="mt-6">${faq}</div>
      <div class="mt-10">
        <h2 class="text-lg font-semibold text-ink-950">Related tools</h2>
        <div class="mt-4"><!-- include:tool-grid.html --></div>
      </div>
    </section>
  </main>
  <!-- include:footer.html -->
  <div id="toast-host" class="toast-host" aria-live="polite"></div>
  <script src="${base}/assets/vendor/qr-code-styling/qr-code-styling.min.js" defer></script>
  <script type="module" src="${base}/assets/js/init.js"></script>
</body>
</html>`;
  return injectIncludes(body, base);
}

function homePage() {
  const base = '.';
  const body = `${head({
    title: 'EverQR — Free Permanent Private Unlimited QR Code Generator',
    description:
      'Free, permanent, private, unlimited QR code generator. No signup, no expiration, no watermark. Create static QR codes in your browser.',
    path: '/',
    base,
  })}
<body data-home="true" data-qr-type="url">
  <!-- include:header.html -->
  <main>
    <section class="site-container pt-10 sm:pt-16">
      <div class="max-w-4xl animate-rise-in">
        <h1 class="hero-brand">EverQR</h1>
        <p class="mt-5 max-w-xl text-xl font-medium tracking-tight text-ink-800 sm:text-2xl">Free. Permanent. Private. Unlimited.</p>
        <p class="mt-4 max-w-xl text-base leading-relaxed text-ink-600 sm:text-lg">Create beautiful static QR codes in your browser — no signup, no watermark, nothing stored on our servers.</p>
        <div class="trust-row mt-6">
          <span>No signup</span>
          <span>No expiration</span>
          <span>No watermark</span>
          <span>Unlimited</span>
        </div>
      </div>
    </section>
    ${generatorBlock({ lockType: false, showTypeSelect: true })}
    <section class="site-container py-6">
      <div class="grid gap-4 md:grid-cols-3">
        <article class="panel p-5">
          <p class="text-[11px] font-semibold uppercase tracking-[0.14em] text-brand-700">Private</p>
          <h3 class="mt-2 font-semibold text-ink-950">Processed on your device</h3>
          <p class="mt-2 text-sm leading-relaxed text-ink-600">Wi‑Fi passwords, contacts, and messages stay in the browser for generation.</p>
        </article>
        <article class="panel p-5">
          <p class="text-[11px] font-semibold uppercase tracking-[0.14em] text-brand-700">Permanent</p>
          <h3 class="mt-2 font-semibold text-ink-950">No server dependency</h3>
          <p class="mt-2 text-sm leading-relaxed text-ink-600">Static codes don’t expire because of us. Destinations must remain valid.</p>
        </article>
        <article class="panel p-5">
          <p class="text-[11px] font-semibold uppercase tracking-[0.14em] text-brand-700">Print-ready</p>
          <h3 class="mt-2 font-semibold text-ink-950">PNG, SVG, or JPG</h3>
          <p class="mt-2 text-sm leading-relaxed text-ink-600">Download high-quality files with your colors and logo — never a watermark.</p>
        </article>
      </div>
    </section>
    <section class="site-container py-14">
      <div class="flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <h2 class="section-title">All QR tools</h2>
          <p class="mt-2 muted">Every tool encodes information directly in the QR whenever possible.</p>
        </div>
      </div>
      <div class="mt-8"><!-- include:tool-grid.html --></div>
    </section>
  </main>
  <!-- include:footer.html -->
  <div id="toast-host" class="toast-host" aria-live="polite"></div>
  <script src="${base}/assets/vendor/qr-code-styling/qr-code-styling.min.js" defer></script>
  <script type="module" src="${base}/assets/js/init.js"></script>
</body>
</html>`;
  return injectIncludes(body, base);
}

function simplePage({ file, title, description, path: pagePath, heading, content, base = '.' }) {
  const body = `${head({ title, description, path: pagePath, base })}
<body>
  <!-- include:header.html -->
  <main class="site-container py-10 sm:py-14">
    <article class="mx-auto max-w-3xl">
      <h1 class="font-display text-3xl font-semibold tracking-tight text-ink-950 sm:text-4xl">${heading}</h1>
      <div class="prose-ever mt-6 space-y-4 text-ink-700 leading-relaxed">${content}</div>
    </article>
  </main>
  <!-- include:footer.html -->
  <script type="module" src="${base}/assets/js/init.js"></script>
</body>
</html>`;
  write(path.join(ROOT, file), injectIncludes(body, base));
}

function guidePage({ dir, title, description, heading, content }) {
  const base = '../..';
  const pagePath = `/guides/${dir}/`;
  const crumbs = loadPartial('breadcrumbs.html').replaceAll('{{CRUMB}}', heading);
  const body = `${head({ title, description, path: pagePath, base, type: 'guide' })}
<body>
  <!-- include:header.html -->
  <main class="site-container py-10 sm:py-14">
    ${crumbs}
    <article class="mx-auto mt-6 max-w-3xl">
      <h1 class="font-display text-3xl font-semibold tracking-tight text-ink-950 sm:text-4xl">${heading}</h1>
      <div class="mt-6 space-y-4 text-ink-700 leading-relaxed">${content}</div>
      <p class="mt-10"><a class="btn-primary" href="${base}/">Create a free QR code</a></p>
    </article>
  </main>
  <!-- include:footer.html -->
  <script type="module" src="${base}/assets/js/init.js"></script>
</body>
</html>`;
  write(path.join(ROOT, 'guides', dir, 'index.html'), injectIncludes(body, base));
}

const guides = [
  {
    dir: 'what-is-a-qr-code',
    title: 'What Is a QR Code? | EverQR Guides',
    heading: 'What is a QR code?',
    description: 'A plain-language explanation of QR codes and how they store information.',
    content: `<p>A QR (Quick Response) code is a two-dimensional barcode that stores data as a pattern of modules. Phone cameras and scanners read the pattern and decode the information instantly.</p><p>Unlike one-dimensional barcodes, QR codes can hold URLs, text, contact cards, Wi‑Fi credentials, and more — which is why they’re used on packaging, posters, restaurants, and business cards.</p>`,
  },
  {
    dir: 'how-qr-codes-work',
    title: 'How QR Codes Work | EverQR Guides',
    heading: 'How QR codes work',
    description: 'Learn how scanners read QR modules, finder patterns, and error correction.',
    content: `<p>QR codes use finder patterns (the three large corner squares) so scanners can locate and orient the code quickly. Data is encoded into the remaining modules with error correction so damaged codes can still scan.</p><p>When you create a static QR with EverQR, the payload is written directly into those modules in your browser.</p>`,
  },
  {
    dir: 'static-vs-dynamic-qr-codes',
    title: 'Static vs Dynamic QR Codes | EverQR Guides',
    heading: 'Static vs dynamic QR codes',
    description: 'Understand the difference between static and dynamic QR codes.',
    content: `<p><strong>Static QR codes</strong> encode the final content directly. After you download them, they don’t need our servers. <strong>Dynamic QR codes</strong> usually point to a short redirect URL you can edit later — useful for campaigns, but dependent on a service remaining online.</p><p>EverQR v1 focuses on static QR codes: free, private, and permanent with respect to our infrastructure.</p>`,
  },
  {
    dir: 'do-qr-codes-expire',
    title: 'Do QR Codes Expire? | EverQR Guides',
    heading: 'Do QR codes expire?',
    description: 'Clear answer on QR expiration for static codes generated with EverQR.',
    content: `<p>Static QR codes generated here do not expire and do not depend on our servers. The encoded destination or information must remain valid for the QR code to remain useful — for example, a website must stay online, or a phone number must still ring.</p>`,
  },
  {
    dir: 'qr-code-error-correction',
    title: 'QR Code Error Correction Levels | EverQR Guides',
    heading: 'QR code error correction',
    description: 'Choose L, M, Q, or H error correction for logos and print durability.',
    content: `<p>Error correction lets scanners recover data if part of the QR is dirty, covered by a logo, or lightly damaged. Levels L, M, Q, and H trade capacity for resilience. Use <strong>H</strong> when adding a logo or printing small.</p>`,
  },
  {
    dir: 'qr-code-size-guide',
    title: 'QR Code Size Guide | EverQR Guides',
    heading: 'QR code size guide',
    description: 'Recommended QR sizes for print, packaging, posters, and screens.',
    content: `<p>As a rule of thumb, printed QR codes should be at least 2 × 2 cm (about 0.8 × 0.8 in) for short URLs, and larger for complex payloads or long scanning distances. Test with a real phone before a large print run.</p>`,
  },
  {
    dir: 'qr-code-printing-guide',
    title: 'QR Code Printing Guide | EverQR Guides',
    heading: 'QR code printing guide',
    description: 'Print QR codes that scan reliably — contrast, quiet zone, and materials.',
    content: `<p>Maintain strong contrast, keep the quiet zone (margin) clear, avoid distorting the code, and prefer matte finishes over heavy gloss glare. SVG downloads scale cleanly for professional print.</p>`,
  },
  {
    dir: 'qr-code-best-practices',
    title: 'QR Code Best Practices | EverQR Guides',
    heading: 'QR code best practices',
    description: 'Practical tips for designing QR codes people will actually scan.',
    content: `<p>Tell people what happens when they scan, place codes at comfortable heights, keep designs scannable, and test on multiple devices. Don’t bury critical CTAs behind a QR without a fallback URL when appropriate.</p>`,
  },
  {
    dir: 'qr-code-security',
    title: 'QR Code Security | EverQR Guides',
    heading: 'QR code security',
    description: 'Stay safe with QR codes — verify destinations and avoid risky scans.',
    content: `<p>QR codes are only as trustworthy as their content. Preview URLs when your device allows it, be cautious with unexpected codes in public places, and never encode secrets you wouldn’t print on paper.</p>`,
  },
  {
    dir: 'qr-code-for-business',
    title: 'QR Codes for Business | EverQR Guides',
    heading: 'QR codes for business',
    description: 'Business use cases for static QR codes — packaging, cards, and signage.',
    content: `<p>Businesses use QR codes for menus, product info, support links, Wi‑Fi, reviews, and contact cards. Static codes are ideal when the destination is stable and you want zero dependency on a QR vendor after printing.</p>`,
  },
  {
    dir: 'qr-code-for-restaurants',
    title: 'QR Codes for Restaurants | EverQR Guides',
    heading: 'QR codes for restaurants',
    description: 'Menus, Wi‑Fi, and review QR ideas for restaurants and cafes.',
    content: `<p>Restaurants commonly use QR codes for menus, Wi‑Fi access, and Google reviews. Keep table tents clean, high contrast, and easy to scan in low light.</p>`,
  },
  {
    dir: 'qr-code-for-wifi',
    title: 'Wi‑Fi QR Codes Guide | EverQR Guides',
    heading: 'QR codes for Wi‑Fi',
    description: 'How Wi‑Fi QR codes work and how to share guest access safely.',
    content: `<p>A Wi‑Fi QR encodes SSID, security type, and password in a standard format many phones understand. Prefer a guest network when sharing access publicly, and reprint if you rotate passwords.</p>`,
  },
  {
    dir: 'qr-code-for-google-reviews',
    title: 'Google Review QR Codes | EverQR Guides',
    heading: 'QR codes for Google reviews',
    description: 'Collect more Google reviews with a simple printable QR code.',
    content: `<p>Place a Google review QR at checkout, on receipts, or near exits. Make sure your Google Business link is correct, then generate a static QR so customers can leave feedback in seconds.</p>`,
  },
  {
    dir: 'qr-code-with-logo',
    title: 'QR Codes with Logos | EverQR Guides',
    heading: 'QR codes with logos',
    description: 'Add a logo without breaking scan reliability — ECC and size tips.',
    content: `<p>Logos should stay relatively small, keep high error correction (H), and preserve enough contrast. Always scan-test after adding branding.</p>`,
  },
];

function savedDesignsPage() {
  const base = '..';
  const body = `${head({
    title: 'Saved Designs — Local QR Projects | EverQR',
    description: 'Open, rename, duplicate, and delete QR designs saved locally in your browser.',
    path: '/saved-designs/',
    base,
  })}
<body>
  <!-- include:header.html -->
  <main class="site-container py-10 sm:py-14">
    <h1 class="font-display text-3xl font-semibold text-ink-950">Saved designs</h1>
    <p class="mt-2 max-w-2xl text-ink-600">Designs are stored in this browser with IndexedDB. Nothing is uploaded to an EverQR account — there isn’t one.</p>
    <div id="saved-designs-root" class="mt-8 grid gap-3"></div>
  </main>
  <!-- include:footer.html -->
  <div id="toast-host" class="toast-host" aria-live="polite"></div>
  <script type="module" src="${base}/assets/js/pages/saved-designs.js"></script>
</body>
</html>`;
  write(path.join(ROOT, 'saved-designs/index.html'), injectIncludes(body, base));
}

function main() {
  write(path.join(ROOT, 'index.html'), homePage());
  for (const tool of TOOLS) {
    write(path.join(ROOT, tool.dir, 'index.html'), toolPage(tool));
  }

  simplePage({
    file: 'about.html',
    title: 'About EverQR',
    description: 'EverQR is a free, private, static QR code generator that runs in your browser.',
    path: '/about.html',
    heading: 'About EverQR',
    content: `<p>EverQR helps anyone create free, permanent, private, unlimited static QR codes — no signup, no watermark, no expiration on our side.</p><p>We built the product around browser-side generation so your content doesn’t need to travel to our servers just to become a QR code.</p>`,
  });

  simplePage({
    file: 'privacy-policy.html',
    title: 'Privacy Policy | EverQR',
    description: 'How EverQR handles privacy for client-side QR generation.',
    path: '/privacy-policy.html',
    heading: 'Privacy policy',
    content: `<p>EverQR is designed so normal static QR generation happens in your browser. We do not require an account, and we do not need your QR payloads on a server to create PNG, SVG, or JPG downloads.</p><p>LocalStorage and IndexedDB may store preferences and saved designs on your device only. If analytics are enabled in a future release, they must never include QR payload content.</p><p>Contact: hello@everqr.app</p>`,
  });

  simplePage({
    file: 'terms.html',
    title: 'Terms of Use | EverQR',
    description: 'Terms for using the EverQR static QR code generator.',
    path: '/terms.html',
    heading: 'Terms of use',
    content: `<p>EverQR is provided free of charge for lawful use. You are responsible for the content you encode and for complying with applicable laws.</p><p>Static QR codes do not expire because of EverQR, but third-party destinations may change. The service is provided “as is” without warranties.</p>`,
  });

  simplePage({
    file: 'disclaimer.html',
    title: 'Disclaimer | EverQR',
    description: 'Important technical disclaimer about static QR permanence.',
    path: '/disclaimer.html',
    heading: 'Disclaimer',
    content: `<p>Static QR codes generated here do not expire and do not depend on our servers. The encoded destination or information must remain valid for the QR code to remain useful.</p>`,
  });

  simplePage({
    file: 'contact.html',
    title: 'Contact | EverQR',
    description: 'Contact EverQR support.',
    path: '/contact.html',
    heading: 'Contact',
    content: `<p>Email us at <a class="text-brand-800 underline" href="mailto:hello@everqr.app">hello@everqr.app</a>. We don’t require accounts, so include enough detail for us to help.</p>`,
  });

  simplePage({
    file: 'faq.html',
    title: 'FAQ | EverQR',
    description: 'Frequently asked questions about EverQR static QR codes.',
    path: '/faq.html',
    heading: 'Frequently asked questions',
    content: `<p><strong>Is EverQR really free?</strong> Yes — unlimited static QR generation with no watermark.</p><p><strong>Do I need to sign up?</strong> No.</p><p><strong>Do QR codes expire?</strong> Static codes generated here do not expire and do not depend on our servers. External destinations must remain valid.</p>`,
  });

  simplePage({
    file: 'accessibility.html',
    title: 'Accessibility | EverQR',
    description: 'EverQR accessibility commitments.',
    path: '/accessibility.html',
    heading: 'Accessibility',
    content: `<p>We aim for semantic HTML, keyboard access, visible focus, labeled forms, and sufficient contrast. If you hit a barrier, email hello@everqr.app.</p>`,
  });

  simplePage({
    file: 'security.html',
    title: 'Security | EverQR',
    description: 'Security practices for the EverQR client-side generator.',
    path: '/security.html',
    heading: 'Security',
    content: `<p>We sanitize user-controlled text before HTML insertion, validate URLs and uploads, keep dependencies minimal, and avoid executing imported project JSON as code.</p>`,
  });

  simplePage({
    file: 'changelog.html',
    title: 'Changelog | EverQR',
    description: 'Product changelog for EverQR.',
    path: '/changelog.html',
    heading: 'Changelog',
    content: `<p><strong>v1.0.0</strong> — Initial release with URL, Text, Wi‑Fi, WhatsApp, Google Review, vCard, Email, SMS, Phone, and Location generators; live preview; PNG/SVG/JPG export; local saved designs.</p>`,
  });

  simplePage({
    file: '404.html',
    title: 'Page not found | EverQR',
    description: 'The page you requested could not be found.',
    path: '/404.html',
    heading: 'Page not found',
    content: `<p>That link doesn’t exist. <a class="text-brand-800 underline" href="./">Return home</a> to create a QR code.</p>`,
  });

  simplePage({
    file: 'offline.html',
    title: 'Offline | EverQR',
    description: 'You appear to be offline.',
    path: '/offline.html',
    heading: 'You are offline',
    content: `<p>Reconnect to load the latest assets. Saved designs already on this device may still be available when you return online.</p>`,
  });

  // Guides index
  const guidesIndex = `${head({
    title: 'QR Code Guides | EverQR',
    description: 'Practical guides on QR codes, printing, security, and business use cases.',
    path: '/guides/',
    base: '..',
  })}
<body>
  <!-- include:header.html -->
  <main class="site-container py-10 sm:py-14">
    <h1 class="font-display text-3xl font-semibold text-ink-950">Guides</h1>
    <p class="mt-2 text-ink-600">Clear, practical articles — written for humans, not keyword stuffing.</p>
    <ul class="mt-8 grid gap-3 sm:grid-cols-2">
      ${guides
        .map(
          (g) =>
            `<li><a class="panel block p-4 hover:border-brand-300" href="./${g.dir}/"><span class="font-semibold text-ink-900">${g.heading}</span></a></li>`
        )
        .join('\n')}
    </ul>
  </main>
  <!-- include:footer.html -->
  <script type="module" src="../assets/js/init.js"></script>
</body>
</html>`;
  write(path.join(ROOT, 'guides/index.html'), injectIncludes(guidesIndex, '..'));

  for (const g of guides) guidePage(g);
  savedDesignsPage();

  // templates index stub
  const templates = `${head({
    title: 'QR Templates | EverQR',
    description: 'Starting points for business, restaurant, Wi‑Fi, review, and social QR designs.',
    path: '/templates/',
    base: '..',
  })}
<body>
  <!-- include:header.html -->
  <main class="site-container py-10">
    <h1 class="font-display text-3xl font-semibold">Templates</h1>
    <p class="mt-2 text-ink-600">Use the generator presets for now — curated template packs expand in a later release.</p>
    <p class="mt-6"><a class="btn-primary" href="../">Open generator</a></p>
  </main>
  <!-- include:footer.html -->
  <script type="module" src="../assets/js/init.js"></script>
</body>
</html>`;
  write(path.join(ROOT, 'templates/index.html'), injectIncludes(templates, '..'));

  console.log(`Generated home + ${TOOLS.length} tool pages + ${guides.length} guides.`);
}

main();
