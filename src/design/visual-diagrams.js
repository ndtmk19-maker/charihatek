/**
 * Academic Visual Diagrams & Vector Infographics Library
 * Provides publication-grade, fully scalable SVG diagrams for all domains and slide types.
 * Generates both inline HTML SVGs and Base64/UTF-8 Data URIs for native PowerPoint (.pptx) embedding.
 * 
 * Includes:
 * - Domain-tailored architectural diagrams (Technology, Management, Economics, Medicine, Accounting, Law)
 * - Conceptual 3-Orbit diagrams for Definitions
 * - Research Funnel hierarchy diagrams for Introductions
 * - Visual VS Crests for Comparisons
 * - Balance Scales for Pros & Cons
 * - Geometric background patterns & watermark meshes
 */

import { DOMAINS } from '../classifier/domain-dictionaries.js';

/**
 * Encodes an SVG string to a data URI for PptxGenJS or CSS background
 */
export function svgToDataUri(svgString) {
  let clean = svgString.replace(/\n\s*/g, ' ').trim();

  // If the SVG has width="100%" or height="100%", replace with viewBox dimensions
  const vbMatch = clean.match(/viewBox=["']\s*0\s+0\s+(\d+)\s+(\d+)\s*["']/i);
  if (vbMatch) {
    const w = vbMatch[1];
    const h = vbMatch[2];
    if (clean.includes('width="100%"')) {
      clean = clean.replace(/width=["']100%["']/gi, `width="${w}"`);
    } else if (!clean.includes('width=')) {
      clean = clean.replace('<svg ', `<svg width="${w}" `);
    }
    if (clean.includes('height="100%"')) {
      clean = clean.replace(/height=["']100%["']/gi, `height="${h}"`);
    } else if (!clean.includes('height=')) {
      clean = clean.replace('<svg ', `<svg height="${h}" `);
    }
  }

  // Ensure xmlns is present for browser Image loader
  if (!clean.includes('xmlns=')) {
    clean = clean.replace('<svg ', '<svg xmlns="http://www.w3.org/2000/svg" ');
  }

  // Use base64 in browser or node
  if (typeof btoa !== 'undefined') {
    return `data:image/svg+xml;base64,${btoa(unescape(encodeURIComponent(clean)))}`;
  } else if (typeof Buffer !== 'undefined') {
    return `data:image/svg+xml;base64,${Buffer.from(clean, 'utf-8').toString('base64')}`;
  }
  return `data:image/svg+xml;utf8,${encodeURIComponent(clean)}`;
}

/**
 * 1. Geometric Background Patterns - Dual-Tone Split & Rich Academic Canvases
 * Implements "نصف أبيض ونصف ملوّن" (Half White & Half Saturated Color) for content slides,
 * and 100% full rich saturated gradient canvas for Cover and Section Divider slides.
 */
export function getSlideBackgroundSvg(primaryHex = '#0284c7', secondaryHex = '#0ea5e9', slideType = 'standard', isRtl = true) {
  const p = primaryHex.startsWith('#') ? primaryHex : `#${primaryHex}`;
  const s = secondaryHex.startsWith('#') ? secondaryHex : `#${secondaryHex}`;

  // 1. COVER SLIDE: Full 100% Rich Saturated Gradient with Geometric Watermarks
  if (slideType === 'cover' || slideType === 'COVER') {
    return `
      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1600 900" width="100%" height="100%" preserveAspectRatio="none" style="position: absolute; top: 0; left: 0; width: 100%; height: 100%; pointer-events: none; z-index: 1;">
        <defs>
          <linearGradient id="coverRichGrad" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stop-color="#090d16" />
            <stop offset="35%" stop-color="${p}" />
            <stop offset="100%" stop-color="${s}" />
          </linearGradient>
          <radialGradient id="coverCoreGlow" cx="50%" cy="40%" r="55%">
            <stop offset="0%" stop-color="#ffffff" stop-opacity="0.18" />
            <stop offset="100%" stop-color="#ffffff" stop-opacity="0" />
          </radialGradient>
          <pattern id="coverGrid" width="60" height="60" patternUnits="userSpaceOnUse">
            <path d="M 60 0 L 0 0 0 60" fill="none" stroke="#ffffff" stroke-width="0.75" stroke-opacity="0.08" />
            <circle cx="60" cy="0" r="1.5" fill="#ffffff" fill-opacity="0.15" />
          </pattern>
        </defs>

        <!-- Base Bold Gradient Fill -->
        <rect width="1600" height="900" fill="url(#coverRichGrad)" />
        <rect width="1600" height="900" fill="url(#coverCoreGlow)" />
        <rect width="1600" height="900" fill="url(#coverGrid)" />

        <!-- Large Orbital Crest Rings -->
        <circle cx="800" cy="450" r="420" fill="none" stroke="#ffffff" stroke-width="1.5" stroke-opacity="0.12" stroke-dasharray="8 6" />
        <circle cx="800" cy="450" r="300" fill="none" stroke="#ffffff" stroke-width="1" stroke-opacity="0.1" />
        <circle cx="800" cy="450" r="180" fill="#ffffff" fill-opacity="0.03" />

        <!-- Corner Geometric Rosettes -->
        <g opacity="0.18" transform="translate(40, 40)">
          <rect width="120" height="120" fill="none" stroke="#ffffff" stroke-width="1.5" />
          <rect x="20" y="20" width="80" height="80" fill="none" stroke="#ffffff" stroke-width="1" stroke-dasharray="4 4" />
        </g>
        <g opacity="0.18" transform="translate(1440, 740)">
          <rect width="120" height="120" fill="none" stroke="#ffffff" stroke-width="1.5" />
          <rect x="20" y="20" width="80" height="80" fill="none" stroke="#ffffff" stroke-width="1" stroke-dasharray="4 4" />
        </g>
      </svg>
    `;
  }

  // 2. SECTION DIVIDER: Bold High-Contrast Architectural Banner
  if (slideType === 'section_divider' || slideType === 'SECTION_DIVIDER') {
    return `
      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1600 900" width="100%" height="100%" preserveAspectRatio="none" style="position: absolute; top: 0; left: 0; width: 100%; height: 100%; pointer-events: none; z-index: 1;">
        <defs>
          <linearGradient id="divHalfGrad" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stop-color="${p}" />
            <stop offset="100%" stop-color="${s}" />
          </linearGradient>
          <pattern id="divIso" width="50" height="50" patternUnits="userSpaceOnUse">
            <path d="M 50 0 L 0 0 0 50" fill="none" stroke="#ffffff" stroke-width="0.75" stroke-opacity="0.1" />
            <circle cx="50" cy="0" r="1.5" fill="#ffffff" fill-opacity="0.15" />
          </pattern>
        </defs>

        <!-- Base Dark Navy Half -->
        <rect width="1600" height="900" fill="#090d16" />

        <!-- Bold Angled Saturated Color Half -->
        <polygon points="${isRtl ? '0,0 750,0 600,900 0,900' : '850,0 1600,0 1600,900 1000,900'}" fill="url(#divHalfGrad)" />
        <polygon points="${isRtl ? '0,0 750,0 600,900 0,900' : '850,0 1600,0 1600,900 1000,900'}" fill="url(#divIso)" />

        <!-- Seam Glow Line -->
        <line x1="${isRtl ? '750' : '850'}" y1="0" x2="${isRtl ? '600' : '1000'}" y2="900" stroke="#ffffff" stroke-width="3" stroke-opacity="0.4" />
      </svg>
    `;
  }

  // 3. STANDARD & CONTENT SLIDES: The Dual-Tone Split Background (نصف أبيض ونصف ملوّن: أزرق/أخضر/أحمر/أصفر)
  // In RTL: The left ~38% (0 to 600) is bold colored, right ~62% (600 to 1600) is crisp pearl white.
  // In LTR: Left ~62% (0 to 1000) is crisp white, right ~38% (1000 to 1600) is bold colored.
  const splitPoints = isRtl
    ? '0,0 620,0 540,900 0,900'
    : '980,0 1600,0 1600,900 1060,900';
  const seamX1 = isRtl ? 620 : 980;
  const seamX2 = isRtl ? 540 : 1060;

  return `
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1600 900" width="100%" height="100%" preserveAspectRatio="none" style="position: absolute; top: 0; left: 0; width: 100%; height: 100%; pointer-events: none; z-index: 1;">
      <defs>
        <!-- Rich Saturated Color Gradient for the Colored Half -->
        <linearGradient id="splitColorGrad" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stop-color="${p}" />
          <stop offset="60%" stop-color="${p}" />
          <stop offset="100%" stop-color="${s}" />
        </linearGradient>

        <!-- Subtle Micro Dots for White Half -->
        <pattern id="whiteHalfGrid" width="45" height="45" patternUnits="userSpaceOnUse">
          <circle cx="2" cy="2" r="1.2" fill="${p}" fill-opacity="0.08" />
        </pattern>

        <!-- Isometric Grid for Colored Half -->
        <pattern id="coloredHalfGrid" width="55" height="55" patternUnits="userSpaceOnUse">
          <path d="M 55 0 L 0 0 0 55" fill="none" stroke="#ffffff" stroke-width="0.8" stroke-opacity="0.12" />
          <circle cx="55" cy="0" r="2" fill="#ffffff" fill-opacity="0.25" />
          <circle cx="0" cy="55" r="2" fill="#ffffff" fill-opacity="0.25" />
        </pattern>

        <!-- Shadow filter for the Seam -->
        <filter id="seamShadow" x="-10%" y="0%" width="120%" height="100%">
          <feDropShadow dx="${isRtl ? '4' : '-4'}" dy="0" stdDeviation="6" flood-color="#000000" flood-opacity="0.22"/>
        </filter>
      </defs>

      <!-- 1. Full Base: Clean Crisp Pearl White -->
      <rect width="1600" height="900" fill="#ffffff" />
      <rect width="1600" height="900" fill="url(#whiteHalfGrid)" />

      <!-- 2. The Vivid Colored Half (Solid Saturated Primary/Secondary Color) with Shadow -->
      <polygon points="${splitPoints}" fill="url(#splitColorGrad)" filter="url(#seamShadow)" />
      
      <!-- 3. Overlaid Isometric Grid on the Colored Half -->
      <polygon points="${splitPoints}" fill="url(#coloredHalfGrid)" />

      <!-- 4. Luminous Accent Seam Divider Line -->
      <line x1="${seamX1}" y1="0" x2="${seamX2}" y2="900" stroke="#ffffff" stroke-width="3" stroke-opacity="0.5" />
      <line x1="${seamX1}" y1="0" x2="${seamX2}" y2="900" stroke="${s}" stroke-width="1.5" stroke-opacity="0.8" />

      <!-- 5. Floating Geometric Accents on the Colored Half -->
      ${isRtl ? `
        <g opacity="0.2" transform="translate(60, 60)">
          <polygon points="60,0 120,60 60,120 0,60" fill="none" stroke="#ffffff" stroke-width="2" />
          <circle cx="60" cy="60" r="30" fill="none" stroke="#ffffff" stroke-width="1" stroke-dasharray="3 3" />
        </g>
        <g opacity="0.15" transform="translate(30, 720)">
          <circle cx="80" cy="80" r="70" fill="none" stroke="#ffffff" stroke-width="1.5" stroke-dasharray="6 4" />
          <circle cx="80" cy="80" r="40" fill="#ffffff" fill-opacity="0.1" />
        </g>
      ` : `
        <g opacity="0.2" transform="translate(1420, 60)">
          <polygon points="60,0 120,60 60,120 0,60" fill="none" stroke="#ffffff" stroke-width="2" />
          <circle cx="60" cy="60" r="30" fill="none" stroke="#ffffff" stroke-width="1" stroke-dasharray="3 3" />
        </g>
        <g opacity="0.15" transform="translate(1400, 720)">
          <circle cx="80" cy="80" r="70" fill="none" stroke="#ffffff" stroke-width="1.5" stroke-dasharray="6 4" />
          <circle cx="80" cy="80" r="40" fill="#ffffff" fill-opacity="0.1" />
        </g>
      `}

      <!-- 6. Corner Radial Ambient Glow on the White Half -->
      <circle cx="${isRtl ? '1500' : '100'}" cy="100" r="350" fill="${p}" fill-opacity="0.04" />
    </svg>
  `;
}

/**
 * 2. Domain-Specific Architectural Infographics (رسومات ومخططات المجالات الأكاديمية)
 */
export function getDomainInfographicSvg(domain = 'general', primaryHex = '#0284c7', secondaryHex = '#0ea5e9') {
  const p = primaryHex.startsWith('#') ? primaryHex : `#${primaryHex}`;
  const s = secondaryHex.startsWith('#') ? secondaryHex : `#${secondaryHex}`;

  switch (domain) {
    case DOMAINS.TECHNOLOGY:
      return `
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 400 320" width="100%" height="100%">
          <defs>
            <linearGradient id="techGrad" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stop-color="${p}" />
              <stop offset="100%" stop-color="${s}" />
            </linearGradient>
            <filter id="shadow" x="-10%" y="-10%" width="120%" height="120%">
              <feDropShadow dx="0" dy="4" stdDeviation="4" flood-opacity="0.08"/>
            </filter>
          </defs>

          <!-- Outer Circuit Board Border -->
          <rect x="10" y="10" width="380" height="300" rx="12" fill="#ffffff" stroke="${p}" stroke-width="1" stroke-opacity="0.2" filter="url(#shadow)"/>
          <path d="M 20 40 L 50 40 L 70 20 L 150 20" fill="none" stroke="${p}" stroke-width="1.5" stroke-opacity="0.3"/>
          <circle cx="150" cy="20" r="3" fill="${p}" fill-opacity="0.5"/>
          <path d="M 380 280 L 350 280 L 330 300 L 250 300" fill="none" stroke="${s}" stroke-width="1.5" stroke-opacity="0.3"/>
          <circle cx="250" cy="300" r="3" fill="${s}" fill-opacity="0.5"/>

          <!-- Top Layer: Client & Intelligence UI -->
          <rect x="50" y="35" width="300" height="55" rx="8" fill="${p}" fill-opacity="0.08" stroke="${p}" stroke-width="1.5"/>
          <circle cx="80" cy="62" r="14" fill="${p}"/>
          <path d="M 75 62 L 79 66 L 86 58" fill="none" stroke="#ffffff" stroke-width="2"/>
          <text x="105" y="58" font-family="Cairo, sans-serif" font-size="13" font-weight="bold" fill="${p}">طبقة التطبيقات وواجهات الذكاء</text>
          <text x="105" y="76" font-family="Cairo, sans-serif" font-size="10" fill="#64748b">معالجة فورية وتفاعل ذكي للمستخدم</text>

          <!-- Connector 1 -->
          <line x1="200" y1="90" x2="200" y2="120" stroke="${p}" stroke-width="2" stroke-dasharray="4 3"/>
          <polygon points="196,118 200,125 204,118" fill="${p}"/>

          <!-- Middle Layer: Core Algorithm & Engine -->
          <rect x="40" y="125" width="320" height="70" rx="10" fill="url(#techGrad)" filter="url(#shadow)"/>
          <circle cx="75" cy="160" r="18" fill="#ffffff" fill-opacity="0.2"/>
          <text x="75" y="165" text-anchor="middle" font-family="Cairo, sans-serif" font-size="14" font-weight="bold" fill="#ffffff">⚡</text>
          <text x="108" y="153" font-family="Cairo, sans-serif" font-size="14" font-weight="bold" fill="#ffffff">محرك الخوارزميات والتحليل العصبي</text>
          <text x="108" y="175" font-family="Cairo, sans-serif" font-size="11" fill="#e0f2fe">نماذج تعلم آلي متقدمة ومعالجة متزامنة</text>

          <!-- Connector 2 -->
          <line x1="200" y1="195" x2="200" y2="225" stroke="${s}" stroke-width="2" stroke-dasharray="4 3"/>
          <polygon points="196,223 200,230 204,223" fill="${s}"/>

          <!-- Bottom Layer: Security & Cloud Infrastructure -->
          <rect x="50" y="230" width="300" height="55" rx="8" fill="${s}" fill-opacity="0.08" stroke="${s}" stroke-width="1.5"/>
          <circle cx="80" cy="257" r="14" fill="${s}"/>
          <text x="80" y="262" text-anchor="middle" font-family="Cairo, sans-serif" font-size="11" fill="#ffffff">🔒</text>
          <text x="105" y="253" font-family="Cairo, sans-serif" font-size="13" font-weight="bold" fill="${s}">البنية السحابية وقواعد البيانات الآمنة</text>
          <text x="105" y="271" font-family="Cairo, sans-serif" font-size="10" fill="#64748b">تشفير سيبراني شامل وموثوقية عالية</text>
        </svg>
      `;

    case DOMAINS.MANAGEMENT:
      return `
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 400 320" width="100%" height="100%">
          <defs>
            <linearGradient id="mgmtGrad" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stop-color="${p}" />
              <stop offset="100%" stop-color="${s}" />
            </linearGradient>
            <filter id="mShadow" x="-10%" y="-10%" width="120%" height="120%">
              <feDropShadow dx="0" dy="4" stdDeviation="4" flood-opacity="0.08"/>
            </filter>
          </defs>

          <!-- Outer Container -->
          <rect x="10" y="10" width="380" height="300" rx="12" fill="#ffffff" stroke="${p}" stroke-width="1" stroke-opacity="0.2" filter="url(#mShadow)"/>

          <!-- Pyramid 1: Vision & Governance (Top) -->
          <polygon points="200,30 280,105 120,105" fill="url(#mgmtGrad)" filter="url(#mShadow)"/>
          <text x="200" y="70" text-anchor="middle" font-family="Cairo, sans-serif" font-size="11" font-weight="bold" fill="#ffffff">الرؤية والحوكمة</text>
          <text x="200" y="90" text-anchor="middle" font-family="Cairo, sans-serif" font-size="9" fill="#e0f2fe">السياسات والقيادة</text>

          <!-- Pyramid 2: Strategy & Operational Process (Middle) -->
          <polygon points="115,115 285,115 325,195 75,195" fill="${p}" fill-opacity="0.12" stroke="${p}" stroke-width="1.5"/>
          <text x="200" y="148" text-anchor="middle" font-family="Cairo, sans-serif" font-size="13" font-weight="bold" fill="${p}">سلاسل القيمة والعمليات المؤسسية</text>
          <text x="200" y="172" text-anchor="middle" font-family="Cairo, sans-serif" font-size="10" fill="#64748b">إعادة هندسة الإجراءات وتكامل الموارد البشرية</text>

          <!-- Pyramid 3: KPIs & Impact (Base) -->
          <polygon points="70,205 330,205 365,285 35,285" fill="${s}" fill-opacity="0.08" stroke="${s}" stroke-width="1.5"/>
          <text x="200" y="238" text-anchor="middle" font-family="Cairo, sans-serif" font-size="14" font-weight="bold" fill="${s}">مؤشرات الأداء والقياس المستدام (KPIs)</text>
          <text x="200" y="262" text-anchor="middle" font-family="Cairo, sans-serif" font-size="10" fill="#475569">تحقيق الكفاءة وخفض التكاليف وتعظيم المخرجات</text>
        </svg>
      `;

    case DOMAINS.ECONOMICS:
      return `
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 400 320" width="100%" height="100%">
          <defs>
            <linearGradient id="econGrad" x1="0%" y1="0%" x2="0%" y2="100%">
              <stop offset="0%" stop-color="${p}" stop-opacity="0.3" />
              <stop offset="100%" stop-color="${p}" stop-opacity="0" />
            </linearGradient>
            <filter id="eShadow" x="-10%" y="-10%" width="120%" height="120%">
              <feDropShadow dx="0" dy="4" stdDeviation="4" flood-opacity="0.08"/>
            </filter>
          </defs>

          <!-- Outer Box -->
          <rect x="10" y="10" width="380" height="300" rx="12" fill="#ffffff" stroke="${p}" stroke-width="1" stroke-opacity="0.2" filter="url(#eShadow)"/>

          <!-- Title Bar -->
          <rect x="25" y="25" width="350" height="35" rx="6" fill="${p}" fill-opacity="0.08"/>
          <text x="200" y="47" text-anchor="middle" font-family="Cairo, sans-serif" font-size="12" font-weight="bold" fill="${p}">محددات التوازن ومؤشرات النمو الاقتصادي</text>

          <!-- Coordinate Axes -->
          <line x1="55" y1="260" x2="350" y2="260" stroke="#94a3b8" stroke-width="1.5"/>
          <line x1="55" y1="75" x2="55" y2="260" stroke="#94a3b8" stroke-width="1.5"/>

          <!-- Grid Lines -->
          <line x1="55" y1="210" x2="350" y2="210" stroke="#e2e8f0" stroke-width="1" stroke-dasharray="3 3"/>
          <line x1="55" y1="160" x2="350" y2="160" stroke="#e2e8f0" stroke-width="1" stroke-dasharray="3 3"/>
          <line x1="55" y1="110" x2="350" y2="110" stroke="#e2e8f0" stroke-width="1" stroke-dasharray="3 3"/>

          <!-- Area Under Curve -->
          <path d="M 55 240 Q 150 210, 220 150 T 340 90 L 340 260 L 55 260 Z" fill="url(#econGrad)"/>

          <!-- Trend Vector Curve -->
          <path d="M 55 240 Q 150 210, 220 150 T 340 90" fill="none" stroke="${p}" stroke-width="3.5" stroke-linecap="round"/>

          <!-- Counter Curve (Supply / Cost) -->
          <path d="M 55 100 Q 160 140, 220 170 T 340 230" fill="none" stroke="${s}" stroke-width="2" stroke-dasharray="5 4" stroke-linecap="round"/>

          <!-- Equilibrium Point Badge -->
          <circle cx="215" cy="155" r="7" fill="${p}"/>
          <circle cx="215" cy="155" r="12" fill="none" stroke="${p}" stroke-width="1.5" stroke-opacity="0.5"/>
          <rect x="235" y="135" width="105" height="28" rx="5" fill="#0f172a" opacity="0.9"/>
          <text x="287" y="153" text-anchor="middle" font-family="Cairo, sans-serif" font-size="10" font-weight="bold" fill="#ffffff">نقطة التوازن: +42%</text>

          <!-- High Growth Peak Point -->
          <circle cx="340" cy="90" r="5" fill="#16a34a"/>
          <rect x="260" y="72" width="75" height="24" rx="4" fill="#16a34a"/>
          <text x="297" y="88" text-anchor="middle" font-family="Cairo, sans-serif" font-size="10" font-weight="bold" fill="#ffffff">الذروة: +88%</text>
        </svg>
      `;

    case DOMAINS.MEDICINE:
      return `
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 400 320" width="100%" height="100%">
          <defs>
            <linearGradient id="medGrad" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stop-color="${p}" />
              <stop offset="100%" stop-color="${s}" />
            </linearGradient>
            <filter id="medShadow" x="-10%" y="-10%" width="120%" height="120%">
              <feDropShadow dx="0" dy="4" stdDeviation="4" flood-opacity="0.08"/>
            </filter>
          </defs>

          <!-- Outer Container -->
          <rect x="10" y="10" width="380" height="300" rx="12" fill="#ffffff" stroke="${p}" stroke-width="1" stroke-opacity="0.2" filter="url(#medShadow)"/>

          <!-- Top Shield Banner -->
          <path d="M 200 25 L 340 55 L 340 120 Q 340 210, 200 285 Q 60 210, 60 120 L 60 55 Z" fill="${p}" fill-opacity="0.06" stroke="${p}" stroke-width="1.5"/>

          <!-- Central Clinical Caduceus / Health Cross Emblem -->
          <circle cx="200" cy="115" r="38" fill="url(#medGrad)" filter="url(#medShadow)"/>
          <path d="M 194 95 H 206 V 110 H 221 V 122 H 206 V 137 H 194 V 122 H 179 V 110 H 194 Z" fill="#ffffff"/>

          <!-- ECG Wave Vector -->
          <path d="M 80 190 L 130 190 L 145 170 L 160 220 L 180 150 L 195 210 L 210 185 L 225 195 L 320 195" fill="none" stroke="${s}" stroke-width="2.5" stroke-linecap="round"/>

          <!-- Clinical Evaluation Nodes -->
          <rect x="75" y="240" width="250" height="45" rx="8" fill="#ffffff" stroke="${p}" stroke-width="1.5" filter="url(#medShadow)"/>
          <text x="200" y="258" text-anchor="middle" font-family="Cairo, sans-serif" font-size="12" font-weight="bold" fill="${p}">منظومة التحقق السريري والتشخيص الطبي</text>
          <text x="200" y="274" text-anchor="middle" font-family="Cairo, sans-serif" font-size="10" fill="#64748b">دقة تشخيصية موثوقة بنسبة تتجاوز 95%</text>
        </svg>
      `;

    default: // General & Law
      return `
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 400 320" width="100%" height="100%">
          <defs>
            <linearGradient id="genGrad" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stop-color="${p}" />
              <stop offset="100%" stop-color="${s}" />
            </linearGradient>
            <filter id="gShadow" x="-10%" y="-10%" width="120%" height="120%">
              <feDropShadow dx="0" dy="4" stdDeviation="4" flood-opacity="0.08"/>
            </filter>
          </defs>

          <!-- Outer Container -->
          <rect x="10" y="10" width="380" height="300" rx="12" fill="#ffffff" stroke="${p}" stroke-width="1" stroke-opacity="0.2" filter="url(#gShadow)"/>

          <!-- Pediment / Temple Roof -->
          <polygon points="200,30 360,80 40,80" fill="url(#genGrad)" filter="url(#gShadow)"/>
          <text x="200" y="65" text-anchor="middle" font-family="Cairo, sans-serif" font-size="12" font-weight="bold" fill="#ffffff">أركان ومحددات التأصيل المنهجي</text>

          <!-- 3 Pillars of Governance & Research -->
          <!-- Pillar 1 -->
          <rect x="70" y="90" width="60" height="150" rx="4" fill="${p}" fill-opacity="0.1" stroke="${p}" stroke-width="1.5"/>
          <text x="100" y="150" text-anchor="middle" font-family="Cairo, sans-serif" font-size="11" font-weight="bold" fill="${p}">التأصيل</text>
          <text x="100" y="170" text-anchor="middle" font-family="Cairo, sans-serif" font-size="9" fill="#64748b">النظري</text>

          <!-- Pillar 2 (Center) -->
          <rect x="170" y="90" width="60" height="150" rx="4" fill="${s}" fill-opacity="0.15" stroke="${s}" stroke-width="2"/>
          <text x="200" y="150" text-anchor="middle" font-family="Cairo, sans-serif" font-size="11" font-weight="bold" fill="${s}">المعيارية</text>
          <text x="200" y="170" text-anchor="middle" font-family="Cairo, sans-serif" font-size="9" fill="#64748b">المنهجية</text>

          <!-- Pillar 3 -->
          <rect x="270" y="90" width="60" height="150" rx="4" fill="${p}" fill-opacity="0.1" stroke="${p}" stroke-width="1.5"/>
          <text x="300" y="150" text-anchor="middle" font-family="Cairo, sans-serif" font-size="11" font-weight="bold" fill="${p}">الأثر</text>
          <text x="300" y="170" text-anchor="middle" font-family="Cairo, sans-serif" font-size="9" fill="#64748b">التطبيقي</text>

          <!-- Base Step Platform -->
          <rect x="40" y="245" width="320" height="20" rx="3" fill="${p}" fill-opacity="0.2"/>
          <rect x="25" y="268" width="350" height="25" rx="5" fill="#0f172a" opacity="0.9"/>
          <text x="200" y="285" text-anchor="middle" font-family="Cairo, sans-serif" font-size="11" font-weight="bold" fill="#ffffff">تكامل معرفي ومنهجي موثق ومحكم</text>
        </svg>
      `;
  }
}

/**
 * 3. Conceptual 3-Orbit Diagram for Definition Slides (مخطط المفهوم ثلاثي الأبعاد)
 */
export function getConceptOrbitSvg(term = 'المفهوم المركزي', primaryHex = '#0284c7', secondaryHex = '#0ea5e9') {
  const p = primaryHex.startsWith('#') ? primaryHex : `#${primaryHex}`;
  const s = secondaryHex.startsWith('#') ? secondaryHex : `#${secondaryHex}`;

  return `
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 380 280" width="100%" height="100%">
      <defs>
        <radialGradient id="centerGrad" cx="50%" cy="50%" r="50%">
          <stop offset="0%" stop-color="${p}" />
          <stop offset="100%" stop-color="#0f172a" />
        </radialGradient>
        <filter id="orbitShadow" x="-10%" y="-10%" width="120%" height="120%">
          <feDropShadow dx="0" dy="4" stdDeviation="4" flood-opacity="0.12"/>
        </filter>
      </defs>

      <!-- Outer Orbital Ellipse -->
      <ellipse cx="190" cy="140" rx="150" ry="95" fill="none" stroke="${p}" stroke-width="1.5" stroke-dasharray="6 4" stroke-opacity="0.4"/>
      <ellipse cx="190" cy="140" rx="90" ry="55" fill="none" stroke="${s}" stroke-width="1" stroke-opacity="0.3"/>

      <!-- Connecting Spokes -->
      <line x1="190" y1="140" x2="190" y2="45" stroke="${p}" stroke-width="1.5" stroke-opacity="0.5"/>
      <line x1="190" y1="140" x2="60" y2="195" stroke="${p}" stroke-width="1.5" stroke-opacity="0.5"/>
      <line x1="190" y1="140" x2="320" y2="195" stroke="${p}" stroke-width="1.5" stroke-opacity="0.5"/>

      <!-- Central Core Sphere -->
      <circle cx="190" cy="140" r="48" fill="url(#centerGrad)" filter="url(#orbitShadow)"/>
      <circle cx="190" cy="140" r="54" fill="none" stroke="${s}" stroke-width="2" stroke-opacity="0.6"/>
      <text x="190" y="136" text-anchor="middle" font-family="Cairo, sans-serif" font-size="12" font-weight="bold" fill="#ffffff">${term.substring(0, 16)}</text>
      <text x="190" y="154" text-anchor="middle" font-family="Cairo, sans-serif" font-size="9" fill="#e0f2fe">النواة المفاهيمية</text>

      <!-- Satellite Node 1: Theoretical Dimension (Top) -->
      <circle cx="190" cy="45" r="28" fill="#ffffff" stroke="${p}" stroke-width="2" filter="url(#orbitShadow)"/>
      <text x="190" y="44" text-anchor="middle" font-family="Cairo, sans-serif" font-size="10" font-weight="bold" fill="${p}">البعد</text>
      <text x="190" y="56" text-anchor="middle" font-family="Cairo, sans-serif" font-size="8" fill="#64748b">النظري</text>

      <!-- Satellite Node 2: Structural Dimension (Bottom Right) -->
      <circle cx="320" cy="195" r="28" fill="#ffffff" stroke="${s}" stroke-width="2" filter="url(#orbitShadow)"/>
      <text x="320" y="194" text-anchor="middle" font-family="Cairo, sans-serif" font-size="10" font-weight="bold" fill="${s}">المحددات</text>
      <text x="320" y="206" text-anchor="middle" font-family="Cairo, sans-serif" font-size="8" fill="#64748b">الهيكلية</text>

      <!-- Satellite Node 3: Empirical Impact (Bottom Left) -->
      <circle cx="60" cy="195" r="28" fill="#ffffff" stroke="${p}" stroke-width="2" filter="url(#orbitShadow)"/>
      <text x="60" y="194" text-anchor="middle" font-family="Cairo, sans-serif" font-size="10" font-weight="bold" fill="${p}">الأثر</text>
      <text x="60" y="206" text-anchor="middle" font-family="Cairo, sans-serif" font-size="8" fill="#64748b">التطبيقي</text>
    </svg>
  `;
}

/**
 * 4. Comparison VS Shield Medallion (درع وشعار المفاضلة والمقارنة)
 */
export function getComparisonVsBadgeSvg(primaryHex = '#0284c7', secondaryHex = '#0ea5e9') {
  const p = primaryHex.startsWith('#') ? primaryHex : `#${primaryHex}`;

  return `
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100" width="56" height="56">
      <defs>
        <linearGradient id="vsGrad" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stop-color="#0f172a" />
          <stop offset="100%" stop-color="${p}" />
        </linearGradient>
        <filter id="vsGlow" x="-20%" y="-20%" width="140%" height="140%">
          <feDropShadow dx="0" dy="2" stdDeviation="3" flood-opacity="0.25"/>
        </filter>
      </defs>
      <circle cx="50" cy="50" r="44" fill="url(#vsGrad)" stroke="#ffffff" stroke-width="3" filter="url(#vsGlow)"/>
      <circle cx="50" cy="50" r="38" fill="none" stroke="#ffffff" stroke-width="1" stroke-opacity="0.3"/>
      <text x="50" y="58" text-anchor="middle" font-family="Arial, sans-serif" font-size="20" font-weight="900" fill="#ffffff" letter-spacing="1">VS</text>
    </svg>
  `;
}
