export function initMobileMenu() {
  const btn = document.getElementById('mobile-menu-button');
  const panel = document.getElementById('mobile-menu');
  if (!btn || !panel) return;

  const setOpen = (open) => {
    panel.hidden = !open;
    btn.setAttribute('aria-expanded', String(open));
    document.body.classList.toggle('overflow-hidden', open);
  };

  btn.addEventListener('click', () => {
    setOpen(panel.hidden);
  });

  panel.querySelectorAll('a').forEach((link) => {
    link.addEventListener('click', () => setOpen(false));
  });

  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') setOpen(false);
  });

  setOpen(false);
}
