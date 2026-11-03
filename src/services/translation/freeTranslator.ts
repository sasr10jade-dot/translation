import { ITranslationService, TranslationResult } from './types';

function decodeHtmlEntities(str: string): string {
  if (!str) return '';
  return str
    .replace(/&quot;/g, '"')
    .replace(/&#39;/g, "'")
    .replace(/&apos;/g, "'")
    .replace(/&amp;/g, '&')
    .replace(/&lt;/g, '<')
    .replace(/&gt;/g, '>')
    .replace(/&#(\d+);/g, (_, dec) => String.fromCharCode(dec));
}

export class FreeTranslatorService implements ITranslationService {
  public name = '무료 고속 번역';
  public engine = 'free' as const;

  // 단일 문장 번역
  private async translateChunk(
    chunk: string,
    sl: string,
    tl: string
  ): Promise<string> {
    const trimmed = chunk.trim();
    if (!trimmed) return '';

    // 1차 시도: Google GTx Web Endpoint
    try {
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 4500);

      const gtxUrl = `https://translate.googleapis.com/translate_a/single?client=gtx&sl=${sl}&tl=${tl}&dt=t&q=${encodeURIComponent(trimmed)}`;
      const res = await fetch(gtxUrl, {
        method: 'GET',
        signal: controller.signal,
      });
      clearTimeout(timeoutId);

      if (res.ok) {
        const data = await res.json();
        if (Array.isArray(data) && Array.isArray(data[0])) {
          const combined = data[0]
            .map((item: any) => (Array.isArray(item) ? item[0] : ''))
            .filter((piece: string) => typeof piece === 'string' && piece.trim().length > 0)
            .join(' ');

          if (combined.trim()) {
            return decodeHtmlEntities(combined.trim());
          }
        }
      }
    } catch {
      // 1차 실패 시 MyMemory 시도
    }

    // 2차 Fallback: MyMemory API
    try {
      const fromLang = sl === 'auto' ? (/[가-힣]/.test(trimmed) ? 'ko' : 'en') : sl;
      const toLang = tl;
      const memoryUrl = `https://api.mymemory.translated.net/get?q=${encodeURIComponent(trimmed)}&langpair=${fromLang}|${toLang}`;
      const res = await fetch(memoryUrl);
      if (res.ok) {
        const data = await res.json();
        if (data && data.responseData && data.responseData.translatedText) {
          return decodeHtmlEntities(data.responseData.translatedText);
        }
      }
    } catch {
      //
    }

    return trimmed;
  }

  public async translate(
    text: string,
    sourceLang: string = 'auto',
    targetLang: string = 'ko'
  ): Promise<TranslationResult> {
    const trimmed = text.trim();
    if (!trimmed) {
      return { translatedText: '', engine: 'free', latencyMs: 0 };
    }

    const startTime = performance.now();
    const sl = sourceLang === 'auto' ? 'auto' : sourceLang;
    const tl = targetLang || (sl === 'ko' ? 'en' : 'ko');

    // 긴 문장(800자 초과) 시 문단/문장 단위로 안전하게 분할하여 URI 길이 초과(414) 방지
    if (trimmed.length > 800) {
      const paragraphs = trimmed.split(/\n+/);
      const translatedParagraphs: string[] = [];

      for (const p of paragraphs) {
        if (p.trim()) {
          const trans = await this.translateChunk(p, sl, tl);
          translatedParagraphs.push(trans);
        } else {
          translatedParagraphs.push('');
        }
      }

      const latencyMs = Math.round(performance.now() - startTime);
      return {
        translatedText: translatedParagraphs.join('\n\n'),
        engine: 'free',
        latencyMs,
      };
    }

    const singleResult = await this.translateChunk(trimmed, sl, tl);
    const latencyMs = Math.round(performance.now() - startTime);

    return {
      translatedText: singleResult,
      engine: 'free',
      latencyMs,
    };
  }
}
