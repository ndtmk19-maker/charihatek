/**
 * Deterministic Content-Type Classifier for Academic Slides
 * Analyzes structured research blocks and maps them to appropriate presentation layouts.
 * No AI or probabilistic models used.
 */

import { normalizeText } from './normalize-text.js';

export const SLIDE_TYPES = {
  COVER: 'cover',
  AGENDA: 'agenda',
  INTRODUCTION: 'introduction',
  SECTION_DIVIDER: 'section-divider',
  DEFINITION: 'definition',
  EXPLANATION: 'explanation',
  BULLETS: 'bullets',
  PROCESS_STEPS: 'process-steps',
  COMPARISON: 'comparison',
  PROS_CONS: 'pros-cons',
  TIMELINE: 'timeline',
  STATISTICS: 'statistics',
  TABLE: 'table',
  CONCLUSION: 'conclusion',
  REFERENCES: 'references'
};

export const SLIDE_TYPE_METADATA = {
  [SLIDE_TYPES.COVER]: { nameAr: 'شريحة الغلاف والمقدمين', icon: 'presentation' },
  [SLIDE_TYPES.AGENDA]: { nameAr: 'خطة البحث والفهرس', icon: 'list' },
  [SLIDE_TYPES.INTRODUCTION]: { nameAr: 'مقدمة البحث والإشكالية', icon: 'align-right' },
  [SLIDE_TYPES.SECTION_DIVIDER]: { nameAr: 'فاصل المبحث / الفصل', icon: 'bookmark' },
  [SLIDE_TYPES.DEFINITION]: { nameAr: 'تعريف اصطلاحي ومفاهيم', icon: 'quote' },
  [SLIDE_TYPES.EXPLANATION]: { nameAr: 'شرح تحليلي موسع', icon: 'file-text' },
  [SLIDE_TYPES.BULLETS]: { nameAr: 'نقاط ومحاور رئيسية', icon: 'list' },
  [SLIDE_TYPES.PROCESS_STEPS]: { nameAr: 'خطوات ومراحل متسلسلة', icon: 'git-commit' },
  [SLIDE_TYPES.COMPARISON]: { nameAr: 'مقارنة بين مفهومين', icon: 'columns' },
  [SLIDE_TYPES.PROS_CONS]: { nameAr: 'إيجابيات وسلبيات / مزايا وعيوب', icon: 'scale' },
  [SLIDE_TYPES.TIMELINE]: { nameAr: 'تسلسل زمني وتطور تاريخي', icon: 'clock' },
  [SLIDE_TYPES.STATISTICS]: { nameAr: 'بيانات وإحصائيات رقمية', icon: 'bar-chart-2' },
  [SLIDE_TYPES.TABLE]: { nameAr: 'جدول بيانات منظم', icon: 'table' },
  [SLIDE_TYPES.CONCLUSION]: { nameAr: 'الخاتمة والنتائج والتوصيات', icon: 'check-circle' },
  [SLIDE_TYPES.REFERENCES]: { nameAr: 'قائمة المصادر والمراجع', icon: 'book-open' }
};

/**
 * Classifies an individual content chunk
 * @param {Object} block - Content block with title, paragraphs, bullets, stats, etc.
 * @returns {string} Determined SLIDE_TYPES
 */
export function classifySlideContentType(block) {
  if (!block) return SLIDE_TYPES.EXPLANATION;

  // 1. Explicit user override
  if (block.forcedType && Object.values(SLIDE_TYPES).includes(block.forcedType)) {
    return block.forcedType;
  }

  // 2. Structural checks first (highest confidence)
  if (block.isCover) return SLIDE_TYPES.COVER;
  if (block.isDivider) return SLIDE_TYPES.SECTION_DIVIDER;
  if (block.isIntro) return SLIDE_TYPES.INTRODUCTION;
  if (block.isConclusion) return SLIDE_TYPES.CONCLUSION;
  if (block.isReferences) return SLIDE_TYPES.REFERENCES;

  // Has structured table data
  if (block.table && Array.isArray(block.table.headers) && block.table.headers.length > 0) {
    return SLIDE_TYPES.TABLE;
  }

  // Has structured statistics / numerical indicators
  if (Array.isArray(block.statistics) && block.statistics.length > 0) {
    return SLIDE_TYPES.STATISTICS;
  }

  // Has explicit two-column comparison data
  if (block.comparison && block.comparison.colA && block.comparison.colB) {
    return SLIDE_TYPES.COMPARISON;
  }

  const rawTitle = (block.title || '').trim();
  const normTitle = normalizeText(rawTitle);
  const allText = [
    rawTitle,
    ...(block.paragraphs || []),
    ...(block.bullets || []),
    ...(block.numbered || [])
  ].join(' ');
  const normAllText = normalizeText(allText);

  // 3. Keyword-based rules on title and body
  const checkMatches = (keywordsList, targetText) => {
    return keywordsList.some(kw => targetText.includes(normalizeText(kw)));
  };

  // Check Pros and Cons
  const prosConsKeywords = [
    'مزايا وعيوب', 'ايجابيات وسلبيات', 'الايجابيات والسلبيات', 'المزايا والعيوب',
    'اوجه القوة والضعف', 'نقاط القوة ونقاط الضعف', 'avantages et inconvenients',
    'pros and cons', 'advantages and disadvantages', 'strengths and weaknesses'
  ];
  if (checkMatches(prosConsKeywords, normTitle) || checkMatches(prosConsKeywords, normAllText)) {
    return SLIDE_TYPES.PROS_CONS;
  }

  // Check Comparison
  const comparisonKeywords = [
    'مقارنة بين', 'مقارنة', 'الفرق بين', 'اوجه الاختلاف', 'في المقابل', 'بينما',
    'comparaison', 'difference entre', 'versus', 'vs.', 'vs', 'contrast'
  ];
  if (checkMatches(comparisonKeywords, normTitle)) {
    return SLIDE_TYPES.COMPARISON;
  }

  // Check Timeline (Dates & Chronology)
  const timelineKeywords = [
    'تسلسل زمني', 'تطور تاريخي', 'التطور التاريخي', 'المراحل التاريخية',
    'تاريخ نشاه', 'chronologie', 'evolution historique', 'timeline', 'historical overview'
  ];
  // Regex for 4-digit years (e.g. 1990, 2024)
  const yearMatches = allText.match(/\b(19\d{2}|20\d{2})\b/g) || [];
  if (checkMatches(timelineKeywords, normTitle) || yearMatches.length >= 3) {
    return SLIDE_TYPES.TIMELINE;
  }

  // Check Process & Steps
  const processKeywords = [
    'خطوات', 'مراحل', 'الية عمل', 'سيرورة', 'مسار',
    'etapes', 'processus', 'phases', 'steps', 'workflow', 'lifecycle'
  ];
  const hasNumberedList = Array.isArray(block.numbered) && block.numbered.length >= 2;
  if (hasNumberedList || checkMatches(processKeywords, normTitle)) {
    return SLIDE_TYPES.PROCESS_STEPS;
  }

  // Check Definition
  const definitionKeywords = [
    'تعريف', 'مفهوم', 'المفهوم الاصطلاحي', 'المعنى اللغوي', 'ماهية', 'اصطلاحا',
    'definition', 'est defini comme', 'notion de', 'concept de', 'is defined as', 'meaning of'
  ];
  if (checkMatches(definitionKeywords, normTitle) || block.isDefinition) {
    return SLIDE_TYPES.DEFINITION;
  }

  // Check Bullet Points priority
  if (Array.isArray(block.bullets) && block.bullets.length >= 3) {
    return SLIDE_TYPES.BULLETS;
  }

  // Default to clean academic explanation layout
  return SLIDE_TYPES.EXPLANATION;
}
