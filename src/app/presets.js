/**
 * Academic Draft Presets for All 6 Required Testing Scenarios & Multilingual Content
 */

import { DOMAINS } from '../classifier/domain-dictionaries.js';

export const PRESET_DRAFTS = {
  // Scenario 1: Long Arabic Presentation on Human Resources Management
  'management-hr': {
    id: 'preset-mgmt-hr',
    title: 'إدارة الموارد البشرية كمدخل استراتيجي لتحقيق الميزة التنافسية في المؤسسة الاقتصادية',
    author: 'أحمد بن علي الزهراني',
    institution: 'جامعة الملك سعود',
    faculty: 'كلية إدارة الأعمال',
    course: 'السلوك التنظيمي وإدارة الكفاءات',
    instructor: 'د. عبد الرحمن المنصور',
    language: 'ar',
    domain: 'auto', // Will classify to management
    density: 'standard',
    introduction: 'تشهد بيئة الأعمال المعاصرة تحولات متسارعة فرضتها عولمة الأسواق وتنامي دور المعرفة والتكنولوجيا. في هذا السياق، لم يعد رأس المال المادي وحده كافياً لضمان بقاء المؤسسات، بل أضحت الموارد البشرية المؤهلة هي المحرك الجوهري لخلق القيمة والتميز المستدام.',
    sections: [
      {
        id: 'sec-hr-1',
        title: 'المبحث الأول: الإطار المفاهيمي لإدارة الموارد البشرية وتطورها',
        paragraphs: [
          'يُعرف تسيير الموارد البشرية بأنه مجموعة الأنشطة والسياسات الرامية إلى استقطاب، وتطوير، وتحفيز الكفاءات البشرية بما يحقق أهداف المؤسسة وتطلعات الأفراد العاملين.',
          'لقد انتقلت الوظيفة من مجرد إدارة شؤون الموظفين التقليدية المعنية بالإجراءات الروتينية ومسك الدفاتر، إلى شريك استراتيجي يساهم مباشرة في صياغة الخطط المستقبلية والتطوير التنظيمي.'
        ],
        bullets: [
          'التحول من النظرة الكلاسيكية للأفراد كعناصر تكلفة إلى أصول استثمارية',
          'ربط خطط التوظيف والتدريب بالغايات الاستراتيجية العامة للمنظمة',
          'الاهتمام بالولاء المؤسسي وتعزيز الرضا الوظيفي لتحسين معدلات الاستبقاء'
        ],
        subsections: [
          {
            id: 'sub-hr-1-1',
            title: 'المطلب الأول: الوظائف الجوهرية لإدارة الموارد البشرية',
            paragraphs: ['تتكامل وظائف الموارد البشرية لتشكل منظومة متماسكة تبدأ من تخطيط الاحتياجات الوظيفية وحتى تقييم الأداء والمسار المهني.'],
            bullets: [
              'تخطيط الاحتياجات البشرية واستقطاب الكفاءات النوعية',
              'التدريب المستمر وتنمية المهارات القيادية والتنفيذية',
              'نظم تقييم الأداء وربط الحوافز بالإنتاجية الفعلية'
            ]
          }
        ]
      },
      {
        id: 'sec-hr-2',
        title: 'المبحث الثاني: مساهمة رأس المال البشري في بناء الميزة التنافسية',
        paragraphs: [
          'وفقاً لنظرية الموارد (RBV)، فإن الموارد البشرية تتسم بالندرة وصعوبة التقليد وعدم القابلية للإحلال الفوري، مما يجعلها المصدر الأهم لتحقيق تفوق تنافسي دائم في الأسواق الديناميكية.'
        ],
        bullets: [
          'بناء ثقافة تنظيمية تشجع على الابتكار والمبادرة الفردية',
          'تحسين جودة الخدمة ورضا العملاء عبر تمكين خطوط المواجهة',
          'تخفيض تكاليف دوران العمل وهدر الموارد عبر التسكين المهني الدقيق'
        ],
        subsections: []
      }
    ],
    conclusion: 'تخلص هذه الدراسة إلى أن الاستثمار الواعي في العنصر البشري وتطوير نظم القيادة والتحفيز ليس خياراً ثانوياً، بل هو الركيزة الأساسية لمرونة المؤسسات وقدرتها على مجابهة الأزمات والتوسع المستقبلي.',
    references: [
      'العتيبي، مبارك (2022). إدارة الموارد البشرية المعاصرة: المنهج والتطبيق، دار الفكر العربي، الرياض.',
      'دريس، عبد السلام (2020). استراتيجيات القيادة والسلوك التنظيمي، المؤسسة الوطنية للكتاب، الجزائر.',
      'Armstrong, M., & Taylor, S. (2020). Armstrong\'s Handbook of Human Resource Management Practice, Kogan Page.'
    ]
  },

  // Scenario 2: Medical Presentation on Human Anatomy & Cardiovascular System
  'medicine-anatomy': {
    id: 'preset-med-anatomy',
    title: 'تشريح ووظائف الجهاز القلبي الوعائي وأبرز الآليات الفسيولوجية لضخ الدم',
    author: 'سارة خالد الأنصاري',
    institution: 'كلية الطب والعلوم الصحية',
    faculty: 'قسم التشريح وعلم وظائف الأعضاء',
    course: 'فسيولوجيا القلب والأوعية الدموية',
    instructor: 'أ.د. منذر الشريف',
    language: 'ar',
    domain: 'auto', // Will classify to medicine
    density: 'standard',
    introduction: 'يمثل الجهاز القلبي الوعائي منظومة النقل الحيوية المركزية في جسم الإنسان، حيث يتولى توزيع الأكسجين والمغذيات والهرمونات إلى جميع خلايا الأنسجة وإزالة الفضلات وثاني أكسيد الكربون عبر شبكة دموية متناهية الدقة.',
    sections: [
      {
        id: 'sec-med-1',
        title: 'المبحث الأول: البنية التشريحية لعضلة القلب وحجيراته الأربع',
        paragraphs: [
          'يتكون القلب البشري من أربع حجيرات رئيسية: أذينان يتلقيان الدم العائد من الدورة الدموية، وبطينان يقومان بضخ الدم بقوة عالية نحو الرئتين وسائر أنحاء الجسم.',
          'يفصل بين الحجيرات صمامات أحادية الاتجاه (الصمام التاجي، وثلاثي الشرفات، والأبهري، والرئوي) لضمان تدفق الدم في مسار سليم ومنع الارتجاع أثناء الانقباض والانبساط.'
        ],
        bullets: [
          'الأذين الأيمن: يتلقى الدم غير المؤكسج من الوريدين الأجوفين العلوي والسفلي',
          'البطين الأيمن: يضخ الدم نحو الشريان الرئوي للأكسجة',
          'الأذين الأيسر: يستقبل الدم المؤكسج القادم من الأوردة الرئوية الأربعة',
          'البطين الأيسر: الحجيرة الأكثر سماكة وقوة لضخ الدم عبر الشريان الأورطي'
        ],
        subsections: []
      },
      {
        id: 'sec-med-2',
        title: 'المبحث الثاني: الآلية الكهروفسيولوجية والدورة القلبية',
        paragraphs: [
          'تنشأ النبضة القلبية ذاتياً في العقدة الجيبية الأذينية (SA Node) التي تعمل كمنظم طبيعي لضربات القلب بمعدل 60-100 نبضة في الدقيقة، ثم تنتقل الإشارة عبر العقدة الأذينية البطينية (AV Node) وحزمة هيس وألياف بركنجي.'
        ],
        bullets: [
          'مرحلة الانقباض البطيني (Systole): اندفاع الدم بضغط مرتفع في الشرايين',
          'مرحلة الانبساط (Diastole): استرخاء العضلة وامتلاء الحجيرات بالدم',
          'التحكم العصبي المستقل: توازن بين الجهاز الودي ونظير الودي'
        ],
        subsections: []
      }
    ],
    conclusion: 'إن الفهم الدقيق للبنية التشريحية للقلب وشبكة أوعيته يعد الأساس الجوهري لتشخيص الأمراض الوعائية وتحديد العلاجات الدوائية والجراحية الفعالة.',
    references: [
      'Hall, J. E., & Guyton, A. C. (2021). Guyton and Hall Textbook of Medical Physiology, 14th Edition, Elsevier.',
      'العمري، كمال (2021). أطلس تشريح جسم الإنسان والوظائف الحيوية، الدار الجامعية، القاهرة.'
    ]
  },

  // Scenario 3: Economics Presentation with Structured Numerical Data & Charts
  'economics-gdp': {
    id: 'preset-econ-gdp',
    title: 'تحليل مؤشرات النمو الاقتصادي ومعدلات التضخم: دراسة قياسية مقارنة (2020 - 2024)',
    author: 'طارق حسام الدين',
    institution: 'جامعة القاهرة',
    faculty: 'كلية الاقتصاد والعلوم السياسية',
    course: 'الاقتصاد الكلي والسياسات النقدية',
    instructor: 'د. ليلى عبد المجيد',
    language: 'ar',
    domain: 'auto', // Will classify to economics
    density: 'standard',
    introduction: 'شهد الاقتصاد العالمي خلال السنوات الخمس الأخيرة صدمات هيكلية متتالية أثرت على سلاسل الإمداد ومستويات الأسعار، مما دفع البنوك المركزية إلى تبني سياسات نقدية تشددية لمكافحة التضخم والمحافظة على استقرار العملة.',
    sections: [
      {
        id: 'sec-econ-1',
        title: 'المبحث الأول: تطور الناتج المحلي الإجمالي ومعدلات التضخم',
        paragraphs: ['توضح المؤشرات الرقمية المسجلة خلال الفترة 2020-2024 تعافياً تدريجياً في معدلات النمو بالتوازي مع انحسار نسبي في الضغوط التضخمية بعد وصولها إلى ذروتها.'],
        bullets: [],
        statistics: [
          { label: 'نمو الناتج 2021', value: '5.6', unit: '%' },
          { label: 'نمو الناتج 2022', value: '3.4', unit: '%' },
          { label: 'نمو الناتج 2023', value: '2.8', unit: '%' },
          { label: 'نمو الناتج 2024 (تقديري)', value: '3.2', unit: '%' }
        ],
        chartType: 'bar',
        subsections: [
          {
            id: 'sub-econ-1-1',
            title: 'المطلب الأول: محددات العرض والطلب الكلي وتأثير أسعار الفائدة',
            paragraphs: ['أدى رفع أسعار الفائدة من قبل البنك المركزي إلى كبح الاقتراض الاستهلاكي، مما ساعد في تخفيف حدة السيولة الفائضة وتعديل ميزان المدفوعات.'],
            bullets: [
              'تراجع القوة الشرائية للأسر نتيجة ارتفاع كلفة التمويل',
              'تباطؤ الاستثمارات الرأسمالية في القطاعات كثيفة الاقتراض',
              'استقرار تدريجي في مؤشر أسعار المستهلكين (CPI)'
            ]
          }
        ]
      }
    ],
    conclusion: 'تؤكد نتائج التحليل أن السياسة النقدية وحدها غير كافية لضمان نمو مستدام، بل يتطلب الأمر تنسيقاً وثيقاً مع السياسة المالية لتعزيز الاستثمار الإنتاجي وزيادة مرونة جانب العرض.',
    references: [
      'صندوق النقد الدولي (2024). تقرير آفاق الاقتصاد العالمي، واشنطن.',
      'البنك الدولي (2023). المرصد الاقتصادي الإقليمي، باريس.',
      'Mankiw, N. G. (2020). Macroeconomics, 10th Edition, Worth Publishers.'
    ]
  },

  // Scenario 4: Accounting Presentation with Balance Sheet & Ledger Figures
  'accounting-balance-sheet': {
    id: 'preset-acc-balance',
    title: 'تحليل الميزانية العمومية وهيكل الأصول والخصوم لتقييم السيولة والملاءة المالية',
    author: 'يوسف مصطفى النمري',
    institution: 'جامعة الملك فهد للبترول والمعادن',
    faculty: 'قسم المحاسبة ونظم الرقابة المالية',
    course: 'المحاسبة المالية المتقدمة والتدقيق',
    instructor: 'د. سامي القحطاني',
    language: 'ar',
    domain: 'auto', // Will classify to accounting
    density: 'standard',
    introduction: 'تعتبر الميزانية العمومية (قائمة المركز المالي) المرآة الصادقة للوضع المالي لأي مؤسسة في تاريخ محدد، حيث تقدم تلخيصاً شاملاً لما تملكه المنشأة من أصول وما عليها من التزامات تجاه الغير وحقوق الملاك.',
    sections: [
      {
        id: 'sec-acc-1',
        title: 'المبحث الأول: مكونات المركز المالي وتوازن المعادلة المحاسبية',
        paragraphs: [
          'تستند المحاسبة المالية إلى المعادلة المحاسبية الأساسية: (الأصول = الخصوم + حقوق الملكية). ويجب أن يتطابق الطرفان في كافة الأوقات لضمان صحة التسجيل في دفتر الأستاذ والقوائم الختامية.'
        ],
        table: {
          headers: ['البند المحاسبي', 'سنة 2022 (ألف ر.س)', 'سنة 2023 (ألف ر.س)', 'نسبة التغير'],
          rows: [
            ['الأصول المتداولة (نقدية ومخزون)', '4,500', '5,200', '+15.5%'],
            ['الأصول غير المتداولة (عقارات ومعدات)', '12,000', '13,100', '+9.1%'],
            ['مجموع الأصول الكلية', '16,500', '18,300', '+10.9%'],
            ['الالتزامات المتداولة (دائنون وقروض قصيرة)', '3,200', '3,400', '+6.2%'],
            ['الالتزامات غير المتداولة (قروض طويلة الأجل)', '5,100', '5,500', '+7.8%'],
            ['حقوق الملكية ورأس المال والأرباح المبقاة', '8,200', '9,400', '+14.6%']
          ]
        },
        bullets: [
          'ارتفاع نسبة السيولة السريعة بنسبة 8% بفضل تحسن التدفقات النقدية التشغيلية',
          'انخفاض نسبة المديونية إلى حقوق الملكية، مما يعزز الملاءة الائتمانية للشركة'
        ],
        subsections: []
      }
    ],
    conclusion: 'تؤكد المؤشرات المحاسبية سلامة الهيكل المالي للمنشأة وقدرتها على سداد التزاماتها قصيرة الأجل مع تحقيق عائد مجزٍ على حقوق المساهمين.',
    references: [
      'الهيئة السعودية للمراجعين والمحاسبين (SOCPA) - المعايير الدولية للتقرير المالي (IFRS).',
      'Kieso, D. E., Weygandt, J. J., & Warfield, T. D. (2020). Intermediate Accounting, IFRS Edition, Wiley.'
    ]
  },

  // Scenario 5: Technology Presentation Describing Network Architecture
  'technology-network': {
    id: 'preset-tech-network',
    title: 'معمارية شبكات الحاسوب وأمن بروتوكولات الاتصال ونماذج التشغيل السحابي',
    author: 'عمر نبيل الشامي',
    institution: 'جامعة العلوم والتكنولوجيا',
    faculty: 'كلية هندسة الحاسوب وتكنولوجيا المعلومات',
    course: 'شبكات الحاسوب والأمن السيبراني',
    instructor: 'د. فراس النعيمي',
    language: 'ar',
    domain: 'auto', // Will classify to technology
    density: 'standard',
    introduction: 'تعد الشبكات الحاسوبية العمود الفقري للبنية التحتية الرقمية العالمية، حيث تتيح تبادل البيانات بين ملايين الخوادم والأجهزة الطرفية عبر بروتوكولات موحدة تخضع لمعايير أمان صارمة لمنع التسلل والقرصنة.',
    sections: [
      {
        id: 'sec-tech-1',
        title: 'المبحث الأول: مقارنة بين نموذج OSI المرجعي ونموذج TCP/IP',
        paragraphs: ['يقوم الاتصال الشبكي على تقسيم وظائف معالجة الحزم إلى طبقات متسلسلة لضمان التوافق بين مختلف أنظمة التشغيل والعتاد.'],
        comparison: {
          colA: {
            title: 'نموذج OSI السباعي (Open Systems Interconnection)',
            items: [
              'يتكون من 7 طبقات محددة بدقة (الفيزيائية وحتى طبقة التطبيقات)',
              'فصل صارم بين الخدمات، والواجهات، والبروتوكولات',
              'يستخدم كمرجع نظري وتدريسي شامل في هندسة الشبكات'
            ]
          },
          colB: {
            title: 'نموذج TCP/IP العملي (Internet Protocol Suite)',
            items: [
              'يتكون من 4 طبقات عملية (الوصول، الإنترنت، النقل، التطبيقات)',
              'هو المعيار الفعلي المطبق عالمياً في شبكة الإنترنت',
              'بنية برمجية مبسطة تعتمد على مرونة التوجيه والتحزيم'
            ]
          }
        },
        bullets: [],
        subsections: []
      },
      {
        id: 'sec-tech-2',
        title: 'المبحث الثاني: خطوات ومراحل إقامة الاتصال الآمن عبر بروتوكول TLS/HTTPS',
        paragraphs: ['يعتمد تبادل البيانات الآمن على المصافحة التشفيرية لتوليد مفاتيح الجلسة والتحقق من موثوقية الخادم.'],
        numbered: [
          'إرسال رسالة Client Hello تتضمن خوارزميات التشفير المدعومة ورقم عشوائي',
          'استجابة الخادم بـ Server Hello وتقديم الشهادة الرقمية الموقعة',
          'التحقق من الشهادة عبر جهة إصدار الشهادات (CA) وتوليد المفتاح المسبق (Pre-Master Secret)',
          'بدء تبادل البيانات المشفرة بصيغة متماثلة فائقة السرعة'
        ],
        subsections: []
      }
    ],
    conclusion: 'تتجه معمارية الشبكات الحديثة نحو تقنيات الشبكات المعرفة برمجياً (SDN) ونماذج الثقة المعدومة (Zero Trust) لضمان حماية استباقية ضد الهجمات المتقدمة.',
    references: [
      'Tanenbaum, A. S., & Wetherall, D. (2021). Computer Networks, 6th Edition, Pearson.',
      'Stallings, W. (2022). Cryptography and Network Security: Principles and Practice, Pearson.'
    ]
  },

  // Scenario 6: Information Systems Presentation
  'information-systems-data': {
    id: 'preset-is-data',
    title: 'نظم المعلومات الإدارية وقواعد البيانات: معالجة البيانات ودعم اتخاذ القرار المؤسسي',
    author: 'مريم عادل الكندري',
    institution: 'جامعة الكويت',
    faculty: 'كلية العلوم الإدارية',
    course: 'نظم المعلومات وقواعد البيانات العلائقية',
    instructor: 'د. باسم السلمان',
    language: 'ar',
    domain: 'auto', // Will classify to information-systems
    density: 'standard',
    introduction: 'تمثل البيانات الخام المدخل الأساسي لأي نظام معلومات، حيث يتم تحويلها عبر مراحل معالجة منطقية إلى معلومات ذات قيمة، تسهم في مستودعات البيانات ونظم دعم القرار (DSS) في توجيه استراتيجية المؤسسة.',
    sections: [
      {
        id: 'sec-is-1',
        title: 'المبحث الأول: دورة حياة معالجة البيانات وتدفق المعلومات',
        paragraphs: ['تمر معالجة البيانات بسلسلة عمليات مترابطة تضمن تكامل السجلات وخلوها من التكرار والتناقض.'],
        numbered: [
          'إدخال البيانات وجمعها من نقاط البيع والمستشعرات والواجهات الرقمية',
          'التحقق من صحة المدخلات وتنظيفها من القيم الشاذة والمكررة',
          'معالجة وتخزين البيانات في قواعد بيانات علائقية مهيكلة بصيغة SQL',
          'استخراج التقارير ولوحات التحكم وتوليد الاستبصارات التحليلية للمديرين'
        ],
        subsections: []
      }
    ],
    conclusion: 'إن التكامل الناجح بين قواعد البيانات ونظم المعلومات المؤسسية يمنح الإدارة رؤية شاملة وفورية لتحسين الأداء التشغيلي وتقليل الأخطاء الإدارية.',
    references: [
      'Laudon, K. C., & Laudon, J. P. (2022). Management Information Systems: Managing the Digital Firm, 17th Edition, Pearson.',
      'Elmasri, R., & Navathe, S. B. (2020). Fundamentals of Database Systems, 7th Edition, Pearson.'
    ]
  },

  // Scenario 7: Multilingual Academic Draft (Arabic, French, English terms)
  'multilingual-research': {
    id: 'preset-multilingual',
    title: 'Transformation Digitale et Intelligence Artificielle: التحول الرقمي في المؤسسات الأكاديمية والبحثية',
    author: 'د. أمين البشير / Dr. Amine El-Bechir',
    institution: 'جامعة الأخوين / Al Akhawayn University',
    faculty: 'School of Science & Engineering',
    course: 'Digital Transformation & Systems Architecture',
    instructor: 'Prof. J. Martin',
    language: 'ar',
    domain: 'auto',
    density: 'standard',
    introduction: 'The modern university ecosystem is experiencing a profound transition driven by digital workflows, artificial intelligence (IA), and distributed cloud infrastructure. Ce travail examine les opportunités et les défis de la numérisation dans l\'enseignement supérieur.',
    sections: [
      {
        id: 'sec-multi-1',
        title: 'المبحث الأول: Les Fondements de la Transformation Numérique',
        paragraphs: [
          'La transformation digitale ne se limite pas à l\'adoption de nouveaux outils informatiques (Software), mais implique une refonte complète des processus organisationnels et de la culture académique.',
          'يشمل التحول الرقمي أتمتة الإجراءات الإدارية، وإتاحة المقررات عبر منصات التعلم الافتراضي (LMS - Learning Management Systems)، مع تعزيز الأمن السيبراني (Cybersecurity) لحماية بيانات الباحثين والطلاب.'
        ],
        bullets: [
          'Cloud Computing & Distributed Data Warehouses for scientific collaboration',
          'Adoption des outils d\'apprentissage adaptatif basés sur des algorithmes prédictifs',
          'الحوكمة الرقمية وتأهيل الكوادر الأكاديمية للتعامل مع النظم السحابية'
        ],
        subsections: []
      }
    ],
    conclusion: 'La synergie entre les technologies émergentes et l\'éthique académique constitue la clé d\'une modernisation durable des universités du XXIe siècle.',
    references: [
      'UNESCO (2023). Guidance for Generative AI in Education and Research, Paris.',
      'Brynjolfsson, E., & McAfee, A. (2019). The Second Machine Age: Work, Progress, and Prosperity, Norton & Company.'
    ]
  }
};
