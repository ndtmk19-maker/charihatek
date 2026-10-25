/**
 * Smart Deterministic Academic Interface Icons & Layout Enricher
 * Assigns clean, vector interface icons (Flaticon UIcons aesthetic) and structured diagram layouts.
 * Strips cartoonish emojis to maintain a pristine, publication-grade academic standard.
 * 
 * Strictly deterministic - zero AI / zero LLMs.
 */

import { normalizeText } from '../classifier/normalize-text.js';

/**
 * Academic interface icon keyword rules mapping to UIcons library keys
 */
export const UICON_KEYWORD_RULES = [
  // Goals, Objectives, Strategy
  { iconKey: 'target', keywords: ['هدف', 'اهداف', 'غاية', 'غايات', 'رؤية', 'استراتيجية', 'مرمى', 'تطلع', 'objective', 'goal', 'vision', 'target'] },
  // Statistics, Data, Metrics
  { iconKey: 'barChart', keywords: ['احصاء', 'احصائيات', 'بيانات', 'نسبة', 'معدل', 'مؤشر', 'مؤشرات', 'ارقام', 'رقمي', 'قياس', 'statistic', 'data', 'metric', 'indicator', '%'] },
  // Growth, Increase, Prosperity
  { iconKey: 'trendingUp', keywords: ['نمو', 'تطور', 'توسع', 'زيادة', 'ارتفاع', 'تصاعد', 'تحسن', 'ازدهار', 'growth', 'increase', 'trend', 'progress'] },
  // Decline, Deficit, Loss
  { iconKey: 'trendingDown', keywords: ['تراجع', 'انخفاض', 'هبوط', 'عجز', 'خسارة', 'انكماش', 'تدهور', 'decline', 'drop', 'deficit'] },
  // Insights, Ideas, Discoveries, Innovations
  { iconKey: 'lightbulb', keywords: ['استبصار', 'فكرة', 'ابتكار', 'ابداع', 'اضاءة', 'رؤية جديدة', 'مفهوم جديد', 'حل مقترح', 'insight', 'idea', 'innovation'] },
  // Findings, Conclusions, Achievements
  { iconKey: 'trophy', keywords: ['نتيجة', 'نتائج', 'خلاصة', 'استنتاج', 'توصية', 'توصيات', 'انجاز', 'تفوق', 'ريادة', 'finding', 'conclusion', 'achievement', 'result'] },
  // Legal, Standards, Comparison, Governance
  { iconKey: 'scale', keywords: ['قانون', 'معيار', 'معايير', 'تنظيم', 'حوكمة', 'عدالة', 'مقارنة', 'مفاضلة', 'توازن', 'تشريع', 'legal', 'standard', 'comparison', 'governance'] },
  // Risks, Challenges, Limitations, Cautions
  { iconKey: 'alertTriangle', keywords: ['تحدي', 'تحديات', 'صعوبة', 'صعوبات', 'خطر', 'مخاطر', 'سلبيات', 'عيوب', 'معوقات', 'عائق', 'limitation', 'risk', 'challenge', 'con'] },
  // Advantages, Strengths, Positive Points
  { iconKey: 'checkCircle', keywords: ['ميزة', 'مزايا', 'ايجابيات', 'قوة', 'نجاح', 'ضمان', 'تأكيد', 'سلامة', 'فاعلية', 'advantage', 'strength', 'pro', 'positive'] },
  // Research, Investigation, Deep Analysis
  { iconKey: 'search', keywords: ['بحث', 'دراسة', 'تحليل', 'استقصاء', 'فحص', 'استطلاع', 'معاينة', 'تشخيص', 'research', 'analysis', 'investigation', 'study'] },
  // Technology, Systems, Computing, Cloud
  { iconKey: 'cpu', keywords: ['حاسوب', 'برمجية', 'نظام', 'انظمة', 'سحابة', 'سحابي', 'تكنولوجيا', 'رقمي', 'شبكة', 'شبكات', 'خادم', 'technology', 'system', 'software', 'cloud', 'digital'] },
  // Security, Protection, Quality Assurance
  { iconKey: 'shieldCheck', keywords: ['امان', 'حماية', 'سيبراني', 'تامين', 'خصوصية', 'جودة', 'رقابة', 'تدقيق', 'security', 'protection', 'privacy', 'audit', 'assurance'] },
  // Organizations, Institutions, Governance
  { iconKey: 'university', keywords: ['مؤسسة', 'منظمة', 'ادارة', 'جامعة', 'هيئة', 'وزارة', 'قطاع', 'حكومة', 'organization', 'institution', 'management', 'university'] },
  // Finance, Accounting, Revenue, Budget
  { iconKey: 'table', keywords: ['مالية', 'محاسبة', 'تكلفة', 'تكاليف', 'ايراد', 'ايرادات', 'ارباح', 'ميزانية', 'اصول', 'خصوم', 'financial', 'cost', 'revenue', 'profit', 'budget'] },
  // Medicine, Clinical, Health, Therapy
  { iconKey: 'activity', keywords: ['طبي', 'صحة', 'علاج', 'سريري', 'مرض', 'تشخيص طبي', 'فسيولوجي', 'قلب', 'دواء', 'medical', 'clinical', 'health', 'disease', 'patient'] },
  // Processes, Steps, Execution, Mechanisms
  { iconKey: 'refreshCw', keywords: ['الية', 'اليات', 'عملية', 'عمليات', 'اجراء', 'اجراءات', 'تنفيذ', 'مرحلة', 'خطوة', 'مسار', 'process', 'step', 'mechanism', 'execution'] },
  // Books, References, Academic Citations
  { iconKey: 'bookOpen', keywords: ['مرجع', 'مراجع', 'مصدر', 'مصادر', 'توثيق', 'كتاب', 'مؤلف', 'دراسات سابقة', 'reference', 'book', 'literature', 'citation'] },
  // Core Concepts, Definitions, Key Terminology
  { iconKey: 'bookmark', keywords: ['مفهوم', 'تعريف', 'اصطلاح', 'تاصيل', 'محور', 'منطلق', 'اساس', 'concept', 'definition', 'fundamental', 'term'] },
  // Time, Timeline, History, Milestones
  { iconKey: 'clock', keywords: ['تاريخ', 'زمن', 'تطور تاريخي', 'مرحلة تاريخية', 'محطة', 'فترة', 'timeline', 'chronology', 'milestone', 'history'] }
];

/**
 * Strips all cartoonish emojis and pictographs from text to keep academic text clean
 */
export function stripEmojis(text) {
  if (!text) return '';
  return String(text)
    .replace(/(\p{Extended_Pictographic}|\p{Emoji_Presentation}|[✔✖🔹🔸▪▫•])\s*/gu, '')
    .trim();
}

/**
 * Checks if a string contains any emoji characters
 */
export function containsEmoji(text) {
  if (!text) return false;
  return /(\p{Extended_Pictographic}|\p{Emoji_Presentation}|[✔✖🔹🔸▪▫•])/u.test(text);
}

/**
 * Legacy compatibility alias for startsWithEmoji
 */
export function startsWithEmoji(text) {
  return containsEmoji(text);
}

/**
 * Detects the most appropriate academic UIcon key for a given text snippet
 * @param {string} text - The input text (bullet point, title, or paragraph)
 * @param {number} fallbackIndex - Index for cyclic fallback if no keyword matches
 * @returns {string} Matching UIcon key in UICONS
 */
export function getAcademicIconForText(text, fallbackIndex = 0) {
  if (!text) return 'bookmark';
  const norm = normalizeText(text);

  for (const rule of UICON_KEYWORD_RULES) {
    for (const kw of rule.keywords) {
      if (norm.includes(kw)) {
        return rule.iconKey;
      }
    }
  }

  // Fallback cyclic list of elegant UIcon keys
  const fallbacks = ['bookmark', 'target', 'lightbulb', 'fileText', 'layers', 'shieldCheck'];
  return fallbacks[fallbackIndex % fallbacks.length];
}

/**
 * Legacy compatibility alias
 */
export function getAcademicEmojiForText(text, fallbackIndex = 0) {
  return getAcademicIconForText(text, fallbackIndex);
}

/**
 * Cleans a bullet point by stripping emojis and returning pure academic text
 */
export function enrichBullet(bullet) {
  if (!bullet) return '';
  return stripEmojis(bullet);
}

/**
 * Cleans an entire array of bullet points
 */
export function enrichBullets(bullets) {
  if (!Array.isArray(bullets)) return [];
  return bullets.map(b => stripEmojis(b)).filter(Boolean);
}

/**
 * Auto-enriches an entire draft:
 * 1. Strips all informal cartoon emojis from paragraphs, bullets, titles, and keypoints
 * 2. Assigns deterministic iconKey metadata to each section based on academic content
 * 3. Preserves clean text formatting
 * 
 * @param {Object} draft - Raw draft object
 * @returns {Object} Enriched draft object
 */
export function autoEnrichDraft(draft) {
  const cloned = JSON.parse(JSON.stringify(draft));

  if (cloned.title) cloned.title = stripEmojis(cloned.title);
  if (cloned.introduction) cloned.introduction = stripEmojis(cloned.introduction);
  if (cloned.conclusion) cloned.conclusion = stripEmojis(cloned.conclusion);

  // 1. Enrich sections
  if (Array.isArray(cloned.sections)) {
    cloned.sections.forEach((sec, sIdx) => {
      if (sec.title) sec.title = stripEmojis(sec.title);
      if (sec.definitionTerm) sec.definitionTerm = stripEmojis(sec.definitionTerm);

      // Assign academic UIcon key based on section text
      sec.iconKey = getAcademicIconForText(`${sec.title} ${sec.keyPoint || ''} ${sec.definitionTerm || ''}`, sIdx);

      // Clean paragraphs
      if (Array.isArray(sec.paragraphs)) {
        sec.paragraphs = sec.paragraphs.map(p => stripEmojis(p)).filter(Boolean);
      }

      // Clean bullets
      if (Array.isArray(sec.bullets)) {
        sec.bullets = enrichBullets(sec.bullets);
      }

      // Clean numbered steps
      if (Array.isArray(sec.numbered)) {
        sec.numbered = sec.numbered.map(n => stripEmojis(n)).filter(Boolean);
      }

      // Clean comparison items
      if (sec.comparison) {
        if (sec.comparison.colA) {
          sec.comparison.colA.title = stripEmojis(sec.comparison.colA.title);
          sec.comparison.colA.items = (sec.comparison.colA.items || []).map(it => stripEmojis(it));
        }
        if (sec.comparison.colB) {
          sec.comparison.colB.title = stripEmojis(sec.comparison.colB.title);
          sec.comparison.colB.items = (sec.comparison.colB.items || []).map(it => stripEmojis(it));
        }
      }

      // Clean keypoint
      if (sec.keyPoint) {
        sec.keyPoint = stripEmojis(sec.keyPoint);
      }

      // Clean subsections
      if (Array.isArray(sec.subsections)) {
        sec.subsections.forEach((sub, subIdx) => {
          if (sub.title) sub.title = stripEmojis(sub.title);
          sub.iconKey = getAcademicIconForText(sub.title, subIdx);
          if (Array.isArray(sub.bullets)) {
            sub.bullets = enrichBullets(sub.bullets);
          }
          if (Array.isArray(sub.paragraphs)) {
            sub.paragraphs = sub.paragraphs.map(p => stripEmojis(p)).filter(Boolean);
          }
        });
      }
    });
  }

  // 2. Clean conclusion points
  if (Array.isArray(cloned.conclusionPoints)) {
    cloned.conclusionPoints = enrichBullets(cloned.conclusionPoints);
  }

  // 3. Clean references
  if (Array.isArray(cloned.references)) {
    cloned.references = cloned.references.map(r => stripEmojis(r)).filter(Boolean);
  }

  return cloned;
}

/**
 * Traditional manuscript calligraphy ribbons & cartouches (Zero Emojis)
 */
export const MANUSCRIPT_CARTOUCHES = {
  BASMALA: '« بِسْمِ اللَّـهِ الرَّحْمَـٰنِ الرَّحِيمِ »',
  PEER_REVIEWED: '« بَحْثٌ أَكَادِيمِيٌّ مُحَكَّمٌ وَمُجَازٌ عِلْمِيّاً »',
  METHODOLOGY_APPROVED: '« وِفْقَ مَنْهَجِيَّةِ البَحْثِ العِلْمِيِّ الرَّصِينِ »',
  CHAPTER_PREFIX: 'المَبْحَثُ',
  REQUIREMENT_PREFIX: 'المَطْلَبُ',
  CONCLUSION_SEAL: '« خَاتِمَةُ الدِّرَاسَةِ وَالتَّوْصِيَاتِ الجَوْهَرِيَّةِ »',
  REFERENCES_SEAL: '« قَائِمَةُ المَصَادِرِ وَالمَرَاجِعِ المُعْتَمَدَةِ »'
};
