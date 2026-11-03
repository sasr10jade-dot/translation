import { AppSettings, SupportedLang, TargetLang, TranslationTone } from '../../types';
import { FreeTranslatorService } from './freeTranslator';
import { GeminiTranslatorService } from './geminiTranslator';
import { ITranslationService, TranslationResult } from './types';

export class TranslationManager {
  private freeService = new FreeTranslatorService();

  private applyGlossary(text: string, settings: AppSettings): string {
    if (!settings.glossary || settings.glossary.length === 0) return text;
    let res = text;
    for (const item of settings.glossary) {
      if (!item.enabled || !item.sourceWord.trim() || !item.targetWord.trim()) continue;
      try {
        const escaped = item.sourceWord.trim().replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
        const regex = new RegExp(escaped, 'gi');
        res = res.replace(regex, item.targetWord.trim());
      } catch {
        //
      }
    }
    return res;
  }

  public getService(settings: AppSettings): ITranslationService {
    if (settings.engine === 'gemini' && settings.geminiApiKey.trim()) {
      return new GeminiTranslatorService(settings.geminiApiKey, settings.geminiModel);
    }
    return this.freeService;
  }

  public async translate(
    text: string,
    settings: AppSettings,
    sourceLang: SupportedLang = 'auto',
    targetLang: TargetLang = 'ko',
    overrideTone?: TranslationTone
  ): Promise<TranslationResult> {
    const tone = overrideTone || settings.tone;
    const service = this.getService(settings);

    let rawResult: TranslationResult;
    try {
      rawResult = await service.translate(text, sourceLang, targetLang, tone);
    } catch (err: any) {
      // Gemini 모드였는데 실패한 경우 무료 모드로 graceful fallback 시도
      if (settings.engine === 'gemini') {
        try {
          rawResult = await this.freeService.translate(text, sourceLang, targetLang);
        } catch {
          throw err;
        }
      } else {
        throw err;
      }
    }

    // 커스텀 용어 사전 치환 적용
    const finalizedText = this.applyGlossary(rawResult.translatedText, settings);
    return {
      ...rawResult,
      translatedText: finalizedText,
    };
  }
}

export const translationManager = new TranslationManager();
export * from './types';
export * from './freeTranslator';
export * from './geminiTranslator';
