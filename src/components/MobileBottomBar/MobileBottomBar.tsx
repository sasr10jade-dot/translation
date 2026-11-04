import React from 'react';
import { Mic, MicOff, Volume2, Trash2, ArrowLeftRight } from 'lucide-react';
import { SpeechLangCode } from '../../types';
import './MobileBottomBar.css';

interface MobileBottomBarProps {
  isListening: boolean;
  speechLang: SpeechLangCode;
  hasText: boolean;
  translatedText: string;
  isSpeaking: boolean;
  onToggleMic: () => void;
  onCycleSpeechLang: () => void;
  onClearText: () => void;
  onSpeak: (text: string) => void;
}

const SPEECH_META: Record<SpeechLangCode, { flag: string; label: string }> = {
  'ko-KR': { flag: '🇰🇷', label: '한국어' },
  'en-US': { flag: '🇺🇸', label: '영어' },
  'ja-JP': { flag: '🇯🇵', label: '일본어' },
  'zh-CN': { flag: '🇨🇳', label: '중국어' },
  'fr-FR': { flag: '🇫🇷', label: '프랑스어' },
};

export const MobileBottomBar: React.FC<MobileBottomBarProps> = ({
  isListening,
  speechLang,
  hasText,
  translatedText,
  isSpeaking,
  onToggleMic,
  onCycleSpeechLang,
  onClearText,
  onSpeak,
}) => {
  const current = SPEECH_META[speechLang] || SPEECH_META['ko-KR'];

  return (
    <nav className="mobile-bottom-bar">
      {/* 1. Mic Language Toggle (Cycle 5 Languages) */}
      <button
        type="button"
        className="mobile-bar-btn lang-toggle"
        onClick={onCycleSpeechLang}
        title="마이크 인식 언어 전환 (5개국어)"
      >
        <span className="mobile-bar-flag">{current.flag}</span>
        <span className="mobile-bar-lang-text">{current.label}</span>
        <ArrowLeftRight size={13} className="bar-icon-sub" />
      </button>

      {/* 2. Center Large Floating Mic FAB */}
      <div className="mobile-mic-fab-wrapper">
        <button
          type="button"
          className={`mobile-mic-fab ${isListening ? 'active' : ''}`}
          onClick={onToggleMic}
          title={isListening ? '음성 청취 중지' : '음성 번역 시작'}
        >
          {isListening ? (
            <Mic size={26} className="fab-mic-icon pulsing" />
          ) : (
            <MicOff size={24} className="fab-mic-icon" />
          )}
        </button>
      </div>

      {/* 3. Quick Actions (TTS speak & Clear) */}
      <div className="mobile-bar-actions">
        {/* Speak Output */}
        <button
          type="button"
          className={`mobile-bar-btn action-icon ${isSpeaking ? 'active' : ''}`}
          onClick={() => onSpeak(translatedText)}
          disabled={!translatedText}
          title="번역 결과 음성 듣기"
        >
          <Volume2 size={18} />
        </button>

        {/* Clear Input */}
        <button
          type="button"
          className="mobile-bar-btn action-icon danger"
          onClick={onClearText}
          disabled={!hasText}
          title="입력 내용 지우기"
        >
          <Trash2 size={18} />
        </button>
      </div>
    </nav>
  );
};
