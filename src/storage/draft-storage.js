/**
 * Local Draft Storage and Project Persistence
 * Uses browser LocalStorage for privacy-preserving, zero-server persistence.
 */

const STORAGE_KEY_DRAFT = 'academic_pptx_current_draft';
const STORAGE_KEY_PREFS = 'academic_pptx_preferences';
const STORAGE_KEY_API_KEY = 'academic_pptx_gemini_api_key';

/**
 * Saves the Gemini API key securely in LocalStorage
 */
export function saveApiKey(key) {
  try {
    if (!key) {
      localStorage.removeItem(STORAGE_KEY_API_KEY);
    } else {
      localStorage.setItem(STORAGE_KEY_API_KEY, key.trim());
    }
    return true;
  } catch (e) {
    return false;
  }
}

/**
 * Loads the stored Gemini API key
 */
export function loadApiKey() {
  try {
    return localStorage.getItem(STORAGE_KEY_API_KEY) || '';
  } catch (e) {
    return '';
  }
}

/**
 * Checks whether an API key is stored
 */
export function hasApiKey() {
  return Boolean(loadApiKey());
}

/**
 * Clears the stored API key
 */
export function clearApiKey() {
  try {
    localStorage.removeItem(STORAGE_KEY_API_KEY);
    return true;
  } catch (e) {
    return false;
  }
}

/**
 * Creates a rich, complete academic research draft showcase template
 * Packed with charts, diagrams, comparisons, processes, stickers, and seals out-of-the-box.
 */
export function createEmptyDraft() {
  return {
    id: `draft-${Date.now()}`,
    title: 'أثر التحول الرقمي والذكاء الاصطناعي في تحسين كفاءة الأداء المؤسسي والحوكمة',
    author: 'أحمد بن علي الزهراني',
    institution: 'جامعة الملك سعود',
    faculty: 'كلية إدارة الأعمال ونظم المعلومات',
    course: 'الإدارة الاستراتيجية والتحول الرقمي',
    instructor: 'أ.د. عبد الرحمن المنصور',
    date: '1446هـ / 2024م',
    language: 'ar',
    domain: 'economics',
    density: 'standard', // compact | standard | detailed
    themeVariant: 'econ-trend', // 'مؤشرات التداول (بترولي وعنبر دافئ)' كـ default
    introduction: 'يشهد العصر الراهن ثورة تكنولوجية متسارعة أعادت صياغة نماذج العمل الإداري، حيث أضحى التحول الرقمي والأنظمة الذكية ركيزة جوهرية لتعزيز الإنتاجية وتكريس الشفافية وضمان الحوكمة المؤسسية الرشيدة.',
    sections: [
      {
        id: `section-${Date.now()}-1`,
        title: 'المبحث الأول: الإطار المفاهيمي للتحول الرقمي والحوكمة',
        definitionTerm: 'التحول الرقمي المؤسسي',
        layoutType: 'definition',
        paragraphs: [
          'يُعرّف التحول الرقمي المؤسسي بأنه عملية استراتيجية شاملة تهدف إلى إعادة هندسة الإجراءات والخدمات والسياسات عبر توظيف الحلول البرمجية والذكاء الاصطناعي لتحقيق قيمة مستدامة تلبي تطلعات المستفيدين والشركاء.'
        ],
        bullets: [
          'مواءمة النماذج التقنية الحديثة مع الرؤية الاستراتيجية الكبرى للمنظمة',
          'إعادة هيكلة العمليات التشغيلية وتفكيك الإجراءات الروتينية المعقدة',
          'الامتثال الصارم لأطر الحوكمة المؤسسية ومعايير النزاهة والشفافية'
        ],
        keyPoint: 'التحول الرقمي يمثل تحولاً ثقافياً وتنظيمياً عميقاً يتجاوز مجرد اقتناء الحواسيب والبرمجيات.'
      },
      {
        id: `section-${Date.now()}-2`,
        title: 'المبحث الثاني: مؤشرات الأداء والنمو التشغيلي بعد الأتمتة',
        layoutType: 'statistics',
        paragraphs: [
          'توضح المؤشرات الرقمية المسجلة خلال فترة التطبيق الميداني تحسناً كمياً ونوعياً كبيراً في دقة المعالجة، مع تقليص ملموس في زمن الاستجابة والتكاليف التشغيلية المباشرة.'
        ],
        statistics: [
          { label: 'كفاءة معالجة المعاملات', value: '45', unit: '%' },
          { label: 'نسبة رضا المستفيدين', value: '88', unit: '%' },
          { label: 'تقليص التكاليف التشغيلية', value: '32', unit: '%' },
          { label: 'سرعة اتخاذ القرارات', value: '76', unit: '%' }
        ],
        chartType: 'bar',
        bullets: []
      },
      {
        id: `section-${Date.now()}-3`,
        title: 'المبحث الثالث: مسار التطبيق ومراحل التحول المتسلسلة',
        layoutType: 'process_steps',
        paragraphs: [
          'يتم تنفيذ خارطة طريق التحول الرقمي وفق منهجية مرحلية مرنة تتكون من أربع محطات متتابعة تضمن استيعاب التغيير وإدارة المخاطر التقنية.'
        ],
        numbered: [
          'التشخيص الميداني الشامل وحصر الاحتياجات وتحديد الفجوات التقنية الحالية',
          'إعادة هندسة العمليات وتطوير البنية السحابية ومنصات البيانات المشتركة',
          'تدريب وتأهيل الكوادر البشرية على المنظومات البرمجية وتكريس ثقافة الابتكار',
          'التقييم المستمر وقياس مؤشرات الأداء ومراقبة جودة المخرجات وتطويرها'
        ],
        bullets: []
      },
      {
        id: `section-${Date.now()}-4`,
        title: 'المبحث الرابع: دراسة مقارنة بين الإدارة التقليدية والإدارة الرقمية',
        layoutType: 'comparison',
        paragraphs: [
          'تُظهر المقارنة المفاهيمية والميدانية الفروق الجوهرية بين الأنماط الإدارية الكلاسيكية والأنظمة الرقمية المتقدمة في جوانب السرعة والموثوقية والرقابة.'
        ],
        comparison: {
          colA: {
            title: 'الإدارة الورقية التقليدية',
            items: [
              'بطء ملحوظ في دورة التوقيعات وسريان المعاملات الورقية',
              'صعوبة تتبع المعاملات وارتفاع مخاطر فقدان البيانات وتلفها',
              'تكاليف أرشفة وتخزين مرتفعة وغياب الرقابة اللحظية على الأداء'
            ]
          },
          colB: {
            title: 'الإدارة الرقمية الذكية',
            items: [
              'معالجة فورية وتتبع رقمي دقيق لكافة مسارات المعاملات',
              'أرشفة سحابية مشفرة مع إمكانية الوصول الآمن على مدار الساعة',
              'تقارير أداء لحظية ودعم متكامل لصناع القرار عبر لوحات القيادة'
            ]
          }
        },
        bullets: []
      },
      {
        id: `section-${Date.now()}-5`,
        title: 'المبحث الخامس: موازنة المكتسبات والفرص وتحديات الأمن السيبراني',
        layoutType: 'pros_cons',
        paragraphs: [
          'على الرغم من الآفاق الواعدة للتحول الرقمي، إلا أنه يفرض تحديات أمنية وتنظيمية تستوجب تدابير وقائية استباقية لتحصين الأصول الرقمية.'
        ],
        bullets: [
          'زيادة الإنتاجية الكلية وتقليص الهدر الزمني والمادي',
          'توفير تدفقات بيانات دقيقة تدعم القرارات التنبؤية الذكية',
          'تحسين تجربة المستفيدين وتقديم خدمات متكاملة وسلسة',
          'مخاطر الهجمات السيبرانية وضرورة حماية الخصوصية والمعلومات',
          'مقاومة التغيير والحاجة إلى برامج تدريب وتوعية مكثفة',
          'التكاليف الرأسمالية الأولية للبنية التحتية والبرمجيات المتخصصة'
        ]
      }
    ],
    conclusion: 'تخلص هذه الدراسة الأكاديمية إلى أن التحول الرقمي وحوكمة النظم لم يعد خياراً ثانوياً للمؤسسات، بل هو الركيزة الأساسية لمرونتها وقدرتها على تحقيق التميز التنافسي ومواكبة متطلبات الاقتصاد المعرفي المعاصر.',
    conclusionPoints: [
      'اعتماد استراتيجية وطنية متكاملة للحوكمة الرقمية المؤسسية',
      'الاستثمار طويل الأجل في تنمية المهارات الرقمية لرأس المال البشري',
      'بناء منظومة أمن سيبراني استباقية لحماية البيانات وضمان استمرارية الأعمال'
    ],
    references: [
      'الزهراني، أحمد (2023). استراتيجيات التحول الرقمي والحوكمة المؤسسية المعاصرة، دار الفكر العربي، الرياض.',
      'المنصور، عبد الرحمن (2022). الإدارة الذكية وإعادة هندسة العمليات، دار النشر الجامعي، القاهرة.',
      'Davenport, T. H. (2020). The AI Advantage: How to Put the Artificial Intelligence Revolution to Work, MIT Press.',
      'Westerman, G., et al. (2021). Leading Digital: Turning Technology into Business Transformation, Harvard Business Review Press.'
    ]
  };
}

/**
 * Saves current draft to LocalStorage
 */
export function saveDraftToStorage(draft) {
  try {
    localStorage.setItem(STORAGE_KEY_DRAFT, JSON.stringify(draft));
    return true;
  } catch (err) {
    console.warn('LocalStorage save failed:', err);
    return false;
  }
}

/**
 * Loads current draft from LocalStorage
 */
export function loadDraftFromStorage() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY_DRAFT);
    if (raw) {
      return JSON.parse(raw);
    }
  } catch (err) {
    console.warn('LocalStorage load failed:', err);
  }
  return null;
}

/**
 * Clears current draft from LocalStorage
 */
export function clearDraftFromStorage() {
  try {
    localStorage.removeItem(STORAGE_KEY_DRAFT);
    return true;
  } catch (err) {
    return false;
  }
}

/**
 * Saves user preferences
 */
export function savePreferences(prefs) {
  try {
    localStorage.setItem(STORAGE_KEY_PREFS, JSON.stringify(prefs));
  } catch (e) {}
}

/**
 * Loads user preferences
 */
export function loadPreferences() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY_PREFS);
    return raw ? JSON.parse(raw) : {};
  } catch (e) {
    return {};
  }
}

/**
 * Exports project draft as a JSON file download
 */
export function exportDraftAsJson(draft) {
  const safeTitle = (draft.title || 'academic-draft')
    .replace(/[\\/:*?"<>|]/g, '_')
    .substring(0, 40);
  const jsonStr = JSON.stringify(draft, null, 2);
  const blob = new Blob([jsonStr], { type: 'application/json' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = `${safeTitle}.json`;
  a.click();
  URL.revokeObjectURL(url);
}

/**
 * Reads a JSON file selected by the user into a draft object
 */
export function importDraftFromJsonFile(file) {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = (e) => {
      try {
        const data = JSON.parse(e.target.result);
        if (!data || typeof data !== 'object') {
          throw new Error('صيغة ملف JSON غير صالحة.');
        }
        resolve(data);
      } catch (err) {
        reject(err);
      }
    };
    reader.onerror = () => reject(new Error('تعذر قراءة الملف المختار.'));
    reader.readAsText(file);
  });
}
