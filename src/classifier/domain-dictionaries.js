/**
 * Domain Dictionaries for Rule-Based Academic Classification
 * Multilingual keyword sets (Arabic, French, English) with phrase support.
 */

export const DOMAINS = {
  TECHNOLOGY: 'technology',
  INFORMATION_SYSTEMS: 'information-systems',
  ECONOMICS: 'economics',
  MANAGEMENT: 'management',
  MEDICINE: 'medicine',
  ACCOUNTING: 'accounting'
};

export const DOMAIN_METADATA = {
  [DOMAINS.TECHNOLOGY]: {
    id: DOMAINS.TECHNOLOGY,
    nameAr: 'التكنولوجيا وهندسة البرمجيات',
    nameEn: 'Technology & Software',
    nameFr: 'Technologie & Informatique',
    descriptionAr: 'أنظمة التشغيل، الشبكات، الأمن السيبراني، وهندسة البرمجيات والعتاد.',
    icon: 'cpu',
    primaryColor: '#0284c7'
  },
  [DOMAINS.INFORMATION_SYSTEMS]: {
    id: DOMAINS.INFORMATION_SYSTEMS,
    nameAr: 'نظم المعلومات وقواعد البيانات',
    nameEn: 'Information Systems',
    nameFr: "Systèmes d'Information",
    descriptionAr: 'هندسة البيانات، قواعد البيانات، تدفق المعلومات، ومعمارية النظم.',
    icon: 'database',
    primaryColor: '#4f46e5'
  },
  [DOMAINS.ECONOMICS]: {
    id: DOMAINS.ECONOMICS,
    nameAr: 'العلوم الاقتصادية والأسواق',
    nameEn: 'Economics & Markets',
    nameFr: 'Sciences Économiques',
    descriptionAr: 'النمو الاقتصادي، التضخم، العرض والطلب، السياسات النقدية، والتجارة.',
    icon: 'trending-up',
    primaryColor: '#15803d'
  },
  [DOMAINS.MANAGEMENT]: {
    id: DOMAINS.MANAGEMENT,
    nameAr: 'إدارة الأعمال والمؤسسات',
    nameEn: 'Management & Institutions',
    nameFr: 'Management & Organisation',
    descriptionAr: 'الموارد البشرية، القيادة، الهياكل التنظيمية، التخطيط الاستراتيجي، والتسويق.',
    icon: 'briefcase',
    primaryColor: '#1e293b'
  },
  [DOMAINS.MEDICINE]: {
    id: DOMAINS.MEDICINE,
    nameAr: 'العلوم الطبية والصحية',
    nameEn: 'Medical & Health Sciences',
    nameFr: 'Sciences Médicales',
    descriptionAr: 'التشريح، الأمراض، التشخيص والعلاج، الوقاية، والأنظمة الحيوية.',
    icon: 'activity',
    primaryColor: '#0d9488'
  },
  [DOMAINS.ACCOUNTING]: {
    id: DOMAINS.ACCOUNTING,
    nameAr: 'المحاسبة والتدقيق المالي',
    nameEn: 'Accounting & Finance',
    nameFr: 'Comptabilité & Finance',
    descriptionAr: 'الميزانية العمومية، الأصول والخصوم، الأرباح والخسائر، والتدفقات النقدية.',
    icon: 'file-spreadsheet',
    primaryColor: '#166534'
  }
};

export const DOMAIN_KEYWORDS = {
  [DOMAINS.TECHNOLOGY]: [
    // Arabic
    'التكنولوجيا', 'تكنولوجيا', 'تقنية', 'تقنيات', 'برمجة', 'مبرمج', 'حاسوب', 'حواسيب',
    'شبكات', 'شبكة', 'أمن سيبراني', 'امن سيبراني', 'نظام تشغيل', 'انظمة تشغيل', 'برمجيات',
    'برنامج', 'كود', 'خوارزميات', 'خوارزمية', 'معالج', 'معالجات', 'سحابية', 'حوسبة سحابية',
    'خادم', 'خوادم', 'بروتوكول', 'انترنت', 'ويب', 'ذكاء اصطناعي', 'تشفير', 'اتصالات رقمية',
    // French
    'technologie', 'technologies', 'programmation', 'informatique', 'réseaux', 'reseaux',
    'cybersécurité', 'cybersecurite', 'logiciel', 'logiciels', 'système d\'exploitation',
    'algorithme', 'algorithmes', 'serveur', 'serveurs', 'cloud', 'matériel', 'matériel informatique',
    'protocole', 'développement logiciel',
    // English
    'technology', 'technologies', 'programming', 'computer', 'computers', 'networks', 'network',
    'cybersecurity', 'software', 'operating system', 'algorithm', 'algorithms', 'server', 'servers',
    'cloud computing', 'hardware', 'code', 'coding', 'protocol', 'protocols', 'cyber security',
    'developer', 'computing', 'web development'
  ],

  [DOMAINS.INFORMATION_SYSTEMS]: [
    // Arabic
    'معلومات', 'بيانات', 'نظم المعلومات', 'نظام المعلومات', 'قواعد البيانات', 'قاعدة بيانات',
    'معالجة البيانات', 'معالجة المعلومات', 'الاتصال', 'مستودع البيانات', 'مستودعات البيانات',
    'تدفق البيانات', 'تدفق المعلومات', 'نمذجة البيانات', 'استرجاع المعلومات', 'تنقيب البيانات',
    'تكامل النظم', 'أمن المعلومات', 'نظم دعم القرار', 'هندسة المعلومات', 'سجلات البيانات',
    // French
    'information', 'informations', 'données', 'donnees', 'système d\'information', 'systeme d\'information',
    'systèmes d\'information', 'base de données', 'bases de donnees', 'communication',
    'flux de données', 'entrepôt de données', 'traitement de données', 'modélisation de données',
    'analyse de données', 'sécurité de l\'information',
    // English
    'information', 'data', 'information systems', 'information system', 'database', 'databases',
    'data processing', 'communication systems', 'data flow', 'data warehouse', 'relational database',
    'sql', 'data modeling', 'decision support systems', 'data mining', 'information architecture',
    'data pipeline', 'big data', 'enterprise resource planning', 'erp'
  ],

  [DOMAINS.ECONOMICS]: [
    // Arabic
    'اقتصاد', 'اقتصادي', 'اقتصادية', 'تضخم', 'نمو اقتصادي', 'عرض وطلب', 'العرض والطلب',
    'سوق', 'أسواق', 'تجارة', 'تجارة دولية', 'بطالة', 'الناتج المحلي', 'الناتج المحلي الإجمالي',
    'سياسة نقدية', 'سياسات مالية', 'فائدة', 'سعر الفائدة', 'أسعار', 'استهلاك', 'استثمار',
    'ركود', 'ميزان المدفوعات', 'عجز مالي', 'دخل قومي', 'تنمية اقتصادية', 'أسواق المال',
    // French
    'économie', 'economie', 'économique', 'inflation', 'croissance économique', 'offre et demande',
    'marché', 'marche', 'commerce', 'chômage', 'chomage', 'pib', 'politique monétaire',
    'taux d\'intérêt', 'investissement', 'récession', 'consommation', 'balance des paiements',
    // English
    'economics', 'economy', 'economic', 'inflation', 'economic growth', 'supply and demand',
    'market', 'markets', 'trade', 'unemployment', 'gdp', 'gross domestic product',
    'monetary policy', 'fiscal policy', 'interest rate', 'consumption', 'investment',
    'recession', 'balance of payments', 'price index', 'macroeconomics', 'microeconomics'
  ],

  [DOMAINS.MANAGEMENT]: [
    // Arabic
    'مؤسسة', 'مؤسسات', 'إدارة', 'ادارة', 'تسيير', 'موارد بشرية', 'الموارد البشرية', 'قيادة',
    'استراتيجية', 'استراتيجيات', 'إنتاج', 'انتاج', 'تسويق', 'هيكل تنظيمي', 'هياكل تنظيمية',
    'كفاءات', 'حوكمة', 'تخطيط استراتيجي', 'توظيف', 'أداء مؤسسي', 'ثقافة تنظيمية', 'اتخاذ القرار',
    'سلوك تنظيمي', 'إدارة الجودة', 'سلسلة التوريد',
    // French
    'entreprise', 'entreprises', 'organisation', 'organisations', 'gestion', 'management',
    'ressources humaines', 'stratégie', 'strategie', 'production', 'marketing', 'structure organisationnelle',
    'gouvernance', 'leadership', 'planification stratégique', 'performance organisationnelle',
    // English
    'business', 'organization', 'organizations', 'management', 'human resources', 'leadership',
    'strategy', 'strategic', 'production', 'marketing', 'organizational structure', 'governance',
    'strategic planning', 'recruitment', 'organizational behavior', 'corporate', 'manager',
    'enterprise', 'quality management', 'supply chain'
  ],

  [DOMAINS.MEDICINE]: [
    // Arabic
    'طب', 'طبي', 'طبية', 'مرض', 'أمراض', 'تشخيص', 'علاج', 'تشريح', 'أعضاء الجسم', 'خلايا',
    'خلية', 'وقاية', 'مستشفى', 'مستشفيات', 'جراحة', 'أعراض', 'سريري', 'فيروس', 'بكتيريا',
    'أدوية', 'دواء', 'فسيولوجيا', 'مناعة', 'جهاز مناعي', 'قلب', 'دورة دموية', 'أعصاب',
    'صحة عامة', 'علم الأدوية', 'علم الأمراض',
    // French
    'médecine', 'medecine', 'médical', 'maladie', 'maladies', 'diagnostic', 'traitement',
    'anatomie', 'cellules', 'cellule', 'prévention', 'hôpital', 'hopital', 'chirurgie',
    'symptômes', 'clinique', 'immunité', 'médicament', 'médicaments', 'physiologie', 'pathologie',
    // English
    'medicine', 'medical', 'disease', 'diseases', 'diagnosis', 'treatment', 'anatomy', 'cells',
    'cell', 'prevention', 'hospital', 'surgery', 'symptoms', 'clinical', 'virus', 'bacteria',
    'medication', 'drugs', 'physiology', 'immunity', 'immune system', 'pathology', 'cardiology',
    'health', 'healthcare', 'therapy'
  ],

  [DOMAINS.ACCOUNTING]: [
    // Arabic
    'محاسبة', 'محاسبي', 'محاسبية', 'ميزانية', 'ميزانية عمومية', 'أصول', 'خصوم', 'إيرادات',
    'مصروفات', 'تكاليف', 'تكلفة', 'أرباح', 'ربح', 'خسارة', 'تدفقات نقدية', 'التدفقات النقدية',
    'ميزان مراجعة', 'تدقيق', 'قائمة الدخل', 'حقوق الملكية', 'إهلاك', 'دفتر الأستاذ',
    'قوائم مالية', 'محاسبة تكاليف', 'محاسبة مالية', 'ضرائب',
    // French
    'comptabilité', 'comptabilite', 'comptable', 'bilan', 'bilan comptable', 'actifs', 'actif',
    'passifs', 'passif', 'revenus', 'dépenses', 'coûts', 'couts', 'bénéfices', 'trésorerie',
    'compte de résultat', 'amortissement', 'audit', 'capitaux propres', 'grand livre',
    // English
    'accounting', 'accountant', 'balance sheet', 'assets', 'asset', 'liabilities', 'liability',
    'revenue', 'expenses', 'costs', 'cost', 'profit', 'profits', 'cash flow', 'cash flows',
    'income statement', 'audit', 'auditing', 'depreciation', 'equity', 'ledger', 'financial statements',
    'cost accounting', 'financial audit', 'trial balance'
  ]
};

/**
 * Scoring weights as specified by academic requirements
 */
export const SCORING_WEIGHTS = {
  TITLE: 5,
  SECTION_TITLE: 3,
  SUBSECTION_TITLE: 2,
  INTRODUCTION: 2,
  BODY: 1
};
