/**
 * Visual Stickers, Badges, and Vector Icons Library
 * Provides rich SVG stickers, academic seals, process connectors, and domain emblems.
 * Works offline with zero external dependencies.
 */

export const ACADEMIC_STICKERS = {
  SEAL: {
    name: 'ختم أكاديمي',
    emoji: '🎓',
    svg: `<svg viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg">
      <circle cx="50" cy="50" r="46" stroke="currentColor" stroke-width="4" stroke-dasharray="4 2"/>
      <circle cx="50" cy="50" r="38" fill="currentColor" fill-opacity="0.1" stroke="currentColor" stroke-width="2"/>
      <polygon points="50,22 80,36 50,50 20,36" fill="currentColor"/>
      <path d="M32,43 v16 c0,8 8,14 18,14 s18,-6 18,-14 v-16" fill="none" stroke="currentColor" stroke-width="3"/>
      <line x1="72" y1="36" x2="72" y2="64" stroke="currentColor" stroke-width="2"/>
      <circle cx="72" cy="66" r="3" fill="currentColor"/>
    </svg>`
  },
  TARGET: {
    name: 'هدف استراتيجي',
    emoji: '🎯',
    svg: `<svg viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg">
      <circle cx="50" cy="50" r="44" stroke="currentColor" stroke-width="3"/>
      <circle cx="50" cy="50" r="30" stroke="currentColor" stroke-width="3" fill="currentColor" fill-opacity="0.15"/>
      <circle cx="50" cy="50" r="16" fill="currentColor"/>
      <circle cx="50" cy="50" r="6" fill="#ffffff"/>
      <line x1="78" y1="22" x2="52" y2="48" stroke="#dc2626" stroke-width="4" stroke-linecap="round"/>
      <polygon points="82,16 74,26 84,24" fill="#dc2626"/>
    </svg>`
  },
  IDEA_BULB: {
    name: 'استبصار جوهري',
    emoji: '💡',
    svg: `<svg viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path d="M50 16C36 16 26 26 26 40C26 50 34 58 38 64V72C38 74 40 76 42 76H58C60 76 62 74 62 72V64C66 58 74 50 74 40C74 26 64 16 50 16Z" fill="currentColor" fill-opacity="0.2" stroke="currentColor" stroke-width="3"/>
      <line x1="42" y1="84" x2="58" y2="84" stroke="currentColor" stroke-width="4" stroke-linecap="round"/>
      <line x1="46" y1="90" x2="54" y2="90" stroke="currentColor" stroke-width="3" stroke-linecap="round"/>
      <path d="M44 44L50 36L56 44" stroke="currentColor" stroke-width="3" stroke-linecap="round" stroke-linejoin="round"/>
    </svg>`
  },
  VS_BADGE: {
    name: 'شارة مقارنة',
    emoji: '⚖️',
    svg: `<svg viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg">
      <circle cx="50" cy="50" r="44" fill="currentColor"/>
      <text x="50" y="60" font-family="Arial, sans-serif" font-size="34" font-weight="900" fill="#ffffff" text-anchor="middle">VS</text>
    </svg>`
  },
  QUOTE_BADGE: {
    name: 'شارة تعريف',
    emoji: '💬',
    svg: `<svg viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path d="M22 62C22 46 34 34 46 28V42C38 44 34 48 34 54H46V80H22V62Z" fill="currentColor"/>
      <path d="M58 62C58 46 70 34 82 28V42C74 44 70 48 70 54H82V80H58V62Z" fill="currentColor"/>
    </svg>`
  },
  CHECK_PROS: {
    name: 'إيجابيات ومزايا',
    emoji: '✅',
    svg: `<svg viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg">
      <circle cx="50" cy="50" r="44" fill="#16a34a"/>
      <path d="M30 52L44 66L72 36" stroke="#ffffff" stroke-width="8" stroke-linecap="round" stroke-linejoin="round"/>
    </svg>`
  },
  CROSS_CONS: {
    name: 'سلبيات وتحديات',
    emoji: '⚠️',
    svg: `<svg viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg">
      <circle cx="50" cy="50" r="44" fill="#dc2626"/>
      <line x1="34" y1="34" x2="66" y2="66" stroke="#ffffff" stroke-width="8" stroke-linecap="round"/>
      <line x1="66" y1="34" x2="34" y2="66" stroke="#ffffff" stroke-width="8" stroke-linecap="round"/>
    </svg>`
  },
  CHART_GROWTH: {
    name: 'رسم نمو',
    emoji: '📈',
    svg: `<svg viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg">
      <rect x="16" y="60" width="14" height="26" rx="2" fill="currentColor" fill-opacity="0.4"/>
      <rect x="38" y="44" width="14" height="42" rx="2" fill="currentColor" fill-opacity="0.6"/>
      <rect x="60" y="28" width="14" height="58" rx="2" fill="currentColor"/>
      <path d="M16 52L42 38L62 24L86 14" stroke="#16a34a" stroke-width="5" stroke-linecap="round"/>
      <polygon points="86,14 74,16 82,24" fill="#16a34a"/>
    </svg>`
  },
  FLOW_STEP: {
    name: 'مرحلة مسار',
    emoji: '🔄',
    svg: `<svg viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg">
      <circle cx="50" cy="50" r="40" stroke="currentColor" stroke-width="4"/>
      <polygon points="50,25 75,50 50,75 25,50" fill="currentColor" fill-opacity="0.2"/>
      <circle cx="50" cy="50" r="12" fill="currentColor"/>
    </svg>`
  },
  TROPHY: {
    name: 'نتائج وتوصيات',
    emoji: '🏆',
    svg: `<svg viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path d="M30 24H70V48C70 60 60 70 50 70C40 70 30 60 30 48V24Z" fill="currentColor" fill-opacity="0.25" stroke="currentColor" stroke-width="4"/>
      <path d="M30 32H20C16 32 14 36 14 40C14 48 22 54 30 54" stroke="currentColor" stroke-width="3" stroke-linecap="round"/>
      <path d="M70 32H80C84 32 86 36 86 40C86 48 78 54 70 54" stroke="currentColor" stroke-width="3" stroke-linecap="round"/>
      <line x1="50" y1="70" x2="50" y2="82" stroke="currentColor" stroke-width="5"/>
      <rect x="32" y="82" width="36" height="8" rx="2" fill="currentColor"/>
    </svg>`
  }
};

/**
 * Domain-specific visual icons and glyphs
 */
export const DOMAIN_VISUAL_ICONS = {
  technology: {
    badge: '💻 تقنية وبرمجيات',
    emblem: '⚡',
    stickerKey: 'FLOW_STEP'
  },
  'information-systems': {
    badge: '🗄️ نظم وقواعد بيانات',
    emblem: '🔄',
    stickerKey: 'FLOW_STEP'
  },
  economics: {
    badge: '📊 اقتصاد وأسواق',
    emblem: '📈',
    stickerKey: 'CHART_GROWTH'
  },
  management: {
    badge: '🏢 إدارة وتنظيم',
    emblem: '🎯',
    stickerKey: 'TARGET'
  },
  medicine: {
    badge: '🩺 علوم طبية وصحية',
    emblem: '🔬',
    stickerKey: 'SEAL'
  },
  accounting: {
    badge: '📑 محاسبة وقوائم مالية',
    emblem: '⚖️',
    stickerKey: 'VS_BADGE'
  }
};

/**
 * Helper to convert an SVG string to a Data URL for PptxGenJS and HTML img tags
 */
export function svgToDataUri(svgString) {
  if (!svgString) return '';
  const cleanSvg = svgString.trim().replace(/\n/g, ' ');
  return `data:image/svg+xml;utf8,${encodeURIComponent(cleanSvg)}`;
}
