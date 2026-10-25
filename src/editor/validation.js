/**
 * Academic Draft Validation and Health Checks
 * Validates required fields, numerical table sanity, and generates helpful feedback.
 */

export function validateDraft(draft) {
  const errors = [];
  const warnings = [];

  // 1. Title validation (Critical)
  if (!draft.title || !draft.title.trim()) {
    errors.push({
      field: 'title',
      message: 'عنوان العرض التقديمي حقل إلزامي لا يمكن تركه فارغاً.'
    });
  } else if (draft.title.trim().length < 5) {
    warnings.push({
      field: 'title',
      message: 'عنوان البحث قصير جداً؛ يُفضل كتابة عنوان أكاديمي وصفي ومعبّر.'
    });
  }

  // 2. Sections validation
  if (!Array.isArray(draft.sections) || draft.sections.length === 0) {
    warnings.push({
      field: 'sections',
      message: 'لم يتم إضافة أي مباحث دراسية بعد. يُنصح بإضافة مبحث واحد على الأقل.'
    });
  } else {
    draft.sections.forEach((sec, idx) => {
      const sNum = idx + 1;
      if (!sec.title || !sec.title.trim()) {
        warnings.push({
          field: `section-${sec.id}`,
          message: `المبحث رقم (${sNum}) بدون عنوان رئيسي.`
        });
      }

      const hasContent = (sec.paragraphs?.length > 0) ||
                         (sec.bullets?.length > 0) ||
                         (sec.numbered?.length > 0) ||
                         (sec.statistics?.length > 0) ||
                         (sec.table?.headers?.length > 0) ||
                         (sec.subsections?.length > 0);

      if (!hasContent) {
        warnings.push({
          field: `section-${sec.id}`,
          message: `المبحث رقم (${sNum}) فارغ من المحتوى النصي أو النقاط.`
        });
      }

      // Numerical statistics sanity check
      if (Array.isArray(sec.statistics)) {
        sec.statistics.forEach((stat, stIdx) => {
          if (!stat.label || !stat.label.trim()) {
            warnings.push({
              field: `section-${sec.id}-stat-${stIdx}`,
              message: `المؤشر الإحصائي رقم (${stIdx + 1}) في المبحث (${sNum}) يفتقد لعنوان التسمية.`
            });
          }
          const parsedVal = parseFloat(stat.value);
          if (isNaN(parsedVal)) {
            warnings.push({
              field: `section-${sec.id}-stat-${stIdx}`,
              message: `قيمة المؤشر "${stat.label || stIdx + 1}" غير رقمية (${stat.value})، مما قد يؤثر على الرسم البياني.`
            });
          }
        });
      }
    });
  }

  // 3. Metadata helpful checks
  if (!draft.author || !draft.author.trim()) {
    warnings.push({
      field: 'author',
      message: 'لم يتم تدوين اسم الباحث / الطالب في بطاقة الغلاف.'
    });
  }

  if (!draft.institution || !draft.institution.trim()) {
    warnings.push({
      field: 'institution',
      message: 'لم يتم تحديد اسم الجامعة أو المؤسسة الأكاديمية.'
    });
  }

  return {
    isValid: errors.length === 0,
    errors,
    warnings
  };
}
