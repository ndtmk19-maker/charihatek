/**
 * Layout Rules and Capacity Constraints for Academic Slides
 * Calibrated for standard 16:9 widescreen presentation dimensions.
 */

export const DENSITY_MODES = {
  COMPACT: 'compact',     // Higher density, fewer slides
  STANDARD: 'standard',   // Balanced readability (default)
  DETAILED: 'detailed'    // Lower density, more slides, larger font sizes
};

export const CAPACITY_BUDGETS = {
  [DENSITY_MODES.COMPACT]: {
    maxCharsPerSlide: 1100,
    maxParagraphsPerSlide: 3,
    maxCharsPerParagraph: 450,
    maxBulletsPerSlide: 7,
    maxStepsPerSlide: 5,
    maxStatsPerSlide: 4,
    maxTableRowsPerSlide: 7,
    fontScale: 0.95
  },
  [DENSITY_MODES.STANDARD]: {
    maxCharsPerSlide: 850,
    maxParagraphsPerSlide: 2,
    maxCharsPerParagraph: 360,
    maxBulletsPerSlide: 5,
    maxStepsPerSlide: 4,
    maxStatsPerSlide: 3,
    maxTableRowsPerSlide: 5,
    fontScale: 1.0
  },
  [DENSITY_MODES.DETAILED]: {
    maxCharsPerSlide: 580,
    maxParagraphsPerSlide: 1,
    maxCharsPerParagraph: 260,
    maxBulletsPerSlide: 4,
    maxStepsPerSlide: 3,
    maxStatsPerSlide: 2,
    maxTableRowsPerSlide: 4,
    fontScale: 1.15
  }
};

/**
 * Calculates estimated text height / weight index for overflow detection
 */
export function estimateTextWeight(text = '', isBullet = false) {
  if (!text) return 0;
  const length = text.trim().length;
  // Bullet items take vertical line spacing overhead
  const spacingOverhead = isBullet ? 25 : 10;
  return length + spacingOverhead;
}

/**
 * Checks if a proposed slide content will exceed the safe boundary
 */
export function isSlideCrowded(slideData, density = DENSITY_MODES.STANDARD) {
  if (!slideData) return false;

  const type = slideData.type;

  // Structural slides are fixed-format and should never be marked as crowded
  if (
    type === 'cover' ||
    type === 'section-divider' ||
    type === 'section_divider' ||
    type === 'agenda'
  ) {
    return false;
  }

  const budget = CAPACITY_BUDGETS[density] || CAPACITY_BUDGETS[DENSITY_MODES.STANDARD];
  let maxAllowed = budget.maxCharsPerSlide;

  // Conclusion and References slides naturally accommodate broader thesis wrap-ups and citations
  if (type === 'conclusion') {
    maxAllowed = Math.round(maxAllowed * 1.6); // Generous allowance: conclusion statement + 3 recommendations
  } else if (type === 'references') {
    maxAllowed = Math.round(maxAllowed * 1.8); // References list citations
  } else if (type === 'comparison' || type === 'pros-cons' || type === 'table') {
    maxAllowed = Math.round(maxAllowed * 1.3);
  }

  let totalWeight = 0;

  if (Array.isArray(slideData.paragraphs)) {
    slideData.paragraphs.forEach(p => {
      totalWeight += estimateTextWeight(p, false);
    });
  }

  if (Array.isArray(slideData.bullets)) {
    slideData.bullets.forEach(b => {
      totalWeight += estimateTextWeight(b, true);
    });
  }

  return totalWeight > maxAllowed;
}
