/**
 * Dynamic Section & Subsection DOM Component Renderer - Enhanced with Visual Layouts & Emojis
 * Provides structured controls for selecting slide diagrams (Charts, Flowcharts, Comparisons),
 * adding academic emoji stickers, and formatting research blocks.
 */

import { enrichBullets, stripEmojis, getAcademicIconForText } from '../engine/visual-enricher.js';
import { SLIDE_TYPES } from '../classifier/content-type-classifier.js';
import { renderIcon } from '../design/interface-icons.js';

export function renderSectionsList(sections, containerEl, onChange) {
  if (!containerEl) return;
  containerEl.innerHTML = '';

  if (!sections || sections.length === 0) {
    containerEl.innerHTML = `
      <div class="empty-state-box">
        <div class="empty-icon">📑</div>
        <h4>لا توجد مباحث دراسية مضافة حتى الآن</h4>
        <p>انقر على زر "إضافة مبحث جديد" لبدء هيكلة محتوى البحث الأكاديمي.</p>
      </div>
    `;
    return;
  }

  sections.forEach((section, sIdx) => {
    const sectionCard = document.createElement('div');
    sectionCard.className = 'section-card-accordion';
    sectionCard.dataset.sectionId = section.id;

    const isFirst = sIdx === 0;
    const isLast = sIdx === sections.length - 1;
    const curLayout = section.layoutType || 'auto';

    sectionCard.innerHTML = `
      <div class="section-card-header">
        <div class="section-badge">المبحث ${sIdx + 1}</div>
        <input type="text" class="section-title-input" value="${escapeAttr(section.title)}" placeholder="عنوان المبحث الرئيسي (مثال: المبحث الأول: الإطار المفاهيمي)..." />
        
        <div class="section-actions-toolbar">
          <button type="button" class="btn-icon btn-move-up" title="تحريك لأعلى" ${isFirst ? 'disabled' : ''}>▲</button>
          <button type="button" class="btn-icon btn-move-down" title="تحريك لأسفل" ${isLast ? 'disabled' : ''}>▼</button>
          <button type="button" class="btn-icon btn-delete-section text-danger" title="حذف المبحث">✕</button>
        </div>
      </div>

      <div class="section-card-body">
        
        <!-- Visual Layout & Diagram Selector -->
        <div class="layout-picker-wrapper">
          <div class="layout-picker-header">
            <span class="layout-picker-title">نوع الشكل البياني والتخطيط للشريحة:</span>
            <button type="button" class="btn btn-secondary btn-xs btn-auto-enrich-sec" title="تنسيق الشريحة وتعيين الأيقونة المناسبة تلقائياً">
              ✨ تنسيق ذكي بالأيقونات
            </button>
          </div>
          <div class="layout-pill-group">
            <button type="button" class="layout-pill-btn ${curLayout === 'auto' ? 'active' : ''}" data-layout="auto">تلقائي</button>
            <button type="button" class="layout-pill-btn ${curLayout === SLIDE_TYPES.STATISTICS ? 'active' : ''}" data-layout="${SLIDE_TYPES.STATISTICS}">رسم بياني ومؤشرات</button>
            <button type="button" class="layout-pill-btn ${curLayout === SLIDE_TYPES.PROCESS_STEPS ? 'active' : ''}" data-layout="${SLIDE_TYPES.PROCESS_STEPS}">مخطط تدفقي ومراحل</button>
            <button type="button" class="layout-pill-btn ${curLayout === SLIDE_TYPES.COMPARISON ? 'active' : ''}" data-layout="${SLIDE_TYPES.COMPARISON}">مقارنة VS</button>
            <button type="button" class="layout-pill-btn ${curLayout === SLIDE_TYPES.PROS_CONS ? 'active' : ''}" data-layout="${SLIDE_TYPES.PROS_CONS}">مزايا وسلبيات</button>
            <button type="button" class="layout-pill-btn ${curLayout === SLIDE_TYPES.DEFINITION ? 'active' : ''}" data-layout="${SLIDE_TYPES.DEFINITION}">تعريف اصطلاحي</button>
            <button type="button" class="layout-pill-btn ${curLayout === SLIDE_TYPES.TABLE ? 'active' : ''}" data-layout="${SLIDE_TYPES.TABLE}">جدول محاسبي</button>
            <button type="button" class="layout-pill-btn ${curLayout === SLIDE_TYPES.TIMELINE ? 'active' : ''}" data-layout="${SLIDE_TYPES.TIMELINE}">خط زمني</button>
          </div>
        </div>

        <!-- Academic Vector Interface Icons (UIcons) Bar -->
        <div class="uicon-palette-strip">
          <span class="uicon-palette-label">أيقونات الواجهة (UIcons):</span>
          <div class="uicon-buttons-scroll">
            <button type="button" class="uicon-chip ${section.iconKey === 'target' ? 'active' : ''}" data-icon="target" title="هدف استراتيجي">
              ${renderIcon('target', { size: 14 })} <span>هدف</span>
            </button>
            <button type="button" class="uicon-chip ${section.iconKey === 'barChart' ? 'active' : ''}" data-icon="barChart" title="مؤشر إحصائي">
              ${renderIcon('barChart', { size: 14 })} <span>إحصاء</span>
            </button>
            <button type="button" class="uicon-chip ${section.iconKey === 'trendingUp' ? 'active' : ''}" data-icon="trendingUp" title="نمو وتطور">
              ${renderIcon('trendingUp', { size: 14 })} <span>نمو</span>
            </button>
            <button type="button" class="uicon-chip ${section.iconKey === 'lightbulb' ? 'active' : ''}" data-icon="lightbulb" title="فكرة واستبصار">
              ${renderIcon('lightbulb', { size: 14 })} <span>فكرة</span>
            </button>
            <button type="button" class="uicon-chip ${section.iconKey === 'scale' ? 'active' : ''}" data-icon="scale" title="مقارنة وحوكمة">
              ${renderIcon('scale', { size: 14 })} <span>مقارنة</span>
            </button>
            <button type="button" class="uicon-chip ${section.iconKey === 'checkCircle' ? 'active' : ''}" data-icon="checkCircle" title="ميزة وإيجابية">
              ${renderIcon('checkCircle', { size: 14 })} <span>ميزة</span>
            </button>
            <button type="button" class="uicon-chip ${section.iconKey === 'alertTriangle' ? 'active' : ''}" data-icon="alertTriangle" title="تحدي وخطر">
              ${renderIcon('alertTriangle', { size: 14 })} <span>تحدي</span>
            </button>
            <button type="button" class="uicon-chip ${section.iconKey === 'trophy' ? 'active' : ''}" data-icon="trophy" title="نتيجة وتوصية">
              ${renderIcon('trophy', { size: 14 })} <span>نتائج</span>
            </button>
            <button type="button" class="uicon-chip ${section.iconKey === 'shieldCheck' ? 'active' : ''}" data-icon="shieldCheck" title="أمان وحماية">
              ${renderIcon('shieldCheck', { size: 14 })} <span>حماية</span>
            </button>
            <button type="button" class="uicon-chip ${section.iconKey === 'search' ? 'active' : ''}" data-icon="search" title="تحليل وبحث">
              ${renderIcon('search', { size: 14 })} <span>تحليل</span>
            </button>
            <button type="button" class="uicon-chip ${section.iconKey === 'cpu' ? 'active' : ''}" data-icon="cpu" title="تقنية ورقمي">
              ${renderIcon('cpu', { size: 14 })} <span>تقنية</span>
            </button>
            <button type="button" class="uicon-chip ${section.iconKey === 'database' ? 'active' : ''}" data-icon="database" title="بيانات ونظم">
              ${renderIcon('database', { size: 14 })} <span>بيانات</span>
            </button>
            <button type="button" class="uicon-chip ${section.iconKey === 'bookOpen' ? 'active' : ''}" data-icon="bookOpen" title="مرجع وتوثيق">
              ${renderIcon('bookOpen', { size: 14 })} <span>توثيق</span>
            </button>
          </div>
        </div>

        <!-- Paragraphs Section -->
        <div class="block-group">
          <div class="block-group-header">
            <label class="group-label">الفقرات والشروح التحليلية</label>
            <button type="button" class="btn-secondary btn-sm btn-add-paragraph">+ إضافة فقرة</button>
          </div>
          <div class="paragraphs-list-container">
            ${(section.paragraphs || []).map((p, pIdx) => `
              <div class="removable-input-row" data-p-index="${pIdx}">
                <textarea class="form-textarea paragraph-textarea" rows="2" placeholder="اكتب فقرة بحثية رصينة...">${escapeHtml(p)}</textarea>
                <button type="button" class="btn-icon text-muted btn-remove-paragraph" title="حذف الفقرة">✕</button>
              </div>
            `).join('')}
          </div>
        </div>

        <!-- Bullets Section -->
        <div class="block-group">
          <div class="block-group-header">
            <label class="group-label">النقاط والمحاور المستخلصة</label>
            <button type="button" class="btn-secondary btn-sm btn-add-bullet">+ إضافة نقطة</button>
          </div>
          <div class="bullets-list-container">
            ${(section.bullets || []).map((b, bIdx) => `
              <div class="removable-input-row" data-b-index="${bIdx}">
                <input type="text" class="form-input bullet-input" value="${escapeAttr(b)}" placeholder="نقطة محورية مركزة..." />
                <button type="button" class="btn-icon text-muted btn-remove-bullet" title="حذف النقطة">✕</button>
              </div>
            `).join('')}
          </div>
        </div>

        <!-- Key Point Callout -->
        <div class="block-group">
          <label class="group-label">خلاصة جوهرية أو استنتاج رئيسي (إضاءة بحثية)</label>
          <input type="text" class="form-input keypoint-input" value="${escapeAttr(section.keyPoint || '')}" placeholder="فكرة محورية يراد إبرازها في شريحة الشرح..." />
        </div>

        <!-- Statistics & Indicators Sub-panel -->
        <div class="block-group">
          <div class="block-group-header">
            <label class="group-label">المؤشرات الرقمية والبيانات الإحصائية (لتوليد الرسوم البيانية)</label>
            <button type="button" class="btn-secondary btn-sm btn-add-stat">+ إضافة مؤشر رقمي</button>
          </div>
          <div class="stats-list-container">
            ${(section.statistics || []).map((st, stIdx) => `
              <div class="stat-input-row" data-stat-index="${stIdx}">
                <input type="text" class="form-input stat-label-input" value="${escapeAttr(st.label)}" placeholder="التسمية (مثال: نمو 2023)" />
                <input type="text" class="form-input stat-value-input" value="${escapeAttr(st.value)}" placeholder="القيمة (مثال: 45)" />
                <input type="text" class="form-input stat-unit-input" value="${escapeAttr(st.unit || '')}" placeholder="الوحدة (مثال: % أو مليون)" />
                <button type="button" class="btn-icon text-muted btn-remove-stat" title="حذف المؤشر">✕</button>
              </div>
            `).join('')}
          </div>
        </div>

        <!-- Subsections (مطالب وفروع) -->
        <div class="subsections-container">
          <div class="subsections-header">
            <h5 class="subsections-title">المطالب والفروع الفرعية (المبحث ${sIdx + 1})</h5>
            <button type="button" class="btn-primary btn-sm btn-add-subsection">+ إضافة مطلب فرعي</button>
          </div>
          <div class="subsections-list">
            ${(section.subsections || []).map((sub, subIdx) => `
              <div class="subsection-card" data-sub-id="${sub.id}">
                <div class="subsection-card-header">
                  <div class="sub-badge">مطلب ${subIdx + 1}</div>
                  <input type="text" class="sub-title-input" value="${escapeAttr(sub.title)}" placeholder="عنوان المطلب (مثال: المطلب الأول: الخصائص الأساسية)..." />
                  <div class="subsection-actions">
                    <button type="button" class="btn-icon btn-sub-move-up" ${subIdx === 0 ? 'disabled' : ''}>▲</button>
                    <button type="button" class="btn-icon btn-sub-move-down" ${subIdx === (section.subsections.length - 1) ? 'disabled' : ''}>▼</button>
                    <button type="button" class="btn-icon btn-delete-sub text-danger" title="حذف المطلب">✕</button>
                  </div>
                </div>
                <div class="subsection-card-body">
                  <textarea class="form-textarea sub-paragraphs-input" rows="2" placeholder="فقرات نصية لشرح هذا المطلب...">${escapeHtml((sub.paragraphs || []).join('\n'))}</textarea>
                  <input type="text" class="form-input sub-bullets-input mt-2" value="${escapeAttr((sub.bullets || []).join(' | '))}" placeholder="نقاط فرعية مفصولة بعلامة | ..." />
                </div>
              </div>
            `).join('')}
          </div>
        </div>
      </div>
    `;

    // Bind event listeners for this section
    bindSectionEvents(sectionCard, section, sIdx, sections, onChange);
    containerEl.appendChild(sectionCard);
  });
}

function bindSectionEvents(cardEl, section, sIdx, sections, onChange) {
  // Title change
  const titleInput = cardEl.querySelector('.section-title-input');
  titleInput.addEventListener('input', (e) => {
    section.title = e.target.value;
    onChange();
  });

  // Layout Pill Selection
  cardEl.querySelectorAll('.layout-pill-btn').forEach(btn => {
    btn.addEventListener('click', (e) => {
      const selectedLayout = e.target.dataset.layout;
      section.layoutType = selectedLayout;

      // Auto-populate reasonable sample structures if needed
      if (selectedLayout === SLIDE_TYPES.STATISTICS && (!section.statistics || section.statistics.length === 0)) {
        section.statistics = [
          { label: 'مؤشر النمو', value: '45', unit: '%' },
          { label: 'نسبة الدقة', value: '88', unit: '%' },
          { label: 'تقليص التكاليف', value: '32', unit: '%' },
          { label: 'رضا المستفيدين', value: '91', unit: '%' }
        ];
        section.chartType = 'bar';
      } else if (selectedLayout === SLIDE_TYPES.PROCESS_STEPS && (!section.numbered || section.numbered.length === 0)) {
        section.numbered = [
          'المرحلة الأولى: التشخيص وحصر المتطلبات',
          'المرحلة الثانية: التطوير وهندسة النظم',
          'المرحلة الثالثة: التأهيل والتدريب الميداني',
          'المرحلة الرابعة: المراقبة وقياس الأثر'
        ];
      } else if (selectedLayout === SLIDE_TYPES.COMPARISON && !section.comparison) {
        section.comparison = {
          colA: { title: 'النمط التقليدي', items: ['إجراءات يدوية بطيئة', 'صعوبة تتبع البيانات'] },
          colB: { title: 'النمط الذكي المعتمد', items: ['أتمتة فورية ولحظية', 'أرشفة سحابية مشفرة'] }
        };
      }

      onChange(true);
    });
  });

  // Auto-enrich Section with clean UIcons
  cardEl.querySelector('.btn-auto-enrich-sec')?.addEventListener('click', () => {
    if (Array.isArray(section.bullets)) {
      section.bullets = enrichBullets(section.bullets);
    }
    if (section.keyPoint) {
      section.keyPoint = stripEmojis(section.keyPoint);
    }
    section.iconKey = getAcademicIconForText(`${section.title} ${section.keyPoint || ''}`);
    onChange(true);
  });

  // UIcon Chip click - Sets section's active iconKey
  cardEl.querySelectorAll('.uicon-chip').forEach(chip => {
    chip.addEventListener('click', (e) => {
      const iconKey = e.currentTarget.dataset.icon;
      section.iconKey = iconKey;
      cardEl.querySelectorAll('.uicon-chip').forEach(c => c.classList.remove('active'));
      e.currentTarget.classList.add('active');
      onChange(true);
    });
  });

  // Move Up
  const moveUpBtn = cardEl.querySelector('.btn-move-up');
  moveUpBtn?.addEventListener('click', () => {
    if (sIdx > 0) {
      const temp = sections[sIdx];
      sections[sIdx] = sections[sIdx - 1];
      sections[sIdx - 1] = temp;
      onChange(true);
    }
  });

  // Move Down
  const moveDownBtn = cardEl.querySelector('.btn-move-down');
  moveDownBtn?.addEventListener('click', () => {
    if (sIdx < sections.length - 1) {
      const temp = sections[sIdx];
      sections[sIdx] = sections[sIdx + 1];
      sections[sIdx + 1] = temp;
      onChange(true);
    }
  });

  // Delete Section
  const delBtn = cardEl.querySelector('.btn-delete-section');
  delBtn?.addEventListener('click', () => {
    if (confirm(`هل أنت متأكد من حذف المبحث "${section.title || sIdx + 1}" مع كافة مطالبه ومحتوياته؟`)) {
      sections.splice(sIdx, 1);
      onChange(true);
    }
  });

  // Paragraph inputs
  const pContainer = cardEl.querySelector('.paragraphs-list-container');
  pContainer.addEventListener('input', (e) => {
    if (e.target.classList.contains('paragraph-textarea')) {
      const row = e.target.closest('.removable-input-row');
      const pIdx = parseInt(row.dataset.pIndex, 10);
      section.paragraphs[pIdx] = e.target.value;
      onChange();
    }
  });

  pContainer.addEventListener('click', (e) => {
    if (e.target.closest('.btn-remove-paragraph')) {
      const row = e.target.closest('.removable-input-row');
      const pIdx = parseInt(row.dataset.pIndex, 10);
      section.paragraphs.splice(pIdx, 1);
      onChange(true);
    }
  });

  // Add Paragraph button
  cardEl.querySelector('.btn-add-paragraph')?.addEventListener('click', () => {
    if (!section.paragraphs) section.paragraphs = [];
    section.paragraphs.push('');
    onChange(true);
  });

  // Bullet inputs
  const bContainer = cardEl.querySelector('.bullets-list-container');
  bContainer.addEventListener('input', (e) => {
    if (e.target.classList.contains('bullet-input')) {
      const row = e.target.closest('.removable-input-row');
      const bIdx = parseInt(row.dataset.bIndex, 10);
      section.bullets[bIdx] = e.target.value;
      onChange();
    }
  });

  bContainer.addEventListener('click', (e) => {
    if (e.target.closest('.btn-remove-bullet')) {
      const row = e.target.closest('.removable-input-row');
      const bIdx = parseInt(row.dataset.bIndex, 10);
      section.bullets.splice(bIdx, 1);
      onChange(true);
    }
  });

  // Add Bullet button
  cardEl.querySelector('.btn-add-bullet')?.addEventListener('click', () => {
    if (!section.bullets) section.bullets = [];
    section.bullets.push('');
    onChange(true);
  });

  // KeyPoint input
  const kpInput = cardEl.querySelector('.keypoint-input');
  kpInput?.addEventListener('input', (e) => {
    section.keyPoint = e.target.value;
    onChange();
  });

  // Statistics inputs
  const statContainer = cardEl.querySelector('.stats-list-container');
  statContainer.addEventListener('input', (e) => {
    const row = e.target.closest('.stat-input-row');
    if (!row) return;
    const stIdx = parseInt(row.dataset.statIndex, 10);
    if (!section.statistics[stIdx]) section.statistics[stIdx] = {};

    if (e.target.classList.contains('stat-label-input')) {
      section.statistics[stIdx].label = e.target.value;
    } else if (e.target.classList.contains('stat-value-input')) {
      section.statistics[stIdx].value = e.target.value;
    } else if (e.target.classList.contains('stat-unit-input')) {
      section.statistics[stIdx].unit = e.target.value;
    }
    onChange();
  });

  statContainer.addEventListener('click', (e) => {
    if (e.target.closest('.btn-remove-stat')) {
      const row = e.target.closest('.stat-input-row');
      const stIdx = parseInt(row.dataset.statIndex, 10);
      section.statistics.splice(stIdx, 1);
      onChange(true);
    }
  });

  cardEl.querySelector('.btn-add-stat')?.addEventListener('click', () => {
    if (!section.statistics) section.statistics = [];
    section.statistics.push({ label: '', value: '', unit: '' });
    onChange(true);
  });

  // Subsections handling
  cardEl.querySelector('.btn-add-subsection')?.addEventListener('click', () => {
    if (!section.subsections) section.subsections = [];
    section.subsections.push({
      id: `sub-${Date.now()}-${section.subsections.length + 1}`,
      title: '',
      paragraphs: [''],
      bullets: []
    });
    onChange(true);
  });

  const subList = cardEl.querySelector('.subsections-list');
  subList.addEventListener('input', (e) => {
    const subCard = e.target.closest('.subsection-card');
    if (!subCard) return;
    const subId = subCard.dataset.subId;
    const sub = section.subsections.find(s => s.id === subId);
    if (!sub) return;

    if (e.target.classList.contains('sub-title-input')) {
      sub.title = e.target.value;
    } else if (e.target.classList.contains('sub-paragraphs-input')) {
      sub.paragraphs = e.target.value.split('\n').filter(p => p.trim());
    } else if (e.target.classList.contains('sub-bullets-input')) {
      sub.bullets = e.target.value.split('|').map(b => b.trim()).filter(Boolean);
    }
    onChange();
  });

  subList.addEventListener('click', (e) => {
    const subCard = e.target.closest('.subsection-card');
    if (!subCard) return;
    const subId = subCard.dataset.subId;
    const subIdx = section.subsections.findIndex(s => s.id === subId);
    if (subIdx === -1) return;

    if (e.target.closest('.btn-delete-sub')) {
      if (confirm('حذف هذا المطلب الفرعي؟')) {
        section.subsections.splice(subIdx, 1);
        onChange(true);
      }
    } else if (e.target.closest('.btn-sub-move-up') && subIdx > 0) {
      const temp = section.subsections[subIdx];
      section.subsections[subIdx] = section.subsections[subIdx - 1];
      section.subsections[subIdx - 1] = temp;
      onChange(true);
    } else if (e.target.closest('.btn-sub-move-down') && subIdx < section.subsections.length - 1) {
      const temp = section.subsections[subIdx];
      section.subsections[subIdx] = section.subsections[subIdx + 1];
      section.subsections[subIdx + 1] = temp;
      onChange(true);
    }
  });
}

function escapeHtml(str) {
  if (!str) return '';
  return String(str)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;');
}

function escapeAttr(str) {
  if (!str) return '';
  return String(str)
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#39;');
}
