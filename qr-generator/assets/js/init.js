import { initNavbar } from './ui/navbar.js';
import { initMobileMenu } from './ui/mobile-menu.js';
import { initAccordion } from './ui/accordion.js';
import { initTabs } from './ui/tabs.js';
import { initDropdowns } from './ui/dropdown.js';
import { initTheme } from './ui/theme.js';
import { bootGenerator } from './app.js';

export function initShell() {
  initTheme();
  initNavbar();
  initMobileMenu();
  initAccordion();
  initTabs();
  initDropdowns();
}

export function initPage() {
  initShell();
  const generatorRoot = document.getElementById('generator-app');
  if (generatorRoot) {
    const lockType = document.body.dataset.lockType === 'true';
    const initialType = document.body.dataset.qrType || undefined;
    bootGenerator({ initialType, lockType });
  }
}

if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', initPage);
} else {
  initPage();
}
