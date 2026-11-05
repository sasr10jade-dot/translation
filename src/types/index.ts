export type TranslationEngine = 'free' | 'gemini';
export type TranslationTone = 'natural' | 'polite' | 'casual' | 'formal';
export type InputMode = 'mic' | 'text';
export type TranslationStatus = 'idle' | 'translating' | 'success' | 'error';
export type SupportedLang = 'auto' | 'ko' | 'en' | 'ja' | 'zh' | 'fr';
export type TargetLang = 'ko' | 'en' | 'ja' | 'zh' | 'fr';
export type ViewMode = 'normal' | 'wide' | 'hud' | 'stream';
export type AppTheme = 'dark' | 'light';
export type SpeakerRole = 'me' | 'partner';
export type AppFontFamily = 'noto-sans' | 'pretendard' | 'nanum-gothic' | 'system';

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

export interface NuanceTip {
  keyword: string;
  culture: 'ko' | 'en' | 'ja' | 'zh' | 'fr';
  title: string;
  explanation: string;
}

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
  speaker: SpeakerRole;
  nuanceTip?: NuanceTip;
  engine: TranslationEngine;
  tone: TranslationTone;
  latencyMs: number;
  isFavorite: boolean;
  isBookmarked?: boolean; // 실시간 핵심 순간 골드 스타 북마크
  speakerName?: string; // 다자간 회의용 맞춤 화자 라벨 (예: "존 (PM)")
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
  fontFamily: AppFontFamily; // 기본 글꼴 (noto-sans, pretendard, nanum-gothic, system)
  pushToTalk: boolean;
  glossary: GlossaryItem[];
  participantPresets?: string[]; // 다자간 회의 참석자 프리셋
  activeSpeakerName?: string; // 현재 활성화된 화자 이름
  googleMeetWebhookUrl: string; // Google Meet (Google Chat) 회의록 전송 웹훅 URL
  zoomWebhookUrl: string; // Zoom Team Chat 회의록 전송 웹훅 URL
  slackWebhookUrl: string; // 슬랙 채널 실시간 회의록 전송 웹훅 URL
  teamsWebhookUrl: string; // Microsoft Teams 채널 회의록 전송 웹훅 URL
  googleMeetUrl: string; // 자주 사용하는 Google Meet 회의실 주소 (URL)
  zoomUrl: string; // 자주 사용하는 Zoom 회의실 주소 (URL / PMI)
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
