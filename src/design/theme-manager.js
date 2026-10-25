/**
 * Theme Manager
 * Coordinates theme switching, CSS custom properties injection, and typography.
 */

import { THEME_VARIANTS, getDefaultVariantForDomain } from './domain-themes.js';

let currentTheme = THEME_VARIANTS['econ-trend'];

export function getActiveTheme() {
  return currentTheme;
}

export function setActiveTheme(themeIdOrDomain) {
  let theme = THEME_VARIANTS[themeIdOrDomain];
  if (!theme) {
    theme = getDefaultVariantForDomain(themeIdOrDomain);
  }
  if (!theme) {
    theme = THEME_VARIANTS['econ-trend'];
  }
  currentTheme = theme;
  applyThemeToDOM(theme);
  return theme;
}

/**
 * Injects CSS variables into document root for preview and UI
 */
export function applyThemeToDOM(theme) {
  const root = document.documentElement;
  root.style.setProperty('--theme-primary', theme.primary);
  root.style.setProperty('--theme-secondary', theme.secondary);
  root.style.setProperty('--theme-accent', theme.accent);
  root.style.setProperty('--theme-bg', theme.background);
  root.style.setProperty('--theme-surface', theme.surface);
  root.style.setProperty('--theme-text-primary', theme.textPrimary);
  root.style.setProperty('--theme-text-secondary', theme.textSecondary);
  root.style.setProperty('--theme-border', theme.border);
  root.style.setProperty('--theme-header-bg', theme.headerBg);
  root.style.setProperty('--theme-header-text', theme.headerText);
  root.style.setProperty('--font-header', theme.fontHeader || 'Cairo, sans-serif');
  root.style.setProperty('--font-body', theme.fontBody || 'Cairo, sans-serif');
}
