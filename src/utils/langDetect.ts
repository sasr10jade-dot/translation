export interface LangDetectResult {
  lang: 'ko' | 'en';
  confidence: number; // 0 ~ 1
  label: string;
}

/**
 * 정밀 언어 감지 엔진:
 * - 한글 완성형 [가-힣]
 * - 한글 자모 [ㄱ-ㅎㅏ-ㅣ]
 * - 영문 알파벳 [a-zA-Z]
 * - 음절 및 단어 단위 빈도 분석
 */
export function detectLanguageDetailed(text: string): LangDetectResult {
  const trimmed = text.trim();
  if (!trimmed) {
    return { lang: 'en', confidence: 1.0, label: '영어 (기본)' };
  }

  // 1. 한글 매칭 (완성형 + 자모)
  const koreanMatches = trimmed.match(/[가-힣ㄱ-ㅎㅏ-ㅣ]/g);
  const koreanCount = koreanMatches ? koreanMatches.length : 0;

  // 2. 영문 알파벳 매칭
  const englishMatches = trimmed.match(/[a-zA-Z]/g);
  const englishCount = englishMatches ? englishMatches.length : 0;

  // 3. 한글이 단 하나라도 포함되어 있으면 실전 업무/회의 문장에서는 한국어일 확률이 압도적으로 높음
  // (예: "Zoom 링크 부탁해요", "PR 확인", "API 연동 완료")
  if (koreanCount > 0) {
    const totalChars = koreanCount + englishCount;
    const koreanRatio = koreanCount / totalChars;

    // 한글이 영문보다 많거나, 영어가 섞여 있어도 한글이 존재하면 한국어 문장
    if (koreanCount >= 1 && (koreanRatio >= 0.15 || koreanCount >= englishCount)) {
      return {
        lang: 'ko',
        confidence: Math.min(1.0, 0.7 + koreanRatio * 0.3),
        label: '한국어 (KO)',
      };
    }
  }

  // 영문 위주
  if (englishCount > 0) {
    return {
      lang: 'en',
      confidence: 0.95,
      label: '영어 (EN)',
    };
  }

  return { lang: 'en', confidence: 0.5, label: '영어 (기본)' };
}

export function detectLanguage(text: string): 'ko' | 'en' {
  return detectLanguageDetailed(text).lang;
}
