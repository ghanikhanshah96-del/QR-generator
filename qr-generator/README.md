# EverQR

Free, permanent, private, unlimited static QR code generator — **no signup, no expiration, no watermark**.

## Stack

- [Next.js](https://nextjs.org/) (App Router, static export)
- Tailwind CSS
- Client-side QR generation via `qr-code-styling`
- LocalStorage + IndexedDB for preferences and saved designs

No accounts, no server-side QR processing. Generation stays in the browser.

## Quick start

```bash
npm install
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

## Scripts

| Command | Purpose |
| --- | --- |
| `npm run dev` | Next.js development server |
| `npm run build` | Static export to `out/` |
| `npm start` | Serve the production build (Node) |

## Architecture

```
Generator form → payload formatter → validator → QR engine → live renderer → export
```

Generators under `lib/generators/` only build payloads. Rendering and export stay in `lib/core/`. The UI shell lives in `app/` and `components/`; `components/GeneratorApp.jsx` boots the client generator.

## Privacy

Static QR content is processed in the browser. EverQR does not need your Wi‑Fi passwords, messages, or logos on a server to generate downloads.

> Static QR codes generated here do not expire and do not depend on our servers. The encoded destination or information must remain valid for the QR code to remain useful.

## License

MIT — see `LICENSE`.
