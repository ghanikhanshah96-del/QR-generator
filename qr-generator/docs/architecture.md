# Architecture

EverQR is a static, client-side QR platform.

## Flow

1. User selects a QR type and fills a form
2. Generator module builds a validated payload string
3. `qr-state` stores fields + design
4. `qr-engine` maps design → `qr-code-styling` options
5. `qr-renderer` updates the live preview
6. Export modules download PNG / SVG / JPG locally

## Persistence

- LocalStorage: theme, recent type, editor prefs
- IndexedDB: saved designs

## Non-goals (v1)

Dynamic redirects, accounts, scan analytics, payments, server databases.
