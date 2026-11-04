import { TargetLang } from '../types';

const LANG_TO_BCP47: Record<TargetLang, string> = {
  ko: 'ko-KR',
  en: 'en-US',
  ja: 'ja-JP',
  zh: 'zh-CN',
  fr: 'fr-FR',
};

export class SpeechSynthesizerService {
  private static instance: SpeechSynthesizerService;
  private voices: SpeechSynthesisVoice[] = [];

  private constructor() {
    this.loadVoices();
    if (typeof window !== 'undefined' && 'speechSynthesis' in window) {
      window.speechSynthesis.onvoiceschanged = () => {
        this.loadVoices();
      };
    }
  }

  public static getInstance(): SpeechSynthesizerService {
    if (!SpeechSynthesizerService.instance) {
      SpeechSynthesizerService.instance = new SpeechSynthesizerService();
    }
    return SpeechSynthesizerService.instance;
  }

  private loadVoices() {
    if (typeof window === 'undefined' || !('speechSynthesis' in window)) return;
    this.voices = window.speechSynthesis.getVoices();
  }

  public speak(
    text: string,
    targetLang: TargetLang | string = 'ko',
    rate: number = 1.0,
    onEnd?: () => void
  ): boolean {
    if (typeof window === 'undefined' || !('speechSynthesis' in window)) return false;
    if (!text.trim()) return false;

    window.speechSynthesis.cancel();

    const langCode = LANG_TO_BCP47[targetLang as TargetLang] || targetLang || 'ko-KR';
    const utterance = new SpeechSynthesisUtterance(text);
    utterance.lang = langCode;
    utterance.rate = Math.max(0.5, Math.min(2.0, rate));
    utterance.pitch = 1.0;

    // 해당 언어의 최적 보이스 선택 (Google / Natural / Microsoft 우선)
    const langPrefix = langCode.slice(0, 2);
    const matchingVoices = this.voices.filter((v) => v.lang.toLowerCase().startsWith(langPrefix));
    if (matchingVoices.length > 0) {
      const preferred = matchingVoices.find((v) =>
        v.name.includes('Natural') || v.name.includes('Google') || v.name.includes('Online')
      ) || matchingVoices[0];
      utterance.voice = preferred;
    }

    if (onEnd) {
      utterance.onend = () => onEnd();
      utterance.onerror = () => onEnd();
    }

    window.speechSynthesis.speak(utterance);
    return true;
  }

  public stop() {
    if (typeof window !== 'undefined' && 'speechSynthesis' in window) {
      window.speechSynthesis.cancel();
    }
  }

  public isSpeaking(): boolean {
    if (typeof window === 'undefined' || !('speechSynthesis' in window)) return false;
    return window.speechSynthesis.speaking;
  }
}
