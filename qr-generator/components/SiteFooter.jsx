import Link from 'next/link';

export default function SiteFooter() {
  const year = new Date().getFullYear();

  return (
    <footer className="mt-24 border-t border-ink-200/70 bg-ink-950 text-ink-200">
      <div className="site-container grid gap-10 py-14 md:grid-cols-4">
        <div className="space-y-4 md:col-span-1">
          <p className="font-display text-2xl font-semibold text-white">EverQR</p>
          <p className="text-sm leading-relaxed text-ink-300">
            Free, permanent, private, unlimited static QR codes. No signup. No watermark. Generated in your browser.
          </p>
        </div>
        <div>
          <p className="text-sm font-semibold text-white">Tools</p>
          <ul className="mt-4 space-y-2 text-sm text-ink-300">
            <li>
              <Link className="hover:text-brand-300" href="/url-qr-code/">
                URL QR
              </Link>
            </li>
            <li>
              <Link className="hover:text-brand-300" href="/wifi-qr-code/">
                WiFi QR
              </Link>
            </li>
            <li>
              <Link className="hover:text-brand-300" href="/vcard-qr-code/">
                vCard QR
              </Link>
            </li>
            <li>
              <Link className="hover:text-brand-300" href="/whatsapp-qr-code/">
                WhatsApp QR
              </Link>
            </li>
            <li>
              <Link className="hover:text-brand-300" href="/google-review-qr-code/">
                Google Review QR
              </Link>
            </li>
            <li>
              <Link className="hover:text-brand-300" href="/phone-number-qr-code/">
                Phone Number QR
              </Link>
            </li>
            <li>
              <Link className="hover:text-brand-300" href="/image-to-qr-code/">
                Image to QR
              </Link>
            </li>
            <li>
              <Link className="hover:text-brand-300" href="/video-to-qr-code/">
                Video to QR
              </Link>
            </li>
            <li>
              <Link className="hover:text-brand-300" href="/file-qr-code/">
                File QR
              </Link>
            </li>
          </ul>
        </div>
        <div>
          <p className="text-sm font-semibold text-white">Learn</p>
          <ul className="mt-4 space-y-2 text-sm text-ink-300">
            <li>
              <Link className="hover:text-brand-300" href="/guides/what-is-a-qr-code/">
                What is a QR code?
              </Link>
            </li>
            <li>
              <Link className="hover:text-brand-300" href="/guides/static-vs-dynamic-qr-codes/">
                Static vs dynamic
              </Link>
            </li>
            <li>
              <Link className="hover:text-brand-300" href="/guides/do-qr-codes-expire/">
                Do QR codes expire?
              </Link>
            </li>
            <li>
              <Link className="hover:text-brand-300" href="/guides/qr-code-security/">
                QR security
              </Link>
            </li>
            <li>
              <Link className="hover:text-brand-300" href="/faq.html/">
                FAQ
              </Link>
            </li>
          </ul>
        </div>
        <div>
          <p className="text-sm font-semibold text-white">Company</p>
          <ul className="mt-4 space-y-2 text-sm text-ink-300">
            <li>
              <Link className="hover:text-brand-300" href="/about.html/">
                About
              </Link>
            </li>
            <li>
              <Link className="hover:text-brand-300" href="/privacy-policy.html/">
                Privacy
              </Link>
            </li>
            <li>
              <Link className="hover:text-brand-300" href="/terms.html/">
                Terms
              </Link>
            </li>
            <li>
              <Link className="hover:text-brand-300" href="/accessibility.html/">
                Accessibility
              </Link>
            </li>
            <li>
              <Link className="hover:text-brand-300" href="/contact.html/">
                Contact
              </Link>
            </li>
          </ul>
        </div>
      </div>
      <div className="border-t border-white/10">
        <div className="site-container flex flex-col gap-2 py-6 text-xs text-ink-400 sm:flex-row sm:items-center sm:justify-between">
          <p>© {year} EverQR. Static QR codes do not expire and do not depend on our servers.</p>
          <p className="text-brand-300">No signup · No watermark · Unlimited</p>
        </div>
      </div>
    </footer>
  );
}
