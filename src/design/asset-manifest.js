/**
 * Local Visual Asset Manifest
 * Maps local SVG illustrations and icons by domain, content type, and subject tags.
 * Ensures zero remote runtime dependencies.
 */

import { DOMAINS } from '../classifier/domain-dictionaries.js';
import { SLIDE_TYPES } from '../classifier/content-type-classifier.js';

export const ASSET_MANIFEST = [
  // General Academic
  {
    id: 'gen-academic-cap',
    path: '/assets/general/academic-cap.svg',
    domain: 'general',
    tags: ['education', 'academic', 'university', 'student', 'faculty'],
    preferredSlideTypes: [SLIDE_TYPES.COVER, SLIDE_TYPES.CONCLUSION],
    alt: 'قبعة التخرج والبحث الأكاديمي'
  },
  {
    id: 'gen-book-research',
    path: '/assets/general/book-research.svg',
    domain: 'general',
    tags: ['research', 'book', 'references', 'literature', 'study'],
    preferredSlideTypes: [SLIDE_TYPES.REFERENCES, SLIDE_TYPES.INTRODUCTION, SLIDE_TYPES.EXPLANATION],
    alt: 'كتاب البحث والمراجع الأكاديمية'
  },
  {
    id: 'gen-quote-mark',
    path: '/assets/general/quote-mark.svg',
    domain: 'general',
    tags: ['quote', 'definition', 'concept', 'terminology'],
    preferredSlideTypes: [SLIDE_TYPES.DEFINITION],
    alt: 'رمز علامات الاقتباس والتعريف'
  },

  // Technology
  {
    id: 'tech-network-nodes',
    path: '/assets/technology/network-nodes.svg',
    domain: DOMAINS.TECHNOLOGY,
    tags: ['network', 'nodes', 'internet', 'communication', 'cloud'],
    preferredSlideTypes: [SLIDE_TYPES.EXPLANATION, SLIDE_TYPES.PROCESS_STEPS],
    alt: 'شبكة العقد والاتصالات التقنية'
  },
  {
    id: 'tech-cyber-shield',
    path: '/assets/technology/cyber-shield.svg',
    domain: DOMAINS.TECHNOLOGY,
    tags: ['security', 'cybersecurity', 'firewall', 'protection'],
    preferredSlideTypes: [SLIDE_TYPES.DEFINITION, SLIDE_TYPES.EXPLANATION],
    alt: 'درع الحماية والأمن السيبراني'
  },
  {
    id: 'tech-code-dev',
    path: '/assets/technology/code-dev.svg',
    domain: DOMAINS.TECHNOLOGY,
    tags: ['code', 'programming', 'software', 'algorithm', 'system'],
    preferredSlideTypes: [SLIDE_TYPES.EXPLANATION, SLIDE_TYPES.PROCESS_STEPS],
    alt: 'شفرة البرمجة وهندسة النظم'
  },

  // Information Systems
  {
    id: 'is-data-pipeline',
    path: '/assets/information-systems/data-pipeline.svg',
    domain: DOMAINS.INFORMATION_SYSTEMS,
    tags: ['pipeline', 'data', 'processing', 'flow', 'etl'],
    preferredSlideTypes: [SLIDE_TYPES.PROCESS_STEPS, SLIDE_TYPES.TIMELINE],
    alt: 'مسار معالجة وتدفق البيانات'
  },
  {
    id: 'is-database-schema',
    path: '/assets/information-systems/database-schema.svg',
    domain: DOMAINS.INFORMATION_SYSTEMS,
    tags: ['database', 'schema', 'sql', 'warehouse', 'storage'],
    preferredSlideTypes: [SLIDE_TYPES.TABLE, SLIDE_TYPES.EXPLANATION],
    alt: 'قاعدة البيانات ونمذجة المعلومات'
  },
  {
    id: 'is-sys-architecture',
    path: '/assets/information-systems/sys-architecture.svg',
    domain: DOMAINS.INFORMATION_SYSTEMS,
    tags: ['architecture', 'system', 'components', 'nodes'],
    preferredSlideTypes: [SLIDE_TYPES.COMPARISON, SLIDE_TYPES.EXPLANATION],
    alt: 'معمارية نظم المعلومات'
  },

  // Economics
  {
    id: 'econ-growth-chart',
    path: '/assets/economics/growth-chart.svg',
    domain: DOMAINS.ECONOMICS,
    tags: ['growth', 'gdp', 'trend', 'statistics', 'chart'],
    preferredSlideTypes: [SLIDE_TYPES.STATISTICS, SLIDE_TYPES.EXPLANATION],
    alt: 'رسم بياني للنمو الاقتصادي'
  },
  {
    id: 'econ-market-balance',
    path: '/assets/economics/market-balance.svg',
    domain: DOMAINS.ECONOMICS,
    tags: ['market', 'supply', 'demand', 'balance', 'equilibrium'],
    preferredSlideTypes: [SLIDE_TYPES.COMPARISON, SLIDE_TYPES.PROS_CONS],
    alt: 'ميزان العرض والطلب في السوق'
  },
  {
    id: 'econ-global-trade',
    path: '/assets/economics/global-trade.svg',
    domain: DOMAINS.ECONOMICS,
    tags: ['trade', 'global', 'international', 'commerce'],
    preferredSlideTypes: [SLIDE_TYPES.EXPLANATION, SLIDE_TYPES.TIMELINE],
    alt: 'التجارة الدولية والعولمة'
  },

  // Management
  {
    id: 'mgmt-org-structure',
    path: '/assets/management/org-structure.svg',
    domain: DOMAINS.MANAGEMENT,
    tags: ['hierarchy', 'organization', 'governance', 'structure'],
    preferredSlideTypes: [SLIDE_TYPES.EXPLANATION, SLIDE_TYPES.PROCESS_STEPS],
    alt: 'الهيكل التنظيمي للمؤسسة'
  },
  {
    id: 'mgmt-team-hierarchy',
    path: '/assets/management/team-hierarchy.svg',
    domain: DOMAINS.MANAGEMENT,
    tags: ['human-resources', 'team', 'leadership', 'staff'],
    preferredSlideTypes: [SLIDE_TYPES.BULLETS, SLIDE_TYPES.EXPLANATION],
    alt: 'إدارة الموارد البشرية والقيادة'
  },
  {
    id: 'mgmt-strategy-target',
    path: '/assets/management/strategy-target.svg',
    domain: DOMAINS.MANAGEMENT,
    tags: ['strategy', 'target', 'planning', 'goals', 'mission'],
    preferredSlideTypes: [SLIDE_TYPES.CONCLUSION, SLIDE_TYPES.INTRODUCTION],
    alt: 'التخطيط الاستراتيجي والأهداف'
  },

  // Medicine
  {
    id: 'med-dna-helix',
    path: '/assets/medicine/dna-helix.svg',
    domain: DOMAINS.MEDICINE,
    tags: ['dna', 'genetics', 'cellular', 'biology', 'anatomy'],
    preferredSlideTypes: [SLIDE_TYPES.DEFINITION, SLIDE_TYPES.EXPLANATION],
    alt: 'الحمض النووي والعلوم الحيوية'
  },
  {
    id: 'med-heart-cardio',
    path: '/assets/medicine/heart-cardio.svg',
    domain: DOMAINS.MEDICINE,
    tags: ['cardio', 'heart', 'ecg', 'physiology', 'symptoms'],
    preferredSlideTypes: [SLIDE_TYPES.STATISTICS, SLIDE_TYPES.EXPLANATION],
    alt: 'تخطيط القلب والأنظمة الفسيولوجية'
  },
  {
    id: 'med-clinical-cross',
    path: '/assets/medicine/clinical-cross.svg',
    domain: DOMAINS.MEDICINE,
    tags: ['clinical', 'hospital', 'treatment', 'prevention', 'health'],
    preferredSlideTypes: [SLIDE_TYPES.BULLETS, SLIDE_TYPES.PROCESS_STEPS],
    alt: 'الرعاية السريرية والوقاية'
  },

  // Accounting
  {
    id: 'acc-balance-sheet',
    path: '/assets/accounting/balance-sheet.svg',
    domain: DOMAINS.ACCOUNTING,
    tags: ['balance-sheet', 'assets', 'liabilities', 'audit', 'equity'],
    preferredSlideTypes: [SLIDE_TYPES.TABLE, SLIDE_TYPES.COMPARISON],
    alt: 'الميزانية العمومية والقوائم المالية'
  },
  {
    id: 'acc-cash-flow',
    path: '/assets/accounting/cash-flow.svg',
    domain: DOMAINS.ACCOUNTING,
    tags: ['cash-flow', 'revenue', 'costs', 'profit', 'currency'],
    preferredSlideTypes: [SLIDE_TYPES.STATISTICS, SLIDE_TYPES.EXPLANATION],
    alt: 'التدفقات النقدية والأرباح'
  },
  {
    id: 'acc-ledger-calc',
    path: '/assets/accounting/ledger-calc.svg',
    domain: DOMAINS.ACCOUNTING,
    tags: ['ledger', 'calculation', 'accounting', 'fiscal'],
    preferredSlideTypes: [SLIDE_TYPES.PROCESS_STEPS, SLIDE_TYPES.BULLETS],
    alt: 'دفتر الأستاذ والحسابات الختامية'
  }
];

/**
 * Finds the most relevant visual asset for a slide
 * Based on domain, content type, and keywords.
 */
export function findAssetForSlide(domain, slideType, keywords = []) {
  // 1. Exact match on domain and preferred slide type
  const domainAssets = ASSET_MANIFEST.filter(a => a.domain === domain);
  const typeMatch = domainAssets.find(a => a.preferredSlideTypes.includes(slideType));
  if (typeMatch) return typeMatch;

  // 2. Keyword tag match in domain
  if (keywords.length > 0) {
    const tagMatch = domainAssets.find(a => a.tags.some(t => keywords.includes(t)));
    if (tagMatch) return tagMatch;
  }

  // 3. Any asset from the domain
  if (domainAssets.length > 0) {
    return domainAssets[0];
  }

  // 4. Fallback to general academic asset
  const generalAssets = ASSET_MANIFEST.filter(a => a.domain === 'general');
  const genTypeMatch = generalAssets.find(a => a.preferredSlideTypes.includes(slideType));
  if (genTypeMatch) return genTypeMatch;

  return generalAssets[0] || null;
}
