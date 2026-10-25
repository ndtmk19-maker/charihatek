/**
 * Contextual Layout Selector
 * Unifies domain visual theme, slide content type, and local asset coordinates.
 */

import { SLIDE_TYPES } from '../classifier/content-type-classifier.js';
import { findAssetForSlide } from '../design/asset-manifest.js';
import { getActiveTheme } from '../design/theme-manager.js';

/**
 * Standard 16:9 Widescreen presentation dimensions in inches (PptxGenJS default: 10 x 5.625)
 */
export const SLIDE_DIMENSIONS = {
  width: 10.0,
  height: 5.625,
  safeMarginX: 0.8,
  safeMarginY: 0.6
};

/**
 * Enriches a slide descriptor with layout styling, geometric boxes, and assets
 * @param {Object} slide - Raw slide descriptor from slide splitter
 * @param {string} domain - Active or detected domain
 * @param {Object} theme - Active theme variant
 * @returns {Object} Fully resolved layout model ready for preview and PPTX export
 */
export function resolveSlideLayout(slide, domain, theme = null) {
  const activeTheme = theme || getActiveTheme();
  const type = slide.type || SLIDE_TYPES.EXPLANATION;
  const isRtl = (slide.language || 'ar') === 'ar';

  // Find suitable local visual asset
  const asset = findAssetForSlide(domain, type, [type, ...(slide.tags || [])]);

  // Base layout model
  const resolved = {
    ...slide,
    theme: activeTheme,
    asset,
    isRtl,
    layoutName: `${domain}_${type}`,
    // Common geometry blocks
    geometry: calculateGeometryForType(type, isRtl)
  };

  return resolved;
}

/**
 * Computes exact coordinate blocks for PPTX text/shapes/charts (16:9 scale)
 */
function calculateGeometryForType(type, isRtl) {
  const W = SLIDE_DIMENSIONS.width;
  const H = SLIDE_DIMENSIONS.height;

  switch (type) {
    case SLIDE_TYPES.COVER:
      return {
        header: { x: 0, y: 0, w: W, h: 0.15 },
        titleBox: { x: 1.0, y: 1.3, w: W - 2.0, h: 1.6 },
        metaBox: { x: 1.2, y: 3.1, w: W - 2.4, h: 1.8 },
        footer: { x: 0, y: H - 0.35, w: W, h: 0.35 }
      };

    case SLIDE_TYPES.SECTION_DIVIDER:
      return {
        accentBand: { x: 0, y: 0, w: 0.35, h: H },
        badgeBox: { x: 1.2, y: 1.6, w: 3.0, h: 0.6 },
        titleBox: { x: 1.2, y: 2.3, w: W - 2.4, h: 1.8 }
      };

    case SLIDE_TYPES.COMPARISON:
      return {
        header: { x: 0.8, y: 0.5, w: W - 1.6, h: 0.8 },
        colA: { x: isRtl ? 5.2 : 0.8, y: 1.5, w: 4.0, h: 3.4 },
        colB: { x: isRtl ? 0.8 : 5.2, y: 1.5, w: 4.0, h: 3.4 },
        footer: { x: 0.8, y: H - 0.5, w: W - 1.6, h: 0.3 }
      };

    case SLIDE_TYPES.STATISTICS:
      return {
        header: { x: 0.8, y: 0.5, w: W - 1.6, h: 0.8 },
        cardsBox: { x: 0.8, y: 1.4, w: W - 1.6, h: 1.3 },
        chartOrDetails: { x: 0.8, y: 2.9, w: W - 1.6, h: 2.0 },
        footer: { x: 0.8, y: H - 0.5, w: W - 1.6, h: 0.3 }
      };

    case SLIDE_TYPES.PROCESS_STEPS:
      return {
        header: { x: 0.8, y: 0.5, w: W - 1.6, h: 0.8 },
        stepsBox: { x: 0.8, y: 1.6, w: W - 1.6, h: 3.2 },
        footer: { x: 0.8, y: H - 0.5, w: W - 1.6, h: 0.3 }
      };

    default: // EXPLANATION, BULLETS, DEFINITION, CONCLUSION, REFERENCES
      return {
        header: { x: 0.8, y: 0.5, w: W - 1.6, h: 0.8 },
        content: { x: isRtl ? 2.8 : 0.8, y: 1.5, w: 6.4, h: 3.3 },
        sideAsset: { x: isRtl ? 0.8 : 7.4, y: 1.8, w: 1.8, h: 2.4 },
        footer: { x: 0.8, y: H - 0.5, w: W - 1.6, h: 0.3 }
      };
  }
}
