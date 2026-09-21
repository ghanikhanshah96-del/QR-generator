export function initAccordion(root = document) {
  root.querySelectorAll('[data-accordion]').forEach((acc) => {
    const buttons = acc.querySelectorAll('[data-accordion-trigger]');
    buttons.forEach((btn) => {
      btn.addEventListener('click', () => {
        const expanded = btn.getAttribute('aria-expanded') === 'true';
        const panelId = btn.getAttribute('aria-controls');
        const panel = panelId ? document.getElementById(panelId) : null;
        btn.setAttribute('aria-expanded', String(!expanded));
        if (panel) panel.hidden = expanded;
      });
    });
  });
}
