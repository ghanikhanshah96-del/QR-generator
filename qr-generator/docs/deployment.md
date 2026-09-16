# Deployment

1. Set `SITE.url` in `assets/js/config.js` and regenerate pages if needed
2. `npm run build`
3. Host the repository root as a static site (Netlify, Cloudflare Pages, S3, nginx, etc.)
4. Ensure `/url-qr-code/` style directories resolve to `index.html`
5. Serve over HTTPS
