/**
 * Shell UI helpers — call explicitly from React; do not auto-boot on import.
 */
import { initNavbar } from './ui/navbar.js';
import { initMobileMenu } from './ui/mobile-menu.js';
import { initAccordion } from './ui/accordion.js';
import { initTabs } from './ui/tabs.js';
import { initDropdowns } from './ui/dropdown.js';
import { initTheme } from './ui/theme.js';

export function initShell() {
  initTheme();
  initNavbar();
  initMobileMenu();
  initAccordion();
  initTabs();
  initDropdowns();
}
