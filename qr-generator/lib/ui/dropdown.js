export function initDropdowns(root = document) {
  root.querySelectorAll('[data-dropdown]').forEach((wrap) => {
    const btn = wrap.querySelector('[data-dropdown-trigger]');
    const menu = wrap.querySelector('[data-dropdown-menu]');
    if (!btn || !menu) return;

    const close = () => {
      menu.hidden = true;
      btn.setAttribute('aria-expanded', 'false');
    };
    const open = () => {
      menu.hidden = false;
      btn.setAttribute('aria-expanded', 'true');
    };

    btn.addEventListener('click', () => {
      if (menu.hidden) open();
      else close();
    });
    document.addEventListener('click', (e) => {
      if (!wrap.contains(e.target)) close();
    });
    document.addEventListener('keydown', (e) => {
      if (e.key === 'Escape') close();
    });
    close();
  });
}
