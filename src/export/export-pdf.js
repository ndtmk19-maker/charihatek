/**
 * High-Fidelity Academic Presentation PDF Exporter
 * Generates publication-ready 16:9 PDF presentations via native browser printing engine.
 * Guarantees 100% crisp vector typography, native Arabic shaping, and rich theme palettes.
 */

import { renderSlideToHtml } from '../preview/preview-renderer.js';

/**
 * Triggers PDF export by rendering all slides in an isolated print layout
 * @param {Array} slides - Array of generated slide models
 * @param {string} domain - Active academic domain
 * @param {Object} theme - Active theme variant
 * @param {string} density - Layout density mode
 * @param {Object} metadata - Title, author, etc.
 */
export async function exportPdfDeck(slides, domain, theme, density = 'standard', metadata = {}) {
  if (!Array.isArray(slides) || slides.length === 0) {
    throw new Error('لا توجد شرائح متاحة للطباعة والتصدير كـ PDF.');
  }

  // Remove any previous print container
  const existing = document.getElementById('presentation-print-container');
  if (existing) {
    existing.remove();
  }

  // Create isolated print container
  const printContainer = document.createElement('div');
  printContainer.id = 'presentation-print-container';
  printContainer.className = 'presentation-print-container';

  // Render every slide as a separate full-page slide in sequence
  slides.forEach((slide, idx) => {
    const pageWrapper = document.createElement('div');
    pageWrapper.className = 'print-slide-page';
    pageWrapper.dataset.slideIndex = (idx + 1).toString();

    // Render slide HTML
    const slideHtml = renderSlideToHtml(slide, domain, theme, density);
    pageWrapper.innerHTML = slideHtml;

    printContainer.appendChild(pageWrapper);
  });

  document.body.appendChild(printContainer);

  // Set document title temporarily to ensure default PDF filename matches research title
  const originalTitle = document.title;
  const safeTitle = (metadata.title || 'عرض_تقديمي_أكاديمي')
    .replace(/[\\/:*?"<>|]/g, '_')
    .trim();
  document.title = safeTitle;

  // Small delay to allow fonts, SVG diagrams and layout to settle
  await new Promise(resolve => setTimeout(resolve, 250));

  // Trigger print dialog
  const cleanup = () => {
    document.title = originalTitle;
    const el = document.getElementById('presentation-print-container');
    if (el) el.remove();
    window.removeEventListener('afterprint', cleanup);
  };

  window.addEventListener('afterprint', cleanup);

  try {
    window.print();
  } finally {
    // Fallback cleanup after 3 seconds in case afterprint doesn't fire
    setTimeout(cleanup, 3000);
  }

  return { success: true, fileName: `${safeTitle}.pdf` };
}
