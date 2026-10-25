/**
 * Native PowerPoint Chart Builder
 * Transforms structured numerical indicators into native, editable PPTX charts.
 */

import { cleanHexColor } from './text-layout.js';

/**
 * Builds native PptxGenJS chart configuration from statistics data
 * @param {Object} pptx - PptxGenJS presentation instance
 * @param {Object} slide - PptxGenJS slide instance
 * @param {Array} statistics - Array of { label, value, unit }
 * @param {Object} coords - { x, y, w, h }
 * @param {Object} theme - Active theme
 * @param {string} chartType - 'bar' | 'pie' | 'line'
 */
export function addNativeChartToSlide(pptx, slide, statistics, coords, theme, chartType = 'bar') {
  if (!Array.isArray(statistics) || statistics.length === 0) return;

  const labels = [];
  const values = [];

  statistics.forEach(item => {
    labels.push(item.label || '');
    // Parse numeric value safely
    const num = parseFloat(String(item.value).replace(/[^0-9.-]+/g, '')) || 0;
    values.push(num);
  });

  const chartData = [
    {
      name: 'البيانات والمؤشرات',
      labels: labels,
      values: values
    }
  ];

  const primaryCol = cleanHexColor(theme.pptx?.primary || '0284C7');
  const secCol = cleanHexColor(theme.pptx?.secondary || '0EA5E9');
  const accentCol = cleanHexColor(theme.pptx?.accent || '38BDF8');

  let type = pptx.ChartType.bar;
  let opts = {
    x: coords.x,
    y: coords.y,
    w: coords.w,
    h: coords.h,
    showTitle: false,
    showLegend: statistics.length > 3,
    legendPos: 'b',
    chartColors: [primaryCol, secCol, accentCol, '10B981', 'F59E0B'],
    chartColorsOpacity: 90
  };

  if (chartType === 'pie') {
    type = pptx.ChartType.pie;
    opts.showValue = true;
    opts.showPercent = true;
  } else if (chartType === 'line') {
    type = pptx.ChartType.line;
    opts.lineDataSymbol = 'circle';
    opts.lineDataSymbolSize = 8;
  } else {
    // Default: Column/Bar
    opts.barDir = 'col';
    opts.showValue = true;
  }

  slide.addChart(type, chartData, opts);
}
