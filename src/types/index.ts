export type TranslationEngine = 'free' | 'gemini';
export type TranslationTone = 'natural' | 'polite' | 'casual' | 'formal';
export type InputMode = 'mic' | 'text';
export type TranslationStatus = 'idle' | 'translating' | 'success' | 'error';
export type SupportedLang = 'auto' | 'ko' | 'en' | 'ja' | 'zh' | 'fr';
export type TargetLang = 'ko' | 'en' | 'ja' | 'zh' | 'fr';
export type ViewMode = 'normal' | 'wide' | 'hud' | 'stream';
export type AppTheme = 'dark' | 'light';

export type SpeechLangCode = 'ko-KR' | 'en-US' | 'ja-JP' | 'zh-CN' | 'fr-FR';

export interface LanguageMeta {
  code: TargetLang;
  label: string;
  flag: string;
  speechCode: SpeechLangCode;
  greeting: string;
}

export const LANGUAGES_MAP: Record<TargetLang, LanguageMeta> = {
  ko: { code: 'ko', label: '한국어', flag: '🇰🇷', speechCode: 'ko-KR', greeting: '안녕하세요' },
  en: { code: 'en', label: '영어', flag: '🇺🇸', speechCode: 'en-US', greeting: 'Hello' },
  ja: { code: 'ja', label: '일본어', flag: '🇯🇵', speechCode: 'ja-JP', greeting: 'こんにちは' },
  zh: { code: 'zh', label: '중국어', flag: '🇨🇳', speechCode: 'zh-CN', greeting: '你好' },
  fr: { code: 'fr', label: '프랑스어', flag: '🇫🇷', speechCode: 'fr-FR', greeting: 'Bonjour' },
};

export interface GlossaryItem {
  id: string;
  sourceWord: string;
  targetWord: string;
  enabled: boolean;
}

export interface MeetingSummary {
  keyPoints: string[];
  actionItems: string[];
  createdAt: number;
}

export interface TranslationRecord {
  id: string;
  timestamp: number;
  sourceText: string;
  translatedText: string;
  sourceLang: SupportedLang;
  targetLang: TargetLang;
  sourceType: InputMode;
  engine: TranslationEngine;
  tone: TranslationTone;
  latencyMs: number;
  isFavorite: boolean;
}

export interface AppSettings {
  engine: TranslationEngine;
  geminiApiKey: string;
  geminiModel: string;
  tone: TranslationTone;
  autoTts: boolean;
  ttsVoiceRate: number; // 0.8 ~ 1.4
  continuousListening: boolean;
  debounceMs: number;
  defaultViewMode: ViewMode;
  fontScale: number;
  pushToTalk: boolean;
  glossary: GlossaryItem[];
}

export interface AudioVisualizerState {
  isListening: boolean;
  volume: number;
  error: string | null;
}

export interface QuickPrompt {
  id: string;
  category: 'daily' | 'business' | 'tech';
  text: string;
  label: string;
  lang: TargetLang;
}
