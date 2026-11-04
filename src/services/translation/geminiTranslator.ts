import { GoogleGenerativeAI } from '@google/generative-ai';
import { TranslationTone, TargetLang } from '../../types';
import { ITranslationService, TranslationResult } from './types';

const LANG_NAMES: Record<TargetLang, string> = {
  ko: 'Korean',
  en: 'English',
  ja: 'Japanese',
  zh: 'Simplified Chinese (Mandarin)',
  fr: 'French',
};

export class GeminiTranslatorService implements ITranslationService {
  public name = 'Gemini AI 실시간 번역';
  public engine = 'gemini' as const;
  private apiKey: string;
  private modelName: string;

  constructor(apiKey: string, modelName: string = 'gemini-1.5-flash') {
    this.apiKey = apiKey.trim();
    this.modelName = modelName;
  }

  private getToneInstruction(tone: TranslationTone = 'natural', targetLang: TargetLang): string {
    if (targetLang === 'ko') {
      switch (tone) {
        case 'polite':
          return '상대방을 존중하는 정중하고 예의 바른 존댓말(해요체/하십시오체)로 번역하세요.';
        case 'casual':
          return '친근하고 편안한 반말 구어체로 번역하세요.';
        case 'formal':
          return '격식 있는 비즈니스 및 공식 보고체(하십시오체)로 번역하세요.';
        case 'natural':
        default:
          return '실제 한국인이 일상 및 비즈니스 회의에서 사용하는 가장 자연스러운 한국어로 번역하세요.';
      }
    } else if (targetLang === 'ja') {
      switch (tone) {
        case 'formal':
        case 'polite':
          return '丁寧なビジネス敬語（です・ます調）で自然に翻訳してください。';
        case 'casual':
          return '親しい友人と話すような自然な口語表現で翻訳してください。';
        case 'natural':
        default:
          return '日本のネイティブがビジネスや日常会話で使う最も自然で流暢な日本語に翻訳してください。';
      }
    } else if (targetLang === 'zh') {
      return '请翻译成流畅、地道且符合母语表达习惯的现代标准简体中文。';
    } else if (targetLang === 'fr') {
      return 'Traduisez en français courant, naturel et idiomatique, adapté aux réunions professionnelles.';
    } else {
      // English
      switch (tone) {
        case 'formal':
          return 'Translate into professional business English suitable for executive meetings.';
        case 'casual':
          return 'Translate into relaxed everyday conversational English.';
        case 'polite':
        case 'natural':
        default:
          return 'Translate into natural, clear, idiomatic English as spoken by native speakers in business meetings.';
      }
    }
  }

  public async translate(
    text: string,
    sourceLang: string = 'auto',
    targetLang: string = 'ko',
    tone: TranslationTone = 'natural'
  ): Promise<TranslationResult> {
    const trimmed = text.trim();
    if (!trimmed) {
      return { translatedText: '', engine: 'gemini', latencyMs: 0 };
    }

    if (!this.apiKey) {
      throw new Error('Gemini API 키가 설정되지 않았습니다. 우측 상단 [설정]에서 API Key를 입력해 주세요.');
    }

    const tLang = (targetLang as TargetLang) || 'ko';
    const targetName = LANG_NAMES[tLang] || 'Korean';
    const sourceName = sourceLang === 'auto' ? 'the detected source language' : (LANG_NAMES[sourceLang as TargetLang] || sourceLang);
    const toneGuide = this.getToneInstruction(tone, tLang);
    const startTime = performance.now();

    try {
      const genAI = new GoogleGenerativeAI(this.apiKey);
      const model = genAI.getGenerativeModel({
        model: this.modelName || 'gemini-1.5-flash',
        generationConfig: {
          temperature: 0.25,
        },
      });

      const prompt = `System: You are an elite real-time multilingual translator specializing in international video conferences.
Translate from ${sourceName} into ${targetName}.
Style Guideline: ${toneGuide}

Strict Rules:
1. Translate faithfully and idiomatically. Avoid rigid word-for-word translation.
2. Return ONLY the translated text in ${targetName}.
3. No explanations, no romanization, no quotes, no markdown syntax.

Source text:
${trimmed}`;

      const result = await model.generateContent(prompt);
      const response = await result.response;
      let translatedText = response.text().trim();

      if (translatedText.startsWith('"') && translatedText.endsWith('"')) {
        translatedText = translatedText.slice(1, -1);
      }

      const latencyMs = Math.round(performance.now() - startTime);

      return {
        translatedText,
        engine: 'gemini',
        latencyMs,
      };
    } catch (err: any) {
      const msg = err.message || String(err);
      if (msg.includes('API_KEY_INVALID') || msg.includes('403') || msg.includes('400')) {
        throw new Error('유효하지 않은 Gemini API 키입니다. 설정에서 키를 확인해 주세요.');
      }
      throw new Error(`Gemini 번역 실패: ${msg}`);
    }
  }
}
