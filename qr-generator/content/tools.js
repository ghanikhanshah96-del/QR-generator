export const TOOLS = [
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

export function getToolByDir(dir) {
  return TOOLS.find((tool) => tool.dir === dir) ?? null;
}

export function getToolById(id) {
  return TOOLS.find((tool) => tool.id === id) ?? null;
}
