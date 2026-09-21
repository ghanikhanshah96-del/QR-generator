export function createToast(host = document.getElementById('toast-host')) {
  if (!host) {
    host = document.createElement('div');
    host.id = 'toast-host';
    host.className = 'toast-host';
    host.setAttribute('aria-live', 'polite');
    document.body.appendChild(host);
  }

  return {
    show(message, { tone = 'info', timeout = 3200 } = {}) {
      const el = document.createElement('div');
      el.className = 'toast';
      el.setAttribute('role', 'status');
      if (tone === 'error') el.classList.add('border-red-200', 'text-red-800');
      if (tone === 'success') el.classList.add('border-brand-200', 'text-brand-900');
      el.textContent = message;
      host.appendChild(el);
      setTimeout(() => {
        el.remove();
      }, timeout);
    },
  };
}
