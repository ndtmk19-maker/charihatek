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
 * Creates a clean, empty draft for new visitors (0 slides until user generates)
 */
export function createEmptyDraft() {
  return {
    id: `draft-${Date.now()}`,
    title: '',
    author: '',
    institution: '',
    faculty: '',
    course: '',
    instructor: '',
    date: '',
    language: 'ar',
    domain: 'general',
    density: 'standard', // compact | standard | detailed
    themeVariant: 'econ-trend', // 'مؤشرات التداول (بترولي وعنبر دافئ)' كـ default
    introduction: '',
    sections: [],
    conclusion: '',
    conclusionPoints: [],
    references: []
  };
}

/**
 * Saves current draft to LocalStorage (only if it contains actual content)
 */
export function saveDraftToStorage(draft) {
  try {
    if (!draft || (!draft.title && (!Array.isArray(draft.sections) || draft.sections.length === 0))) {
      return false;
    }
    localStorage.setItem(STORAGE_KEY_DRAFT, JSON.stringify(draft));
    return true;
  } catch (err) {
    console.warn('LocalStorage save failed:', err);
    return false;
  }
}

/**
 * Loads current draft from LocalStorage
 * Automatically purges legacy dummy showcase research so new/returning visitors start at 0 slides
 */
export function loadDraftFromStorage() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY_DRAFT);
    if (raw) {
      const data = JSON.parse(raw);
      // Clean up legacy dummy research presentation if present in storage
      if (data && (
        data.title === 'أثر التحول الرقمي والذكاء الاصطناعي في تحسين كفاءة الأداء المؤسسي والحوكمة' ||
        data.author === 'أحمد بن علي الزهراني'
      )) {
        localStorage.removeItem(STORAGE_KEY_DRAFT);
        return null;
      }
      // If draft is completely empty, treat as null
      if (!data || (!data.title && (!Array.isArray(data.sections) || data.sections.length === 0))) {
        return null;
      }
      return data;
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
