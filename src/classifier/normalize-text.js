/**
 * Text Normalization for Multilingual Academic Drafts
 * Supports Arabic, French, and English text processing without external AI.
 */

export function normalizeArabic(text) {
  if (!text) return '';
  return text
    // Remove Tashkeel (diacritics)
    .replace(/[\u064B-\u065F\u0670]/g, '')
    // Remove Tatweel (kashida)
    .replace(/\u0640/g, '')
    // Normalize Alef forms
    .replace(/[إأآٱ]/g, 'ا')
    // Normalize Alif Maqsura to Yaa for keyword matching
    .replace(/ى/g, 'ي')
    // Normalize Taa Marbouta to Haa
    .replace(/ة/g, 'ه')
    // Normalize Persian/Urdu Yeh and Kaf if any
    .replace(/ي/g, 'ي')
    .replace(/ك/g, 'ك')
    // Remove Arabic and standard punctuation
    .replace(/[،؛؟«»""''!?:;.\-–—()\[\]{}]/g, ' ')
    // Normalize whitespaces
    .replace(/\s+/g, ' ')
    .trim();
}

export function normalizeLatin(text) {
  if (!text) return '';
  return text
    .toLowerCase()
    // Normalize accents for fuzzy matching (e.g., é -> e, è -> e)
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    // Replace punctuation with spaces
    .replace(/[.,/#!$%^&*;:{}=\-_`~()?"'«»]/g, ' ')
    .replace(/\s+/g, ' ')
    .trim();
}

/**
 * Universal text normalizer that prepares text for keyword searching
 */
export function normalizeText(text) {
  if (!text) return '';
  const str = String(text);
  // Arabic normalization + Latin lowercasing
  return normalizeArabic(str)
    .toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/[.,/#!$%^&*;:{}=\-_`~()?"'«»]/g, ' ')
    .replace(/\s+/g, ' ')
    .trim();
}

/**
 * Splits text into normalized tokens
 */
export function tokenize(text) {
  const norm = normalizeText(text);
  if (!norm) return [];
  return norm.split(/\s+/).filter(w => w.length > 1);
}

/**
 * Check if a normalized text contains a keyword or phrase
 */
export function textContainsPhrase(normalizedText, normalizedPhrase) {
  if (!normalizedText || !normalizedPhrase) return false;
  // Use word boundary check or exact substring if multi-word
  if (normalizedPhrase.includes(' ')) {
    return normalizedText.includes(normalizedPhrase);
  }
  // Single word boundary
  const words = normalizedText.split(' ');
  return words.includes(normalizedPhrase);
}
