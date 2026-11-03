/**
 * 텍스트 내 한글과 영문의 비율, 자모, 문장 구조를 분석하여 가장 정확한 언어를 판별합니다.
 * (영문 약어나 고유명사("Zoom", "PR", "API")가 포함된 한국어 문장도 정확히 한국어로 분류)
 */
export function detectLanguage(text: string): 'ko' | 'en' {
  const trimmed = text.trim();
  if (!trimmed) return 'en';

  // 1. 한글 완성형 [가-힣] 및 자모 [ㄱ-ㅎㅏ-ㅣ]
  const koreanMatches = trimmed.match(/[가-힣ㄱ-ㅎㅏ-ㅣ]/g);
  const koreanCount = koreanMatches ? koreanMatches.length : 0;

  // 2. 영문 알파벳 [a-zA-Z]
  const englishMatches = trimmed.match(/[a-zA-Z]/g);
  const englishCount = englishMatches ? englishMatches.length : 0;

  // 한글이 전혀 없으면 영어
  if (koreanCount === 0) return 'en';

  // 영어가 전혀 없으면 한국어
  if (englishCount === 0) return 'ko';

  // 비즈니스/개발 대화의 경우 한글 문장에 영단어가 많이 섞이므로
  // 한글이 2글자 이상 있거나, 전체 알파벳의 25% 이상이면 한국어 문장으로 판별
  if (koreanCount >= 2 || koreanCount >= englishCount * 0.25) {
    return 'ko';
  }

  return 'en';
}
