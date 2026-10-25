/**
 * Central Reactive Application State Manager
 * Connects Editor, Domain Classification, Slide Splitting, Theme, and Preview.
 */

import { createEmptyDraft, loadDraftFromStorage, saveDraftToStorage } from '../storage/draft-storage.js';
import { classifyDomain } from '../classifier/domain-classifier.js';
import { splitDraftIntoSlides } from '../engine/slide-splitter.js';
import { setActiveTheme, getActiveTheme } from '../design/theme-manager.js';
import { getDefaultVariantForDomain, THEME_VARIANTS } from '../design/domain-themes.js';
import { validateDraft } from '../editor/validation.js';

class AppStateManager {
  constructor() {
    this.draft = loadDraftFromStorage() || createEmptyDraft();
    if (!this.draft.themeVariant) {
      this.draft.themeVariant = 'econ-trend';
    }
    this.domainResult = null;
    this.activeDomain = this.draft.domain && this.draft.domain !== 'auto' ? this.draft.domain : 'economics';
    this.density = this.draft.density || 'standard';
    this.generatedSlides = [];
    this.activeSlideIndex = 0;
    this.validation = { isValid: true, errors: [], warnings: [] };
    this.activeView = 'editor'; // 'editor' | 'preview'
    this.listeners = [];

    this.recomputeAll();
  }

  subscribe(listener) {
    this.listeners.push(listener);
    return () => {
      this.listeners = this.listeners.filter(l => l !== listener);
    };
  }

  notify(event, payload) {
    this.listeners.forEach(fn => fn(event, payload, this));
  }

  recomputeAll() {
    // 1. Validate
    this.validation = validateDraft(this.draft);

    // 2. Classify domain
    this.domainResult = classifyDomain(this.draft);

    // 3. Resolve active domain (auto or manual override)
    if (this.draft.domain && this.draft.domain !== 'auto') {
      this.activeDomain = this.draft.domain;
    } else {
      this.activeDomain = this.domainResult?.selectedDomain || 'economics';
    }

    // 4. Resolve theme
    let theme = null;
    if (this.draft.themeVariant && THEME_VARIANTS[this.draft.themeVariant]) {
      theme = THEME_VARIANTS[this.draft.themeVariant];
    } else {
      theme = THEME_VARIANTS['econ-trend'];
    }
    setActiveTheme(theme.id);

    // 5. Generate slides
    this.generatedSlides = splitDraftIntoSlides(this.draft, this.density);

    if (this.activeSlideIndex >= this.generatedSlides.length) {
      this.activeSlideIndex = Math.max(0, this.generatedSlides.length - 1);
    }

    // 6. Save draft
    saveDraftToStorage(this.draft);
  }

  updateDraft(newDraft, shouldRegenerate = false) {
    this.draft = newDraft;
    if (shouldRegenerate) {
      this.recomputeAll();
      this.notify('deck-regenerated');
    } else {
      // Re-run domain classifier and validation on draft edits
      this.validation = validateDraft(this.draft);
      this.domainResult = classifyDomain(this.draft);
      if (!this.draft.domain || this.draft.domain === 'auto') {
        this.activeDomain = this.domainResult?.selectedDomain || 'economics';
        const defaultTh = getDefaultVariantForDomain(this.activeDomain);
        if (!this.draft.themeVariant) {
          setActiveTheme(defaultTh?.id || 'econ-trend');
        }
      }
      this.generatedSlides = splitDraftIntoSlides(this.draft, this.density);
      saveDraftToStorage(this.draft);
      this.notify('draft-updated');
    }
  }

  setDomainOverride(domainId) {
    this.draft.domain = domainId; // 'auto' or explicit
    this.recomputeAll();
    this.notify('domain-changed');
  }

  setThemeVariant(variantId) {
    this.draft.themeVariant = variantId;
    setActiveTheme(variantId);
    saveDraftToStorage(this.draft);
    this.notify('theme-changed');
  }

  setDensity(density) {
    this.density = density;
    this.draft.density = density;
    this.recomputeAll();
    this.notify('density-changed');
  }

  setView(viewName) {
    this.activeView = viewName;
    this.notify('view-changed', viewName);
  }

  setActiveSlideIndex(idx) {
    if (idx >= 0 && idx < this.generatedSlides.length) {
      this.activeSlideIndex = idx;
      this.notify('slide-index-changed', idx);
    }
  }

  nextSlide() {
    if (this.activeSlideIndex < this.generatedSlides.length - 1) {
      this.setActiveSlideIndex(this.activeSlideIndex + 1);
      return true;
    }
    return false;
  }

  prevSlide() {
    if (this.activeSlideIndex > 0) {
      this.setActiveSlideIndex(this.activeSlideIndex - 1);
      return true;
    }
    return false;
  }

  resetDraft() {
    this.draft = createEmptyDraft();
    this.recomputeAll();
    this.notify('draft-reset');
  }
}

export const appState = new AppStateManager();
