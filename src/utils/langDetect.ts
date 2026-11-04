import { TargetLang } from '../types';

export interface LangDetectResult {
  lang: TargetLang;
  confidence: number;
  label: string;
}

const FRENCH_WORDS = new Set([
  'bonjour', 'merci', 'oui', 'non', 'salut', 's\'il', 'vous', 'plaît',
  'comment', 'allez', 'bien', 'avec', 'pour', 'dans', 'sur', 'mais',
  'nous', 'vous', 'ils', 'elles', 'c\'est', 'est', 'une', 'les', 'des'
]);

/**
 * 5개국어(한국어, 영어, 일본어, 중국어, 프랑스어) 문자셋 및 어휘 정밀 판별
 */
export function detectLanguageDetailed(text: string): LangDetectResult {
  const trimmed = text.trim();
  if (!trimmed) {
    return { lang: 'en', confidence: 1.0, label: '영어 (기본)' };
  }

  // 1. 한국어 매칭 [가-힣] + [ㄱ-ㅎㅏ-ㅣ]
  const koreanMatches = trimmed.match(/[가-힣ㄱ-ㅎㅏ-ㅣ]/g);
  const koreanCount = koreanMatches ? koreanMatches.length : 0;

  // 2. 일본어 히라가나 & 가타카나 매칭
  const japaneseMatches = trimmed.match(/[\u3040-\u309F\u30A0-\u30FF]/g);
  const japaneseCount = japaneseMatches ? japaneseMatches.length : 0;

  // 3. 한자 매칭 (CJK Unified Ideographs)
  const cjkMatches = trimmed.match(/[\u4E00-\u9FFF]/g);
  const cjkCount = cjkMatches ? cjkMatches.length : 0;

  // 4. 프랑스어 특수 악센트 [éèêëàâäîïôöùûüçœæ]
  const frenchAccentMatches = trimmed.match(/[éèêëàâäîïôöùûüçœæÉÈÊËÀÂÄÎÏÔÖÙÛÜÇ]/g);
  const frenchAccentCount = frenchAccentMatches ? frenchAccentMatches.length : 0;

  // 5. 영문/라틴 알파벳
  const englishMatches = trimmed.match(/[a-zA-Z]/g);
  const englishCount = englishMatches ? englishMatches.length : 0;

  // --- 판별 규칙 ---

  // A. 한글이 포함되어 있는 경우 (영단어가 섞여 있어도 한국어 우선)
  if (koreanCount > 0) {
    return { lang: 'ko', confidence: 0.98, label: '한국어 (KO)' };
  }

  // B. 히라가나 또는 가타카나가 포함되어 있으면 일본어 (한자가 섞여 있어도 일본어)
  if (japaneseCount > 0) {
    return { lang: 'ja', confidence: 0.98, label: '일본어 (JA)' };
  }

  // C. 한자만 있고 한글/가나가 없으면 중국어
  if (cjkCount > 0 && japaneseCount === 0 && koreanCount === 0) {
    return { lang: 'zh', confidence: 0.95, label: '중국어 (ZH)' };
  }

  // D. 프랑스어 고유 악센트가 있거나 프랑스어 단어가 감지되면 프랑스어
  if (frenchAccentCount > 0) {
    return { lang: 'fr', confidence: 0.92, label: '프랑스어 (FR)' };
  }

  // 단어 단위 프랑스어 검사
  const words = trimmed.toLowerCase().split(/[\s,.'";:!?]+/);
  const frenchWordCount = words.filter((w) => FRENCH_WORDS.has(w)).length;
  if (frenchWordCount >= 1 && (frenchWordCount / words.length) >= 0.2) {
    return { lang: 'fr', confidence: 0.88, label: '프랑스어 (FR)' };
  }

  // E. 그 외 라틴 알파벳은 기본 영어
  if (englishCount > 0) {
    return { lang: 'en', confidence: 0.95, label: '영어 (EN)' };
  }

  return { lang: 'en', confidence: 0.5, label: '영어 (기본)' };
}

export function detectLanguage(text: string): TargetLang {
  return detectLanguageDetailed(text).lang;
}
