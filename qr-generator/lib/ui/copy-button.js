import { copyText } from '../utils/clipboard.js';
import { createToast } from './toast.js';

export function initCopyButtons(root = document) {
  const toast = createToast();
  root.querySelectorAll('[data-copy]').forEach((btn) => {
    btn.addEventListener('click', async () => {
      const value = btn.getAttribute('data-copy') || '';
      try {
        await copyText(value);
        toast.show('Copied to clipboard', { tone: 'success' });
      } catch {
        toast.show('Could not copy', { tone: 'error' });
      }
    });
  });
}
