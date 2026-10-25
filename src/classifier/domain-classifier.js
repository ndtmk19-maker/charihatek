/**
 * Deterministic Rule-Based Domain Classifier
 * Evaluates academic drafts against multilingual keyword dictionaries.
 * No AI or external services used.
 */

import { normalizeText, textContainsPhrase } from './normalize-text.js';
import { DOMAINS, DOMAIN_KEYWORDS, SCORING_WEIGHTS, DOMAIN_METADATA } from './domain-dictionaries.js';

// Pre-normalize the dictionaries for high-speed matching
const NORMALIZED_DICTIONARY = {};
for (const domain of Object.values(DOMAINS)) {
  NORMALIZED_DICTIONARY[domain] = (DOMAIN_KEYWORDS[domain] || []).map(kw => ({
    raw: kw,
    norm: normalizeText(kw),
    isMultiword: kw.includes(' ')
  }));
}

/**
 * Counts keyword matches in a given text segment
 * Avoids duplicate overcounting by checking each unique keyword match.
 */
function matchKeywordsInSegment(text, domain) {
  if (!text) return { count: 0, matchedWords: [] };
  const normalizedText = normalizeText(text);
  if (!normalizedText) return { count: 0, matchedWords: [] };

  const keywords = NORMALIZED_DICTIONARY[domain] || [];
  let matches = 0;
  const matchedWords = [];

  for (const item of keywords) {
    if (textContainsPhrase(normalizedText, item.norm)) {
      matches += 1;
      matchedWords.push(item.raw);
    }
  }

  return { count: matches, matchedWords };
}

/**
 * Classifies a structured presentation draft
 * @param {Object} draft - Structured presentation draft
 * @returns {Object} Classification result with scores, detected domain, and confidence
 */
export function classifyDomain(draft) {
  const scores = {};
  const matchedKeywords = {};
  const breakdown = {};

  for (const domain of Object.values(DOMAINS)) {
    scores[domain] = 0;
    matchedKeywords[domain] = new Set();
    breakdown[domain] = {
      titleMatches: 0,
      sectionMatches: 0,
      introMatches: 0,
      bodyMatches: 0
    };

    // 1. Title matching (Weight: 5)
    if (draft.title) {
      const match = matchKeywordsInSegment(draft.title, domain);
      if (match.count > 0) {
        const points = match.count * SCORING_WEIGHTS.TITLE;
        scores[domain] += points;
        breakdown[domain].titleMatches += match.count;
        match.matchedWords.forEach(w => matchedKeywords[domain].add(w));
      }
    }

    // 2. Introduction matching (Weight: 2)
    if (draft.introduction) {
      const match = matchKeywordsInSegment(draft.introduction, domain);
      if (match.count > 0) {
        const points = match.count * SCORING_WEIGHTS.INTRODUCTION;
        scores[domain] += points;
        breakdown[domain].introMatches += match.count;
        match.matchedWords.forEach(w => matchedKeywords[domain].add(w));
      }
    }

    // 3. Sections matching
    if (Array.isArray(draft.sections)) {
      for (const section of draft.sections) {
        // Section Title (Weight: 3)
        if (section.title) {
          const sMatch = matchKeywordsInSegment(section.title, domain);
          if (sMatch.count > 0) {
            scores[domain] += sMatch.count * SCORING_WEIGHTS.SECTION_TITLE;
            breakdown[domain].sectionMatches += sMatch.count;
            sMatch.matchedWords.forEach(w => matchedKeywords[domain].add(w));
          }
        }

        // Section Paragraphs & Bullets (Weight: 1)
        const bodyContent = [
          ...(section.paragraphs || []),
          ...(section.bullets || []),
          ...(section.numbered || []),
          ...(section.keyPoints || [])
        ].join(' ');

        if (bodyContent) {
          const bMatch = matchKeywordsInSegment(bodyContent, domain);
          if (bMatch.count > 0) {
            scores[domain] += bMatch.count * SCORING_WEIGHTS.BODY;
            breakdown[domain].bodyMatches += bMatch.count;
            bMatch.matchedWords.forEach(w => matchedKeywords[domain].add(w));
          }
        }

        // Subsections matching (Weight: 2 for title, 1 for body)
        if (Array.isArray(section.subsections)) {
          for (const sub of section.subsections) {
            if (sub.title) {
              const subMatch = matchKeywordsInSegment(sub.title, domain);
              if (subMatch.count > 0) {
                scores[domain] += subMatch.count * SCORING_WEIGHTS.SUBSECTION_TITLE;
                subMatch.matchedWords.forEach(w => matchedKeywords[domain].add(w));
              }
            }

            const subBody = [
              ...(sub.paragraphs || []),
              ...(sub.bullets || [])
            ].join(' ');

            if (subBody) {
              const subBMatch = matchKeywordsInSegment(subBody, domain);
              if (subBMatch.count > 0) {
                scores[domain] += subBMatch.count * SCORING_WEIGHTS.BODY;
                subBMatch.matchedWords.forEach(w => matchedKeywords[domain].add(w));
              }
            }
          }
        }
      }
    }

    // 4. Conclusion matching (Weight: 1)
    if (draft.conclusion) {
      const cMatch = matchKeywordsInSegment(draft.conclusion, domain);
      if (cMatch.count > 0) {
        scores[domain] += cMatch.count * SCORING_WEIGHTS.BODY;
        cMatch.matchedWords.forEach(w => matchedKeywords[domain].add(w));
      }
    }
  }

  // Sort domains by descending score
  const ranked = Object.entries(scores)
    .map(([domain, score]) => ({
      domain,
      score,
      meta: DOMAIN_METADATA[domain],
      matchedKeywords: Array.from(matchedKeywords[domain]),
      breakdown: breakdown[domain]
    }))
    .sort((a, b) => b.score - a.score);

  const top = ranked[0];
  const runnerUp = ranked[1];

  let confidence = 'low';
  let isTieOrClose = false;
  let recommendedDomain = top.domain;
  let explanation = '';

  const totalScore = ranked.reduce((acc, r) => acc + r.score, 0);

  if (top.score === 0) {
    // Fallback: Default to Management / Academic if no domain matches
    confidence = 'none';
    recommendedDomain = DOMAINS.MANAGEMENT;
    explanation = 'لم يتم رصد كلمات مفتاحية تخصصية كافية. تم تطبيق القالب المؤسسي الافتراضي كخيار عام.';
  } else if (top.score >= 12 && runnerUp.score < top.score * 0.6) {
    confidence = 'high';
    explanation = `تطابق تخصصي قوي (${top.score} نقطة) بناءً على الكلمات المفتاحية في العنوان وهيكل المباحث.`;
  } else if (top.score >= 5) {
    confidence = 'medium';
    // Check if runner up is very close (< 25% difference)
    if (runnerUp && runnerUp.score > 0 && (top.score - runnerUp.score) / top.score < 0.25) {
      isTieOrClose = true;
      explanation = `تطابق متقارب بين "${top.meta.nameAr}" (${top.score} نقطة) و "${runnerUp.meta.nameAr}" (${runnerUp.score} نقطة). يُرجى مراجعة الخيار المناسب.`;
    } else {
      explanation = `تطابق متوسط (${top.score} نقطة) مع مصطلحات مجال "${top.meta.nameAr}".`;
    }
  } else {
    confidence = 'low';
    isTieOrClose = runnerUp.score > 0;
    explanation = `درجة تطابق منخفضة (${top.score} نقطة). يُنصح باختيار التخصص يدوياً إن كان مختلفاً.`;
  }

  return {
    scores,
    ranked,
    selectedDomain: recommendedDomain,
    topDomain: top.domain,
    topScore: top.score,
    runnerUpDomain: runnerUp ? runnerUp.domain : null,
    runnerUpScore: runnerUp ? runnerUp.score : 0,
    confidence,
    isTieOrClose,
    explanation,
    totalScore
  };
}
