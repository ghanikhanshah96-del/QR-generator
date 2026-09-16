export function initTabs(root = document) {
  root.querySelectorAll('[data-tabs]').forEach((tabs) => {
    const triggers = [...tabs.querySelectorAll('[data-tab]')];
    const panels = [...tabs.querySelectorAll('[data-tab-panel]')];

    function activate(id) {
      triggers.forEach((t) => {
        const on = t.getAttribute('data-tab') === id;
        t.setAttribute('aria-selected', String(on));
        t.classList.toggle('bg-brand-50', on);
        t.classList.toggle('text-brand-800', on);
      });
      panels.forEach((p) => {
        p.hidden = p.getAttribute('data-tab-panel') !== id;
      });
    }

    triggers.forEach((t) => {
      t.addEventListener('click', () => activate(t.getAttribute('data-tab')));
    });

    const initial = triggers.find((t) => t.getAttribute('aria-selected') === 'true') || triggers[0];
    if (initial) activate(initial.getAttribute('data-tab'));
  });
}
