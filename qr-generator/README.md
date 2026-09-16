# EverQR

Free, permanent, private, unlimited static QR code generator — **no signup, no expiration, no watermark**.

## Stack

- HTML5 static pages
- Tailwind CSS (compiled)
- Vanilla JavaScript (ES modules)
- Client-side QR generation via vendored `qr-code-styling`
- LocalStorage + IndexedDB for preferences and saved designs

No React/Vue/Angular, no backend framework, no accounts, no server-side QR processing.

## Quick start

```bash
npm install
npm run build
npx serve .
```


Open the local URL and use the homepage generator.

## Scripts

| Command | Purpose |
| --- | --- |
| `npm run build` | Generate pages, compile Tailwind, sitemap, robots |
| `npm run build:css` | Tailwind only |
| `npm run build:pages` | Regenerate HTML from partials/templates |
| `npm test` | Unit tests for payloads and validation |
| `npm run dev:css` | Watch Tailwind |

## Architecture

```
Generator form → payload formatter → validator → QR engine → live renderer → export
```

Individual generators under `assets/js/generators/` only build payloads. Rendering and export stay in `assets/js/core/`.

## Privacy

Static QR content is processed in the browser. EverQR does not need your Wi‑Fi passwords, messages, or logos on a server to generate downloads.

> Static QR codes generated here do not expire and do not depend on our servers. The encoded destination or information must remain valid for the QR code to remain useful.

## License

MIT — see `LICENSE`. Vendor licenses are under `assets/vendor/licenses/`.
