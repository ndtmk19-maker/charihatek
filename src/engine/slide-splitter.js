/**
 * Deterministic Academic Slide Generation & Distillation Engine
 * Transforms academic research drafts into presentation-ready slide decks.
 * Summarizes dense text to fit 16:9 slides with ZERO continuation (تابع) slides.
 * Strictly rule-based, deterministic, zero external AI.
 */

import { DENSITY_MODES, CAPACITY_BUDGETS } from './layout-rules.js';
import { classifySlideContentType, SLIDE_TYPES } from '../classifier/content-type-classifier.js';
import { enrichBullets } from './visual-enricher.js';
import {
  summarizeSectionForSlide,
  summarizeParagraphToLead,
  cleanCompleteConclusion,
  distillBulletsForSlide,
  deduceKeyTakeaway,
  stripAcademicFluff
} from './academic-summarizer.js';

/**
 * Transforms a structured academic research draft into a slide deck sequence
 * @param {Object} draft - Structured draft
 * @param {string} density - compact | standard | detailed
 * @returns {Array} Array of final slide descriptors
 */
export function splitDraftIntoSlides(draft, density = DENSITY_MODES.STANDARD) {
  // If draft is completely empty or lacks both title and sections, return 0 slides
  if (!draft || (!draft.title && (!Array.isArray(draft.sections) || draft.sections.length === 0))) {
    return [];
  }

  const budget = CAPACITY_BUDGETS[density] || CAPACITY_BUDGETS[DENSITY_MODES.STANDARD];
  const slides = [];
  const lang = draft.language || 'ar';
  const isArabic = lang === 'ar';

  // 1. Cover Slide
  slides.push({
    id: 'slide-cover',
    type: SLIDE_TYPES.COVER,
    isCover: true,
    title: draft.title || (isArabic ? 'عنوان البحث الأكاديمي' : 'Research Title'),
    author: draft.author || (isArabic ? 'اسم الطالب / الباحث' : 'Researcher Name'),
    institution: draft.institution || (isArabic ? 'اسم الجامعة أو المؤسسة الأكاديمية' : 'University / Institution'),
    faculty: draft.faculty || (isArabic ? 'الكلية أو القسم العلمي' : 'Faculty / Department'),
    course: draft.course || (isArabic ? 'المادة أو التخصص' : 'Course / Discipline'),
    instructor: draft.instructor || '',
    date: draft.date || new Date().getFullYear().toString(),
    language: lang
  });

  // 1b. Academic Research Plan / Agenda Slide (خطة البحث: 3 مباحث وكل مبحث 3 مطالب)
  const sectionsPlan = Array.isArray(draft.sections) && draft.sections.length > 0
    ? draft.sections.map((sec, idx) => ({
        mabhath: sec.title || (isArabic ? `المبحث ${idx + 1}` : `Section ${idx + 1}`),
        matalib: Array.isArray(sec.subsections) && sec.subsections.length > 0
          ? sec.subsections.map(sub => sub.title || (isArabic ? `المطلب` : `Topic`))
          : (Array.isArray(sec.bullets) && sec.bullets.length > 0
              ? sec.bullets.slice(0, 3).map(b => typeof b === 'string' ? b : (b.text || ''))
              : [
                  isArabic ? 'المطلب الأول: التأصيل والمفاهيم' : 'Topic 1',
                  isArabic ? 'المطلب الثاني: التحليل والأبعاد' : 'Topic 2',
                  isArabic ? 'المطلب الثالث: النتائج والتقييم' : 'Topic 3'
                ])
      }))
    : [
        {
          mabhath: isArabic ? 'المبحث الأول: التأصيل النظري والمفاهيمي' : 'Section 1: Theoretical Framing',
          matalib: [
            isArabic ? 'المطلب الأول: المفاهيم والنشأة' : 'Topic 1: Concepts',
            isArabic ? 'المطلب الثاني: الأبعاد والخصائص' : 'Topic 2: Dimensions',
            isArabic ? 'المطلب الثالث: المقاربة المنهجية' : 'Topic 3: Methodology'
          ]
        },
        {
          mabhath: isArabic ? 'المبحث الثاني: التحليل التطبيقي والدراسة الميدانية' : 'Section 2: Empirical Analysis',
          matalib: [
            isArabic ? 'المطلب الأول: تشخيص الواقع الراهن' : 'Topic 1: Current Diagnosis',
            isArabic ? 'المطلب الثاني: المؤشرات والقياس الكمي' : 'Topic 2: Metrics',
            isArabic ? 'المطلب الثالث: تحليل البيانات والنتائج' : 'Topic 3: Findings'
          ]
        },
        {
          mabhath: isArabic ? 'المبحث الثالث: التقييم النقدي وآفاق التطوير' : 'Section 3: Strategic Evaluation',
          matalib: [
            isArabic ? 'المطلب الأول: موازنة المكتسبات والتحديات' : 'Topic 1: Pros & Cons',
            isArabic ? 'المطلب الثاني: آليات الحوكمة والأمن' : 'Topic 2: Governance',
            isArabic ? 'المطلب الثالث: التوصيات وخارطة التحول' : 'Topic 3: Roadmap'
          ]
        }
      ];

  slides.push({
    id: 'slide-agenda',
    type: SLIDE_TYPES.AGENDA,
    isAgenda: true,
    sectionTitle: isArabic ? 'خطة البحث' : 'Research Plan',
    title: isArabic ? 'خطة البحث وهيكل العرض الأكاديمي' : 'Research Plan & Academic Outline',
    sectionsPlan: sectionsPlan,
    language: lang
  });

  // 2. Dedicated Academic Introduction Slide (Distinct from Mabaheth / Sections)
  const introText = (draft.introduction || '').trim();
  const problemText = (draft.problemStatement || '').trim();
  const objectivesList = Array.isArray(draft.objectives)
    ? draft.objectives.filter(o => o && o.trim())
    : (draft.objectives ? [draft.objectives] : []);

  if (introText || problemText || objectivesList.length > 0) {
    // Lead context summary
    const introLead = introText
      ? summarizeParagraphToLead(introText, 28)
      : (isArabic ? 'يستعرض هذا البحث الأطر النظرية والتطبيقية للإشكالية المطروحة.' : 'This study outlines the theoretical and empirical framework.');

    // Distill 2-3 objectives if not explicitly provided
    let finalObjectives = objectivesList;
    if (finalObjectives.length === 0 && introText) {
      finalObjectives = distillBulletsForSlide([introText], [], 3, 14, 'أهداف البحث');
    }

    slides.push({
      id: 'slide-intro',
      type: SLIDE_TYPES.INTRODUCTION,
      isIntro: true,
      sectionTitle: isArabic ? 'مقدمة البحث' : 'Introduction',
      title: isArabic ? 'مقدمة البحث وإشكالية الدراسة' : 'Research Introduction & Problem Statement',
      introLead: introLead,
      paragraphs: [introLead],
      problemStatement: problemText || (isArabic ? 'تحديد أثر المتغيرات الجوهرية ودورها في تعزيز الفعالية والكفاءة.' : 'Investigating the core impact of variables on organizational efficiency.'),
      objectives: enrichBullets(finalObjectives.length > 0 ? finalObjectives : [
        isArabic ? 'تشخيص الواقع الميداني وتحديد التحديات الراهنة' : 'Diagnosing current field challenges',
        isArabic ? 'تحليل الآليات التطبيقية وقياس مؤشرات النجاح' : 'Analyzing mechanisms and measuring success indicators'
      ]),
      bullets: enrichBullets(finalObjectives),
      methodology: draft.methodology || (isArabic ? 'المنهج الوصفي التحليلي المقارن' : 'Descriptive Analytical Methodology'),
      language: lang
    });
  }

  // 3. Main Sections & Subsections (المباحث والمطالب)
  if (Array.isArray(draft.sections)) {
    draft.sections.forEach((section, sIdx) => {
      // 3.1 Section Divider Slide (Only if section has a title)
      if (section.title && section.title.trim()) {
        slides.push({
          id: `slide-divider-${section.id || sIdx + 1}`,
          type: SLIDE_TYPES.SECTION_DIVIDER,
          isDivider: true,
          sectionNumber: sIdx + 1,
          title: section.title.trim(),
          description: section.description || (isArabic ? 'محور دراسي رئيسي' : 'Key Research Section'),
          language: lang
        });
      }

      // 3.2 If section has subsections (المطالب), process each subsection as its own dedicated slide!
      if (Array.isArray(section.subsections) && section.subsections.length > 0) {
        section.subsections.forEach((sub) => {
          processContentBlock(sub, slides, budget, lang, section.title);
        });
      } else {
        // Only if there are no subsections, process the section root content as a slide
        processContentBlock(section, slides, budget, lang);
      }
    });
  }

  // 4. Conclusion Slide (Single self-contained slide, preserved completely without ellipses)
  if (draft.conclusion && draft.conclusion.trim()) {
    const concText = cleanCompleteConclusion(draft.conclusion.trim(), 70);
    let concBullets = Array.isArray(draft.conclusionPoints) ? draft.conclusionPoints.filter(Boolean) : [];
    if (concBullets.length === 0) {
      concBullets = distillBulletsForSlide([draft.conclusion.trim()], [], 3, 18, 'نتائج وتوصيات');
    }

    slides.push({
      id: 'slide-conclusion',
      type: SLIDE_TYPES.CONCLUSION,
      isConclusion: true,
      sectionTitle: isArabic ? 'خاتمة البحث' : 'Conclusion',
      title: isArabic ? 'الخاتمة والنتائج المستخلصة' : 'Conclusion & Findings',
      paragraphs: [concText],
      bullets: enrichBullets(concBullets.slice(0, 3)),
      keyPoint: deduceKeyTakeaway([draft.conclusion.trim()], concBullets, 'الخاتمة'),
      language: lang
    });
  }

  // 5. References Slide
  if (Array.isArray(draft.references) && draft.references.length > 0) {
    const cleanRefs = draft.references.filter(r => r && r.trim()).slice(0, 6);
    slides.push({
      id: 'slide-references',
      type: SLIDE_TYPES.REFERENCES,
      isReferences: true,
      sectionTitle: isArabic ? 'قائمة المصادر' : 'References',
      title: isArabic ? 'قائمة المصادر والمراجع المعتمدة' : 'Academic References',
      paragraphs: [],
      bullets: cleanRefs,
      language: lang
    });
  }

  // Number slides sequentially (1-based)
  slides.forEach((slide, index) => {
    slide.slideNumber = index + 1;
    slide.totalSlides = slides.length;
  });

  return slides;
}

/**
 * Processes a content block (Section or Subsection) into a single, high-impact slide.
 * Uses deterministic academic summarization so ALL content fits without overflow or (تابع).
 */
function processContentBlock(block, slides, budget, lang, parentTitle = '') {
  const hasParagraphs = Array.isArray(block.paragraphs) && block.paragraphs.filter(p => p && p.trim()).length > 0;
  const hasBullets = Array.isArray(block.bullets) && block.bullets.filter(b => b && b.trim()).length > 0;
  const hasNumbered = Array.isArray(block.numbered) && block.numbered.filter(n => n && n.trim()).length > 0;
  const hasStats = Array.isArray(block.statistics) && block.statistics.length > 0;
  const hasTable = block.table && Array.isArray(block.table.headers) && block.table.headers.length > 0;
  const hasComparison = block.comparison && block.comparison.colA && block.comparison.colB;

  const title = (block.title || '').trim();
  const detectedType = classifySlideContentType(block);
  const layoutType = block.layoutType || detectedType;

  // Scenario A: Structured Table (Only if valid headers & rows exist)
  const hasValidTable = block.table &&
    Array.isArray(block.table.headers) && block.table.headers.length >= 2 &&
    Array.isArray(block.table.rows) && block.table.rows.length >= 1;

  if (hasValidTable) {
    const maxRows = budget.maxTableRowsPerSlide || 5;
    slides.push({
      id: `slide-table-${block.id || Math.random().toString(36).substring(7)}`,
      type: SLIDE_TYPES.TABLE,
      sectionTitle: parentTitle,
      title: title || (lang === 'ar' ? 'جدول المقارنة والتحليل' : 'Analytical Table'),
      table: {
        headers: block.table.headers,
        rows: block.table.rows.slice(0, maxRows)
      },
      paragraphs: block.paragraphs && block.paragraphs.length > 0
        ? [summarizeParagraphToLead(block.paragraphs[0], 20)]
        : [],
      language: lang
    });
    return;
  }

  // Scenario B: Statistics / Data Chart (STRICTLY conditional: only if real quantitative data exists)
  const hasValidStats = Array.isArray(block.statistics) &&
    block.statistics.length >= 2 &&
    block.statistics.every(s => s && s.label && String(s.label).trim() && s.value !== undefined && String(s.value).trim() !== '');

  if (hasValidStats) {
    slides.push({
      id: `slide-stat-${block.id || Math.random().toString(36).substring(7)}`,
      type: SLIDE_TYPES.STATISTICS,
      sectionTitle: parentTitle,
      title: title || (lang === 'ar' ? 'مؤشرات وبيانات إحصائية' : 'Quantitative Metrics'),
      statistics: block.statistics.slice(0, 4),
      paragraphs: block.paragraphs && block.paragraphs.length > 0
        ? [summarizeParagraphToLead(block.paragraphs[0], 20)]
        : [],
      chartType: block.chartType || 'bar',
      language: lang
    });
    return;
  }

  // Scenario C: Comparison (Only if both columns have real items)
  const hasValidComp = block.comparison &&
    block.comparison.colA && block.comparison.colB &&
    Array.isArray(block.comparison.colA.items) && block.comparison.colA.items.length > 0 &&
    Array.isArray(block.comparison.colB.items) && block.comparison.colB.items.length > 0;

  if (hasValidComp) {
    slides.push({
      id: `slide-comp-${block.id || Math.random().toString(36).substring(7)}`,
      type: SLIDE_TYPES.COMPARISON,
      sectionTitle: parentTitle,
      title: title || (lang === 'ar' ? 'دراسة مقارنة ومفاضلة' : 'Comparative Analysis'),
      comparison: {
        colA: { title: block.comparison.colA.title || (lang === 'ar' ? 'المحور الأول' : 'Aspect A'), items: (block.comparison.colA.items || []).slice(0, 3) },
        colB: { title: block.comparison.colB.title || (lang === 'ar' ? 'المحور الثاني' : 'Aspect B'), items: (block.comparison.colB.items || []).slice(0, 3) }
      },
      paragraphs: block.paragraphs && block.paragraphs.length > 0
        ? [summarizeParagraphToLead(block.paragraphs[0], 20)]
        : [],
      language: lang
    });
    return;
  }

  // Scenario D: Process Steps / Stages (Only if real sequential items exist)
  const hasValidSteps = (hasNumbered && block.numbered.length >= 2) || (hasBullets && block.bullets.length >= 2);
  if (hasValidSteps && (layoutType === SLIDE_TYPES.PROCESS_STEPS || detectedType === SLIDE_TYPES.PROCESS_STEPS)) {
    const rawSteps = hasNumbered ? block.numbered : block.bullets;
    slides.push({
      id: `slide-steps-${block.id || Math.random().toString(36).substring(7)}`,
      type: SLIDE_TYPES.PROCESS_STEPS,
      sectionTitle: parentTitle,
      title: title || (lang === 'ar' ? 'مراحل ومسار التحليل' : 'Process & Stages'),
      numbered: rawSteps.slice(0, 4).map(s => stripAcademicFluff(s)),
      paragraphs: block.paragraphs && block.paragraphs.length > 0
        ? [summarizeParagraphToLead(block.paragraphs[0], 20)]
        : [],
      language: lang
    });
    return;
  }

  // Scenario E: Pros and Cons
  if (layoutType === SLIDE_TYPES.PROS_CONS || detectedType === SLIDE_TYPES.PROS_CONS) {
    const rawBullets = enrichBullets((block.bullets || []).slice(0, 4));
    slides.push({
      id: `slide-proscons-${block.id || Math.random().toString(36).substring(7)}`,
      type: SLIDE_TYPES.PROS_CONS,
      sectionTitle: parentTitle,
      title: title || 'موازنة المزايا والتحديات',
      bullets: rawBullets,
      paragraphs: block.paragraphs && block.paragraphs.length > 0
        ? [summarizeParagraphToLead(block.paragraphs[0], 20)]
        : [],
      keyPoint: block.keyPoint || deduceKeyTakeaway(block.paragraphs || [], block.bullets || [], title),
      language: lang
    });
    return;
  }

  // Scenario F & G: Standard, Definition, Timeline, or Bullets
  // Deterministically summarize and adapt section content so that it fits 100% on ONE single slide!
  const summarized = summarizeSectionForSlide(block, budget);

  let finalType = SLIDE_TYPES.EXPLANATION;
  if (layoutType === SLIDE_TYPES.TIMELINE) {
    finalType = SLIDE_TYPES.TIMELINE;
  } else if (layoutType === SLIDE_TYPES.DEFINITION || block.definitionTerm) {
    finalType = SLIDE_TYPES.DEFINITION;
  } else if (layoutType === SLIDE_TYPES.BULLETS) {
    finalType = SLIDE_TYPES.BULLETS;
  }

  slides.push({
    id: `slide-section-${block.id || Math.random().toString(36).substring(7)}`,
    type: finalType,
    sectionTitle: parentTitle,
    title: title || (lang === 'ar' ? 'محور تحليلي' : 'Analytical Section'),
    paragraphs: summarized.paragraphs,
    bullets: enrichBullets(summarized.bullets),
    definitionTerm: block.definitionTerm || '',
    keyPoint: summarized.keyPoint,
    image: block.image || null,
    language: lang
  });
}
