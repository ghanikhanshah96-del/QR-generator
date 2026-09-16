function normalizePath(pathname) {
  const cleaned = String(pathname || '')
    .replace(/index\.html$/i, '')
    .replace(/\/+$/, '');
  return cleaned || '/';
}

function linkPath(href) {
  try {
    return normalizePath(new URL(href, window.location.href).pathname);
  } catch {
    return normalizePath(href);
  }
}

export function initNavbar() {
  const current = normalizePath(window.location.pathname);
  let onTypePage = false;

  document.querySelectorAll('[data-nav]').forEach((link) => {
    const href = link.getAttribute('href') || '';
    const target = linkPath(href);
    const isHome = target === '/';
    const match = isHome
      ? current === '/'
      : current === target || current.startsWith(`${target}/`);

    if (match) {
      link.setAttribute('aria-current', 'page');
      if (link.hasAttribute('data-nav-type')) onTypePage = true;
    } else {
      link.removeAttribute('aria-current');
    }
  });

  const typesBtn = document.querySelector('[data-nav-types]');
  if (typesBtn) {
    if (onTypePage) typesBtn.setAttribute('aria-current', 'page');
    else typesBtn.removeAttribute('aria-current');
  }
}
