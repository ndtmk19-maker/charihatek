/**
 * Main Application Bootstrap - PPT-Master AI Presentation Studio
 * Integrates Google Gemini API, PPT-Master Prompting, Interactive 16:9 Live Preview,
 * and Native PowerPoint (.pptx) Export.
 */

import { appState } from './app/state.js';
import { AppRouter } from './app/router.js';
import { SlideNavigation } from './preview/slide-navigation.js';
import { renderSlideToHtml, renderSlideThumbnailHtml } from './preview/preview-renderer.js';
import { generatePptxDeck } from './export/generate-pptx.js';
import { exportPdfDeck } from './export/export-pdf.js';
import { THEME_VARIANTS } from './design/domain-themes.js';
import { ASSET_MANIFEST } from './design/asset-manifest.js';
import { saveApiKey, loadApiKey, hasApiKey, clearApiKey } from './storage/draft-storage.js';
import { generatePresentationWithAI, isValidApiKeyFormat } from './engine/ai-generator.js';

document.addEventListener('DOMContentLoaded', () => {
  // 1. Initialize View Router
  const router = new AppRouter(appState);

  // 2. Initialize Slide Navigation
  const slideNav = new SlideNavigation({
    appState: appState,
    onSlideChange: (index) => {
      renderActiveSlide();
      updateThumbnailsActiveState();
    }
  });

  // 3. Initialize API Key State & UI
  initApiKeyControls();

  // 4. Initialize AI Studio Generator Controls
  initAiGeneratorControls(router);

  // 4.5. Initialize 3-Step Studio Wizard Stepper
  setupStudioStepper();

  // 5. Bind Global Toolbar Controls & Exporters
  bindGlobalControls(router, slideNav);

  // 6. Initial Render
  updateAllUI();

  // 7. Subscribe to Reactive App State Changes
  appState.subscribe(() => {
    updateAllUI();
  });

  // Render Theme and Assets Catalogs
  renderThemeVariantsCatalog();
  renderAssetsCatalog();
});

/**
 * Initializes API Key Input, Persistence, and Status Badges
 */
function initApiKeyControls() {
  const inputEl = document.getElementById('input-api-key');
  const saveBtn = document.getElementById('btn-save-key');
  const clearBtn = document.getElementById('btn-clear-key');
  const toggleEyeBtn = document.getElementById('btn-toggle-key-visibility');

  // Load existing key
  const savedKey = loadApiKey();
  if (savedKey && inputEl) {
    inputEl.value = savedKey;
  }
  updateApiKeyStatusBadges(hasApiKey());

  // Save Key
  saveBtn?.addEventListener('click', () => {
    const key = (inputEl?.value || '').trim();
    if (!key) {
      alert('يرجى لصق مفتاح Google Gemini API أولاً.');
      return;
    }
    saveApiKey(key);
    updateApiKeyStatusBadges(true);
    showToast('✓ تم حفظ مفتاح API بنجاح في متصفحك');
  });

  // Clear Key
  clearBtn?.addEventListener('click', () => {
    if (confirm('هل ترغب في مسح مفتاح API المخزن؟')) {
      clearApiKey();
      if (inputEl) inputEl.value = '';
      updateApiKeyStatusBadges(false);
      showToast('تم مسح مفتاح API');
    }
  });

  // Toggle Visibility
  toggleEyeBtn?.addEventListener('click', () => {
    if (!inputEl) return;
    inputEl.type = inputEl.type === 'password' ? 'text' : 'password';
  });
}

/**
 * Updates API key status badges in header and card
 */
function updateApiKeyStatusBadges(isConfigured) {
  const headerBadge = document.getElementById('header-api-status');
  const headerText = document.getElementById('header-api-text');
  const cardBadge = document.getElementById('api-key-status-badge');
  const cardLabel = document.getElementById('api-status-label');

  if (isConfigured) {
    if (headerBadge) {
      headerBadge.className = 'api-status-badge active';
      headerText.textContent = 'مفتاح API نشط ومحفوظ';
    }
    if (cardBadge) {
      cardBadge.className = 'api-status-badge active';
      cardLabel.textContent = 'مفتاح API نشط ومحفوظ ✓';
    }
  } else {
    if (headerBadge) {
      headerBadge.className = 'api-status-badge missing';
      headerText.textContent = 'مفتاح API غير مدخل';
    }
    if (cardBadge) {
      cardBadge.className = 'api-status-badge missing';
      cardLabel.textContent = 'المفتاح غير محفوظ';
    }
  }
}

/**
 * Initializes AI Studio Generation Controls & Preset Topics
 */
function initAiGeneratorControls(router) {
  const generateBtn = document.getElementById('btn-generate-ai-deck');
  const progressCard = document.getElementById('ai-progress-card');
  const progressBarFill = document.getElementById('ai-progress-bar-fill');
  const progressText = document.getElementById('ai-progress-text');
  const resultsCard = document.getElementById('ai-results-card');

  // Live Research Plan Structure Pill Updates
  function updateStructurePill() {
    const mabhathCount = parseInt(document.getElementById('ai-mabhath-count')?.value, 10) || 3;
    const matlabCount = parseInt(document.getElementById('ai-matlab-count')?.value, 10) || 3;
    const slideCount = parseInt(document.getElementById('ai-slide-count')?.value, 10) || 16;
    const pill = document.getElementById('research-structure-pill');
    if (!pill) return;

    const totalMatalib = mabhathCount * matlabCount;
    pill.innerHTML = `<strong>الهيكل الأكاديمي المعتمد:</strong> غلاف رسمي + خطة العرض + مقدمة وإشكالية + <strong>${mabhathCount} مباحث رئيسية</strong> × <strong>${matlabCount} مطالب</strong> = <strong>${totalMatalib} مطالب تخصصية</strong> + خاتمة وتوصيات ومراجع (${slideCount} شريحة).`;
  }

  document.getElementById('ai-mabhath-count')?.addEventListener('change', updateStructurePill);
  document.getElementById('ai-matlab-count')?.addEventListener('change', updateStructurePill);
  document.getElementById('ai-slide-count')?.addEventListener('change', updateStructurePill);
  updateStructurePill();

  // Suggested Topics Preset Chips
  document.querySelectorAll('.ai-preset-chip').forEach(chip => {
    chip.addEventListener('click', () => {
      const prompt = chip.dataset.aiPreset;
      const topicInput = document.getElementById('ai-topic-prompt');
      if (topicInput && prompt) {
        topicInput.value = prompt;
        topicInput.focus();
        showToast('تم تعيين موضوع البحث');
      }
    });
  });

  // Jump to Preview from Result Card
  document.getElementById('btn-jump-to-preview')?.addEventListener('click', () => {
    router.navigateTo('preview');
  });

  // Direct PPTX Download from Result Card
  document.getElementById('btn-result-download-pptx')?.addEventListener('click', () => {
    triggerDeckExport();
  });

  // Direct PDF Export from Result Card
  document.getElementById('btn-result-download-pdf')?.addEventListener('click', () => {
    triggerPdfExport();
  });

  // Main AI Generation Click Handler
  generateBtn?.addEventListener('click', async () => {
    const inputKey = document.getElementById('input-api-key')?.value?.trim();
    const storedKey = loadApiKey();
    const apiKey = inputKey || storedKey;

    if (!apiKey) {
      alert('تنبيه: يُرجى إدخال مفتاح Google Gemini API في الخطوة الأولى للمتابعة.');
      // Switch back to Step 1
      const step1Nav = document.getElementById('step-nav-1');
      if (step1Nav) step1Nav.click();
      document.getElementById('input-api-key')?.focus();
      return;
    }

    // Auto-save if user entered a new key in the field
    if (inputKey && inputKey !== storedKey) {
      saveApiKey(inputKey);
      updateApiKeyStatusBadges(true);
    }

    const topic = document.getElementById('ai-topic-prompt')?.value?.trim();
    if (!topic) {
      alert('تنبيه: يُرجى إدخال عنوان أو موضوع البحث الأكاديمي أولاً.');
      document.getElementById('ai-topic-prompt')?.focus();
      return;
    }

    const academicDomain = document.getElementById('ai-academic-domain')?.value || 'auto';
    const degreeLevel = document.getElementById('ai-degree-level')?.value || 'master';
    const mabhathCount = parseInt(document.getElementById('ai-mabhath-count')?.value, 10) || 3;
    const matlabCount = parseInt(document.getElementById('ai-matlab-count')?.value, 10) || 3;
    const slideCount = parseInt(document.getElementById('ai-slide-count')?.value, 10) || 16;
    const language = document.getElementById('ai-language')?.value || 'ar';
    const selectedTheme = document.getElementById('ai-theme-variant')?.value || 'econ-trend';
    const aiModel = document.getElementById('select-ai-model')?.value || 'gemini-2.5-flash';

    const course = document.getElementById('ai-course')?.value?.trim() || '';
    const author = document.getElementById('ai-author')?.value?.trim() || '';
    const institution = document.getElementById('ai-institution')?.value?.trim() || '';
    const faculty = document.getElementById('ai-faculty')?.value?.trim() || '';
    const instructor = document.getElementById('ai-instructor')?.value?.trim() || '';

    // Show Progress State
    generateBtn.disabled = true;
    generateBtn.innerHTML = `<span>⏳</span><span>جاري توليد العرض الأكاديمي بالذكاء الاصطناعي...</span>`;
    progressCard?.classList.remove('hidden');
    resultsCard?.classList.add('hidden');

    try {
      const generatedDraft = await generatePresentationWithAI({
        apiKey,
        topic,
        academicDomain,
        degreeLevel,
        mabhathCount,
        matlabCount,
        slideCount,
        course,
        author,
        institution,
        faculty,
        instructor,
        language,
        model: aiModel,
        onProgress: ({ step, totalSteps, message }) => {
          if (progressText) progressText.textContent = message;
          if (progressBarFill) {
            const percent = Math.min(100, Math.round((step / totalSteps) * 100));
            progressBarFill.style.width = `${percent}%`;
          }
        }
      });

      // Apply Selected Theme (defaults to econ-trend)
      if (selectedTheme && selectedTheme !== 'auto' && THEME_VARIANTS[selectedTheme]) {
        generatedDraft.themeVariant = selectedTheme;
      } else if (!generatedDraft.themeVariant) {
        generatedDraft.themeVariant = 'econ-trend';
      }

      // Update App State & Slides
      appState.updateDraft(generatedDraft, true);

      // Hide progress, show results
      progressCard?.classList.add('hidden');
      if (resultsCard) {
        resultsCard.classList.remove('hidden');
        document.getElementById('result-deck-title').textContent = generatedDraft.title || topic;
        document.getElementById('result-slides-count-badge').textContent = `${appState.generatedSlides.length} شريحة`;
      }

      showToast('✨ تم توليد العرض الأكاديمي بنجاح بمنهجية PPT-Master!');
    } catch (err) {
      progressCard?.classList.add('hidden');
      alert(`حدث خطأ أثناء التوليد:\n${err.message}`);
    } finally {
      generateBtn.disabled = false;
      generateBtn.innerHTML = `<span>✨</span><span>توليد العرض الأكاديمي بالذكاء الاصطناعي (PPT-Master)</span>`;
    }
  });
}

/**
 * Initializes and manages the 3-step studio wizard stepper
 */
function setupStudioStepper() {
  const steps = [1, 2, 3];
  let currentStep = 1;

  function markStepComplete(stepNum) {
    const navEl = document.getElementById(`step-nav-${stepNum}`);
    const circleEl = document.getElementById(`step-circle-${stepNum}`);
    if (navEl) navEl.classList.add('completed');
    if (circleEl) circleEl.textContent = '✓';
  }

  function unmarkStepComplete(stepNum) {
    const navEl = document.getElementById(`step-nav-${stepNum}`);
    const circleEl = document.getElementById(`step-circle-${stepNum}`);
    if (navEl) navEl.classList.remove('completed');
    if (circleEl) circleEl.textContent = `${stepNum}`;
  }

  // Pre-mark Step 1 complete if API key already stored
  if (hasApiKey()) {
    markStepComplete(1);
  }

  function goToStep(targetStep) {
    if (targetStep < 1 || targetStep > 3) return;

    // Validation when leaving step 1
    if (targetStep > 1) {
      const inputKey = document.getElementById('input-api-key')?.value?.trim();
      const storedKey = loadApiKey();
      if (!inputKey && !storedKey) {
        alert('تنبيه: يُرجى إدخال وحفظ مفتاح Google Gemini API في الخطوة الأولى للمتابعة.');
        document.getElementById('input-api-key')?.focus();
        return;
      }
      if (inputKey && inputKey !== storedKey) {
        saveApiKey(inputKey);
        updateApiKeyStatusBadges(true);
      }
      markStepComplete(1);
    }

    if (targetStep > 2) {
      markStepComplete(2);
    }

    // Toggle panel visibility
    steps.forEach(s => {
      const panel = document.getElementById(`step-panel-${s}`);
      const nav = document.getElementById(`step-nav-${s}`);
      if (panel) {
        if (s === targetStep) {
          panel.classList.remove('hidden');
        } else {
          panel.classList.add('hidden');
        }
      }
      if (nav) {
        if (s === targetStep) {
          nav.classList.add('active');
        } else {
          nav.classList.remove('active');
        }
      }
    });

    // Update dividers
    const div1 = document.getElementById('step-divider-1');
    const div2 = document.getElementById('step-divider-2');
    if (div1) div1.classList.toggle('completed', targetStep >= 2);
    if (div2) div2.classList.toggle('completed', targetStep >= 3);

    currentStep = targetStep;

    // Scroll smoothly to stepper header
    const stepperHeader = document.getElementById('studio-stepper-header');
    if (stepperHeader) {
      stepperHeader.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
    }
  }

  // Bind Nav Step Clicks
  document.getElementById('step-nav-1')?.addEventListener('click', () => goToStep(1));
  document.getElementById('step-nav-2')?.addEventListener('click', () => goToStep(2));
  document.getElementById('step-nav-3')?.addEventListener('click', () => goToStep(3));

  // Bind Action Buttons
  document.getElementById('btn-step1-next')?.addEventListener('click', () => goToStep(2));
  document.getElementById('btn-step2-prev')?.addEventListener('click', () => goToStep(1));
  document.getElementById('btn-step2-next')?.addEventListener('click', () => goToStep(3));
  document.getElementById('btn-step3-prev')?.addEventListener('click', () => goToStep(2));

  // Listen to Clear Key to reset step 1 completion check
  document.getElementById('btn-clear-key')?.addEventListener('click', () => {
    unmarkStepComplete(1);
  });
}

/**
 * Updates all reactive UI elements across views
 */
function updateAllUI() {
  updateSidebarStats();
  updatePreviewFilmstrip();
  renderActiveSlide();
  updateHeaderCounters();
}

/**
 * Updates current deck status in sidebar
 */
function updateSidebarStats() {
  const totalSlidesEl = document.getElementById('sidebar-total-slides');
  const domainNameEl = document.getElementById('sidebar-domain-name');
  const themeNameEl = document.getElementById('sidebar-theme-name');

  if (totalSlidesEl) {
    totalSlidesEl.textContent = `${appState.generatedSlides.length} شريحة`;
  }

  const domainLabels = {
    technology: 'التكنولوجيا والذكاء الاصطناعي',
    management: 'إدارة الأعمال والمؤسسات',
    economics: 'العلوم الاقتصادية والمالية',
    medicine: 'العلوم الطبية والصحية',
    accounting: 'المحاسبة والتدقيق المالي',
    general: 'العلوم العامة والإنسانية'
  };

  if (domainNameEl) {
    domainNameEl.textContent = domainLabels[appState.activeDomain] || 'عام / تلقائي';
  }

  if (themeNameEl) {
    const currentTheme = THEME_VARIANTS[appState.draft.themeVariant];
    themeNameEl.textContent = currentTheme ? currentTheme.nameAr : 'تلقائي حسب التخصص';
  }
}

/**
 * Updates thumbnails filmstrip in Preview View
 */
function updatePreviewFilmstrip() {
  const container = document.getElementById('thumbnails-list-container');
  const counterEl = document.getElementById('thumbs-counter');
  if (!container) return;

  const slides = appState.generatedSlides;
  if (counterEl) counterEl.textContent = `${slides.length} شريحة`;

  const theme = THEME_VARIANTS[appState.draft.themeVariant] || THEME_VARIANTS['mgmt-navy-gold'];

  container.innerHTML = slides.map((s, idx) => {
    const isActive = idx === appState.activeSlideIndex;
    return renderSlideThumbnailHtml(s, idx, isActive, appState.activeDomain, theme);
  }).join('');

  // Bind click on thumbnails
  container.querySelectorAll('.slide-thumb-card').forEach(card => {
    card.addEventListener('click', () => {
      const idx = parseInt(card.dataset.slideIndex, 10);
      appState.setActiveSlideIndex(idx);
      renderActiveSlide();
      updateThumbnailsActiveState();
    });
  });
}

function updateThumbnailsActiveState() {
  const cards = document.querySelectorAll('.slide-thumb-card');
  cards.forEach((card, idx) => {
    if (idx === appState.activeSlideIndex) {
      card.classList.add('active');
      card.scrollIntoView({ block: 'nearest', behavior: 'smooth' });
    } else {
      card.classList.remove('active');
    }
  });

  const counterDisplay = document.getElementById('viewer-counter-display');
  if (counterDisplay) {
    counterDisplay.textContent = `${appState.activeSlideIndex + 1} / ${appState.generatedSlides.length || 1}`;
  }
}

/**
 * Renders the active slide in 16:9 canvas
 */
function renderActiveSlide() {
  const target = document.getElementById('active-slide-render-target');
  if (!target) return;

  const currentSlide = appState.generatedSlides[appState.activeSlideIndex];
  if (!currentSlide) {
    target.innerHTML = `<div style="color: #ffffff; text-align: center; padding: 3rem;">لا توجد شرائح حالياً. استخدم استوديو الذكاء الاصطناعي لتوليد العرض.</div>`;
    return;
  }

  const theme = THEME_VARIANTS[appState.draft.themeVariant] || THEME_VARIANTS['mgmt-navy-gold'];
  const html = renderSlideToHtml(currentSlide, appState.activeDomain, theme, appState.density);
  target.innerHTML = html;
}

function updateHeaderCounters() {
  const tabCount = document.getElementById('tab-slide-count');
  if (tabCount) tabCount.textContent = appState.generatedSlides.length.toString();
}

/**
 * Triggers PPTX presentation generation & download
 */
async function triggerDeckExport(btnEl = null) {
  if (!appState.generatedSlides || appState.generatedSlides.length === 0) {
    alert('لا توجد شرائح لتصديرها حالياً. يرجى توليد العرض أولاً.');
    return;
  }

  const originalContent = btnEl ? btnEl.innerHTML : null;
  if (btnEl) {
    btnEl.disabled = true;
    btnEl.innerHTML = `<span>⏳ جاري إنشاء ملف PPTX...</span>`;
  }

  try {
    const theme = THEME_VARIANTS[appState.draft.themeVariant] || THEME_VARIANTS['mgmt-navy-gold'];
    const res = await generatePptxDeck(
      appState.generatedSlides,
      appState.activeDomain,
      theme,
      {
        title: appState.draft.title,
        author: appState.draft.author
      }
    );
    showToast(`✓ تم تحميل ملف PowerPoint بنجاح: ${res.fileName}`);
  } catch (err) {
    alert(err.message || 'حدث خطأ أثناء تصدير ملف PowerPoint');
  } finally {
    if (btnEl && originalContent) {
      btnEl.disabled = false;
      btnEl.innerHTML = originalContent;
    }
  }
}

/**
 * Triggers High-Fidelity PDF Export of all slides
 */
async function triggerPdfExport(btnEl = null) {
  if (!appState.generatedSlides || appState.generatedSlides.length === 0) {
    alert('لا توجد شرائح لتصديرها حالياً. يرجى توليد العرض أولاً.');
    return;
  }

  const originalContent = btnEl ? btnEl.innerHTML : null;
  if (btnEl) {
    btnEl.disabled = true;
    btnEl.innerHTML = `<span>⏳ جاري تجهيز PDF...</span>`;
  }

  try {
    showToast('📄 جاري فتح نافذة تصدير PDF... اختر "حفظ بتنسيق PDF" بأبعاد أفقية');
    const theme = THEME_VARIANTS[appState.draft.themeVariant] || THEME_VARIANTS['mgmt-navy-gold'];
    await exportPdfDeck(
      appState.generatedSlides,
      appState.activeDomain,
      theme,
      appState.density,
      {
        title: appState.draft.title,
        author: appState.draft.author
      }
    );
  } catch (err) {
    alert(err.message || 'حدث خطأ أثناء تصدير ملف PDF');
  } finally {
    if (btnEl && originalContent) {
      btnEl.disabled = false;
      btnEl.innerHTML = originalContent;
    }
  }
}

/**
 * Binds toolbar, preview navigation, and exporter buttons
 */
function bindGlobalControls(router, slideNav) {
  // Navigation Next/Prev
  document.getElementById('btn-next-slide')?.addEventListener('click', () => slideNav.next());
  document.getElementById('btn-prev-slide')?.addEventListener('click', () => slideNav.prev());
  document.getElementById('btn-fs-next')?.addEventListener('click', (e) => {
    e.stopPropagation();
    slideNav.next();
  });
  document.getElementById('btn-fs-prev')?.addEventListener('click', (e) => {
    e.stopPropagation();
    slideNav.prev();
  });

  // Fullscreen
  document.getElementById('btn-fullscreen-toggle')?.addEventListener('click', () => {
    const stage = document.getElementById('presentation-fullscreen-target');
    if (stage) slideNav.toggleFullscreen(stage);
  });

  // Return to Studio Button from Preview
  document.getElementById('btn-return-to-studio')?.addEventListener('click', () => {
    router.navigateTo('editor');
  });

  // Jump to Preview button from Editor Sidebar
  document.getElementById('btn-goto-preview')?.addEventListener('click', () => {
    router.navigateTo('preview');
  });

  // Global PPTX Export Button in Header
  document.getElementById('btn-global-export-pptx')?.addEventListener('click', function() {
    triggerDeckExport(this);
  });

  // Global PDF Export Button in Header
  document.getElementById('btn-global-export-pdf')?.addEventListener('click', function() {
    triggerPdfExport(this);
  });

  // Preview PPTX Export Button in Viewer Toolbar
  document.getElementById('btn-preview-export-pptx')?.addEventListener('click', function() {
    triggerDeckExport(this);
  });

  // Preview PDF Export Button in Viewer Toolbar
  document.getElementById('btn-preview-export-pdf')?.addEventListener('click', function() {
    triggerPdfExport(this);
  });
}

/**
 * Renders all 18 Theme Variants Cards in Settings View
 */
function renderThemeVariantsCatalog() {
  const container = document.getElementById('theme-variants-grid');
  if (!container) return;

  container.innerHTML = Object.values(THEME_VARIANTS).map(t => {
    const isCurrent = (appState.draft.themeVariant === t.id) ||
      (!appState.draft.themeVariant && t.domain === appState.activeDomain);

    return `
      <div class="sidebar-card" style="border: 2px solid ${isCurrent ? t.primary : 'var(--app-border)'}; cursor: pointer; position: relative;" data-theme-id="${t.id}">
        ${isCurrent ? `<span style="position: absolute; top: 10px; left: 10px; background: ${t.primary}; color: #ffffff; font-size: 0.7rem; font-weight: 700; padding: 2px 8px; border-radius: 4px;">النمط النشط ✓</span>` : ''}
        <h4 style="font-size: 0.95rem; font-weight: 700; color: ${t.primary}; margin-bottom: 0.4rem;">
          ${t.nameAr}
        </h4>
        <div style="font-size: 0.75rem; color: var(--app-text-muted); margin-bottom: 0.75rem;">
          ${t.nameEn}
        </div>

        <!-- Color Swatches -->
        <div style="display: flex; gap: 6px; margin-bottom: 0.75rem;">
          <div style="width: 24px; height: 24px; border-radius: 4px; background: ${t.primary};" title="اللون الأساسي"></div>
          <div style="width: 24px; height: 24px; border-radius: 4px; background: ${t.secondary};" title="اللون الثانوي"></div>
          <div style="width: 24px; height: 24px; border-radius: 4px; background: ${t.accent};" title="لون التمييز"></div>
          <div style="width: 24px; height: 24px; border-radius: 4px; background: ${t.background}; border: 1px solid #ccc;" title="لون الخلفية"></div>
          <div style="width: 24px; height: 24px; border-radius: 4px; background: ${t.headerBg};" title="لون الترويسة"></div>
        </div>

        <button type="button" class="btn btn-secondary btn-sm" style="width: 100%; border-color: ${t.primary}; color: ${t.primary};">
          تطبيق هذا النمط
        </button>
      </div>
    `;
  }).join('');

  container.querySelectorAll('[data-theme-id]').forEach(card => {
    card.addEventListener('click', () => {
      const thId = card.getAttribute('data-theme-id');
      appState.setThemeVariant(thId);
      renderThemeVariantsCatalog();
      showToast(`تم تفعيل النمط: ${THEME_VARIANTS[thId]?.nameAr}`);
    });
  });
}

/**
 * Renders local SVG assets in Settings View
 */
function renderAssetsCatalog() {
  const container = document.getElementById('assets-grid-container');
  if (!container) return;

  container.innerHTML = ASSET_MANIFEST.map(a => `
    <div style="background: #ffffff; border: 1px solid var(--app-border); border-radius: var(--radius-md); padding: 0.85rem; text-align: center;">
      <img src="${a.path}" style="width: 48px; height: 48px; margin-bottom: 0.5rem;" alt="${a.alt}" />
      <div style="font-size: 0.8rem; font-weight: 700; color: var(--app-text);">${a.alt}</div>
      <div style="font-size: 0.7rem; color: var(--app-text-muted);">${a.domain}</div>
    </div>
  `).join('');
}

/**
 * Toast Notification Utility
 */
function showToast(msg) {
  const existing = document.getElementById('app-toast-alert');
  if (existing) existing.remove();

  const toast = document.createElement('div');
  toast.id = 'app-toast-alert';
  toast.style.cssText = `
    position: fixed;
    bottom: 20px;
    left: 50%;
    transform: translateX(-50%);
    max-width: calc(100vw - 32px);
    width: max-content;
    background: #0f172a;
    color: #ffffff;
    padding: 10px 18px;
    border-radius: 8px;
    font-size: 0.88rem;
    font-weight: 600;
    box-shadow: 0 10px 25px -3px rgba(0,0,0,0.4);
    border: 1px solid #1e2e4a;
    z-index: 9999;
    text-align: center;
    direction: rtl;
    animation: fadeIn 0.2s ease-in-out;
  `;
  toast.textContent = msg;
  document.body.appendChild(toast);

  setTimeout(() => {
    toast.remove();
  }, 3500);
}
