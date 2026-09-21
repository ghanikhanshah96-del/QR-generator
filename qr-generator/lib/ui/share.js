import { shareFile } from '../core/qr-share.js';
import { createToast } from './toast.js';

export function initShareUi() {
  const toast = createToast();
  document.querySelectorAll('[data-share-qr]').forEach((btn) => {
    btn.addEventListener('click', async () => {
      toast.show('Use Download, then share the file from your device.', { tone: 'info' });
    });
  });
  return { shareFile, toast };
}
