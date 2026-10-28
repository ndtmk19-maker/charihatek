/**
 * Automated Verification Suite for Rule-Based Academic Presentation Generator
 * Tests Normalization, Domain Classification, Slide Splitting, and Content-Type Detection.
 */

import { readFileSync } from 'fs';
import { resolve } from 'path';
import { normalizeText, normalizeArabic, normalizeLatin } from '../src/classifier/normalize-text.js';
import { classifyDomain } from '../src/classifier/domain-classifier.js';
import { classifySlideContentType, SLIDE_TYPES } from '../src/classifier/content-type-classifier.js';
import { splitDraftIntoSlides } from '../src/engine/slide-splitter.js';
import { DENSITY_MODES, isSlideCrowded } from '../src/engine/layout-rules.js';
import { PRESET_DRAFTS } from '../src/app/presets.js';
import { DOMAINS } from '../src/classifier/domain-dictionaries.js';
import { stripAcademicFluff, deduceKeyTakeaway, summarizeSectionForSlide } from '../src/engine/academic-summarizer.js';
import { SlideNavigation } from '../src/preview/slide-navigation.js';
import { getIconDataUri } from '../src/design/interface-icons.js';
import { generatePptxDeck } from '../src/export/generate-pptx.js';
import { THEME_VARIANTS } from '../src/design/domain-themes.js';
import { exportPdfDeck } from '../src/export/export-pdf.js';
import { createEmptyDraft } from '../src/storage/draft-storage.js';

let passed = 0;
let failed = 0;

function assert(condition, message) {
  if (condition) {
    console.log(`  ✓ PASS: ${message}`);
    passed++;
  } else {
    console.error(`  ✗ FAIL: ${message}`);
    failed++;
  }
}

console.log('\n=== 1. Testing Text Normalizer ===');
const arabicSample = 'إِدَارَةُ المَوَارِدِ البَشَرِيَّةِ!';
const normalizedAr = normalizeArabic(arabicSample);
assert(normalizedAr === 'اداره الموارد البشريه', `Arabic Tashkeel & Alef unification: "${normalizedAr}"`);

const frenchSample = 'Systèmes d\'Information et Économie';
const normalizedFr = normalizeLatin(frenchSample);
assert(normalizedFr === 'systemes d information et economie', `French accent & case normalization: "${normalizedFr}"`);

console.log('\n=== 2. Testing Domain Classification on Preset Scenarios ===');

// Test Scenario 1: Management (HR)
const hrRes = classifyDomain(PRESET_DRAFTS['management-hr']);
assert(hrRes.selectedDomain === DOMAINS.MANAGEMENT, `HR Management classified as "${hrRes.selectedDomain}" (Score: ${hrRes.topScore})`);
assert(hrRes.confidence === 'high', `Confidence is high (${hrRes.confidence})`);

// Test Scenario 2: Medicine (Anatomy)
const medRes = classifyDomain(PRESET_DRAFTS['medicine-anatomy']);
assert(medRes.selectedDomain === DOMAINS.MEDICINE, `Medical Anatomy classified as "${medRes.selectedDomain}" (Score: ${medRes.topScore})`);

// Test Scenario 3: Economics (GDP & Inflation)
const econRes = classifyDomain(PRESET_DRAFTS['economics-gdp']);
assert(econRes.selectedDomain === DOMAINS.ECONOMICS, `Macroeconomics classified as "${econRes.selectedDomain}" (Score: ${econRes.topScore})`);

// Test Scenario 4: Accounting (Balance Sheet)
const accRes = classifyDomain(PRESET_DRAFTS['accounting-balance-sheet']);
assert(accRes.selectedDomain === DOMAINS.ACCOUNTING, `Accounting classified as "${accRes.selectedDomain}" (Score: ${accRes.topScore})`);

// Test Scenario 5: Technology (Networks)
const techRes = classifyDomain(PRESET_DRAFTS['technology-network']);
assert(techRes.selectedDomain === DOMAINS.TECHNOLOGY, `Network Security classified as "${techRes.selectedDomain}" (Score: ${techRes.topScore})`);

// Test Scenario 6: Information Systems (Databases)
const isRes = classifyDomain(PRESET_DRAFTS['information-systems-data']);
assert(isRes.selectedDomain === DOMAINS.INFORMATION_SYSTEMS, `Information Systems classified as "${isRes.selectedDomain}" (Score: ${isRes.topScore})`);

// Test Scenario 7: Fallback on Empty or Abstract Draft
const emptyRes = classifyDomain({ title: 'دراسة في فلسفة الوجود والماهية العامة' });
assert(emptyRes.confidence === 'none' || emptyRes.confidence === 'low', `Abstract text handles fallback gracefully (${emptyRes.confidence})`);

console.log('\n=== 3. Testing Content-Type Classification ===');
const defBlock = { title: 'تعريف تسيير الموارد البشرية اصطلاحاً', paragraphs: ['هو مجموعة السياسات...'] };
assert(classifySlideContentType(defBlock) === SLIDE_TYPES.DEFINITION, 'Definition block detected');

const compBlock = { title: 'مقارنة بين نموذج OSI ونموذج TCP/IP' };
assert(classifySlideContentType(compBlock) === SLIDE_TYPES.COMPARISON, 'Comparison block detected');

const prosConsBlock = { title: 'مزايا وعيوب الحوسبة السحابية' };
assert(classifySlideContentType(prosConsBlock) === SLIDE_TYPES.PROS_CONS, 'Pros/Cons block detected');

const timelineBlock = { title: 'التطور التاريخي لنظم المعلومات', paragraphs: ['بدأت في 1960 وتطورت في 1995 وبلغت أوجها في 2024.'] };
assert(classifySlideContentType(timelineBlock) === SLIDE_TYPES.TIMELINE, 'Timeline block detected');

const statBlock = { title: 'مؤشرات', statistics: [{ label: 'A', value: 10 }] };
assert(classifySlideContentType(statBlock) === SLIDE_TYPES.STATISTICS, 'Statistics block detected');

const tableBlock = { title: 'جدول', table: { headers: ['A'], rows: [['1']] } };
assert(classifySlideContentType(tableBlock) === SLIDE_TYPES.TABLE, 'Table block detected');

console.log('\n=== 4. Testing Academic Summarizer & Fluff Filter ===');

const fluffyText = 'مما لا شك فيه أن التحول الرقمي يسهم في تعزيز كفاءة الحوكمة المؤسسية وتطوير الخدمات.';
const cleanedText = stripAcademicFluff(fluffyText);
assert(!cleanedText.includes('مما لا شك فيه'), `Fluff stripped cleanly: "${cleanedText}"`);
assert(cleanedText.startsWith('التحول الرقمي'), `Proposition starts directly with core subject: "${cleanedText}"`);

const deductionText = 'وتجدر الإشارة إلى أن تطبيق المعايير أدى إلى نتائج ملموسة. وتوصل البحث إلى أن الأتمتة قلصت التكاليف بنسبة 35% وضاعفت الإنتاجية.';
const takeaway = deduceKeyTakeaway([deductionText], [], 'الحوكمة');
assert(takeaway.includes('الاستنتاج الجوهري:'), `Takeaway deduction prefix generated: "${takeaway}"`);
assert(takeaway.includes('35%') || takeaway.includes('قلصت التكاليف'), `Takeaway captured quantitative empirical finding: "${takeaway}"`);

console.log('\n=== 5. Testing Introduction vs Sections Distinction & Zero (تابع) Slides ===');
const academicDraft = {
  title: 'أثر الذكاء الاصطناعي في التدقيق المحاسبي',
  language: 'ar',
  introduction: 'يشهد قطاع المحاسبة والتدقيق تطوراً تكنولوجياً متسارعاً أحدث نقلة نوعية في أدوات الفحص المالي.',
  problemStatement: 'ما مدى فعالية الخوارزميات الذكية في اكتشاف التلاعب المالي مقارنة بالتدقيق التقليدي؟',
  objectives: [
    'تشخيص واقع تبني الذكاء الاصطناعي في مكاتب التدقيق',
    'قياس أثر الأتمتة على تقليص مخاطر الخطأ المحاسبي'
  ],
  methodology: 'المنهج الوصفي التحليلي المقارن',
  sections: [
    {
      id: 'sec-1',
      title: 'المبحث الأول: الإطار المفاهيمي للتدقيق الآلي المتقدم في المؤسسات المالية المعاصرة',
      paragraphs: [
        'مما لا شك فيه أن التدقيق الآلي يمثل منهجية إلكترونية متطورة تعتمد على معالجة البيانات الضخمة. وتجدر الإشارة في هذا الصدد إلى أن هذه المنهجية تسهم في فحص كافة السجلات المحاسبية بنسبة تغطية كاملة بدلاً من أسلوب العينات التقليدي. ومن هذا المنطلق يتضح أن النظام يوفر رقابة لحظية مستمرة تكشف الانحرافات المالية في وقت مبكر.',
        'وفي هذا السياق يمكن التأكيد على أن الأتمتة المحاسبية تتطلب بنية تحتية سحابية آمنة وتأهيلاً احترافياً للمدققين لضمان سلامة الإجراءات والامتثال لمعايير التدقيق الدولية المعتمدة.'
      ],
      bullets: [
        'فحص السجلات بنسبة تغطية 100% بدلاً من العينات العشوائية المحدودة',
        'كشف العمليات المشبوهة والانحرافات المحاسبية بشكل فوري ولحظي',
        'مواءمة الإجراءات مع معايير التدقيق الدولية الصادرة عن المنظمات المهنية'
      ]
    }
  ],
  conclusion: 'توصل البحث إلى أن دمج تقنيات الذكاء الاصطناعي في التدقيق لم يعد خياراً تكميلياً بل ضرورة حتمية لتعزيز موثوقية القوائم المالية.',
  references: ['الزهراني، أحمد (2023). المحاسبة الرقمية والتدقيق الحديث، دار الفكر، الرياض.']
};

const generatedSlides = splitDraftIntoSlides(academicDraft, DENSITY_MODES.STANDARD);

// 1. Verify Introduction Slide is generated as a dedicated first-class slide
const introSlide = generatedSlides.find(s => s.type === SLIDE_TYPES.INTRODUCTION);
assert(introSlide !== undefined, 'Dedicated Introduction slide generated');
assert(introSlide.problemStatement.includes('الخوارزميات الذكية'), 'Introduction slide contains problem statement');
assert(introSlide.objectives.length >= 2, `Introduction slide contains research objectives (${introSlide.objectives.length})`);

// 2. Verify Section is separated from Introduction
const sectionSlide = generatedSlides.find(s => s.id && s.id.startsWith('slide-section-'));
assert(sectionSlide !== undefined, 'Mabhath/Section slide generated separately from Introduction');
assert(sectionSlide.title.includes('المبحث الأول'), 'Section slide preserves section title');

// 3. Verify ZERO continuation (تابع) slides are generated
const continuationSlide = generatedSlides.find(s => s.title && s.title.includes('تابع'));
assert(continuationSlide === undefined, 'ZERO continuation (تابع) slides generated - all content self-contained on its slide');

// 4. Verify Summarization & Distillation on Section Slide
assert(sectionSlide.paragraphs.length === 1, `Section paragraph condensed to 1 concise lead sentence (Actual: ${sectionSlide.paragraphs.length})`);
assert(sectionSlide.bullets.length <= 4, `Bullets distilled to fit slide budget (Actual: ${sectionSlide.bullets.length})`);
assert(Boolean(sectionSlide.keyPoint), `Key takeaway deduction generated for slide: "${sectionSlide.keyPoint}"`);

// 5. Verify Conclusion Slide Completeness and Crowding Safety
const conclusionSlide = generatedSlides.find(s => s.type === SLIDE_TYPES.CONCLUSION);
assert(conclusionSlide !== undefined, 'Conclusion slide generated');
assert(!conclusionSlide.paragraphs[0].endsWith('...'), `Conclusion text is complete without ellipsis: "${conclusionSlide.paragraphs[0]}"`);
assert(conclusionSlide.paragraphs[0].includes('ضرورة حتمية لتعزيز موثوقية القوائم المالية'), 'Conclusion preserved full research thought');
assert(isSlideCrowded(conclusionSlide, DENSITY_MODES.STANDARD) === false, 'Conclusion slide is NOT falsely flagged as crowded (محتوى كثيف)');

console.log('\n=== 6. Testing Slide Navigation Controls (Next / Prev / Bounds) ===');
const mockAppState = {
  generatedSlides: [{ id: 1 }, { id: 2 }, { id: 3 }],
  activeSlideIndex: 0,
  setActiveSlideIndex(i) {
    if (i >= 0 && i < this.generatedSlides.length) {
      this.activeSlideIndex = i;
    }
  },
  nextSlide() {
    if (this.activeSlideIndex < this.generatedSlides.length - 1) {
      this.setActiveSlideIndex(this.activeSlideIndex + 1);
    }
  },
  prevSlide() {
    if (this.activeSlideIndex > 0) {
      this.setActiveSlideIndex(this.activeSlideIndex - 1);
    }
  }
};

let notifiedIndex = -1;
const nav = new SlideNavigation({
  appState: mockAppState,
  onSlideChange: (i) => { notifiedIndex = i; }
});

assert(nav.currentIndex === 0, 'Initial slide index is 0');
nav.next();
assert(nav.currentIndex === 1, 'Next button advances slide index to 1');
assert(notifiedIndex === 1, 'onSlideChange notified with index 1');
nav.next();
assert(nav.currentIndex === 2, 'Next button advances slide index to 2');
nav.next();
assert(nav.currentIndex === 2, 'Next button respects upper bound at last slide');
nav.prev();
assert(nav.currentIndex === 1, 'Prev button rewinds slide index to 1');
nav.prev();
assert(nav.currentIndex === 0, 'Prev button rewinds slide index to 0');
nav.prev();
assert(nav.currentIndex === 0, 'Prev button respects lower bound at 0');

console.log('\n=== 7. Testing PPTX Export Generator & Icon Data URIs ===');

const testIconUri = getIconDataUri('bookOpen', '#0f766e', 64);
assert(testIconUri.startsWith('data:image/svg+xml;base64,'), 'Icon Data URI starts with valid "data:image/svg+xml;base64," prefix');
assert(testIconUri.length > 50, 'Icon Data URI generated with non-trivial base64 content');

const sampleTheme = THEME_VARIANTS['econ-trend'];
assert(sampleTheme && sampleTheme.id === 'econ-trend', 'Default theme "econ-trend" correctly loaded');

const testDeckResult = await generatePptxDeck(
  [
    {
      type: 'cover',
      title: 'عنوان البحث الأكاديمي',
      subtitle: 'دراسة تطبيقية',
      presenter: 'الباحث',
      institution: 'الجامعة'
    },
    {
      type: 'conclusion',
      title: 'خاتمة البحث',
      leadParagraph: 'استنتاجات وتوصيات البحث النهائي.',
      recommendations: ['التوصية الأولى', 'التوصية الثانية']
    }
  ],
  'economics',
  sampleTheme,
  { title: 'ملف_تجريبي' }
);
assert(testDeckResult.success === true, 'PPTX deck generated successfully');
assert(testDeckResult.fileName.endsWith('.pptx'), 'PPTX output filename has correct .pptx extension');

console.log('\n=== 8. Testing PDF Export Module & Container Setup ===');
assert(typeof exportPdfDeck === 'function', 'exportPdfDeck function exported and available');

console.log('\n=== 9. Testing 3-Step Wizard Navigation & Academic Fields in index.html ===');
const indexHtmlContent = readFileSync(resolve(process.cwd(), 'index.html'), 'utf-8');

// Step 1 assertions
assert(indexHtmlContent.includes('id="studio-stepper-header"'), 'Stepper navigation header exists');
assert(indexHtmlContent.includes('id="step-panel-1"'), 'Step 1 panel exists');
assert(indexHtmlContent.includes('id="input-api-key"'), 'Step 1: API key input field exists');
assert(indexHtmlContent.includes('id="select-ai-model"'), 'Step 1: AI Model selector exists');
assert(indexHtmlContent.includes('id="btn-step1-next"'), 'Step 1: Next button exists');

// Step 2 assertions
assert(indexHtmlContent.includes('id="step-panel-2"'), 'Step 2 panel exists');
assert(indexHtmlContent.includes('id="ai-academic-domain"'), 'Step 2: Academic domain/specialization exists');
assert(indexHtmlContent.includes('id="ai-course"'), 'Step 2: Course / Module (الموديل/المقياس) input exists');
assert(indexHtmlContent.includes('id="ai-author"'), 'Step 2: Students / Authors (أسماء الطلبة) input exists');
assert(indexHtmlContent.includes('id="ai-instructor"'), 'Step 2: Instructor / Professor (اسم الأستاذ) input exists');
assert(indexHtmlContent.includes('id="ai-institution"'), 'Step 2: University / Institution (اسم الجامعة) input exists');
assert(indexHtmlContent.includes('id="ai-faculty"'), 'Step 2: Faculty / Department (الكلية أو القسم) input exists');
assert(indexHtmlContent.includes('id="btn-step2-prev"'), 'Step 2: Back button to Step 1 exists');
assert(indexHtmlContent.includes('id="btn-step2-next"'), 'Step 2: Next button to Step 3 exists');

// Step 3 assertions
assert(indexHtmlContent.includes('id="step-panel-3"'), 'Step 3 panel exists');
assert(indexHtmlContent.includes('id="ai-topic-prompt"'), 'Step 3: Research topic/title (عنوان البحث) exists');
assert(indexHtmlContent.includes('id="ai-mabhath-count"'), 'Step 3: Mabaheth count selector (عدد المباحث) exists');
assert(indexHtmlContent.includes('id="ai-matlab-count"'), 'Step 3: Matalib count selector (عدد المطالب) exists');
assert(indexHtmlContent.includes('id="ai-slide-count"'), 'Step 3: Slide count selector (عدد الشرائح) exists');
assert(indexHtmlContent.includes('id="research-structure-pill"'), 'Step 3: Live research structure pill exists');
assert(indexHtmlContent.includes('id="btn-generate-ai-deck"'), 'Step 3: Main AI Generation button exists');
assert(indexHtmlContent.includes('id="btn-step3-prev"'), 'Step 3: Back button to Step 2 exists');

// Brand Identity assertions
assert(indexHtmlContent.includes('شريحتك'), 'Brand name "شريحتك" is present in index.html');
assert(!indexHtmlContent.includes('brand-badge-tag'), 'AI badge is removed from header');
assert(indexHtmlContent.includes('src="/logo.png"'), 'Brand logo image is referenced in header');
assert(indexHtmlContent.includes('href="/favicon.png"'), 'Favicon references favicon.png');

console.log('\n=== 10. Testing Initial Zero-Slides State for New Visitors ===');
const emptyDraft = createEmptyDraft();
assert(emptyDraft.title === '', 'Empty draft title is empty string');
assert(Array.isArray(emptyDraft.sections) && emptyDraft.sections.length === 0, 'Empty draft has 0 sections');

const emptySlides = splitDraftIntoSlides(emptyDraft, DENSITY_MODES.STANDARD);
assert(Array.isArray(emptySlides) && emptySlides.length === 0, 'Empty draft yields exactly 0 slides on fresh load');

assert(indexHtmlContent.includes('id="viewer-counter-display">0 / 0<'), 'Viewer counter defaults to 0 / 0 in index.html');
assert(indexHtmlContent.includes('id="tab-slide-count">0<'), 'Navigation tab counter defaults to 0 in index.html');
assert(indexHtmlContent.includes('id="thumbs-counter">0 شريحة<'), 'Thumbnails counter defaults to 0 شريحة in index.html');
assert(indexHtmlContent.includes('id="sidebar-total-slides" style="color: var(--theme-primary); font-size: 1.05rem;">0 شريحة<'), 'Sidebar counter defaults to 0 شريحة in index.html');

console.log('\n=== 11. Testing Elimination of Fake Placeholders & Conditional Charts ===');

// Test 11.1: Qualitative topic with layoutType 'statistics' but NO data must NOT produce chart or dummy stats
const qualitativeDraft = {
  title: 'التأصيل الفلسفي للعدالة والقانون الطبيعي',
  language: 'ar',
  sections: [
    {
      title: 'المبحث الأول: المفاهيم المؤسسة',
      subsections: [
        {
          title: 'المطلب الأول: البعد النظري للعدالة',
          layoutType: 'statistics', // mistakenly flagged or from prompt
          paragraphs: ['تستند العدالة الفلسفية إلى معايير أخلاقية غير قابلة للتجزئة أو القياس المادي.']
        }
      ]
    }
  ]
};
const qualSlides = splitDraftIntoSlides(qualitativeDraft, DENSITY_MODES.STANDARD);
const hasFakeStatSlide = qualSlides.some(s => s.type === SLIDE_TYPES.STATISTICS);
assert(!hasFakeStatSlide, 'Qualitative topic with empty stats does NOT generate a STATISTICS slide');

const allSlideText = JSON.stringify(qualSlides);
assert(!allSlideText.includes('مؤشر النمو'), 'No dummy "مؤشر النمو" placeholder injected');
assert(!allSlideText.includes('دقة التحليل'), 'No dummy "دقة التحليل" placeholder injected');
assert(!allSlideText.includes('عنصر 1'), 'No dummy table "عنصر 1" placeholder injected');
assert(!allSlideText.includes('الجانب الأول'), 'No dummy comparison "الجانب الأول" placeholder injected');
assert(!allSlideText.includes('المرحلة الأولى'), 'No dummy process "المرحلة الأولى" placeholder injected');

// Test 11.2: Quantitative topic with genuine statistics DOES generate STATISTICS slide
const quantDraft = {
  title: 'تحليل الأداء المالي والربحية للبنوك',
  language: 'ar',
  sections: [
    {
      title: 'المبحث الأول: القوائم المالية والمؤشرات',
      subsections: [
        {
          title: 'المطلب الأول: مؤشرات العائد والسيولة النقدية',
          layoutType: 'statistics',
          statistics: [
            { label: 'معدل العائد على الأصول (ROA)', value: '14.2', unit: '%' },
            { label: 'نسبة السيولة النقدية', value: '38.5', unit: '%' }
          ],
          paragraphs: ['أظهرت البيانات المالية للمصارف تحسناً ملحوظاً في مؤشرات السيولة.']
        }
      ]
    }
  ]
};
const quantSlides = splitDraftIntoSlides(quantDraft, DENSITY_MODES.STANDARD);
const statSlide = quantSlides.find(s => s.type === SLIDE_TYPES.STATISTICS);
assert(Boolean(statSlide), 'Genuinely quantitative topic generates a STATISTICS slide');
assert(statSlide?.statistics?.[0]?.label === 'معدل العائد على الأصول (ROA)', 'Preserved authentic statistical labels and values');

console.log(`\n========================================`);
console.log(`Summary: ${passed} Passed, ${failed} Failed`);
console.log(`========================================\n`);

if (failed > 0) {
  process.exit(1);
}
