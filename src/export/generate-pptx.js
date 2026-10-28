/**
 * Master PowerPoint (.pptx) Export Generator - Flaticon UIcons Edition
 * Uses PptxGenJS to produce 100% native, fully editable PowerPoint presentations.
 * Embeds clean vector SVG interface icons (Flaticon UIcons aesthetic), connecting flowchart arrows,
 * circular medallions, comparison VS badges, pros/cons cards, and native PowerPoint charts.
 * 
 * Zero cartoon emojis / zero informal stickers. Publication-ready academic slides.
 */

import pptxgen from 'pptxgenjs';
import { SLIDE_TYPES } from '../classifier/content-type-classifier.js';
import { resolveSlideLayout } from '../engine/layout-selector.js';
import { getFontFamily, getTextAlignment, cleanHexColor } from './text-layout.js';
import { addNativeChartToSlide } from './chart-builder.js';
import { getIconDataUri, DOMAIN_INTERFACE_ICONS, SLIDE_TYPE_ICONS } from '../design/interface-icons.js';
import { MANUSCRIPT_CARTOUCHES } from '../engine/visual-enricher.js';
import {
  svgToDataUri,
  getSlideBackgroundSvg,
  getDomainInfographicSvg,
  getConceptOrbitSvg,
  getComparisonVsBadgeSvg
} from '../design/visual-diagrams.js';

/**
 * Generates and downloads a complete PPTX file from a slide deck sequence
 * @param {Array} rawSlides - Raw slide descriptors
 * @param {string} domain - Detected or selected domain
 * @param {Object} theme - Active theme variant
 * @param {Object} metadata - Presentation metadata for filename
 * @returns {Promise<boolean>} Success indicator
 */
export async function generatePptxDeck(rawSlides, domain, theme, metadata = {}) {
  try {
    const pptx = new pptxgen();

    // Configure 16:9 widescreen layout (10 x 5.625 inches)
    pptx.layout = 'LAYOUT_16x9';
    pptx.author = metadata.author || 'Academic Research Generator';
    pptx.title = metadata.title || 'Academic Presentation';
    pptx.subject = domain;

    const totalSlides = rawSlides.length;
    const domainInfo = DOMAIN_INTERFACE_ICONS[domain] || DOMAIN_INTERFACE_ICONS.general;

    for (let i = 0; i < rawSlides.length; i++) {
      const rawSlide = rawSlides[i];
      const slideModel = resolveSlideLayout(rawSlide, domain, theme);
      const slide = pptx.addSlide();

      // Apply slide background
      slide.background = { color: cleanHexColor(theme.pptx.background) };

      // Render vector background mesh, ambient corner glows and dual-tone split screen
      renderSlideBackgroundDecorations(pptx, slide, theme, slideModel.isRtl, slideModel.type);

      // Render slide content depending on layout type
      switch (slideModel.type) {
        case SLIDE_TYPES.COVER:
          renderCoverSlide(pptx, slide, slideModel, theme, domainInfo);
          break;

        case SLIDE_TYPES.AGENDA:
          renderAgendaSlide(pptx, slide, slideModel, theme, totalSlides, domainInfo);
          break;

        case SLIDE_TYPES.INTRODUCTION:
          renderIntroductionSlide(pptx, slide, slideModel, theme, totalSlides, domainInfo);
          break;

        case SLIDE_TYPES.SECTION_DIVIDER:
          renderDividerSlide(pptx, slide, slideModel, theme, domainInfo);
          break;

        case SLIDE_TYPES.STATISTICS:
          renderStatisticsSlide(pptx, slide, slideModel, theme, totalSlides, domainInfo);
          break;

        case SLIDE_TYPES.TABLE:
          renderTableSlide(pptx, slide, slideModel, theme, totalSlides, domainInfo);
          break;

        case SLIDE_TYPES.COMPARISON:
          renderComparisonSlide(pptx, slide, slideModel, theme, totalSlides, domainInfo);
          break;

        case SLIDE_TYPES.PROS_CONS:
          renderProsConsSlide(pptx, slide, slideModel, theme, totalSlides, domainInfo);
          break;

        case SLIDE_TYPES.PROCESS_STEPS:
          renderProcessSlide(pptx, slide, slideModel, theme, totalSlides, domainInfo);
          break;

        case SLIDE_TYPES.DEFINITION:
          renderDefinitionSlide(pptx, slide, slideModel, theme, totalSlides, domainInfo);
          break;

        case SLIDE_TYPES.TIMELINE:
          renderTimelineSlide(pptx, slide, slideModel, theme, totalSlides, domainInfo);
          break;

        case SLIDE_TYPES.CONCLUSION:
          renderConclusionSlide(pptx, slide, slideModel, theme, totalSlides, domainInfo);
          break;

        case SLIDE_TYPES.REFERENCES:
          renderReferencesSlide(pptx, slide, slideModel, theme, totalSlides, domainInfo);
          break;

        default:
          renderStandardContentSlide(pptx, slide, slideModel, theme, totalSlides, domainInfo, domain);
          break;
      }
    }

    // Generate safe filename
    const safeTitle = (metadata.title || 'academic-presentation')
      .replace(/[\\/:*?"<>|]/g, '_')
      .substring(0, 50);
    const fileName = `${safeTitle}.pptx`;

    // Trigger download in browser with dual-method fallback
    try {
      await pptx.writeFile({ fileName });
    } catch (writeErr) {
      console.warn('pptx.writeFile direct download threw, trying write(blob) fallback:', writeErr);
      if (typeof window !== 'undefined' && window.URL && typeof document !== 'undefined') {
        const blob = await pptx.write({ outputType: 'blob' });
        const url = window.URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.style.display = 'none';
        a.href = url;
        a.download = fileName;
        document.body.appendChild(a);
        a.click();
        setTimeout(() => {
          window.URL.revokeObjectURL(url);
          document.body.removeChild(a);
        }, 1000);
      } else {
        throw writeErr;
      }
    }

    return { success: true, fileName };
  } catch (err) {
    console.error('PPTX Generation Error:', err);
    throw new Error(`فشل إنشاء ملف الباوربوينت: ${err?.message || err || 'خطأ أثناء المعالجة'}`);
  }
}

/**
 * Universal Vector Background Decorations - Dual-Tone Split & Rich Academic Canvases
 * Physically renders "نصف أبيض ونصف ملوّن" (Half White & Half Saturated Color) in PowerPoint
 */
function renderSlideBackgroundDecorations(pptx, slide, theme, isRtl, slideType = 'standard') {
  try {
    if (slideType === SLIDE_TYPES.COVER) {
      slide.background = { color: cleanHexColor(theme.pptx.primary) };
    } else if (slideType === SLIDE_TYPES.SECTION_DIVIDER) {
      slide.background = { color: cleanHexColor(theme.pptx.headerBg) };
    } else {
      // 1. Native Solid Saturated Color Half for PowerPoint
      slide.background = { color: 'FFFFFF' };
      const coloredW = 3.75;
      const sideX = isRtl ? 0 : 6.25;

      slide.addShape(pptx.ShapeType.rect, {
        x: sideX,
        y: 0,
        w: coloredW,
        h: 5.625,
        fill: { color: cleanHexColor(theme.pptx.primary) }
      });

      // Accent border line at the seam
      slide.addShape(pptx.ShapeType.rect, {
        x: isRtl ? coloredW - 0.05 : sideX,
        y: 0,
        w: 0.05,
        h: 5.625,
        fill: { color: cleanHexColor(theme.pptx.secondary) }
      });
    }

    // Background decorations are rendered as native Office Open XML shapes above.
    // This keeps PowerPoint 100% vector-native, editable, and prevents canvas memory exhaustion in browser exports.
  } catch (err) {
    console.warn('Could not render background decoration:', err);
  }
}

/**
 * 1. Render Cover Slide - Academic Seals, Metadata Badges & Ornamental Frame
 */
function renderCoverSlide(pptx, slide, model, theme, domainInfo) {
  const isRtl = model.isRtl;
  const font = getFontFamily(isRtl);

  // Top accent banner
  slide.addShape(pptx.ShapeType.rect, {
    x: 0,
    y: 0,
    w: 10.0,
    h: 0.15,
    fill: { color: cleanHexColor(theme.pptx.primary) }
  });

  // Basmala Calligraphy Cartouche at top
  slide.addText(MANUSCRIPT_CARTOUCHES.BASMALA, {
    x: 1.0,
    y: 0.25,
    w: 8.0,
    h: 0.35,
    fontFace: font,
    fontSize: 13,
    bold: true,
    color: 'FFFFFF',
    align: 'center'
  });


  // Institution & Faculty Header Text
  const instText = [
    model.institution || '',
    model.faculty || '',
    model.course || ''
  ].filter(Boolean).join('   |   ');

  if (instText) {
    slide.addText(instText, {
      x: 0.8,
      y: 1.15,
      w: 8.4,
      h: 0.35,
      fontFace: font,
      fontSize: 11,
      color: 'F8FAFC',
      align: 'center',
      bold: true
    });
  }

  // Central Title Box with Surface Card & Double Border
  slide.addShape(pptx.ShapeType.roundRect, {
    x: 1.0,
    y: 1.6,
    w: 8.0,
    h: 2.1,
    rectRadius: 0.15,
    fill: { color: cleanHexColor(theme.pptx.surface) },
    line: { color: cleanHexColor(theme.pptx.primary), width: 2 }
  });

  // Domain UIcon Pill on top edge of title box
  slide.addShape(pptx.ShapeType.roundRect, {
    x: 3.6,
    y: 1.45,
    w: 2.8,
    h: 0.35,
    rectRadius: 0.1,
    fill: { color: cleanHexColor(theme.pptx.primary) }
  });

  const domainIconUri = getIconDataUri(domainInfo.iconKey, 'FFFFFF', 64);
  slide.addImage({
    data: domainIconUri,
    x: isRtl ? 6.05 : 3.75,
    y: 1.51,
    w: 0.22,
    h: 0.22
  });

  slide.addText(domainInfo.badge, {
    x: isRtl ? 3.7 : 4.05,
    y: 1.45,
    w: 2.2,
    h: 0.35,
    fontFace: font,
    fontSize: 10,
    bold: true,
    color: 'FFFFFF',
    align: 'center',
    valign: 'middle'
  });

  // Main Presentation Title
  slide.addText(model.title || 'عنوان البحث الأكاديمي', {
    x: 1.2,
    y: 1.9,
    w: 7.6,
    h: 1.6,
    fontFace: font,
    fontSize: 22,
    bold: true,
    color: cleanHexColor(theme.pptx.primary),
    align: 'center',
    valign: 'middle',
    lineSpacingMultiple: 1.2
  });

  // Metadata Footer Cards Grid (Student, Supervisor) with Vector UIcons
  const metaCards = [
    model.author ? { role: 'إعداد الباحث / الطالب', name: model.author, iconKey: 'user' } : null,
    model.instructor ? { role: 'تحت إشراف الأستاذ', name: model.instructor, iconKey: 'supervisor' } : null
  ].filter(Boolean);

  const cardW = metaCards.length > 0 ? (8.0 - (metaCards.length - 1) * 0.25) / metaCards.length : 2.5;

  metaCards.forEach((c, idx) => {
    const cardX = isRtl
      ? 1.0 + (metaCards.length - 1 - idx) * (cardW + 0.25)
      : 1.0 + idx * (cardW + 0.25);

    slide.addShape(pptx.ShapeType.roundRect, {
      x: cardX,
      y: 3.9,
      w: cardW,
      h: 1.15,
      rectRadius: 0.1,
      fill: { color: cleanHexColor(theme.pptx.surface) },
      line: { color: cleanHexColor(theme.pptx.border), width: 1 }
    });

    // Vector UIcon
    const metaIconUri = getIconDataUri(c.iconKey, theme.pptx.primary, 64);
    slide.addImage({
      data: metaIconUri,
      x: cardX + cardW / 2 - 0.12,
      y: 4.0,
      w: 0.24,
      h: 0.24
    });

    slide.addText(c.role, {
      x: cardX,
      y: 4.28,
      w: cardW,
      h: 0.3,
      fontFace: font,
      fontSize: 9.5,
      color: cleanHexColor(theme.pptx.textSecondary),
      align: 'center'
    });

    slide.addText(c.name, {
      x: cardX + 0.1,
      y: 4.58,
      w: cardW - 0.2,
      h: 0.42,
      fontFace: font,
      fontSize: 11.5,
      bold: true,
      color: cleanHexColor(theme.pptx.textPrimary),
      align: 'center'
    });
  });

  // Bottom Accent Strip
  slide.addShape(pptx.ShapeType.rect, {
    x: 0,
    y: 5.35,
    w: 10.0,
    h: 0.275,
    fill: { color: cleanHexColor(theme.pptx.headerBg) }
  });
}

/**
 * 1b. Render Agenda / Research Plan Slide (خطة البحث: 3 مباحث وكل مبحث 3 مطالب)
 */
function renderAgendaSlide(pptx, slide, model, theme, totalSlides, domainInfo) {
  addSlideHeaderAndFooter(pptx, slide, model, theme, totalSlides, 'خطة البحث وهيكل العرض الأكاديمي', 'layers');
  const isRtl = model.isRtl;
  const font = getFontFamily(isRtl);
  const align = getTextAlignment(isRtl);

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

  // 1. Top Context / Plan Summary Banner
  slide.addShape(pptx.ShapeType.roundRect, {
    x: 0.8,
    y: 1.35,
    w: 8.4,
    h: 0.52,
    rectRadius: 0.08,
    fill: { color: cleanHexColor(theme.pptx.surface) },
    line: { color: cleanHexColor(theme.pptx.border), width: 1 }
  });

  // Vertical accent strip
  slide.addShape(pptx.ShapeType.rect, {
    x: isRtl ? 9.15 : 0.8,
    y: 1.35,
    w: 0.05,
    h: 0.52,
    fill: { color: cleanHexColor(theme.pptx.primary) }
  });

  const bookUri = getIconDataUri('bookOpen', theme.pptx.primary, 64);
  slide.addImage({
    data: bookUri,
    x: isRtl ? 8.85 : 0.92,
    y: 1.48,
    w: 0.22,
    h: 0.22
  });

  slide.addText('تنتظم خطة البحث الحالية في مقدمة وثلاثة مباحث رئيسية يشتمل كل منها على ثلاثة مطالب متخصصة وخاتمة:', {
    x: isRtl ? 2.5 : 1.25,
    y: 1.45,
    w: 6.2,
    h: 0.32,
    fontFace: font,
    fontSize: 9.5,
    bold: true,
    color: cleanHexColor(theme.pptx.textPrimary),
    align: align,
    valign: 'middle'
  });

  // Badge: 3 مباحث × 3 مطالب
  slide.addShape(pptx.ShapeType.roundRect, {
    x: isRtl ? 0.95 : 7.25,
    y: 1.45,
    w: 1.5,
    h: 0.32,
    rectRadius: 0.06,
    fill: { color: cleanHexColor(theme.pptx.primary) }
  });

  slide.addText('3 مباحث × 3 مطالب', {
    x: isRtl ? 0.95 : 7.25,
    y: 1.45,
    w: 1.5,
    h: 0.32,
    fontFace: font,
    fontSize: 8.5,
    bold: true,
    color: 'FFFFFF',
    align: 'center',
    valign: 'middle'
  });

  // 2. 3 Column Cards for the 3 Mabaheth
  const cardW = 2.68;
  const cardH = 2.55;
  const gap = 0.18;
  const startX = 0.8;
  const startY = 1.98;

  const bookmarkUri = getIconDataUri('bookmark', theme.pptx.primary, 64);

  plan.slice(0, 3).forEach((sec, idx) => {
    const colPos = isRtl ? (2 - idx) : idx;
    const cardX = startX + colPos * (cardW + gap);

    // Card background
    slide.addShape(pptx.ShapeType.roundRect, {
      x: cardX,
      y: startY,
      w: cardW,
      h: cardH,
      rectRadius: 0.08,
      fill: { color: cleanHexColor(theme.pptx.surface) },
      line: { color: cleanHexColor(theme.pptx.border), width: 1 }
    });

    // Top accent border
    slide.addShape(pptx.ShapeType.rect, {
      x: cardX,
      y: startY,
      w: cardW,
      h: 0.06,
      fill: { color: cleanHexColor(theme.pptx.primary) }
    });

    // Number Badge (01, 02, 03)
    const numBadgeX = isRtl ? cardX + cardW - 0.42 : cardX + 0.12;
    slide.addShape(pptx.ShapeType.roundRect, {
      x: numBadgeX,
      y: startY + 0.12,
      w: 0.3,
      h: 0.3,
      rectRadius: 0.06,
      fill: { color: cleanHexColor(theme.pptx.primary) }
    });

    slide.addText(`0${idx + 1}`, {
      x: numBadgeX,
      y: startY + 0.12,
      w: 0.3,
      h: 0.3,
      fontFace: font,
      fontSize: 8.5,
      bold: true,
      color: 'FFFFFF',
      align: 'center',
      valign: 'middle'
    });

    // Mabhath Title
    const titleX = isRtl ? cardX + 0.1 : cardX + 0.48;
    slide.addText(sec.mabhath || `المبحث ${idx + 1}`, {
      x: titleX,
      y: startY + 0.1,
      w: cardW - 0.58,
      h: 0.48,
      fontFace: font,
      fontSize: 10,
      bold: true,
      color: cleanHexColor(theme.pptx.headerBg),
      align: align,
      valign: 'middle'
    });

    // 3 Matalib Sub-Cards inside
    const matalibList = Array.isArray(sec.matalib) && sec.matalib.length > 0
      ? sec.matalib.slice(0, 3)
      : ['المطلب 1', 'المطلب 2', 'المطلب 3'];

    const subCardH = 0.52;
    const subGap = 0.08;
    const subStartY = startY + 0.65;

    matalibList.forEach((matlabText, mIdx) => {
      const subY = subStartY + mIdx * (subCardH + subGap);

      // Sub-card box
      slide.addShape(pptx.ShapeType.roundRect, {
        x: cardX + 0.1,
        y: subY,
        w: cardW - 0.2,
        h: subCardH,
        rectRadius: 0.05,
        fill: { color: cleanHexColor(theme.pptx.background) },
        line: { color: cleanHexColor(theme.pptx.border), width: 1 }
      });

      // Bookmark UIcon
      const iconX = isRtl ? cardX + cardW - 0.32 : cardX + 0.16;
      slide.addImage({
        data: bookmarkUri,
        x: iconX,
        y: subY + 0.18,
        w: 0.15,
        h: 0.15
      });

      // Matlab Text
      const textX = isRtl ? cardX + 0.15 : cardX + 0.36;
      slide.addText(matlabText, {
        x: textX,
        y: subY + 0.05,
        w: cardW - 0.52,
        h: subCardH - 0.1,
        fontFace: font,
        fontSize: 8.5,
        color: cleanHexColor(theme.pptx.textPrimary),
        align: align,
        valign: 'middle',
        lineSpacingMultiple: 1.1
      });
    });
  });

  // 3. Flow Pipeline Ribbon at bottom
  slide.addShape(pptx.ShapeType.roundRect, {
    x: 0.8,
    y: 4.65,
    w: 8.4,
    h: 0.4,
    rectRadius: 0.06,
    fill: { color: cleanHexColor(theme.pptx.surface) },
    line: { color: cleanHexColor(theme.pptx.border), width: 1, dashType: 'dash' }
  });

  slide.addText('المقدمة والإشكالية  ➔  المباحث الثلاثة ومطالبها التسعة  ➔  الخاتمة والتوصيات  ➔  قائمة المراجع', {
    x: 0.8,
    y: 4.65,
    w: 8.4,
    h: 0.4,
    fontFace: font,
    fontSize: 9,
    bold: true,
    color: cleanHexColor(theme.pptx.primary),
    align: 'center',
    valign: 'middle'
  });
}

/**
 * 2a. Render Dedicated Introduction Slide - Problem Statement & Objectives Dual Cards
 */
function renderIntroductionSlide(pptx, slide, model, theme, totalSlides, domainInfo) {
  addSlideHeaderAndFooter(pptx, slide, model, theme, totalSlides, 'مقدمة البحث والتأطير المنهجي', 'bookOpen');
  const isRtl = model.isRtl;
  const font = getFontFamily(isRtl);
  const align = getTextAlignment(isRtl);

  const introLead = model.introLead || model.paragraphs?.[0] || 'يستعرض هذا البحث الأطر النظرية والتطبيقية للظاهرة محل الدراسة.';
  const problem = model.problemStatement || 'تحديد المتغيرات الحاكمة لقياس فاعلية الأداء وضمان الامتثال للمعايير الأكاديمية المعتمدة.';
  const objectives = Array.isArray(model.objectives) && model.objectives.length > 0
    ? model.objectives
    : (Array.isArray(model.bullets) && model.bullets.length > 0
      ? model.bullets
      : ['تشخيص الواقع الميداني وتحديد التحديات الراهنة', 'بناء نموذج تطبيقي متكامل ومحكّم']);
  const methodology = model.methodology || 'المنهج الوصفي التحليلي المقارن';

  // 1. Top Context / Abstract Banner
  slide.addShape(pptx.ShapeType.roundRect, {
    x: 0.8,
    y: 1.45,
    w: 8.4,
    h: 0.9,
    rectRadius: 0.08,
    fill: { color: cleanHexColor(theme.pptx.surface) },
    line: { color: cleanHexColor(theme.pptx.border), width: 1 }
  });

  // Top banner vertical accent stripe
  slide.addShape(pptx.ShapeType.rect, {
    x: isRtl ? 9.15 : 0.8,
    y: 1.45,
    w: 0.05,
    h: 0.9,
    fill: { color: cleanHexColor(theme.pptx.primary) }
  });

  const bookUri = getIconDataUri('bookOpen', theme.pptx.primary, 64);
  slide.addImage({
    data: bookUri,
    x: isRtl ? 8.85 : 0.92,
    y: 1.52,
    w: 0.22,
    h: 0.22
  });

  slide.addText('سياق البحث والتمهيد العام:', {
    x: isRtl ? 0.95 : 1.2,
    y: 1.5,
    w: 7.5,
    h: 0.25,
    fontFace: font,
    fontSize: 10,
    bold: true,
    color: cleanHexColor(theme.pptx.primary),
    align: align
  });

  slide.addText(introLead, {
    x: isRtl ? 0.95 : 1.2,
    y: 1.76,
    w: 7.8,
    h: 0.52,
    fontFace: font,
    fontSize: 10,
    color: cleanHexColor(theme.pptx.textPrimary),
    align: align,
    valign: 'top',
    lineSpacingMultiple: 1.15
  });

  // 2. Dual Column Cards
  const cardW = 4.05;
  const cardH = 2.55;
  const colRightX = isRtl ? 5.15 : 0.8;
  const colLeftX = isRtl ? 0.8 : 5.15;

  // Card A: Problem Statement Card
  slide.addShape(pptx.ShapeType.roundRect, {
    x: colRightX,
    y: 2.48,
    w: cardW,
    h: cardH,
    rectRadius: 0.1,
    fill: { color: cleanHexColor(theme.pptx.surface) },
    line: { color: cleanHexColor(theme.pptx.border), width: 1 }
  });

  slide.addShape(pptx.ShapeType.rect, {
    x: colRightX,
    y: 2.48,
    w: cardW,
    h: 0.06,
    fill: { color: cleanHexColor(theme.pptx.secondary) }
  });

  const searchUri = getIconDataUri('search', theme.pptx.secondary, 64);
  slide.addImage({
    data: searchUri,
    x: isRtl ? colRightX + cardW - 0.38 : colRightX + 0.15,
    y: 2.62,
    w: 0.22,
    h: 0.22
  });

  slide.addText('إشكالية الدراسة والتساؤلات', {
    x: isRtl ? colRightX + 0.2 : colRightX + 0.42,
    y: 2.6,
    w: cardW - 0.62,
    h: 0.28,
    fontFace: font,
    fontSize: 11.5,
    bold: true,
    color: cleanHexColor(theme.pptx.secondary),
    align: align
  });

  slide.addText(problem, {
    x: colRightX + 0.2,
    y: 2.98,
    w: cardW - 0.4,
    h: 1.35,
    fontFace: font,
    fontSize: 10,
    color: cleanHexColor(theme.pptx.textPrimary),
    align: align,
    valign: 'top',
    lineSpacingMultiple: 1.2
  });

  // Question badge inside problem card
  slide.addShape(pptx.ShapeType.roundRect, {
    x: colRightX + 0.2,
    y: 4.42,
    w: cardW - 0.4,
    h: 0.48,
    rectRadius: 0.08,
    fill: { color: cleanHexColor(theme.pptx.background) }
  });

  const helpUri = getIconDataUri('helpCircle', theme.pptx.secondary, 64);
  slide.addImage({
    data: helpUri,
    x: isRtl ? colRightX + cardW - 0.45 : colRightX + 0.25,
    y: 4.54,
    w: 0.18,
    h: 0.18
  });

  const questionText = model.problemQuestion 
    ? `التساؤل الرئيس: ${model.problemQuestion}`
    : (isRtl ? 'التساؤل الجوهري: ما هي الأبعاد المحددة للإشكالية وكيفية معالجتها علمياً؟' : 'Core Research Question: Key problem dimensions');

  slide.addText(questionText, {
    x: isRtl ? colRightX + 0.25 : colRightX + 0.5,
    y: 4.5,
    w: cardW - 0.75,
    h: 0.32,
    fontFace: font,
    fontSize: 8.5,
    color: cleanHexColor(theme.pptx.textSecondary),
    align: align
  });

  // Card B: Objectives & Methodology Card
  slide.addShape(pptx.ShapeType.roundRect, {
    x: colLeftX,
    y: 2.48,
    w: cardW,
    h: cardH,
    rectRadius: 0.1,
    fill: { color: cleanHexColor(theme.pptx.surface) },
    line: { color: cleanHexColor(theme.pptx.border), width: 1 }
  });

  slide.addShape(pptx.ShapeType.rect, {
    x: colLeftX,
    y: 2.48,
    w: cardW,
    h: 0.06,
    fill: { color: cleanHexColor(theme.pptx.primary) }
  });

  const targetUri = getIconDataUri('target', theme.pptx.primary, 64);
  slide.addImage({
    data: targetUri,
    x: isRtl ? colLeftX + cardW - 0.38 : colLeftX + 0.15,
    y: 2.62,
    w: 0.22,
    h: 0.22
  });

  slide.addText('أهداف البحث والمنهج المتبع', {
    x: isRtl ? colLeftX + 0.2 : colLeftX + 0.42,
    y: 2.6,
    w: cardW - 0.62,
    h: 0.28,
    fontFace: font,
    fontSize: 11.5,
    bold: true,
    color: cleanHexColor(theme.pptx.primary),
    align: align
  });

  // Render objectives bullets
  const objBullets = objectives.slice(0, 3).map(o => ({
    text: typeof o === 'string' ? o : (o.text || ''),
    options: {
      bullet: { type: 'number', style: 'arabicPeriod' },
      fontFace: font,
      fontSize: 9.5,
      color: cleanHexColor(theme.pptx.textPrimary),
      align: align,
      lineSpacingMultiple: 1.15
    }
  }));

  slide.addText(objBullets, {
    x: colLeftX + 0.2,
    y: 2.98,
    w: cardW - 0.4,
    h: 1.35,
    valign: 'top'
  });

  // Methodology pill at bottom
  slide.addShape(pptx.ShapeType.roundRect, {
    x: colLeftX + 0.2,
    y: 4.42,
    w: cardW - 0.4,
    h: 0.48,
    rectRadius: 0.08,
    fill: { color: cleanHexColor(theme.pptx.background) }
  });

  const compassUri = getIconDataUri('compass', theme.pptx.primary, 64);
  slide.addImage({
    data: compassUri,
    x: isRtl ? colLeftX + cardW - 0.45 : colLeftX + 0.25,
    y: 4.54,
    w: 0.18,
    h: 0.18
  });

  slide.addText(`المنهجية المعتمدة: ${methodology}`, {
    x: isRtl ? colLeftX + 0.25 : colLeftX + 0.5,
    y: 4.5,
    w: cardW - 0.75,
    h: 0.32,
    fontFace: font,
    fontSize: 9,
    bold: true,
    color: cleanHexColor(theme.pptx.primary),
    align: align
  });
}

/**
 * 2. Render Section Divider Slide - Big Medallion Badge & Graphic Backdrop
 */
function renderDividerSlide(pptx, slide, model, theme, domainInfo) {
  const isRtl = model.isRtl;
  const font = getFontFamily(isRtl);
  const align = getTextAlignment(isRtl);

  // Side accent banner
  slide.addShape(pptx.ShapeType.rect, {
    x: isRtl ? 9.55 : 0,
    y: 0,
    w: 0.45,
    h: 5.625,
    fill: { color: cleanHexColor(theme.pptx.primary) }
  });

  // Circular Medallion Badge for Section Number with Layers UIcon
  const medalX = isRtl ? 6.2 : 1.2;
  slide.addShape(pptx.ShapeType.ellipse, {
    x: medalX,
    y: 1.2,
    w: 2.4,
    h: 0.7,
    fill: { color: cleanHexColor(theme.pptx.primary) }
  });

  const layersUri = getIconDataUri('layers', 'FFFFFF', 64);
  slide.addImage({
    data: layersUri,
    x: isRtl ? medalX + 1.85 : medalX + 0.2,
    y: 1.4,
    w: 0.3,
    h: 0.3
  });

  slide.addText(`المبحث ${model.sectionNumber || '١'}`, {
    x: isRtl ? medalX + 0.1 : medalX + 0.55,
    y: 1.2,
    w: 1.8,
    h: 0.7,
    fontFace: font,
    fontSize: 14,
    bold: true,
    color: 'FFFFFF',
    align: 'center',
    valign: 'middle'
  });

  // Main Section Title Card
  slide.addShape(pptx.ShapeType.roundRect, {
    x: 1.2,
    y: 2.1,
    w: 7.6,
    h: 2.4,
    rectRadius: 0.15,
    fill: { color: cleanHexColor(theme.pptx.surface) },
    line: { color: cleanHexColor(theme.pptx.primary), width: 1.5 }
  });

  slide.addText(model.title, {
    x: 1.5,
    y: 2.3,
    w: 7.0,
    h: 1.4,
    fontFace: font,
    fontSize: 24,
    bold: true,
    color: cleanHexColor(theme.pptx.headerBg),
    align: align,
    valign: 'top',
    lineSpacingMultiple: 1.2
  });

  // Decorative Separator Line
  slide.addShape(pptx.ShapeType.rect, {
    x: isRtl ? 5.5 : 1.5,
    y: 3.8,
    w: 3.0,
    h: 0.05,
    fill: { color: cleanHexColor(theme.pptx.secondary) }
  });

  slide.addText('محور دراسي متقدم وفق منهجية البحث العلمي المعتمدة', {
    x: 1.5,
    y: 3.95,
    w: 7.0,
    h: 0.4,
    fontFace: font,
    fontSize: 11,
    color: cleanHexColor(theme.pptx.textSecondary),
    align: align
  });
}

/**
 * 3. Render Statistics & Native Chart Slide
 */
function renderStatisticsSlide(pptx, slide, model, theme, totalSlides, domainInfo) {
  addSlideHeaderAndFooter(pptx, slide, model, theme, totalSlides, 'مؤشرات وبيانات إحصائية', 'barChart');
  const isRtl = model.isRtl;
  const font = getFontFamily(isRtl);

  const stats = model.statistics || [];
  const cardCount = Math.min(stats.length, 4);

  if (cardCount > 0) {
    const cardWidth = (8.4 - (cardCount - 1) * 0.25) / cardCount;
    stats.slice(0, cardCount).forEach((stat, idx) => {
      const cardX = isRtl
        ? 0.8 + (cardCount - 1 - idx) * (cardWidth + 0.25)
        : 0.8 + idx * (cardWidth + 0.25);

      // KPI Card Box
      slide.addShape(pptx.ShapeType.roundRect, {
        x: cardX,
        y: 1.35,
        w: cardWidth,
        h: 1.2,
        rectRadius: 0.1,
        fill: { color: cleanHexColor(theme.pptx.surface) },
        line: { color: cleanHexColor(theme.pptx.border), width: 1.2 }
      });

      // KPI UIcon & Trend
      const statIconKey = idx % 2 === 0 ? 'trendingUp' : 'barChart';
      const statIconUri = getIconDataUri(statIconKey, '16A34A', 64);
      slide.addImage({
        data: statIconUri,
        x: isRtl ? cardX + cardWidth - 0.35 : cardX + 0.15,
        y: 1.45,
        w: 0.2,
        h: 0.2
      });

      slide.addText('+ مؤشر رسمي', {
        x: cardX,
        y: 1.42,
        w: cardWidth,
        h: 0.25,
        fontFace: font,
        fontSize: 9,
        bold: true,
        color: '16A34A',
        align: 'center'
      });

      // Metric Value
      slide.addText(`${stat.value} ${stat.unit || ''}`, {
        x: cardX,
        y: 1.68,
        w: cardWidth,
        h: 0.5,
        fontFace: font,
        fontSize: 18,
        bold: true,
        color: cleanHexColor(theme.pptx.primary),
        align: 'center'
      });

      // Metric Label
      slide.addText(stat.label || '', {
        x: cardX + 0.05,
        y: 2.18,
        w: cardWidth - 0.1,
        h: 0.32,
        fontFace: font,
        fontSize: 10,
        color: cleanHexColor(theme.pptx.textSecondary),
        align: 'center'
      });
    });
  }

  // Add Native Chart in the lower section
  const chartY = cardCount > 0 ? 2.7 : 1.4;
  const chartH = cardCount > 0 ? 2.2 : 3.4;
  addNativeChartToSlide(pptx, slide, stats, { x: 0.8, y: chartY, w: 8.4, h: chartH }, theme, model.chartType || 'bar');
}

/**
 * 4. Render Table Slide
 */
function renderTableSlide(pptx, slide, model, theme, totalSlides, domainInfo) {
  addSlideHeaderAndFooter(pptx, slide, model, theme, totalSlides, 'جدول بيانات محاسبي منظم', 'table');
  const isRtl = model.isRtl;
  const font = getFontFamily(isRtl);
  const align = getTextAlignment(isRtl);

  if (!model.table) return;

  const tableRows = [];

  // Header Row
  if (Array.isArray(model.table.headers)) {
    const headerRow = model.table.headers.map(h => ({
      text: h,
      options: {
        fill: { color: cleanHexColor(theme.pptx.primary) },
        color: 'FFFFFF',
        bold: true,
        fontFace: font,
        fontSize: 12,
        align: 'center'
      }
    }));
    tableRows.push(headerRow);
  }

  // Data Rows
  if (Array.isArray(model.table.rows)) {
    model.table.rows.forEach((row, rIdx) => {
      const isAlt = rIdx % 2 === 1;
      const dataRow = row.map(cell => ({
        text: String(cell),
        options: {
          fill: { color: isAlt ? cleanHexColor(theme.pptx.surface) : cleanHexColor(theme.pptx.background) },
          color: cleanHexColor(theme.pptx.textPrimary),
          fontFace: font,
          fontSize: 11,
          align: align
        }
      }));
      tableRows.push(dataRow);
    });
  }

  slide.addTable(tableRows, {
    x: 0.8,
    y: 1.45,
    w: 8.4,
    rowH: 0.45,
    border: { pt: 1, color: cleanHexColor(theme.pptx.border) }
  });
}

/**
 * 5. Render Comparison Slide - Columns with Center "VS" Badge Medallion
 */
function renderComparisonSlide(pptx, slide, model, theme, totalSlides, domainInfo) {
  addSlideHeaderAndFooter(pptx, slide, model, theme, totalSlides, 'دراسة مقارنة ومفاضلة', 'scale');
  const isRtl = model.isRtl;
  const font = getFontFamily(isRtl);
  const align = getTextAlignment(isRtl);

  const comp = model.comparison || { colA: { title: 'الجانب الأول', items: [] }, colB: { title: 'الجانب الثاني', items: [] } };

  const colAX = isRtl ? 5.2 : 0.8;
  const colBX = isRtl ? 0.8 : 5.2;

  // Render Box A
  slide.addShape(pptx.ShapeType.roundRect, {
    x: colAX,
    y: 1.45,
    w: 4.0,
    h: 3.4,
    rectRadius: 0.1,
    fill: { color: cleanHexColor(theme.pptx.surface) },
    line: { color: cleanHexColor(theme.pptx.primary), width: 1.5 }
  });

  slide.addShape(pptx.ShapeType.roundRect, {
    x: colAX,
    y: 1.45,
    w: 4.0,
    h: 0.5,
    rectRadius: 0.1,
    fill: { color: cleanHexColor(theme.pptx.primary) }
  });

  const layersUri = getIconDataUri('layers', 'FFFFFF', 64);
  slide.addImage({
    data: layersUri,
    x: isRtl ? colAX + 3.5 : colAX + 0.25,
    y: 1.58,
    w: 0.24,
    h: 0.24
  });

  slide.addText(comp.colA?.title || 'الجانب الأول', {
    x: colAX + 0.5,
    y: 1.45,
    w: 3.0,
    h: 0.5,
    fontFace: font,
    fontSize: 13,
    bold: true,
    color: 'FFFFFF',
    align: 'center',
    valign: 'middle'
  });

  const itemsA = (comp.colA?.items || []).map(it => `• ${it}`).join('\n\n');
  slide.addText(itemsA, {
    x: colAX + 0.2,
    y: 2.1,
    w: 3.6,
    h: 2.6,
    fontFace: font,
    fontSize: 11,
    color: cleanHexColor(theme.pptx.textPrimary),
    align: align,
    lineSpacingMultiple: 1.2
  });

  // Render Box B
  slide.addShape(pptx.ShapeType.roundRect, {
    x: colBX,
    y: 1.45,
    w: 4.0,
    h: 3.4,
    rectRadius: 0.1,
    fill: { color: cleanHexColor(theme.pptx.surface) },
    line: { color: cleanHexColor(theme.pptx.secondary), width: 1.5 }
  });

  slide.addShape(pptx.ShapeType.roundRect, {
    x: colBX,
    y: 1.45,
    w: 4.0,
    h: 0.5,
    rectRadius: 0.1,
    fill: { color: cleanHexColor(theme.pptx.secondary) }
  });

  const targetUri = getIconDataUri('target', 'FFFFFF', 64);
  slide.addImage({
    data: targetUri,
    x: isRtl ? colBX + 3.5 : colBX + 0.25,
    y: 1.58,
    w: 0.24,
    h: 0.24
  });

  slide.addText(comp.colB?.title || 'الجانب الثاني', {
    x: colBX + 0.5,
    y: 1.45,
    w: 3.0,
    h: 0.5,
    fontFace: font,
    fontSize: 13,
    bold: true,
    color: 'FFFFFF',
    align: 'center',
    valign: 'middle'
  });

  const itemsB = (comp.colB?.items || []).map(it => `• ${it}`).join('\n\n');
  slide.addText(itemsB, {
    x: colBX + 0.2,
    y: 2.1,
    w: 3.6,
    h: 2.6,
    fontFace: font,
    fontSize: 11,
    color: cleanHexColor(theme.pptx.textPrimary),
    align: align,
    lineSpacingMultiple: 1.2
  });

  // Center "VS" Badge Medallion with Vector Shield
  const vsSvg = getComparisonVsBadgeSvg(theme.pptx.primary, theme.pptx.secondary);
  slide.addImage({
    data: svgToDataUri(vsSvg),
    x: 4.6,
    y: 2.8,
    w: 0.8,
    h: 0.8
  });
}

/**
 * 6. Render Pros & Cons Slide - CheckCircle vs AlertTriangle Badges
 */
function renderProsConsSlide(pptx, slide, model, theme, totalSlides, domainInfo) {
  addSlideHeaderAndFooter(pptx, slide, model, theme, totalSlides, 'موازنة المزايا والتحديات', 'scale');
  const isRtl = model.isRtl;
  const font = getFontFamily(isRtl);
  const align = getTextAlignment(isRtl);

  const bullets = model.bullets || [];
  const mid = Math.ceil(bullets.length / 2);
  const pros = bullets.slice(0, mid);
  const cons = bullets.slice(mid);

  const prosX = isRtl ? 5.2 : 0.8;
  const consX = isRtl ? 0.8 : 5.2;

  // Pros Card (Green Theme)
  slide.addShape(pptx.ShapeType.roundRect, {
    x: prosX,
    y: 1.45,
    w: 4.0,
    h: 3.4,
    rectRadius: 0.1,
    fill: { color: 'F0FDF4' },
    line: { color: '16A34A', width: 1.5 }
  });

  slide.addShape(pptx.ShapeType.roundRect, {
    x: prosX,
    y: 1.45,
    w: 4.0,
    h: 0.5,
    rectRadius: 0.1,
    fill: { color: '16A34A' }
  });

  const checkCircleUri = getIconDataUri('checkCircle', 'FFFFFF', 64);
  slide.addImage({
    data: checkCircleUri,
    x: isRtl ? prosX + 3.5 : prosX + 0.2,
    y: 1.58,
    w: 0.24,
    h: 0.24
  });

  slide.addText(isRtl ? 'المزايا والأبعاد الإيجابية' : 'Key Advantages & Strengths', {
    x: prosX + 0.45,
    y: 1.45,
    w: 3.1,
    h: 0.5,
    fontFace: font,
    fontSize: 12,
    bold: true,
    color: 'FFFFFF',
    align: 'center',
    valign: 'middle'
  });

  const prosText = pros.map(p => `•  ${p}`).join('\n\n');
  slide.addText(prosText, {
    x: prosX + 0.2,
    y: 2.1,
    w: 3.6,
    h: 2.6,
    fontFace: font,
    fontSize: 11,
    color: '14532D',
    align: align,
    lineSpacingMultiple: 1.2
  });

  // Cons Card (Red Theme)
  slide.addShape(pptx.ShapeType.roundRect, {
    x: consX,
    y: 1.45,
    w: 4.0,
    h: 3.4,
    rectRadius: 0.1,
    fill: { color: 'FEF2F2' },
    line: { color: 'DC2626', width: 1.5 }
  });

  slide.addShape(pptx.ShapeType.roundRect, {
    x: consX,
    y: 1.45,
    w: 4.0,
    h: 0.5,
    rectRadius: 0.1,
    fill: { color: 'DC2626' }
  });

  const alertTriangleUri = getIconDataUri('alertTriangle', 'FFFFFF', 64);
  slide.addImage({
    data: alertTriangleUri,
    x: isRtl ? consX + 3.5 : consX + 0.2,
    y: 1.58,
    w: 0.24,
    h: 0.24
  });

  slide.addText(isRtl ? 'التحديات والأبعاد النقدية' : 'Key Challenges & Limitations', {
    x: consX + 0.45,
    y: 1.45,
    w: 3.1,
    h: 0.5,
    fontFace: font,
    fontSize: 12,
    bold: true,
    color: 'FFFFFF',
    align: 'center',
    valign: 'middle'
  });

  const consText = cons.map(c => `•  ${c}`).join('\n\n');
  slide.addText(consText, {
    x: consX + 0.2,
    y: 2.1,
    w: 3.6,
    h: 2.6,
    fontFace: font,
    fontSize: 11,
    color: '7F1D1D',
    align: align,
    lineSpacingMultiple: 1.2
  });
}

/**
 * 7. Render Process Steps Slide - Flowchart Diagram with Connected Cards & Directional Arrows
 */
function renderProcessSlide(pptx, slide, model, theme, totalSlides, domainInfo) {
  addSlideHeaderAndFooter(pptx, slide, model, theme, totalSlides, 'مسار وخطوات متسلسلة', 'refreshCw');
  const isRtl = model.isRtl;
  const font = getFontFamily(isRtl);
  const align = getTextAlignment(isRtl);

  const steps = model.numbered || [];
  const count = Math.min(steps.length, 4);

  if (count > 0) {
    const arrowWidth = 0.25;
    const totalGaps = (count - 1) * (0.2 + arrowWidth);
    const cardWidth = (8.4 - totalGaps) / count;

    steps.slice(0, count).forEach((stepText, idx) => {
      const stepOffset = idx * (cardWidth + arrowWidth + 0.2);
      const cardX = isRtl
        ? 0.8 + (count - 1 - idx) * (cardWidth + arrowWidth + 0.2)
        : 0.8 + stepOffset;

      // Step Container Card
      slide.addShape(pptx.ShapeType.roundRect, {
        x: cardX,
        y: 1.5,
        w: cardWidth,
        h: 3.2,
        rectRadius: 0.1,
        fill: { color: cleanHexColor(theme.pptx.surface) },
        line: { color: cleanHexColor(theme.pptx.primary), width: 1.2 }
      });

      // Step Sequence Oval Badge
      slide.addShape(pptx.ShapeType.ellipse, {
        x: cardX + cardWidth / 2 - 0.25,
        y: 1.7,
        w: 0.5,
        h: 0.5,
        fill: { color: cleanHexColor(theme.pptx.primary) }
      });

      slide.addText(`${idx + 1}`, {
        x: cardX + cardWidth / 2 - 0.25,
        y: 1.7,
        w: 0.5,
        h: 0.5,
        fontFace: font,
        fontSize: 12,
        bold: true,
        color: 'FFFFFF',
        align: 'center',
        valign: 'middle'
      });

      // Stage Pill with RefreshCw UIcon
      slide.addShape(pptx.ShapeType.roundRect, {
        x: cardX + 0.15,
        y: 2.35,
        w: cardWidth - 0.3,
        h: 0.35,
        rectRadius: 0.08,
        fill: { color: cleanHexColor(theme.pptx.background) }
      });

      slide.addText(`المرحلة 0${idx + 1}`, {
        x: cardX + 0.15,
        y: 2.35,
        w: cardWidth - 0.3,
        h: 0.35,
        fontFace: font,
        fontSize: 10,
        bold: true,
        color: cleanHexColor(theme.pptx.primary),
        align: 'center',
        valign: 'middle'
      });

      // Step Text
      slide.addText(stepText, {
        x: cardX + 0.15,
        y: 2.8,
        w: cardWidth - 0.3,
        h: 1.8,
        fontFace: font,
        fontSize: 10,
        color: cleanHexColor(theme.pptx.textPrimary),
        align: align,
        lineSpacingMultiple: 1.2
      });

      // Connecting Vector Flow Arrow between cards
      if (idx < count - 1) {
        const arrowX = isRtl
          ? cardX - (arrowWidth + 0.1)
          : cardX + cardWidth + 0.1;

        slide.addShape(isRtl ? pptx.ShapeType.leftArrow : pptx.ShapeType.rightArrow, {
          x: arrowX,
          y: 2.9,
          w: arrowWidth,
          h: 0.25,
          fill: { color: cleanHexColor(theme.pptx.primary) },
          line: { color: cleanHexColor(theme.pptx.primary) }
        });
      }
    });
  }
}

/**
 * 8. Render Definition Slide - 3-Orbit Conceptual Diagram & Academic Showcase Card
 */
function renderDefinitionSlide(pptx, slide, model, theme, totalSlides, domainInfo) {
  addSlideHeaderAndFooter(pptx, slide, model, theme, totalSlides, 'الإطار المفاهيمي والاصطلاحي', 'bookOpen');
  const isRtl = model.isRtl;
  const font = getFontFamily(isRtl);
  const align = getTextAlignment(isRtl);

  const textW = 4.8;
  const diagW = 3.4;
  const textX = isRtl ? 4.4 : 0.8;
  const diagX = isRtl ? 0.8 : 5.8;

  // Left/Right Content Surface Card
  slide.addShape(pptx.ShapeType.roundRect, {
    x: textX,
    y: 1.45,
    w: textW,
    h: 3.4,
    rectRadius: 0.12,
    fill: { color: cleanHexColor(theme.pptx.surface) },
    line: { color: cleanHexColor(theme.pptx.primary), width: 1.5 }
  });

  // Academic Term Banner Badge with Bookmark UIcon
  slide.addShape(pptx.ShapeType.roundRect, {
    x: textX + 0.2,
    y: 1.6,
    w: textW - 0.4,
    h: 0.4,
    rectRadius: 0.1,
    fill: { color: cleanHexColor(theme.pptx.primary) }
  });

  const bookmarkUri = getIconDataUri('bookmark', 'FFFFFF', 64);
  slide.addImage({
    data: bookmarkUri,
    x: isRtl ? textX + textW - 0.55 : textX + 0.3,
    y: 1.68,
    w: 0.24,
    h: 0.24
  });

  const term = model.definitionTerm || model.title;
  slide.addText(`المفهوم الاصطلاحي: ${term}`, {
    x: textX + 0.5,
    y: 1.6,
    w: textW - 1.0,
    h: 0.4,
    fontFace: font,
    fontSize: 11,
    bold: true,
    color: 'FFFFFF',
    align: 'center',
    valign: 'middle'
  });

  // Definition text runs
  const textRuns = [];
  (model.paragraphs || []).forEach(p => {
    textRuns.push({
      text: p + '\n\n',
      options: { fontSize: 11.5, bold: true, color: cleanHexColor(theme.pptx.headerBg) }
    });
  });

  (model.bullets || []).forEach(b => {
    textRuns.push({
      text: `• ${b}\n`,
      options: { fontSize: 10.5, color: cleanHexColor(theme.pptx.textPrimary) }
    });
  });

  slide.addText(textRuns, {
    x: textX + 0.25,
    y: 2.15,
    w: textW - 0.5,
    h: 2.5,
    fontFace: font,
    align: align,
    lineSpacingMultiple: 1.25
  });

  // Diagram Surface Card & 3-Orbit Vector Diagram
  slide.addShape(pptx.ShapeType.roundRect, {
    x: diagX,
    y: 1.45,
    w: diagW,
    h: 3.4,
    rectRadius: 0.12,
    fill: { color: cleanHexColor(theme.pptx.surface) },
    line: { color: cleanHexColor(theme.pptx.border), width: 1 }
  });

  const orbitSvg = getConceptOrbitSvg(term, theme.pptx.primary, theme.pptx.secondary);
  slide.addImage({
    data: svgToDataUri(orbitSvg),
    x: diagX + 0.1,
    y: 1.55,
    w: diagW - 0.2,
    h: 3.2
  });
}

/**
 * 9. Render Timeline Slide - Horizontal Track Bar & Milestone Pins
 */
function renderTimelineSlide(pptx, slide, model, theme, totalSlides, domainInfo) {
  addSlideHeaderAndFooter(pptx, slide, model, theme, totalSlides, 'تسلسل زمني ومراحل تاريخية', 'clock');
  const isRtl = model.isRtl;
  const font = getFontFamily(isRtl);
  const align = getTextAlignment(isRtl);

  const bullets = model.bullets || [];
  const count = Math.min(bullets.length, 4);

  // Horizontal Timeline Track Bar
  slide.addShape(pptx.ShapeType.rect, {
    x: 0.8,
    y: 2.8,
    w: 8.4,
    h: 0.08,
    fill: { color: cleanHexColor(theme.pptx.primary) }
  });

  if (count > 0) {
    const cardWidth = (8.4 - (count - 1) * 0.25) / count;
    bullets.slice(0, count).forEach((b, idx) => {
      const cardX = isRtl
        ? 0.8 + (count - 1 - idx) * (cardWidth + 0.25)
        : 0.8 + idx * (cardWidth + 0.25);

      // Milestone Card
      slide.addShape(pptx.ShapeType.roundRect, {
        x: cardX,
        y: 1.6,
        w: cardWidth,
        h: 2.8,
        rectRadius: 0.1,
        fill: { color: cleanHexColor(theme.pptx.surface) },
        line: { color: cleanHexColor(theme.pptx.primary), width: 1.2 }
      });

      // Pin Badge with Calendar UIcon
      slide.addShape(pptx.ShapeType.roundRect, {
        x: cardX + 0.15,
        y: 1.75,
        w: cardWidth - 0.3,
        h: 0.35,
        rectRadius: 0.08,
        fill: { color: cleanHexColor(theme.pptx.primary) }
      });

      const calUri = getIconDataUri('calendar', 'FFFFFF', 64);
      slide.addImage({
        data: calUri,
        x: isRtl ? cardX + cardWidth - 0.45 : cardX + 0.25,
        y: 1.83,
        w: 0.18,
        h: 0.18
      });

      slide.addText(`محطة 0${idx + 1}`, {
        x: cardX + 0.15,
        y: 1.75,
        w: cardWidth - 0.3,
        h: 0.35,
        fontFace: font,
        fontSize: 10,
        bold: true,
        color: 'FFFFFF',
        align: 'center',
        valign: 'middle'
      });

      // Content
      slide.addText(b, {
        x: cardX + 0.15,
        y: 2.25,
        w: cardWidth - 0.3,
        h: 2.0,
        fontFace: font,
        fontSize: 11,
        color: cleanHexColor(theme.pptx.textPrimary),
        align: align,
        lineSpacingMultiple: 1.2
      });
    });
  }
}

/**
 * 10. Render Conclusion Slide - Golden Trophy UIcon & 3 Strategic Recommendation Cards
 */
function renderConclusionSlide(pptx, slide, model, theme, totalSlides, domainInfo) {
  addSlideHeaderAndFooter(pptx, slide, model, theme, totalSlides, 'الخاتمة والنتائج المستخلصة', 'trophy');
  const isRtl = model.isRtl;
  const font = getFontFamily(isRtl);
  const align = getTextAlignment(isRtl);

  const conclusionText = (model.paragraphs && model.paragraphs[0]) || model.keyPoint || '';

  // Extract or fallback recommendations
  const bullets = (Array.isArray(model.bullets) && model.bullets.length > 0)
    ? model.bullets
    : [
        'توظيف النتائج المستخلصة في تطوير المعرفة العلمية والتطبيقية',
        'بناء استراتيجيات منهجية مرنة تستجيب لمتطلبات الواقع العملي',
        'فتح آفاق بحثية جديدة للدراسات المستقبلية والتحليل المقارن'
      ];
  const recCards = bullets.slice(0, 3);

  const cardMeta = [
    { title: 'التوصية الأولى: الأثر العلمي والتطبيقي', icon: 'target', color: theme.pptx.primary },
    { title: 'التوصية الثانية: التمكين المنهجي', icon: 'trendingUp', color: theme.pptx.secondary },
    { title: 'التوصية الثالثة: الرؤية والآفاق المستقبلية', icon: 'lightbulb', color: theme.pptx.accent || theme.pptx.primary }
  ];

  // 1. Top Hero Conclusion Box
  slide.addShape(pptx.ShapeType.roundRect, {
    x: 0.8,
    y: 1.35,
    w: 8.4,
    h: 1.5,
    rectRadius: 0.1,
    fill: { color: cleanHexColor(theme.pptx.surface) },
    line: { color: cleanHexColor(theme.pptx.primary), width: 1.5 }
  });

  // Trophy Medallion Badge
  const badgeX = isRtl ? 5.7 : 1.0;
  slide.addShape(pptx.ShapeType.roundRect, {
    x: badgeX,
    y: 1.48,
    w: 3.3,
    h: 0.36,
    rectRadius: 0.08,
    fill: { color: cleanHexColor(theme.pptx.primary) }
  });

  const trophyUri = getIconDataUri('trophy', 'FFFFFF', 64);
  slide.addImage({
    data: trophyUri,
    x: isRtl ? 8.68 : 1.12,
    y: 1.54,
    w: 0.22,
    h: 0.22
  });

  slide.addText('الاستنتاج الجوهري وخلاصة البحث', {
    x: isRtl ? 5.8 : 1.38,
    y: 1.48,
    w: 2.8,
    h: 0.36,
    fontFace: font,
    fontSize: 11,
    bold: true,
    color: 'FFFFFF',
    align: 'center',
    valign: 'middle'
  });

  // Complete Conclusion Paragraph
  slide.addText(conclusionText, {
    x: 1.05,
    y: 1.92,
    w: 7.9,
    h: 0.85,
    fontFace: font,
    fontSize: 11.5,
    color: cleanHexColor(theme.pptx.textPrimary),
    align: align,
    lineSpacingMultiple: 1.35
  });

  // 2. Bottom 3 Strategic Recommendation Cards
  const totalW = 8.4;
  const gap = 0.2;
  const cardW = 2.66;
  const cardH = 1.7;
  const cardY = 3.05;

  recCards.forEach((rec, idx) => {
    const meta = cardMeta[idx] || cardMeta[0];
    const cardX = isRtl
      ? (0.8 + (recCards.length - 1 - idx) * (cardW + gap))
      : (0.8 + idx * (cardW + gap));

    slide.addShape(pptx.ShapeType.roundRect, {
      x: cardX,
      y: cardY,
      w: cardW,
      h: cardH,
      rectRadius: 0.1,
      fill: { color: cleanHexColor(theme.pptx.surface) },
      line: { color: cleanHexColor(meta.color), width: 1.5 }
    });

    const iconUri = getIconDataUri(meta.icon, cleanHexColor(meta.color), 64);
    slide.addImage({
      data: iconUri,
      x: isRtl ? (cardX + cardW - 0.38) : (cardX + 0.14),
      y: cardY + 0.14,
      w: 0.24,
      h: 0.24
    });

    slide.addText(meta.title, {
      x: isRtl ? (cardX + 0.12) : (cardX + 0.42),
      y: cardY + 0.12,
      w: cardW - 0.54,
      h: 0.3,
      fontFace: font,
      fontSize: 10.5,
      bold: true,
      color: cleanHexColor(meta.color),
      align: align,
      valign: 'middle'
    });

    slide.addText(rec, {
      x: cardX + 0.15,
      y: cardY + 0.48,
      w: cardW - 0.3,
      h: 1.15,
      fontFace: font,
      fontSize: 10,
      color: cleanHexColor(theme.pptx.textPrimary),
      align: align,
      lineSpacingMultiple: 1.25
    });
  });
}

/**
 * 11. Render References Slide - Bookshelf Badge & Numbered Citations
 */
function renderReferencesSlide(pptx, slide, model, theme, totalSlides, domainInfo) {
  addSlideHeaderAndFooter(pptx, slide, model, theme, totalSlides, 'قائمة المصادر والمراجع المعتمدة', 'bookOpen');
  const isRtl = model.isRtl;
  const font = getFontFamily(isRtl);
  const align = getTextAlignment(isRtl);

  // References Card Box
  slide.addShape(pptx.ShapeType.roundRect, {
    x: 0.8,
    y: 1.45,
    w: 8.4,
    h: 3.4,
    rectRadius: 0.12,
    fill: { color: cleanHexColor(theme.pptx.surface) },
    line: { color: cleanHexColor(theme.pptx.border), width: 1.2 }
  });

  // Bookshelf Badge with Bookmark UIcon
  slide.addShape(pptx.ShapeType.roundRect, {
    x: 1.0,
    y: 1.6,
    w: 3.2,
    h: 0.35,
    rectRadius: 0.08,
    fill: { color: cleanHexColor(theme.pptx.primary) }
  });

  const bookUri = getIconDataUri('bookmark', 'FFFFFF', 64);
  slide.addImage({
    data: bookUri,
    x: isRtl ? 3.85 : 1.15,
    y: 1.66,
    w: 0.22,
    h: 0.22
  });

  slide.addText('المراجع والتوثيق الأكاديمي', {
    x: 1.4,
    y: 1.6,
    w: 2.6,
    h: 0.35,
    fontFace: font,
    fontSize: 11,
    bold: true,
    color: 'FFFFFF',
    align: 'center',
    valign: 'middle'
  });

  const refsList = (model.bullets || []).map((ref, idx) => `[${idx + 1}]  ${ref}`).join('\n\n');
  slide.addText(refsList, {
    x: 1.1,
    y: 2.1,
    w: 7.8,
    h: 2.5,
    fontFace: font,
    fontSize: 10,
    color: cleanHexColor(theme.pptx.textPrimary),
    align: align,
    lineSpacingMultiple: 1.25
  });
}

/**
 * 12. Render Standard Content Slide - Explanation, Bullets with Emblems and Insights
 */
function renderStandardContentSlide(pptx, slide, model, theme, totalSlides, domainInfo, domain = 'general') {
  addSlideHeaderAndFooter(pptx, slide, model, theme, totalSlides, 'عرض تحليلي وتفصيلي', 'fileText');
  const isRtl = model.isRtl;
  const font = getFontFamily(isRtl);
  const align = getTextAlignment(isRtl);

  const mainW = 5.2;
  const sideW = 3.0;
  const mainX = isRtl ? 0.8 : 4.0;
  const sideX = isRtl ? 6.2 : 0.8;

  // Surface Card for Main Content
  slide.addShape(pptx.ShapeType.roundRect, {
    x: mainX,
    y: 1.45,
    w: mainW,
    h: 3.4,
    rectRadius: 0.1,
    fill: { color: cleanHexColor(theme.pptx.surface) },
    line: { color: cleanHexColor(theme.pptx.border), width: 1 }
  });

  // Paragraphs Content
  const textRuns = [];
  if (Array.isArray(model.paragraphs)) {
    model.paragraphs.forEach(p => {
      textRuns.push({
        text: p + '\n\n',
        options: { fontSize: 11.5, color: cleanHexColor(theme.pptx.textPrimary), lineSpacingMultiple: 1.2 }
      });
    });
  }

  // Bullets Content
  if (Array.isArray(model.bullets)) {
    model.bullets.forEach(b => {
      textRuns.push({
        text: `• ${b}\n\n`,
        options: { fontSize: 10.5, color: cleanHexColor(theme.pptx.textPrimary), lineSpacingMultiple: 1.2 }
      });
    });
  }

  slide.addText(textRuns, {
    x: mainX + 0.25,
    y: 1.6,
    w: mainW - 0.5,
    h: 2.3,
    fontFace: font,
    align: align,
    valign: 'top'
  });

  // Floating Keypoint Callout Box with Lightbulb UIcon
  slide.addShape(pptx.ShapeType.roundRect, {
    x: mainX + 0.25,
    y: 4.0,
    w: mainW - 0.5,
    h: 0.7,
    rectRadius: 0.08,
    fill: { color: cleanHexColor(theme.pptx.background) },
    line: { color: cleanHexColor(theme.pptx.primary), width: 1.5 }
  });

  const bulbUri = getIconDataUri('lightbulb', theme.pptx.primary, 64);
  slide.addImage({
    data: bulbUri,
    x: isRtl ? mainX + mainW - 0.6 : mainX + 0.35,
    y: 4.22,
    w: 0.24,
    h: 0.24
  });

  slide.addText(`إضاءة بحثية: ${model.keyPoint || model.paragraphs?.[0] || 'تحليل علمي موثق يستند إلى معطيات البحث.'}`, {
    x: mainX + 0.65,
    y: 4.05,
    w: mainW - 1.1,
    h: 0.6,
    fontFace: font,
    fontSize: 10,
    bold: true,
    color: cleanHexColor(theme.pptx.primary),
    align: align,
    valign: 'middle'
  });

  // Side Visual Card with Domain Architectural Vector Diagram
  slide.addShape(pptx.ShapeType.roundRect, {
    x: sideX,
    y: 1.45,
    w: sideW,
    h: 3.4,
    rectRadius: 0.1,
    fill: { color: cleanHexColor(theme.pptx.surface) },
    line: { color: cleanHexColor(theme.pptx.border), width: 1 }
  });

  const domainDiagSvg = getDomainInfographicSvg(domain, theme.pptx.primary, theme.pptx.secondary);
  slide.addImage({
    data: svgToDataUri(domainDiagSvg),
    x: sideX + 0.1,
    y: 1.55,
    w: sideW - 0.2,
    h: 3.2
  });
}

/**
 * Universal Header and Footer helper for interior slides
 */
function addSlideHeaderAndFooter(pptx, slide, model, theme, totalSlides, defaultSectionTitle = '', iconKey = 'bookmark') {
  const isRtl = model.isRtl;
  const font = getFontFamily(isRtl);
  const align = getTextAlignment(isRtl);

  // Top Title Bar Gradient Line
  slide.addShape(pptx.ShapeType.rect, {
    x: 0,
    y: 0,
    w: 10.0,
    h: 0.08,
    fill: { color: cleanHexColor(theme.pptx.primary) }
  });

  // Section Breadcrumb Kicker with UIcon
  const sectionText = model.sectionTitle || defaultSectionTitle;
  if (sectionText) {
    const kickerIconUri = getIconDataUri(iconKey, theme.pptx.primary, 64);
    slide.addImage({
      data: kickerIconUri,
      x: isRtl ? 9.0 : 0.8,
      y: 0.32,
      w: 0.2,
      h: 0.2
    });

    slide.addText(sectionText, {
      x: isRtl ? 0.8 : 1.1,
      y: 0.3,
      w: 8.0,
      h: 0.3,
      fontFace: font,
      fontSize: 10,
      bold: true,
      color: cleanHexColor(theme.pptx.primary),
      align: align
    });
  }

  // Slide Title
  slide.addText(model.title || '', {
    x: 0.8,
    y: 0.6,
    w: 8.4,
    h: 0.6,
    fontFace: font,
    fontSize: 20,
    bold: true,
    color: cleanHexColor(theme.pptx.headerBg),
    align: align
  });

  // Footer: Slide Number Pill
  slide.addShape(pptx.ShapeType.roundRect, {
    x: isRtl ? 0.8 : 8.4,
    y: 5.15,
    w: 0.8,
    h: 0.3,
    rectRadius: 0.05,
    fill: { color: cleanHexColor(theme.pptx.primary) }
  });

  slide.addText(`${model.slideNumber || 1} / ${totalSlides}`, {
    x: isRtl ? 0.8 : 8.4,
    y: 5.15,
    w: 0.8,
    h: 0.3,
    fontFace: font,
    fontSize: 9,
    bold: true,
    color: 'FFFFFF',
    align: 'center',
    valign: 'middle'
  });

  // Footer: Academic Watermark with GraduationCap UIcon
  const capUri = getIconDataUri('graduationCap', theme.pptx.textSecondary, 64);
  slide.addImage({
    data: capUri,
    x: isRtl ? 7.8 : 0.8,
    y: 5.2,
    w: 0.18,
    h: 0.18
  });

  slide.addText('عرض أكاديمي جامعي مهيكل ومحكّم', {
    x: isRtl ? 2.0 : 1.05,
    y: 5.15,
    w: 5.7,
    h: 0.3,
    fontFace: font,
    fontSize: 9,
    color: cleanHexColor(theme.pptx.textSecondary),
    align: align
  });
}
