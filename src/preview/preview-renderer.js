/**
 * Live 16:9 Slide Preview Renderer - Flaticon UIcons Edition
 * Renders high-fidelity, visually stunning academic slides complete with diagrams,
 * process flow arrows, comparison badges, definition cards, metric KPI cards,
 * and clean monochrome vector interface icons (Flaticon UIcons style).
 * 
 * Zero cartoon emojis / zero stickers. Pure professional academic aesthetic.
 */

import { SLIDE_TYPES, SLIDE_TYPE_METADATA } from '../classifier/content-type-classifier.js';
import { resolveSlideLayout } from '../engine/layout-selector.js';
import { isSlideCrowded } from '../engine/layout-rules.js';
import { renderIcon, DOMAIN_INTERFACE_ICONS, SLIDE_TYPE_ICONS } from '../design/interface-icons.js';
import {
  getSlideBackgroundSvg,
  getDomainInfographicSvg,
  getConceptOrbitSvg,
  getComparisonVsBadgeSvg
} from '../design/visual-diagrams.js';

export function renderSlideToHtml(rawSlide, domain, theme, density = 'standard') {
  const model = resolveSlideLayout(rawSlide, domain, theme);
  const isCrowded = isSlideCrowded(model, density);
  const meta = SLIDE_TYPE_METADATA[model.type] || { nameAr: 'شريحة عامة' };
  const isRtl = model.isRtl;
  const domainInfo = DOMAIN_INTERFACE_ICONS[domain] || DOMAIN_INTERFACE_ICONS.general;
  const typeIconKey = SLIDE_TYPE_ICONS[model.type] || 'fileText';

  let bodyContent = '';

  switch (model.type) {
    case SLIDE_TYPES.COVER:
      bodyContent = renderCoverSlideHtml(model, theme, domainInfo);
      break;

    case SLIDE_TYPES.AGENDA:
      bodyContent = renderAgendaSlideHtml(model, theme, domainInfo);
      break;

    case SLIDE_TYPES.INTRODUCTION:
      bodyContent = renderIntroductionSlideHtml(model, theme, domainInfo);
      break;

    case SLIDE_TYPES.SECTION_DIVIDER:
      bodyContent = renderDividerSlideHtml(model, theme, domainInfo);
      break;

    case SLIDE_TYPES.STATISTICS:
      bodyContent = renderStatisticsSlideHtml(model, theme, domainInfo);
      break;

    case SLIDE_TYPES.TABLE:
      bodyContent = renderTableSlideHtml(model, theme, domainInfo);
      break;

    case SLIDE_TYPES.COMPARISON:
      bodyContent = renderComparisonSlideHtml(model, theme, domainInfo);
      break;

    case SLIDE_TYPES.PROS_CONS:
      bodyContent = renderProsConsSlideHtml(model, theme, domainInfo);
      break;

    case SLIDE_TYPES.PROCESS_STEPS:
      bodyContent = renderProcessSlideHtml(model, theme, domainInfo);
      break;

    case SLIDE_TYPES.TIMELINE:
      bodyContent = renderTimelineSlideHtml(model, theme, domainInfo);
      break;

    case SLIDE_TYPES.DEFINITION:
      bodyContent = renderDefinitionSlideHtml(model, theme, domainInfo);
      break;

    case SLIDE_TYPES.CONCLUSION:
      bodyContent = renderConclusionSlideHtml(model, theme, domainInfo);
      break;

    case SLIDE_TYPES.REFERENCES:
      bodyContent = renderReferencesSlideHtml(model, theme, domainInfo);
      break;

    default:
      bodyContent = renderStandardSlideHtml(model, theme, domainInfo, domain);
      break;
  }

  const crowdedWarning = isCrowded
    ? `<div class="slide-crowded-badge" title="محتوى كثيف يقترب من حد الشريحة">${renderIcon('alertTriangle', { size: 14, color: '#d97706' })} محتوى كثيف</div>`
    : '';

  return `
    <div class="slide-canvas ${isRtl ? 'dir-rtl' : 'dir-ltr'}" 
         style="--slide-bg: ${theme.background}; --slide-surface: ${theme.surface}; --slide-primary: ${theme.primary}; --slide-secondary: ${theme.secondary}; --slide-accent: ${theme.accent}; --slide-text: ${theme.textPrimary}; --slide-border: ${theme.border};">
      
      <!-- Vector Background Mesh, Ambient Glows & Dual-Tone Split Screen -->
      ${getSlideBackgroundSvg(theme.primary, theme.secondary, model.type, isRtl)}

      <!-- Top Decorative Gradient Strip -->
      <div class="slide-accent-top-strip" style="background: linear-gradient(90deg, ${theme.primary}, ${theme.secondary}, ${theme.accent});"></div>

      <!-- Slide Crowded Warning Badge if triggered -->
      ${crowdedWarning ? `
        <div class="slide-header-badges">
          ${crowdedWarning}
        </div>
      ` : ''}

      <!-- Slide Main Content Area -->
      <div class="slide-inner">
        ${bodyContent}
      </div>

      <!-- Slide Footer Bar -->
      ${model.type !== SLIDE_TYPES.COVER && model.type !== SLIDE_TYPES.SECTION_DIVIDER ? `
        <div class="slide-footer-bar">
          <div style="display: flex; align-items: center; gap: 0.5rem;">
            <span class="footer-seal-icon">${renderIcon('graduationCap', { size: 15, color: theme.primary })}</span>
            <span class="slide-meta-note">عرض أكاديمي جامعي مهيكل ومحكّم</span>
          </div>
          <span class="slide-number-indicator" style="background: ${theme.primary}; color: #ffffff;">
            ${model.slideNumber || 1} / ${model.totalSlides || 1}
          </span>
        </div>
      ` : ''}
    </div>
  `;
}

/**
 * Thumbnails sidebar item
 */
export function renderSlideThumbnailHtml(rawSlide, index, isActive, domain, theme) {
  const model = resolveSlideLayout(rawSlide, domain, theme);
  const typeMeta = SLIDE_TYPE_METADATA[model.type] || { nameAr: 'شريحة' };
  const typeIconKey = SLIDE_TYPE_ICONS[model.type] || 'fileText';

  return `
    <div class="slide-thumb-card ${isActive ? 'active' : ''}" data-slide-index="${index}">
      <div class="thumb-header">
        <span class="thumb-number">${index + 1}</span>
        <span class="thumb-type" style="display: inline-flex; align-items: center; gap: 0.35rem;">
          ${renderIcon(typeIconKey, { size: 13, color: theme.primary })}
          <span>${typeMeta.nameAr}</span>
        </span>
      </div>
      <div class="thumb-body" style="background-color: ${theme.background}; border-color: ${isActive ? theme.primary : theme.border}">
        <div class="thumb-title" style="color: ${theme.primary}">${escapeHtml(model.title || 'شريحة')}</div>
        <div class="thumb-snippet" style="color: ${theme.textSecondary}">
          ${escapeHtml((model.paragraphs?.[0] || model.bullets?.[0] || model.institution || '').substring(0, 45))}...
        </div>
      </div>
    </div>
  `;
}

// ================= LAYOUT RENDERERS WITH UICONS & DIAGRAMS =================

/**
 * 1. Cover Slide - Academic Crest, Metadata Badges & Ornamental Frame
 */
function renderCoverSlideHtml(model, theme, domainInfo) {
  return `
    <div class="cover-layout">
      <!-- Traditional Basmala Calligraphy Cartouche -->
      <div class="cover-basmala-cartouche" style="color: ${theme.primary};">
        « بِسْمِ اللَّـهِ الرَّحْمَـٰنِ الرَّحِيمِ »
      </div>


      <!-- Institution Header -->
      <div class="cover-header-meta">
        ${model.institution ? `<span class="inst-pill" style="border-color: ${theme.primary}; display: inline-flex; align-items: center; gap: 0.4rem;">${renderIcon('university', { size: 14, color: theme.primary })} ${escapeHtml(model.institution)}</span>` : ''}
        ${model.faculty ? `<span class="faculty-pill" style="display: inline-flex; align-items: center; gap: 0.4rem;">${renderIcon('bookOpen', { size: 14, color: theme.primary })} ${escapeHtml(model.faculty)}</span>` : ''}
        ${model.course ? `<span class="course-pill" style="display: inline-flex; align-items: center; gap: 0.4rem;">${renderIcon('bookmark', { size: 14, color: theme.primary })} ${escapeHtml(model.course)}</span>` : ''}
      </div>

      <!-- Main Title Showcase Box -->
      <div class="cover-title-card" style="border-color: ${theme.primary}; background: ${theme.surface};">
        <div class="cover-emblem-badge" style="background: ${theme.primary}; color: #ffffff;">
          ${renderIcon(domainInfo.iconKey, { size: 26, color: '#ffffff' })}
        </div>
        <h1 class="cover-title" style="color: ${theme.primary}">${escapeHtml(model.title)}</h1>
        <div class="cover-accent-divider" style="background: ${theme.secondary};"></div>
      </div>

      <!-- Metadata Cards Grid (Student, Supervisor, Date) -->
      <div class="cover-details-grid">
        ${model.author ? `
          <div class="cover-meta-card" style="border-color: ${theme.border}; background: ${theme.surface};">
            <span class="meta-icon" style="display: inline-flex; align-items: center; justify-content: center;">
              ${renderIcon('user', { size: 20, color: theme.primary })}
            </span>
            <div class="meta-info">
              <span class="meta-role">إعداد الباحث / الطالب</span>
              <strong class="meta-name" style="color: ${theme.textPrimary};">${escapeHtml(model.author)}</strong>
            </div>
          </div>
        ` : ''}

        ${model.instructor ? `
          <div class="cover-meta-card" style="border-color: ${theme.border}; background: ${theme.surface};">
            <span class="meta-icon" style="display: inline-flex; align-items: center; justify-content: center;">
              ${renderIcon('supervisor', { size: 20, color: theme.primary })}
            </span>
            <div class="meta-info">
              <span class="meta-role">تحت إشراف الأستاذ</span>
              <strong class="meta-name" style="color: ${theme.textPrimary};">${escapeHtml(model.instructor)}</strong>
            </div>
          </div>
        ` : ''}
      </div>
    </div>
  `;
}

/**
 * 1b. Academic Research Plan / Agenda Slide (خطة البحث: 3 مباحث وكل مبحث 3 مطالب)
 */
function renderAgendaSlideHtml(model, theme, domainInfo) {
  const plan = Array.isArray(model.sectionsPlan) && model.sectionsPlan.length > 0
    ? model.sectionsPlan
    : [
        {
          mabhath: 'المبحث الأول: التأصيل النظري والمفاهيمي',
          matalib: ['المطلب الأول: المفاهيم والنشأة', 'المطلب الثاني: الأبعاد والخصائص', 'المطلب الثالث: المقاربة المنهجية']
        },
        {
          mabhath: 'المبحث الثاني: التحليل التطبيقي والدراسة الميدانية',
          matalib: ['المطلب الأول: تشخيص الواقع الراهن', 'المطلب الثاني: المؤشرات والقياس الكمي', 'المطلب الثالث: تحليل البيانات والنتائج']
        },
        {
          mabhath: 'المبحث الثالث: التقييم النقدي وآفاق التطوير',
          matalib: ['المطلب الأول: موازنة المكتسبات والتحديات', 'المطلب الثاني: آليات الحوكمة والأمن', 'المطلب الثالث: التوصيات وخارطة التحول']
        }
      ];

  return `
    <div class="content-layout">
      ${renderSlideTopHeader(model, theme, 'خطة البحث وهيكل العرض الأكاديمي', 'layers')}

      <div style="display: flex; flex-direction: column; gap: 0.9rem; flex: 1; height: 100%;">
        <!-- Intro Note Bar -->
        <div style="background: ${theme.surface}; border-right: 4px solid ${theme.primary}; border-radius: 8px; padding: 0.65rem 1.25rem; border: 1px solid ${theme.border}; border-right-width: 4px; display: flex; align-items: center; justify-content: space-between;">
          <div style="display: flex; align-items: center; gap: 0.5rem; color: ${theme.textPrimary}; font-size: 0.9rem; font-weight: 600;">
            ${renderIcon('bookOpen', { size: 16, color: theme.primary })}
            <span>تنتظم خطة البحث الحالية في مقدمة وثلاثة مباحث رئيسية يشتمل كل منها على ثلاثة مطالب متخصصة وخاتمة:</span>
          </div>
          <span class="badge-confidence high">3 مباحث × 3 مطالب = 9 مطالب</span>
        </div>

        <!-- 3 Columns for 3 Mabaheth -->
        <div class="agenda-mabaheth-grid" style="gap: 0.85rem; flex: 1;">
          ${plan.slice(0, 3).map((sec, idx) => `
            <div style="background: ${theme.surface}; border: 1px solid ${theme.border}; border-top: 3px solid ${theme.primary}; border-radius: 8px; padding: 0.85rem; display: flex; flex-direction: column; gap: 0.6rem; box-shadow: 0 2px 5px rgba(0,0,0,0.02);">
              <div style="display: flex; align-items: center; gap: 0.5rem;">
                <span style="background: ${theme.primary}; color: #ffffff; width: 24px; height: 24px; border-radius: 6px; display: inline-flex; align-items: center; justify-content: center; font-size: 0.75rem; font-weight: 800;">
                  0${idx + 1}
                </span>
                <strong style="color: ${theme.headerBg}; font-size: 0.88rem; line-height: 1.35;">
                  ${escapeHtml(sec.mabhath || `المبحث ${idx + 1}`)}
                </strong>
              </div>

              <div style="display: flex; flex-direction: column; gap: 0.45rem; flex: 1; margin-top: 0.25rem;">
                ${(sec.matalib || []).slice(0, 3).map((matlab, mIdx) => `
                  <div style="background: ${theme.background}; border: 1px solid ${theme.border}; border-radius: 6px; padding: 0.45rem 0.65rem; font-size: 0.82rem; color: ${theme.textPrimary}; display: flex; align-items: center; gap: 0.45rem; line-height: 1.3;">
                    <span style="color: ${theme.primary}; flex-shrink: 0;">${renderIcon('bookmark', { size: 12, color: theme.primary })}</span>
                    <span>${escapeHtml(matlab)}</span>
                  </div>
                `).join('')}
              </div>
            </div>
          `).join('')}
        </div>

        <!-- Flow Pipeline Bar -->
        <div style="background: ${theme.background}; border: 1px dashed ${theme.border}; border-radius: 6px; padding: 0.4rem 0.85rem; display: flex; align-items: center; justify-content: space-around; font-size: 0.78rem; font-weight: 700; color: ${theme.textSecondary};">
          <span>المقدمة والإشكالية</span>
          <span style="color: ${theme.primary};">➔</span>
          <span style="color: ${theme.primary}; font-weight: 800;">المباحث الثلاثة ومطالبها التسعة</span>
          <span style="color: ${theme.primary};">➔</span>
          <span>الخاتمة والنتائج</span>
          <span style="color: ${theme.primary};">➔</span>
          <span>قائمة المراجع</span>
        </div>
      </div>
    </div>
  `;
}

/**
 * 2a. Academic Introduction Slide - Research Context, Problem Statement & Objectives Cards
 */
function renderIntroductionSlideHtml(model, theme, domainInfo) {
  const introLead = model.introLead || model.paragraphs?.[0] || 'يستعرض هذا البحث الأطر المنهجية والمفاهيمية للظاهرة محل الدراسة.';
  const problem = model.problemStatement || 'تحديد المتغيرات الحاكمة لقياس فاعلية الأداء وضمان الامتثال للمعايير الأكاديمية المعتمدة.';
  const rawObjectives = Array.isArray(model.objectives) && model.objectives.length > 0
    ? model.objectives
    : (Array.isArray(model.bullets) && model.bullets.length > 0
      ? model.bullets
      : ['تشخيص الواقع الميداني وتحديد التحديات الراهنة', 'بناء نموذج تطبيقي متكامل ومحكّم']);
  const methodology = model.methodology || 'المنهج الوصفي التحليلي المقارن';

  return `
    <div class="content-layout">
      ${renderSlideTopHeader(model, theme, 'مقدمة البحث والتأطير المنهجي', 'bookOpen')}

      <div style="display: flex; flex-direction: column; gap: 0.9rem; flex: 1; height: 100%;">
        <!-- Top Context / Background Banner -->
        <div class="intro-context-banner" style="background: ${theme.surface}; border-right: 4px solid ${theme.primary}; border-radius: 8px; padding: 0.75rem 1.25rem; border: 1px solid ${theme.border}; border-right-width: 4px; box-shadow: 0 2px 5px rgba(0,0,0,0.02);">
          <div style="display: flex; align-items: center; gap: 0.5rem; margin-bottom: 0.35rem; color: ${theme.primary}; font-weight: 700; font-size: 0.88rem;">
            ${renderIcon('bookOpen', { size: 15, color: theme.primary })}
            <span>سياق البحث والتمهيد العام:</span>
          </div>
          <p style="font-size: 0.92rem; line-height: 1.6; color: ${theme.textPrimary}; margin: 0;">
            ${escapeHtml(introLead)}
          </p>
        </div>

        <!-- Dual Column: Problem Statement vs Objectives -->
        <div class="intro-cards-grid" style="gap: 1rem; flex: 1;">
          
          <!-- Card 1: Problem Statement -->
          <div class="intro-card" style="background: ${theme.surface}; border: 1px solid ${theme.border}; border-top: 3.5px solid ${theme.secondary}; border-radius: 8px; padding: 1rem; display: flex; flex-direction: column; box-shadow: 0 2px 6px rgba(0,0,0,0.03);">
            <div style="display: flex; align-items: center; gap: 0.5rem; margin-bottom: 0.6rem; color: ${theme.secondary}; font-weight: 700; font-size: 0.95rem;">
              <span style="background: rgba(0,0,0,0.04); padding: 5px; border-radius: 6px; display: inline-flex;">
                ${renderIcon('search', { size: 16, color: theme.secondary })}
              </span>
              <span>إشكالية الدراسة والتساؤلات</span>
            </div>
            <p style="font-size: 0.9rem; line-height: 1.65; color: ${theme.textPrimary}; flex: 1; margin: 0;">
              ${escapeHtml(problem)}
            </p>
            <div style="margin-top: 0.75rem; padding: 0.4rem 0.6rem; background: ${theme.background}; border-radius: 6px; font-size: 0.78rem; color: ${theme.textSecondary}; display: flex; align-items: center; gap: 0.4rem;">
              ${renderIcon('helpCircle', { size: 13, color: theme.secondary })}
              <span>${escapeHtml(model.problemQuestion ? `التساؤل الرئيس: ${model.problemQuestion}` : (model.isRtl ? 'التساؤل الجوهري: ما هي الأبعاد المحددة للإشكالية وكيفية معالجتها علمياً؟' : 'Core Research Question: Key problem dimensions'))}</span>
            </div>
          </div>

          <!-- Card 2: Objectives & Methodology -->
          <div class="intro-card" style="background: ${theme.surface}; border: 1px solid ${theme.border}; border-top: 3.5px solid ${theme.primary}; border-radius: 8px; padding: 1rem; display: flex; flex-direction: column; box-shadow: 0 2px 6px rgba(0,0,0,0.03);">
            <div style="display: flex; align-items: center; gap: 0.5rem; margin-bottom: 0.6rem; color: ${theme.primary}; font-weight: 700; font-size: 0.95rem;">
              <span style="background: rgba(0,0,0,0.04); padding: 5px; border-radius: 6px; display: inline-flex;">
                ${renderIcon('target', { size: 16, color: theme.primary })}
              </span>
              <span>أهداف البحث والمنهج المتبع</span>
            </div>
            <ul style="list-style: none; padding: 0; margin: 0 0 0.5rem 0; display: flex; flex-direction: column; gap: 0.4rem; flex: 1;">
              ${rawObjectives.slice(0, 3).map(obj => `
                <li style="display: flex; align-items: flex-start; gap: 0.45rem; font-size: 0.88rem; line-height: 1.5; color: ${theme.textPrimary};">
                  <span style="color: ${theme.primary}; margin-top: 2px; flex-shrink: 0;">
                    ${renderIcon('checkCircle', { size: 14, color: theme.primary })}
                  </span>
                  <span>${escapeHtml(typeof obj === 'string' ? obj : (obj.text || ''))}</span>
                </li>
              `).join('')}
            </ul>
            <div style="margin-top: auto; padding: 0.4rem 0.6rem; background: ${theme.background}; border-radius: 6px; font-size: 0.78rem; color: ${theme.primary}; font-weight: 600; display: flex; align-items: center; gap: 0.4rem;">
              ${renderIcon('compass', { size: 13, color: theme.primary })}
              <span>المنهجية: ${escapeHtml(methodology)}</span>
            </div>
          </div>

        </div>
      </div>
    </div>
  `;
}

/**
 * 2. Section Divider Slide - Big Medallion Badge & Graphic Backdrop
 */
function renderDividerSlideHtml(model, theme, domainInfo) {
  return `
    <div class="divider-layout">
      <div class="divider-side-stripe" style="background: linear-gradient(180deg, ${theme.primary}, ${theme.secondary});"></div>
      
      <div class="divider-content-box" style="background: ${theme.surface}; border-color: ${theme.border};">
        <!-- Circular Medallion Badge -->
        <div class="divider-medallion" style="background: ${theme.primary}; border-color: ${theme.surface}; color: #ffffff;">
          ${renderIcon('layers', { size: 24, color: '#ffffff' })}
          <span>المبحث ${model.sectionNumber || '١'}</span>
        </div>

        <h2 class="divider-title" style="color: ${theme.headerBg};">
          ${escapeHtml(model.title)}
        </h2>

        <div class="divider-decor-line" style="background: ${theme.primary};"></div>

        <p class="divider-desc" style="color: ${theme.textSecondary}; display: flex; align-items: center; justify-content: center; gap: 0.5rem;">
          ${renderIcon('bookmark', { size: 16, color: theme.primary })}
          <span>محور دراسي متقدم وفق منهجية البحث العلمي المعتمدة</span>
        </p>
      </div>
    </div>
  `;
}

/**
 * 3. Process Steps Slide - Flowchart Diagram with Connected Cards & Directional Arrows
 */
function renderProcessSlideHtml(model, theme, domainInfo) {
  const steps = model.numbered || [];
  return `
    <div class="content-layout">
      ${renderSlideTopHeader(model, theme, 'مسار وخطوات متسلسلة', 'refreshCw')}
      
      <div class="process-diagram-wrapper">
        <div class="process-steps-track">
          ${steps.map((st, i) => `
            <div class="diagram-step-node" style="border-color: ${theme.primary}; background: ${theme.surface};">
              <div class="step-num-badge" style="background: ${theme.primary}; color: #ffffff;">
                ${i + 1}
              </div>
              <div class="step-stage-pill" style="background: ${theme.background}; color: ${theme.primary};">
                المرحلة 0${i + 1}
              </div>
              <p class="step-text-body">${escapeHtml(st)}</p>
            </div>
            ${i < steps.length - 1 ? `
              <div class="process-flow-arrow" style="color: ${theme.primary}; display: flex; align-items: center; justify-content: center;">
                ${renderIcon(model.isRtl ? 'arrowLeft' : 'arrowRight', { size: 22, color: theme.primary })}
              </div>
            ` : ''}
          `).join('')}
        </div>
      </div>
    </div>
  `;
}

/**
 * 4. Comparison Slide - Two Columns with Center "VS" Badge
 */
function renderComparisonSlideHtml(model, theme, domainInfo) {
  const comp = model.comparison || { colA: { title: 'الجانب الأول', items: [] }, colB: { title: 'الجانب الثاني', items: [] } };
  return `
    <div class="content-layout">
      ${renderSlideTopHeader(model, theme, 'دراسة مقارنة ومفاضلة', 'scale')}
      
      <div class="comparison-diagram-container">
        <!-- Column A -->
        <div class="comp-card card-a" style="border-color: ${theme.primary}; background: ${theme.surface};">
          <div class="comp-head" style="background: ${theme.primary}; color: #ffffff; display: flex; align-items: center; justify-content: center; gap: 0.4rem;">
            ${renderIcon('layers', { size: 16, color: '#ffffff' })}
            <span>${escapeHtml(comp.colA?.title || 'الجانب الأول')}</span>
          </div>
          <ul class="comp-items-list">
            ${(comp.colA?.items || []).map(it => `
              <li style="color: #0f172a !important; font-weight: 600;"><span class="comp-bullet-dot" style="background: ${theme.primary};"></span><span style="color: #0f172a !important; font-weight: 600;">${escapeHtml(it)}</span></li>
            `).join('')}
          </ul>
        </div>

        <!-- Center VS Badge Medallion -->
        <div class="comp-vs-medallion" style="background: transparent; border: none; box-shadow: none; display: flex; align-items: center; justify-content: center;">
          ${getComparisonVsBadgeSvg(theme.primary, theme.secondary)}
        </div>

        <!-- Column B -->
        <div class="comp-card card-b" style="border-color: ${theme.secondary}; background: ${theme.surface};">
          <div class="comp-head" style="background: ${theme.secondary}; color: #ffffff; display: flex; align-items: center; justify-content: center; gap: 0.4rem;">
            ${renderIcon('target', { size: 16, color: '#ffffff' })}
            <span>${escapeHtml(comp.colB?.title || 'الجانب الثاني')}</span>
          </div>
          <ul class="comp-items-list">
            ${(comp.colB?.items || []).map(it => `
              <li style="color: #0f172a !important; font-weight: 600;"><span class="comp-bullet-dot" style="background: ${theme.secondary};"></span><span style="color: #0f172a !important; font-weight: 600;">${escapeHtml(it)}</span></li>
            `).join('')}
          </ul>
        </div>
      </div>
    </div>
  `;
}

/**
 * 5. Pros and Cons Slide - Green Checkmark vs Red Triangle Badges
 */
function renderProsConsSlideHtml(model, theme, domainInfo) {
  const bullets = model.bullets || [];
  const mid = Math.ceil(bullets.length / 2);
  const pros = bullets.slice(0, mid);
  const cons = bullets.slice(mid);

  return `
    <div class="content-layout">
      ${renderSlideTopHeader(model, theme, 'موازنة المزايا والتحديات', 'scale')}
      
      <div class="pros-cons-grid">
        <!-- Pros Card -->
        <div class="pros-card" style="border-color: #16a34a; background: #f0fdf4;">
          <div class="pros-head" style="background: #16a34a; color: #ffffff; display: flex; align-items: center; justify-content: center; gap: 0.4rem;">
            ${renderIcon('checkCircle', { size: 18, color: '#ffffff' })}
            <span>${model.isRtl ? 'المزايا والأبعاد الإيجابية' : 'Key Advantages & Strengths'}</span>
          </div>
          <ul class="pros-list">
            ${pros.map(p => `
              <li style="display: flex; align-items: flex-start; gap: 0.4rem; color: #0f172a !important; font-weight: 600;">
                <span style="color: #16a34a; margin-top: 0.2rem; flex-shrink: 0;">${renderIcon('check', { size: 14, color: '#16a34a' })}</span>
                <span style="color: #0f172a !important; font-weight: 600;">${escapeHtml(p)}</span>
              </li>
            `).join('')}
          </ul>
        </div>

        <!-- Cons Card -->
        <div class="cons-card" style="border-color: #dc2626; background: #fef2f2;">
          <div class="cons-head" style="background: #dc2626; color: #ffffff; display: flex; align-items: center; justify-content: center; gap: 0.4rem;">
            ${renderIcon('alertTriangle', { size: 18, color: '#ffffff' })}
            <span>${model.isRtl ? 'التحديات والأبعاد النقدية' : 'Key Challenges & Limitations'}</span>
          </div>
          <ul class="cons-list">
            ${cons.map(c => `
              <li style="display: flex; align-items: flex-start; gap: 0.4rem; color: #0f172a !important; font-weight: 600;">
                <span style="color: #dc2626; margin-top: 0.2rem; flex-shrink: 0;">${renderIcon('cross', { size: 14, color: '#dc2626' })}</span>
                <span style="color: #0f172a !important; font-weight: 600;">${escapeHtml(c)}</span>
              </li>
            `).join('')}
          </ul>
        </div>
      </div>
    </div>
  `;
}

/**
 * 6. Definition Slide - 3-Orbit Conceptual Diagram & Academic Showcase Card
 */
function renderDefinitionSlideHtml(model, theme, domainInfo) {
  const term = model.definitionTerm || model.title;
  return `
    <div class="content-layout">
      ${renderSlideTopHeader(model, theme, 'الإطار المفاهيمي والاصطلاحي', 'bookOpen')}
      
      <div class="definition-showcase-card" style="border-color: ${theme.primary}; background: ${theme.surface};">
        <div class="giant-quote-mark" style="color: ${theme.primary}; opacity: 0.12;">
          ${renderIcon('quote', { size: 54, color: theme.primary })}
        </div>
        
        <!-- Left / Content Column -->
        <div class="def-text-column">
          <div class="def-header-badge" style="background: ${theme.primary}; color: #ffffff; display: inline-flex; align-items: center; gap: 0.4rem;">
            ${renderIcon('bookmark', { size: 16, color: '#ffffff' })}
            <span>المفهوم الاصطلاحي: ${escapeHtml(term)}</span>
          </div>

          <div class="def-body-content">
            ${(model.paragraphs || []).map(p => `
              <p class="def-lead-paragraph">${escapeHtml(p)}</p>
            `).join('')}
            
            <div style="display: flex; flex-wrap: wrap; gap: 0.4rem; margin-top: 0.75rem;">
              ${(model.bullets || []).map(b => `
                <div class="def-bullet-tag" style="background: ${theme.background}; border-color: ${theme.border};">
                  <span class="def-tag-dot" style="background: ${theme.primary};"></span>
                  <span>${escapeHtml(b)}</span>
                </div>
              `).join('')}
            </div>
          </div>
        </div>

        <!-- Right / Visual 3-Orbit Diagram Column -->
        <div class="def-diagram-column" style="display: flex; align-items: center; justify-content: center; height: 100%; min-height: 220px;">
          ${getConceptOrbitSvg(term, theme.primary, theme.secondary)}
        </div>
      </div>
    </div>
  `;
}

/**
 * 7. Statistics & Visual Charts Slide - KPI Badges + Visual Chart
 */
function renderStatisticsSlideHtml(model, theme, domainInfo) {
  const stats = model.statistics || [];
  return `
    <div class="content-layout">
      ${renderSlideTopHeader(model, theme, 'مؤشرات وبيانات إحصائية', 'barChart')}
      
      <!-- Top KPI Cards with Icons -->
      <div class="stats-cards-grid">
        ${stats.map((st, i) => `
          <div class="stat-kpi-card" style="border-color: ${theme.primary}; background: ${theme.surface};">
            <div class="kpi-top-row">
              <span class="kpi-icon-pill" style="background: ${theme.background}; color: ${theme.primary}; display: inline-flex; align-items: center; justify-content: center;">
                ${renderIcon(i % 2 === 0 ? 'trendingUp' : 'barChart', { size: 16, color: theme.primary })}
              </span>
              <span class="kpi-trend-pill" style="color: ${theme.primary}; font-weight: 700;">مؤشر كمي</span>
            </div>
            <div class="stat-value" style="color: ${theme.primary};">
              ${escapeHtml(st.value)} <span class="stat-unit">${escapeHtml(st.unit || '')}</span>
            </div>
            <div class="stat-label" style="color: ${theme.textSecondary};">${escapeHtml(st.label)}</div>
          </div>
        `).join('')}
      </div>

      <!-- Visual Bar Chart Container -->
      <div class="chart-preview-container" style="border-color: ${theme.border}; background: ${theme.surface};">
        <div class="chart-header-row">
          <div class="chart-title" style="display: flex; align-items: center; gap: 0.4rem;">
            ${renderIcon('barChart', { size: 18, color: theme.primary })}
            <span>تمثيل بياني للمؤشرات والبيانات الكمية</span>
          </div>
          <span class="chart-badge-tag" style="background: ${theme.primary}; color: #ffffff;">${model.chartType === 'pie' ? 'مخطط دائري' : (model.chartType === 'line' ? 'مخطط خطي' : 'مخطط أعمدة')}</span>
        </div>

        <div class="chart-bars-visual">
          ${stats.map((st, i) => {
            const num = Math.min(100, Math.max(20, (parseFloat(st.value) || (i + 1) * 25) % 100));
            return `
              <div class="chart-bar-col">
                <div class="bar-fill" style="height: ${num}%; background: linear-gradient(180deg, ${theme.secondary}, ${theme.primary});">
                  <span class="bar-val">${escapeHtml(st.value)}</span>
                </div>
                <span class="bar-lbl">${escapeHtml(st.label)}</span>
              </div>
            `;
          }).join('')}
        </div>
      </div>
    </div>
  `;
}

/**
 * 8. Timeline Slide - Chronological Milestone Diagram
 */
function renderTimelineSlideHtml(model, theme, domainInfo) {
  const bullets = model.bullets || [];
  return `
    <div class="content-layout">
      ${renderSlideTopHeader(model, theme, 'تسلسل زمني ومراحل تاريخية', 'clock')}
      
      <div class="timeline-diagram-wrapper">
        <div class="timeline-track-bar" style="background: ${theme.primary};"></div>
        <div class="timeline-nodes-grid">
          ${bullets.map((b, i) => `
            <div class="timeline-node-card" style="border-color: ${theme.border}; background: ${theme.surface};">
              <div class="node-pin-badge" style="background: ${theme.primary}; color: #ffffff; display: flex; align-items: center; justify-content: center; gap: 0.35rem;">
                ${renderIcon('calendar', { size: 14, color: '#ffffff' })}
                <span>محطة 0${i + 1}</span>
              </div>
              <p class="node-text">${escapeHtml(b)}</p>
            </div>
          `).join('')}
        </div>
      </div>
    </div>
  `;
}

/**
 * 9. Structured Table Slide
 */
function renderTableSlideHtml(model, theme, domainInfo) {
  const table = model.table || { headers: [], rows: [] };
  return `
    <div class="content-layout">
      ${renderSlideTopHeader(model, theme, model.isRtl ? 'جدول المقارنة والتحليل الأكاديمي' : 'Analytical Data Matrix', 'table')}
      <div class="table-container">
        <table class="academic-table" style="border-color: ${theme.border}">
          <thead>
            <tr style="background: ${theme.primary}; color: #ffffff">
              ${(table.headers || []).map(h => `<th style="text-align: center;">${renderIcon('table', { size: 14, color: '#ffffff' })} ${escapeHtml(h)}</th>`).join('')}
            </tr>
          </thead>
          <tbody>
            ${(table.rows || []).map((row, rIdx) => `
              <tr style="background: ${rIdx % 2 === 1 ? theme.background : theme.surface}">
                ${row.map(cell => `<td>${escapeHtml(cell)}</td>`).join('')}
              </tr>
            `).join('')}
          </tbody>
        </table>
      </div>
    </div>
  `;
}

/**
 * 10. Conclusion Slide - Executive Thesis Wrap-up & 3 Actionable Recommendations
 */
function renderConclusionSlideHtml(model, theme, domainInfo) {
  const conclusionText = (model.paragraphs && model.paragraphs[0]) || model.keyPoint || '';
  
  // Extract or fallback recommendation bullets
  let bullets = (Array.isArray(model.bullets) && model.bullets.length > 0)
    ? model.bullets
    : [
        'توظيف النتائج المستخلصة في تطوير المعرفة العلمية والتطبيقية',
        'بناء استراتيجيات منهجية مرنة تستجيب لمتطلبات الواقع العملي',
        'فتح آفاق بحثية جديدة للدراسات المستقبلية والتحليل المقارن'
      ];

  // Limit to at most 3 punchy recommendation cards
  const recCards = bullets.slice(0, 3);

  const cardMeta = [
    { title: 'التوصية الأولى: الأثر العلمي والتطبيقي', icon: 'target', color: theme.primary },
    { title: 'التوصية الثانية: التمكين المنهجي', icon: 'trendingUp', color: theme.secondary },
    { title: 'التوصية الثالثة: الرؤية والآفاق المستقبلية', icon: 'lightbulb', color: theme.accent || theme.primary }
  ];

  return `
    <div class="content-layout">
      ${renderSlideTopHeader(model, theme, 'الخاتمة والنتائج المستخلصة', 'trophy')}
      
      <div class="conclusion-container-v2">
        <!-- 1. Hero Conclusion Statement Box -->
        <div class="conclusion-hero-card" style="border-color: ${theme.primary}; background: ${theme.surface};">
          <div class="conclusion-hero-header">
            <div class="conclusion-medallion" style="background: ${theme.primary}; color: #ffffff;">
              ${renderIcon('trophy', { size: 16, color: '#ffffff' })}
              <strong>الاستنتاج الجوهري وخلاصة البحث</strong>
            </div>
            <span class="conclusion-badge-pill" style="border-color: ${theme.border}; color: ${theme.primary};">
              ${renderIcon('shieldCheck', { size: 13, color: theme.primary })}
              <span>نتائج مؤكدة</span>
            </span>
          </div>
          <p class="conclusion-hero-text">${escapeHtml(conclusionText)}</p>
        </div>

        <!-- 2. Strategic Recommendations / Findings Grid -->
        <div class="conclusion-recommendations-grid" style="grid-template-columns: repeat(${recCards.length}, 1fr);">
          ${recCards.map((rec, idx) => {
            const meta = cardMeta[idx] || cardMeta[0];
            return `
              <div class="recommendation-card" style="border-color: ${meta.color}; background: ${theme.surface};">
                <div class="rec-card-header">
                  <span class="rec-icon-box" style="background: ${meta.color}; color: #ffffff;">
                    ${renderIcon(meta.icon, { size: 14, color: '#ffffff' })}
                  </span>
                  <strong style="color: #0f172a;">${meta.title}</strong>
                </div>
                <p class="rec-card-text">${escapeHtml(rec)}</p>
              </div>
            `;
          }).join('')}
        </div>
      </div>
    </div>
  `;
}

/**
 * 11. References Slide - Bookshelf Badge & Citations
 */
function renderReferencesSlideHtml(model, theme, domainInfo) {
  return `
    <div class="content-layout">
      ${renderSlideTopHeader(model, theme, 'قائمة المصادر والمراجع المعتمدة', 'bookOpen')}
      
      <div class="references-card-container" style="border-color: ${theme.border}; background: ${theme.surface};">
        <div class="references-badge-tag" style="background: ${theme.primary}; color: #ffffff; display: flex; align-items: center; gap: 0.4rem;">
          ${renderIcon('bookmark', { size: 16, color: '#ffffff' })}
          <span>المراجع والتوثيق الأكاديمي</span>
        </div>
        <ul class="references-styled-list">
          ${(model.bullets || []).map((ref, idx) => `
            <li class="ref-item">
              <span class="ref-num-tag" style="background: ${theme.background}; color: ${theme.primary};">[${idx + 1}]</span>
              <span class="ref-citation-text">${escapeHtml(ref)}</span>
            </li>
          `).join('')}
        </ul>
      </div>
    </div>
  `;
}

/**
 * 12. Standard Explanation & Bullets - Side Panel Illustration & Keypoint Card
 */
function renderStandardSlideHtml(model, theme, domainInfo, domain = 'general') {
  const keyTakeaway = model.keyPoint || (model.paragraphs && model.paragraphs[0]) || 'تحليل علمي موثق يستند إلى معطيات البحث.';
  return `
    <div class="content-layout">
      ${renderSlideTopHeader(model, theme, 'عرض تحليلي وتفصيلي', 'fileText')}
      
      <div class="standard-grid-with-visual">
        <!-- Main Content Card -->
        <div class="standard-body-card" style="border-color: ${theme.border}; background: ${theme.surface};">
          ${(model.paragraphs || []).map(p => `<p class="slide-paragraph" style="color: #0f172a !important; font-weight: 500;">${escapeHtml(p)}</p>`).join('')}
          
          ${Array.isArray(model.bullets) && model.bullets.length > 0 ? `
            <ul class="slide-bullets-list">
              ${model.bullets.map(b => `
                <li style="--bullet-color: ${theme.primary}; display: flex; align-items: flex-start; gap: 0.4rem; color: #0f172a !important;">
                  <span class="bullet-sticker-badge" style="background: ${theme.background}; color: ${theme.primary}; margin-top: 0.2rem; flex-shrink: 0;">
                    ${renderIcon('check', { size: 12, color: theme.primary })}
                  </span>
                  <span style="color: #0f172a !important; font-weight: 500;">${escapeHtml(b)}</span>
                </li>
              `).join('')}
            </ul>
          ` : ''}
        </div>

        <!-- Side Visual Architectural Card -->
        <div class="standard-side-visual-card" style="border-color: ${theme.border}; background: ${theme.surface}; padding: 0.85rem; display: flex; flex-direction: column; justify-content: space-between; overflow: hidden;">
          
          <div class="slide-keypoint-side-box" style="background: ${theme.background}; border: 1px solid ${theme.border}; border-top: 3px solid ${theme.primary}; border-radius: 8px; padding: 0.85rem;">
            <div style="display: flex; align-items: center; gap: 0.4rem; font-weight: 700; color: ${theme.primary}; margin-bottom: 0.35rem; font-size: 0.88rem;">
              ${renderIcon('lightbulb', { size: 16, color: theme.primary })}
              <span>إضاءة بحثية واستنتاج محوري:</span>
            </div>
            <p style="color: #0f172a !important; font-weight: 600; font-size: 0.86rem; line-height: 1.6; margin: 0;">
              ${escapeHtml(keyTakeaway)}
            </p>
          </div>

          <div class="domain-diagram-box" style="width: 100%; flex: 1; min-height: 130px; display: flex; align-items: center; justify-content: center; margin: 0.5rem 0;">
            ${getDomainInfographicSvg(domain, theme.primary, theme.secondary)}
          </div>

          <div style="display: flex; align-items: center; justify-content: center; gap: 0.35rem; font-size: 0.72rem; color: ${theme.primary}; font-weight: 700; padding-top: 0.25rem; border-top: 1px solid ${theme.border};">
            ${renderIcon('bookmark', { size: 12, color: theme.primary })}
            <span>تأصيل منهجي موثق</span>
          </div>
        </div>
      </div>
    </div>
  `;
}

function renderSlideTopHeader(model, theme, defaultCategory = '', defaultIconKey = 'bookmark') {
  return `
    <div class="slide-top-header">
      <div style="display: flex; align-items: center; justify-content: space-between;">
        <div class="slide-breadcrumb" style="color: ${theme.primary}; display: flex; align-items: center; gap: 0.4rem;">
          ${renderIcon(defaultIconKey, { size: 14, color: theme.primary })}
          <span>${escapeHtml(model.sectionTitle || defaultCategory)}</span>
        </div>
        ${model.asset ? `<img src="${model.asset.path.startsWith('/') ? '.' + model.asset.path : model.asset.path}" class="slide-corner-asset" alt="" />` : ''}
      </div>
      <h2 class="slide-main-title" style="color: ${theme.headerBg}">
        ${escapeHtml(model.title)}
      </h2>
    </div>
  `;
}

function escapeHtml(str) {
  if (!str) return '';
  return String(str)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#39;');
}
