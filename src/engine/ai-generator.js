/**
 * AI Academic Presentation Generator powered by PPT-Master Methodology
 * Connects directly to Google Gemini API via user API Key.
 * Synthesizes comprehensive, beautifully structured, publication-grade academic presentations.
 * 
 * Rules enforced:
 * - PPT-Master narrative topology (Cover -> Framing/Questions -> Objectives -> Core Analyses -> Conclusion & Recommendations -> References)
 * - Diverse communicative layouts: Comparisons, Process Steps, Metric KPI Grids, Pros/Cons, Definitions, Data Tables
 * - Rich vector interface icons (Flaticon UIcons)
 * - Executive Takeaways on every content slide
 * - Zero "تابع" / zero duplicate continuation slides
 */

import { SLIDE_TYPES } from '../classifier/content-type-classifier.js';

const GEMINI_API_ENDPOINT = 'https://generativelanguage.googleapis.com/v1beta/models';

/**
 * Validates whether an API key format looks reasonable
 */
export function isValidApiKeyFormat(key) {
  if (!key || typeof key !== 'string') return false;
  const clean = key.trim();
  return clean.length >= 20 && /^AIza[0-9A-Za-z-_]{35,}$/.test(clean) || clean.length >= 25;
}

/**
 * Builds the PPT-Master Academic System Instruction
 * Fully incorporates PPT-Master presentation design methodology (C:\Users\Administrator\.gemini\config\skills\ppt-master):
 * - Communication contract (Audience, Purpose, Outcome, Persuasion Spine)
 * - Academic Research Architecture: المقدمة + 3 مباحث رئيسية يشتمل كل مبحث على 3 مطالب متخصصة = 9 مطالب + خاتمة ومراجع
 * - Communicative Layout Diversity: Definition, Comparison, Statistics, Process Steps, Pros/Cons, Table
 * - Executive Takeaways on every content slide
 * - Zero continuation slides ("ممنوع منعاً باتاً كتابة تابع")
 * - Flaticon UIcons interface design mapping
 */
function buildPptMasterSystemPrompt({ academicDomain, degreeLevel, slideCount, language, mabhathCount = 3, matlabCount = 3 }) {
  const isArabic = language === 'ar';
  const totalMatalib = mabhathCount * matlabCount;
  
  return `You are PPT-Master AI, the elite academic presentation strategist and presentation design architect powered by the PPT-Master presentation framework.
Your mission is to generate a comprehensive, highly structured, scholarly academic slide deck based on the user's research topic.

ACADEMIC RESEARCH PROFILE:
- Target Domain: ${academicDomain || 'General Academic & Scientific'}
- Degree Level: ${degreeLevel || 'Master Thesis / Postgraduate Research'}
- Architecture: Academic Research Plan (خطة بحث أكاديمية: مقدمة + ${mabhathCount} مباحث × ${matlabCount} مطالب = ${totalMatalib} مطالب + خاتمة ومراجع)
- Target Slide Count: ${slideCount || 16} slides
- Primary Language: ${isArabic ? 'Arabic (RTL - لغة أكاديمية رصينة، محكمة، خالية من الحشو والإنشاء)' : language}

MANDATORY PPT-MASTER CORE DISCIPLINES:
1. RIGOROUS ACADEMIC RESEARCH PLAN HIERARCHY (خطة البحث وهيكل الدراسة):
   The presentation MUST strictly adhere to the recognized university academic thesis standard:
   - Slide 1: Cover (Academic title, subtitle, researcher, university, faculty, course, supervisor, date)
   - Slide 2: Agenda / Research Architecture (خطة البحث: المقدمة، ${mabhathCount} مباحث رئيسية، ${totalMatalib} مطالب فرعية، الخاتمة، المراجع)
   - Slide 3: Dedicated Introduction & Theoretical Framing with Problem Statement (إشكالية البحث وتساؤلاته الجوهرية)، 3 specific Research Objectives (أهداف البحث)، and Scientific Methodology (المنهجية المتبعة).
   - Core Research Chapters (المباحث والمطالب):
     You MUST generate exactly ${mabhathCount} main sections (المباحث).
     Each Mabhath MUST contain exactly ${matlabCount} specialized subsections (المطالب).
     Total: ${mabhathCount} Mabaheth × ${matlabCount} Matalib = ${totalMatalib} distinct, focused analytical subsections!
   - Second to Last Slide: Conclusion & Strategic Recommendations (الخاتمة وأهم النتائج والتوصيات الإجرائية المحددة)
   - Last Slide: Scholarly References (قائمة المصادر والمراجع المعتمدة وفق أسلوب APA)

2. COMMUNICATIVE LAYOUT SELECTION & STRICT TOPIC RELEVANCE (اختيار الأنماط البصرية بدقة وملاءمة):
   Assign appropriate, high-impact communicative layouts strictly tailored to the topic:
   - "definition": Conceptual framework, terminology, and foundational dimensions (definitionTerm, paragraphs, bullets, keyPoint).
   - "comparison": Comparative analysis contrasting two schools of thought, doctrines, models, or paradigms (colA and colB with specific items).
   - "process_steps": Chronological phases, operational workflows, or methodological steps (numbered: [step 1, step 2, step 3]).
   - "pros_cons": Critical evaluation, advantages vs challenges/critiques (bullets reflecting substantive arguments).
   - "table": Analytical matrix with meaningful headers and rows.
   - "explanation" or "bullets": Deep qualitative analysis, theoretical exposition, and scholarly critique.

   STRICT MANDATE ON CHARTS & STATISTICS (ضوابط صارمة للرسومات البيانية والأعمدة والمؤشرات الرقمية):
   - ONLY use "statistics" layout with quantitative numbers and charts (chartType: "bar" | "pie" | "line") IF AND ONLY IF the topic is inherently quantitative, empirical, economic, financial, statistical, or experimental.
   - If the research topic is theoretical, legal, philosophical, religious, literary, historical, or purely qualitative:
     IT IS STRICTLY FORBIDDEN to invent fake percentages, numbers, or bar charts (ممنوع منعاً باتاً اختلاق أرقام أو نسب أو رسومات بيانية وأعمدة لموضوع لا يحتاجها).
     Instead, use qualitative analytical layouts: "explanation", "definition", "comparison", "process_steps", or "pros_cons".
   - Every single slide must strictly adhere to the exact research topic. Never generate generic, off-topic, or placeholder text.

3. EXECUTIVE TAKEAWAY PER CONTENT SLIDE (خلاصة استنتاجية تنفيذية):
   Every single Matlab MUST have a crisp, high-impact "keyPoint" (خلاصة نوعية / استنتاج محوري) summarizing the core analytical insight in 1-2 impactful sentences.

4. ZERO CONTINUATION ("ممنوع منعاً باتاً كتابة تابع"):
   Never create continuation slides or duplicate titles. Every slide must be self-contained, dense with high-value analytical content, and summarized to fit perfectly on a 16:9 canvas.

5. OUTPUT FORMAT:
   Return strictly valid, parseable JSON conforming to the schema below without markdown commentary or code block markers.`;
}

/**
 * Builds the User Generation Prompt
 */
function buildUserPrompt({ topic, author, institution, faculty, course, instructor, slideCount, language, mabhathCount = 3, matlabCount = 3 }) {
  const totalMatalib = mabhathCount * matlabCount;
  return `Generate an academic presentation deck for the following topic:
Topic: "${topic}"

Metadata:
- Author / Student: ${author || 'الباحث الأكاديمي'}
- Institution / University: ${institution || 'جامعة الدراسات العليا'}
- Faculty: ${faculty || 'كلية العلوم والدراسات المتقدمة'}
- Course / Module: ${course || 'الدراسات والبحوث التخصصية'}
- Supervisor / Instructor: ${instructor || 'أ.د. المشرف الأكاديمي'}
- Target Slide Count: ${slideCount || 16}
- Mabaheth Count: ${mabhathCount}
- Matalib per Mabhath: ${matlabCount}

Return JSON with this EXACT structure (strictly ${mabhathCount} sections, each section having ${matlabCount} subsections = ${totalMatalib} subsections in total):
{
  "title": "العنوان الأكاديمي الدقيق والاحترافي للبحث",
  "author": "اسم الباحث",
  "institution": "المؤسسة أو الجامعة",
  "faculty": "الكلية أو القسم",
  "course": "المادة أو التخصص",
  "instructor": "الأستاذ المشرف",
  "date": "",
  "language": "${language || 'ar'}",
  "domain": "technology | management | economics | medicine | accounting | general",
  "themeVariant": "academic-royal | neom-tech | emerald-science | crimson-law | modern-slate",
  "introduction": "تمهيد وسياق نظري مكثف للبحث يستعرض أهمية الموضوع وأبعاده المعرفية الخاصة بعنوان البحث.",
  "problemStatement": "صياغة دقيقة لإشكالية الدراسة الخاصة بهذا الموضوع تحديداً.",
  "problemQuestion": "التساؤل الجوهري للبحث المنبثق عن الإشكالية (مرتبط حصراً بموضوع البحث)",
  "objectives": [
    "الهدف الأول: تشخيص واقع الإشكالية وتحديد المتغيرات الحاكمة للموضوع",
    "الهدف الثاني: تحليل الأبعاد المنهجية والتطبيقية المعمقة",
    "الهدف الثالث: صياغة أطر استشرافية وتوصيات علمية محكمة"
  ],
  "methodology": "المنهج الوصفي التحليلي المقارن",
  "sections": [
    {
      "id": "mabhath-1",
      "title": "المبحث الأول: التأصيل النظري والإطار المفاهيمي",
      "description": "المفاهيم المحورية والأبعاد الهيكلية",
      "subsections": [
        {
          "id": "sec-1-1",
          "title": "المطلب الأول: المفاهيم المؤسسة والنشأة التاريخية",
          "layoutType": "definition",
          "definitionTerm": "المفهوم المحوري للدراسة",
          "paragraphs": ["تعريف أكاديمي دقيق يوضح الأبعاد والمحددات الجوهرية للظاهرة محل الدراسة."],
          "bullets": [
            "البعد الهيكلي والخصائص الأساسية للنموذج",
            "المعايير المنهجية المعتمدة في التصنيف والتحليل"
          ],
          "keyPoint": "يمثل التأصيل النظري نقطة الانطلاق لبناء النماذج التطبيقية المحكمة."
        },
        {
          "id": "sec-1-2",
          "title": "المطلب الثاني: دراسة مقارنة ومفاضلة معيارية بين النماذج",
          "layoutType": "comparison",
          "paragraphs": ["مقارنة نقدية بين النماذج والحلول المتناولة في إطار البحث."],
          "comparison": {
            "colA": {
              "title": "الجانب أو الاتجاه الأول",
              "items": [
                "الخصائص المحددة والمحددات الهيكلية للاتجاه الأول",
                "الأثر والمخرجات المترتبة على هذا المدخل"
              ]
            },
            "colB": {
              "title": "الجانب أو الاتجاه المقابل",
              "items": [
                "المزايا والمحددات النوعية للاتجاه المقابل",
                "النتائج الميدانية والقيمة المضافة المترتبة"
              ]
            }
          },
          "keyPoint": "المفاضلة المعيارية تكشف نقاط القوة وتحدد الخيارات المثلى للتطبيق العلمي."
        },
        {
          "id": "sec-1-3",
          "title": "المطلب الثالث: الأبعاد المنهجية والمراحل الإجرائية",
          "layoutType": "process_steps",
          "paragraphs": ["استعراض مسار التحليل العلمي والمراحل المعتمدة لمعالجة إشكالية البحث."],
          "numbered": [
            "المرحلة الأولى: حصر الأدبيات وتأطير الفرضيات الموجهة للدراسة",
            "المرحلة الثانية: التحليل النقدي المعمق واختبار محاور البحث",
            "المرحلة الثالثة: استخلاص الدلالات وصياغة النتائج العلمية المحكمة"
          ],
          "keyPoint": "التتابع المنهجي الدقيق يضمن سلامة الاستنتاجات العلمية وموثوقية مخرجات البحث."
        }
      ]
    }
  ],
  "conclusion": "تخلص الدراسة إلى نتائج علمية متكاملة تعالج الإشكالية المطروحة بدقة وموضوعية.",
  "conclusionPoints": [
    "النتيجة الأولى: إثبات صحة الفرضيات وتحديد المحددات الجوهرية",
    "النتيجة الثانية: تقديم معالجة منهجية قابلة للبناء عليها مستقبلاً",
    "النتيجة الثالثة: توصيات إجرائية عملية موجهة للباحثين والممارسين"
  ],
  "references": [
    "مرجع أكاديمي أول موثق وفق APA",
    "مرجع أكاديمي ثانٍ موثق وفق APA",
    "مرجع أكاديمي ثالث موثق وفق APA"
  ]
}

CRITICAL RULES:
- IMPORTANT: DO NOT include "statistics" or "chartType" unless the user's specific topic is truly quantitative, statistical, or empirical! For theoretical, legal, philosophical, or literary topics, use ONLY qualitative layouts ("explanation", "bullets", "definition", "comparison", "process_steps", "pros_cons").
- All content must be 100% relevant, detailed, and directly related to the user's exact topic ("${topic}").`;
}

/**
 * Main AI Presentation Generation Function
 * Calls Gemini API and returns fully formed academic presentation draft
 */
export async function generatePresentationWithAI(params) {
  const {
    apiKey,
    topic,
    academicDomain = 'auto',
    degreeLevel = 'master',
    slideCount = 16,
    mabhathCount = 3,
    matlabCount = 3,
    author = '',
    institution = '',
    faculty = '',
    course = '',
    instructor = '',
    language = 'ar',
    model = 'gemini-3.8-flash',
    onProgress = () => {}
  } = params;

  if (!apiKey || !apiKey.trim()) {
    throw new Error('يرجى إدخال مفتاح Google Gemini API للمتابعة.');
  }

  if (!topic || !topic.trim()) {
    throw new Error('يرجى إدخال موضوع البحث أو العنوان الذي تود توليد العرض له.');
  }

  // Step 1: Initialize
  onProgress({
    step: 1,
    totalSteps: 5,
    message: 'تهيئة نموذج الذكاء الاصطناعي وبناء برومبت PPT-Master الأكاديمي...'
  });

  const systemPrompt = buildPptMasterSystemPrompt({
    academicDomain,
    degreeLevel,
    slideCount,
    language,
    mabhathCount,
    matlabCount
  });

  const userPrompt = buildUserPrompt({
    topic,
    author,
    institution,
    faculty,
    course,
    instructor,
    slideCount,
    language,
    mabhathCount,
    matlabCount
  });

  const preferredModel = (model || 'gemini-3.5-flash-lite').trim();
  // Build fallback model chain, prioritizing fast, official Google Gemini models
  const modelsToTry = [
    preferredModel,
    'gemini-3.5-flash-lite',
    'gemini-3.8-flash',
    'gemini-2.5-flash',
    'gemini-2.5-flash-lite',
    'gemini-1.5-flash'
  ].filter((m, i, arr) => m && arr.indexOf(m) === i);

  let response = null;
  let textOutput = null;
  let lastError = null;

  for (let mIdx = 0; mIdx < modelsToTry.length; mIdx++) {
    const currentModel = modelsToTry[mIdx];

    onProgress({
      step: 2,
      totalSteps: 5,
      message: mIdx === 0
        ? `جاري الاتصال بنموذج (${currentModel}) وصياغة الإشكالية والفرضيات...`
        : `النموذج السابق يواجه ضغطاً أو غير متاح، جاري الاتصال تلقائياً بنموذج (${currentModel})...`
    });

    const url = `${GEMINI_API_ENDPOINT}/${currentModel}:generateContent?key=${apiKey.trim()}`;

    const generationConfig = {
      responseMimeType: 'application/json',
      temperature: 0.35,
      topP: 0.95
    };

    const requestBody = {
      contents: [
        {
          role: 'user',
          parts: [
            { text: `${systemPrompt}\n\n---\n\n${userPrompt}` }
          ]
        }
      ],
      generationConfig
    };

    try {
      response = await fetch(url, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(requestBody)
      });
    } catch (networkError) {
      throw new Error(`تعذر الاتصال بخادم الذكاء الاصطناعي: ${networkError.message}. يرجى التحقق من اتصالك بالإنترنت.`);
    }

    if (!response.ok) {
      let errorDetail = '';
      try {
        const errJson = await response.json();
        errorDetail = errJson?.error?.message || errJson?.error?.status || `رمز الاستجابة: ${response.status}`;
      } catch (e) {
        errorDetail = response.statusText || `رمز الاستجابة: ${response.status}`;
      }

      // Check for invalid API key
      if (response.status === 400 && (errorDetail.includes('API_KEY_INVALID') || errorDetail.includes('API key not valid'))) {
        throw new Error('مفتاح Google Gemini API غير صالح. يرجى التأكد من نسخ المفتاح بشكل صحيح من Google AI Studio.');
      }

      // If we have alternative fallback models to try, ALWAYS switch seamlessly to the next model!
      if (mIdx < modelsToTry.length - 1) {
        const nextModel = modelsToTry[mIdx + 1];
        lastError = errorDetail;

        let reasonLabel = 'غير متاح حالياً';
        if (response.status === 503 || errorDetail.includes('high demand') || errorDetail.includes('Spikes in demand')) {
          reasonLabel = 'يشهد ضغطاً مؤقتاً عالياً (High Demand)';
        } else if (response.status === 429 || errorDetail.includes('RESOURCE_EXHAUSTED')) {
          reasonLabel = 'تجاوز حد الطلبات اللحظي';
        } else if (response.status === 404 || errorDetail.includes('not found')) {
          reasonLabel = 'غير متاح لحسابك';
        }

        console.warn(`[AI Studio] Model ${currentModel} failed (${response.status}: ${errorDetail}). Auto-switching to ${nextModel}...`);

        onProgress({
          step: 2,
          totalSteps: 5,
          message: `نموذج (${currentModel}) ${reasonLabel}. جاري التحويل التلقائي والفوري إلى (${nextModel})...`
        });

        // 350ms delay before connecting to next fallback model
        await new Promise(r => setTimeout(r, 350));
        continue;
      }

      // If all models in the fallback chain were exhausted, display friendly Arabic messages:
      if (errorDetail.includes('high demand') || errorDetail.includes('Spikes in demand') || response.status === 503) {
        throw new Error(`خوادم Google Gemini تشهد ضغطاً مؤقتاً كبيراً على النماذج حالياً (High Demand). يرجى الانتظار 10 ثوانٍ وإعادة المحاولة، أو اختيار نموذج Gemini 3.5 Flash-Lite من الخطوة الأولى.`);
      }

      if (response.status === 429 || errorDetail.includes('RESOURCE_EXHAUSTED')) {
        throw new Error('تم تجاوز حد الطلبات المسموح (Rate Limit) لمفتاحك حالياً. يرجى الانتظار 30 ثانية ثم المحاولة مجدداً.');
      }

      throw new Error(`خطأ من خادم الذكاء الاصطناعي (${currentModel}): ${errorDetail}`);
    }

    // Response is OK, parse candidates
    try {
      const result = await response.json();
      textOutput = result?.candidates?.[0]?.content?.parts?.[0]?.text;
      if (textOutput) {
        break; // Successfully got output!
      } else {
        const finishReason = result?.candidates?.[0]?.finishReason;
        lastError = finishReason ? `سبب الإيقاف: ${finishReason}` : 'استجابة فارغة من النموذج';
      }
    } catch (e) {
      lastError = e.message;
    }
  }

  if (!textOutput) {
    throw new Error('لم يتمكن نموذج الذكاء الاصطناعي من توليد المحتوى: ' + (lastError || 'استجابة فارغة'));
  }

  // Step 4: Parse & Validate
  onProgress({
    step: 4,
    totalSteps: 5,
    message: 'التحقق من صحة البنية وتعيين الأنماط وأيقونات الواجهة (UIcons)...'
  });

  let parsedDraft;
  try {
    // Strip possible markdown fences if returned
    let cleanJson = textOutput.trim();
    if (cleanJson.startsWith('```json')) {
      cleanJson = cleanJson.substring(7);
    } else if (cleanJson.startsWith('```')) {
      cleanJson = cleanJson.substring(3);
    }
    if (cleanJson.endsWith('```')) {
      cleanJson = cleanJson.substring(0, cleanJson.length - 3);
    }
    cleanJson = cleanJson.trim();

    // Extract outermost JSON object if model returned any surrounding text
    const startObj = cleanJson.indexOf('{');
    const endObj = cleanJson.lastIndexOf('}');
    if (startObj !== -1 && endObj !== -1 && endObj > startObj) {
      cleanJson = cleanJson.substring(startObj, endObj + 1);
    }

    parsedDraft = JSON.parse(cleanJson);
  } catch (parseError) {
    console.error('Failed to parse AI JSON:', textOutput);
    throw new Error('تعذر قراءة مخرجات الذكاء الاصطناعي كبيانات مهيكلة: ' + parseError.message);
  }

  // Post-process to ensure all required fields exist
  parsedDraft.id = `ai-deck-${Date.now()}`;
  parsedDraft.density = 'standard';
  if (!parsedDraft.language) parsedDraft.language = language;
  if (!parsedDraft.domain || parsedDraft.domain === 'auto') {
    parsedDraft.domain = academicDomain !== 'auto' ? academicDomain : 'general';
  }

  // Step 5: Complete
  onProgress({
    step: 5,
    totalSteps: 5,
    message: 'اكتمل توليد العرض بنجاح! جاري بناء الشرائح والمعاينة...'
  });

  return parsedDraft;
}
