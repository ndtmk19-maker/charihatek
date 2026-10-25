/**
 * Text and Typography Layout Helpers for PptxGenJS Export
 * Handles Arabic RTL alignment, cross-platform font fallbacks, and safe margin offsets.
 */

export const FONT_CONFIG = {
  // Cross-platform safe font list: PowerPoint uses local fonts; Cairo + Arial/Calibri
  headerFontArabic: 'Cairo',
  bodyFontArabic: 'Cairo',
  headerFontLatin: 'Arial',
  bodyFontLatin: 'Calibri'
};

/**
 * Returns text alignment depending on language / direction
 */
export function getTextAlignment(isRtl) {
  return isRtl ? 'right' : 'left';
}

/**
 * Returns safe font family string for PowerPoint text boxes
 */
export function getFontFamily(isRtl) {
  return isRtl ? FONT_CONFIG.bodyFontArabic : FONT_CONFIG.bodyFontLatin;
}

/**
 * Strips hash `#` from hex color for PptxGenJS compatibility
 */
export function cleanHexColor(hex, fallback = '000000') {
  if (!hex) return fallback;
  return String(hex).replace('#', '').trim().toUpperCase();
}
