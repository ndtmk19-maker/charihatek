/**
 * Structured Research Editor Controller
 * Connects research draft data to the DOM forms and synchronizes updates with app state.
 */

import { renderSectionsList } from './sections.js';
import { PRESET_DRAFTS } from '../app/presets.js';

export class StructuredEditor {
  constructor(options = {}) {
    this.draft = options.draft || null;
    this.onDraftChange = options.onDraftChange || (() => {});
    this.container = options.container || null;
  }

  setDraft(draft) {
    this.draft = draft;
    this.populateForm();
  }

  init() {
    this.bindStaticFormFields();
    this.populateForm();
  }

  bindStaticFormFields() {
    // Title
    const titleEl = document.getElementById('field-title');
    titleEl?.addEventListener('input', (e) => {
      this.draft.title = e.target.value;
      this.notify(false);
    });

    // Author
    const authorEl = document.getElementById('field-author');
    authorEl?.addEventListener('input', (e) => {
      this.draft.author = e.target.value;
      this.notify(false);
    });

    // Institution
    const instEl = document.getElementById('field-institution');
    instEl?.addEventListener('input', (e) => {
      this.draft.institution = e.target.value;
      this.notify(false);
    });

    // Faculty
    const facEl = document.getElementById('field-faculty');
    facEl?.addEventListener('input', (e) => {
      this.draft.faculty = e.target.value;
      this.notify(false);
    });

    // Course
    const courseEl = document.getElementById('field-course');
    courseEl?.addEventListener('input', (e) => {
      this.draft.course = e.target.value;
      this.notify(false);
    });

    // Instructor
    const instrEl = document.getElementById('field-instructor');
    instrEl?.addEventListener('input', (e) => {
      this.draft.instructor = e.target.value;
      this.notify(false);
    });

    // Language
    const langEl = document.getElementById('field-language');
    langEl?.addEventListener('change', (e) => {
      this.draft.language = e.target.value;
      this.notify(true);
    });

    // Introduction & Methodology
    const introEl = document.getElementById('field-introduction');
    introEl?.addEventListener('input', (e) => {
      this.draft.introduction = e.target.value;
      this.notify(false);
    });

    const introProbEl = document.getElementById('field-intro-problem');
    introProbEl?.addEventListener('input', (e) => {
      this.draft.problemStatement = e.target.value;
      this.notify(false);
    });

    const introObjEl = document.getElementById('field-intro-objectives');
    introObjEl?.addEventListener('input', (e) => {
      this.draft.objectives = e.target.value.split('\n').map(l => l.trim()).filter(Boolean);
      this.notify(false);
    });

    // Conclusion
    const concEl = document.getElementById('field-conclusion');
    concEl?.addEventListener('input', (e) => {
      this.draft.conclusion = e.target.value;
      this.notify(false);
    });

    // References
    const refEl = document.getElementById('field-references');
    refEl?.addEventListener('input', (e) => {
      this.draft.references = e.target.value.split('\n').filter(r => r.trim());
      this.notify(false);
    });

    // Add Section button
    const addSecBtn = document.getElementById('btn-add-section');
    addSecBtn?.addEventListener('click', () => {
      if (!this.draft.sections) this.draft.sections = [];
      const newSecNum = this.draft.sections.length + 1;
      this.draft.sections.push({
        id: `section-${Date.now()}-${newSecNum}`,
        title: `المبحث ${newSecNum}: `,
        paragraphs: [''],
        bullets: [],
        subsections: []
      });
      this.renderSections();
      this.notify(true);
    });

    // Preset Select Dropdown
    const presetSelect = document.getElementById('select-preset');
    presetSelect?.addEventListener('change', (e) => {
      const key = e.target.value;
      if (key && PRESET_DRAFTS[key]) {
        if (confirm('هل ترغب في تحميل هذا النموذج الأكاديمي واستبدال المسودة الحالية؟')) {
          this.draft = JSON.parse(JSON.stringify(PRESET_DRAFTS[key]));
          this.populateForm();
          this.notify(true);
        }
      }
      e.target.value = '';
    });
  }

  populateForm() {
    if (!this.draft) return;

    setVal('field-title', this.draft.title);
    setVal('field-author', this.draft.author);
    setVal('field-institution', this.draft.institution);
    setVal('field-faculty', this.draft.faculty);
    setVal('field-course', this.draft.course);
    setVal('field-instructor', this.draft.instructor);
    setVal('field-language', this.draft.language || 'ar');
    setVal('field-introduction', this.draft.introduction);
    setVal('field-intro-problem', this.draft.problemStatement || '');
    setVal('field-intro-objectives', Array.isArray(this.draft.objectives) ? this.draft.objectives.join('\n') : (this.draft.objectives || ''));
    setVal('field-conclusion', this.draft.conclusion);
    setVal('field-references', (this.draft.references || []).join('\n'));

    this.renderSections();
  }

  renderSections() {
    const container = document.getElementById('sections-container');
    if (!container || !this.draft) return;
    renderSectionsList(this.draft.sections, container, (reRender) => {
      if (reRender) this.renderSections();
      this.notify(false);
    });
  }

  notify(shouldRegenerateSlides = false) {
    this.onDraftChange(this.draft, shouldRegenerateSlides);
  }
}

function setVal(id, val) {
  const el = document.getElementById(id);
  if (el) el.value = val || '';
}
