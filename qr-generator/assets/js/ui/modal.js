export function createModal(root) {
  if (!root) return null;
  const dialog = root;
  const closeBtns = dialog.querySelectorAll('[data-modal-close]');

  function open() {
    dialog.hidden = false;
    dialog.setAttribute('aria-hidden', 'false');
    const focusable = dialog.querySelector('button, [href], input, select, textarea');
    focusable?.focus();
  }

  function close() {
    dialog.hidden = true;
    dialog.setAttribute('aria-hidden', 'true');
  }

  closeBtns.forEach((btn) => btn.addEventListener('click', close));
  dialog.addEventListener('click', (e) => {
    if (e.target === dialog) close();
  });
  document.addEventListener('keydown', (e) => {
    if (!dialog.hidden && e.key === 'Escape') close();
  });

  return { open, close };
}
