/**
 * Deterministic Academic Research Summarizer & Distillation Engine
 * Formats dense academic text into concise, high-impact presentation slides.
 * Zero external AI, zero probabilistic APIs — 100% deterministic algorithms.
 */

// Arabic Academic Rhetorical Filler / Preambles dictionary
const ARABIC_ACADEMIC_FLUFF = [
  // Assertive / Obviousness fillers
  /^(مما\s+لا\s+شك\s+فيه\s+أن|مما\s+لا\s+ريب\s+فيه\s+أن|لا\s+شك\s+أن|لا\s+ريب\s+أن)\s*/i,
  /^(من\s+نافلة\s+القول\s+أن|لا\s+يخفى\s+على\s+أحد\s+أن|من\s+البديهي\s+أن|من\s+المسلّم\s+به\s+أن)\s*/i,
  /^(كما\s+هو\s+معلوم\s+(لدى\s+الباحثين(\s+والمختصين)?\s+)?أن|كما\s+هو\s+معروف\s+أن|من\s+المعروف\s+أن)\s*/i,
  /^(يتبين\s+لنا\s+(جلياً|بوضوح|بجلاء)\s+أن|يتضح\s+(لنا\s+)?(جلياً|بوضوح|بجلاء)\s+أن)\s*/i,
  
  // Transition / Contextual fillers
  /^(وتجدر\s+الإشارة\s+(في\s+هذا\s+(الصدد|السياق|المقام)\s+)?إلى\s+أن|تجدر\s+الإشارة\s+إلى\s+أن)\s*/i,
  /^(وجدير\s+بالذكر\s+أن|ومن\s+الجدير\s+بالذكر\s+أن|جدير\s+بالذكر\s+أن)\s*/i,
  /^(من\s+هذا\s+المنطلق(\s+نجد\s+أن|\s+يتضح\s+أن)?|انطلاقاً\s+من\s+ذلك\s+(نجد\s+أن)?)\s*/i,
  /^(بناءً?\s+على\s+ما\s+تقدم(\s+يتضح\s+أن|\s+يمكن\s+القول\s+بأن)?|تأسيساً\s+على\s+ما\s+سبق)\s*/i,
  /^(وفي\s+هذا\s+(السياق|الصدد|الإطار)(\s+يمكن\s+القول\s+بأن|\s+نجد\s+أن)?)\s*/i,
  /^(وعلى\s+هذا\s+الأساس\s+(فإن|نجد\s+أن)?|وعلى\s+هذا\s+النحو)\s*/i,
  /^(ومن\s+الأهمية\s+بمكان\s+(التأكيد|الإشارة)\s+إلى\s+أن)\s*/i,
  /^(بالرجوع\s+إلى\s+الأدبيات\s+السابقة\s+(يتضح\s+أن)?|من\s+خلال\s+الاستقراء\s+والتحليل\s+(يظهر\s+أن)?)\s*/i,
  /^(وفي\s+ضوء\s+ما\s+سبق\s+بيانه|تجدر\s+الملاحظة\s+أن|من\s+الملاحظ\s+أن)\s*/i,
  /^(والجدير\s+بالإشارة\s+أن|وعليه\s+فإنه\s+يمكن\s+القول\s+بأن)\s*/i
];

// English Academic Fillers
const ENGLISH_ACADEMIC_FLUFF = [
  /^(it\s+is\s+worth\s+noting\s+that|it\s+should\s+be\s+noted\s+that)\s*/i,
  /^(it\s+goes\s+without\s+saying\s+that|needless\s+to\s+say,?)\s*/i,
  /^(in\s+this\s+context,?\s*(it\s+is\s+clear\s+that)?)\s*/i,
  /^(based\s+on\s+the\s+aforementioned,?\s*(we\s+can\s+see\s+that)?)\s*/i,
  /^(as\s+is\s+widely\s+acknowledged,?\s*)\s*/i,
  /^(from\s+this\s+perspective,?\s*)\s*/i
];

// Deduction & Concluding Action Triggers
const DEDUCTION_TRIGGERS_AR = [
  'توصل البحث إلى', 'أثبتت النتائج أن', 'أظهرت المؤشرات أن', 'يستنتج من ذلك أن',
  'المحصلة الجوهرية هي', 'الأثر الجوهري يتمثل في', 'الركيزة الأساسية تكمن في',
  'يؤدي بالضرورة إلى', 'الخلاصة أن', 'يخلص المبحث إلى أن', 'النتيجة الحاسمة هي',
  'تتمثل الفائدة الكبرى في', 'يكمن التحدي الرئيسي في', 'تسهم هذه الآلية في'
];

/**
 * Strips rhetorical filler and padding phrases from academic statements
 * @param {string} text - Raw academic text
 * @returns {string} Clean, focused proposition
 */
export function stripAcademicFluff(text) {
  if (!text || typeof text !== 'string') return '';
  let cleaned = text.trim();

  // Strip known Arabic fluff prefixes
  for (const regex of ARABIC_ACADEMIC_FLUFF) {
    if (regex.test(cleaned)) {
      cleaned = cleaned.replace(regex, '').trim();
      break;
    }
  }

  // Strip English fluff prefixes
  for (const regex of ENGLISH_ACADEMIC_FLUFF) {
    if (regex.test(cleaned)) {
      cleaned = cleaned.replace(regex, '').trim();
      break;
    }
  }

  // Capitalize first letter or capitalize Arabic proposition if needed
  if (cleaned.length > 0) {
    // If stripped text starts with 'أن ' remove it: 'أن التحول الرقمي...' -> 'التحول الرقمي...'
    cleaned = cleaned.replace(/^(أن|بأن|إن|فإن)\s+/, '');
  }

  return cleaned.trim();
}

/**
 * Splits a text into clean academic propositions/clauses
 * @param {string} text - Paragraph text
 * @returns {Array<string>} Array of clean sentences
 */
export function splitIntoPropositions(text) {
  if (!text) return [];
  
  // Split on Arabic and Latin sentence endings, semicolons, and bullet markers
  const rawSentences = text
    .split(/[.?!؛؟\n]+|[•\-*▪]\s+/)
    .map(s => s.trim())
    .filter(s => s.length > 10); // ignore micro fragments

  return rawSentences.map(s => stripAcademicFluff(s)).filter(Boolean);
}

/**
 * Scores a sentence based on its information density and academic relevance
 * @param {string} sentence - Clean sentence
 * @param {string} titleContext - Title or topic context
 * @returns {number} Score
 */
function scoreSentence(sentence, titleContext = '') {
  let score = 0;
  const words = sentence.split(/\s+/);
  const wordCount = words.length;

  // Ideal length for a presentation bullet is 8 to 18 words
  if (wordCount >= 8 && wordCount <= 18) {
    score += 15;
  } else if (wordCount >= 6 && wordCount <= 24) {
    score += 8;
  } else {
    score += 2;
  }

  // Data / quantitative indicators: numbers, %, years
  if (/\d+[%٪]/.test(sentence)) score += 20;
  if (/\b(19\d\d|20\d\d)\b/.test(sentence)) score += 10;
  if (/\d+/.test(sentence)) score += 8;

  // Action & Impact verbs in Arabic
  const actionVerbs = [
    'يعتمد', 'يسهم', 'يطبق', 'يحدد', 'يعزز', 'يقيس', 'يحلل', 'يوفر', 'يقود', 'يتطلب',
    'يهدف', 'يحقق', 'يطور', 'يكرس', 'يؤدي', 'يربط', 'ينظم', 'يضمن', 'يكفل', 'يرفع'
  ];
  actionVerbs.forEach(v => {
    if (sentence.includes(v)) score += 5;
  });

  // Structural & Academic markers
  const keyMarkers = [
    'استراتيجية', 'حوكمة', 'كفاءة', 'معيار', 'مؤشر', 'إجراءات', 'تحول', 'أثر',
    'تطبيق', 'نظام', 'هيكلية', 'جودة', 'رقابة', 'مخاطر', 'تكلفة', 'مرحلة', 'نتائج'
  ];
  keyMarkers.forEach(m => {
    if (sentence.includes(m)) score += 6;
  });

  // Relevance to title keywords
  if (titleContext) {
    const titleWords = titleContext.split(/\s+/).filter(w => w.length > 3);
    titleWords.forEach(tw => {
      if (sentence.includes(tw)) score += 7;
    });
  }

  return score;
}

/**
 * Deduces the central research takeaway / key deduction from section content
 * @param {Array<string>} paragraphs - Section paragraphs
 * @param {Array<string>} bullets - Section bullets
 * @param {string} title - Section title
 * @returns {string} Crisp takeaway statement
 */
export function deduceKeyTakeaway(paragraphs = [], bullets = [], title = '') {
  const allText = [...paragraphs, ...bullets].join(' ');
  if (!allText.trim()) {
    return 'تشكل مخرجات هذا المحور ركيزة جوهرية في بناء الاستنتاج العلمي للبحث.';
  }

  // 1. Search for explicit deduction triggers
  for (const trigger of DEDUCTION_TRIGGERS_AR) {
    const idx = allText.indexOf(trigger);
    if (idx !== -1) {
      const snippet = allText.substring(idx + trigger.length).trim();
      const endIdx = snippet.search(/[.?!؛؟\n]/);
      const rawClause = endIdx !== -1 ? snippet.substring(0, endIdx) : snippet;
      const cleanClause = stripAcademicFluff(rawClause);
      if (cleanClause.length > 15 && cleanClause.length < 160) {
        return `الاستنتاج الجوهري: ${cleanClause}.`;
      }
    }
  }

  // 2. Fallback: Select the most conclusive proposition (often the concluding sentence or highest scoring sentence)
  const propositions = splitIntoPropositions(allText);
  if (propositions.length === 0) {
    return 'الاستنتاج الجوهري: تمثل هذه المعطيات دليلاً تطبيقياً على أهمية المحور المدروس.';
  }

  // Check the last proposition first (conclusions often placed at paragraph ends)
  const lastProp = propositions[propositions.length - 1];
  if (lastProp && lastProp.length >= 25 && lastProp.length <= 130) {
    return `الاستنتاج الجوهري: ${lastProp}.`;
  }

  // Rank propositions by academic weight
  const scored = propositions.map(p => ({ text: p, score: scoreSentence(p, title) }));
  scored.sort((a, b) => b.score - a.score);

  const best = scored[0]?.text || propositions[0];
  const truncated = best.split(/\s+/).slice(0, 18).join(' ');
  return `الاستنتاج الجوهري: ${truncated}${best.length > truncated.length ? '...' : '.'}`;
}

/**
/**
 * Preserves the complete academic conclusion statement without mid-sentence slicing or ellipses.
 * Keeps full thoughts intact for the conclusion slide.
 * @param {string} text - Raw conclusion text
 * @param {number} maxWords - Upper boundary before sentence trimming
 * @returns {string} Complete, fully formed conclusion statement
 */
export function cleanCompleteConclusion(text, maxWords = 70) {
  if (!text) return '';
  const clean = stripAcademicFluff(text.trim());
  const words = clean.split(/\s+/).filter(Boolean);

  // If the conclusion fits within a generous presentation paragraph (up to 65 words or 420 chars), preserve it 100% in full!
  if (words.length <= maxWords || clean.length <= 420) {
    return clean.replace(/[.!?؟]+$/, '') + '.';
  }

  // If it is longer, take complete sentences up to maxWords
  const sentenceMatches = clean.match(/[^.!?؟\n]+[.!?؟\n]+/g);
  if (sentenceMatches && sentenceMatches.length > 0) {
    let acc = '';
    for (const s of sentenceMatches) {
      const combined = (acc + ' ' + s).trim();
      if (combined.split(/\s+/).length <= maxWords) {
        acc = combined;
      } else {
        break;
      }
    }
    if (acc) return acc;
  }

  // Fallback: take up to maxWords cleanly ending with a period (never mid-sentence ellipsis)
  return words.slice(0, maxWords).join(' ').replace(/[,;،؛]+$/, '') + '.';
}

/**
 * Summarizes a long academic paragraph into a concise presentation lead sentence
 * @param {string} paragraph - Dense text
 * @param {number} maxWords - Word limit
 * @returns {string} Condensed lead sentence
 */
export function summarizeParagraphToLead(paragraph, maxWords = 28) {
  if (!paragraph) return '';
  const clean = stripAcademicFluff(paragraph);
  const words = clean.split(/\s+/).filter(Boolean);

  if (words.length <= maxWords) {
    return clean;
  }

  // Look for first sentence ending before maxWords + tolerance
  const firstSentenceEnd = clean.search(/[.?!؛؟\n]/);
  if (firstSentenceEnd > 20 && firstSentenceEnd < 240) {
    const firstSentence = clean.substring(0, firstSentenceEnd).trim();
    const sentenceWords = firstSentence.split(/\s+/);
    if (sentenceWords.length <= maxWords + 6) {
      return firstSentence + '.';
    }
  }

  // Slice at word boundary cleanly
  const sliced = words.slice(0, maxWords).join(' ');
  return `${sliced}...`;
}

/**
 * Distills long academic text or existing verbose bullets into 2-4 punchy presentation bullets
 * @param {Array<string>} paragraphs - Section paragraphs
 * @param {Array<string>} existingBullets - Existing bullets if provided
 * @param {number} maxBullets - Maximum bullets allowed for the slide
 * @param {number} maxWordsPerBullet - Maximum words per bullet
 * @param {string} titleContext - Title context
 * @returns {Array<string>} Array of presentation-ready bullets
 */
export function distillBulletsForSlide(paragraphs = [], existingBullets = [], maxBullets = 3, maxWordsPerBullet = 15, titleContext = '') {
  // If user already wrote structured bullets, summarize and clean each bullet
  if (Array.isArray(existingBullets) && existingBullets.filter(b => b && b.trim()).length > 0) {
    return existingBullets
      .filter(b => b && b.trim())
      .slice(0, maxBullets)
      .map(b => {
        const clean = stripAcademicFluff(b);
        const words = clean.split(/\s+/);
        if (words.length > maxWordsPerBullet) {
          return words.slice(0, maxWordsPerBullet).join(' ') + '...';
        }
        return clean;
      });
  }

  // Otherwise, extract propositions from paragraphs
  const combinedText = paragraphs.join(' ');
  const propositions = splitIntoPropositions(combinedText);

  if (propositions.length === 0) {
    return [];
  }

  // Score propositions
  const scored = propositions.map(p => ({
    text: p,
    score: scoreSentence(p, titleContext)
  }));

  // Sort descending by score
  scored.sort((a, b) => b.score - a.score);

  // Take top N distinct propositions
  const selected = scored.slice(0, maxBullets);

  return selected.map(item => {
    const words = item.text.split(/\s+/);
    if (words.length > maxWordsPerBullet) {
      return words.slice(0, maxWordsPerBullet).join(' ') + '...';
    }
    return item.text;
  });
}

/**
 * Summarizes an entire section content block to perfectly fit ONE slide with ZERO overflow
 * @param {Object} block - Section / Subsection block
 * @param {Object} budget - Layout capacity budget
 * @returns {Object} Summarized block with lead, distilled bullets, and key takeaway
 */
export function summarizeSectionForSlide(block, budget = {}) {
  const maxBullets = budget.maxBulletsPerSlide || 3;
  const rawParagraphs = (block.paragraphs || []).filter(p => p && p.trim());
  const rawBullets = (block.bullets || []).filter(b => b && b.trim());
  const title = (block.title || '').trim();

  // 1. Generate concise summary lead (max 22-25 words)
  let summaryLead = '';
  if (rawParagraphs.length > 0) {
    summaryLead = summarizeParagraphToLead(rawParagraphs[0], 24);
  }

  // 2. Distill 2 to 4 crisp presentation bullets
  const distilledBullets = distillBulletsForSlide(
    rawParagraphs,
    rawBullets,
    maxBullets,
    16,
    title
  );

  // 3. Deduce Key Research Takeaway
  const keyPoint = block.keyPoint && block.keyPoint.trim()
    ? block.keyPoint.trim()
    : deduceKeyTakeaway(rawParagraphs, rawBullets, title);

  return {
    summaryLead,
    paragraphs: summaryLead ? [summaryLead] : [],
    bullets: distilledBullets,
    keyPoint
  };
}
