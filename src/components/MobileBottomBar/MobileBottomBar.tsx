import React from 'react';
import { Mic, MicOff, Volume2, Trash2, ArrowLeftRight } from 'lucide-react';
import './MobileBottomBar.css';

interface MobileBottomBarProps {
  isListening: boolean;
  speechLang: 'ko-KR' | 'en-US';
  hasText: boolean;
  translatedText: string;
  isSpeaking: boolean;
  onToggleMic: () => void;
  onToggleSpeechLang: () => void;
  onClearText: () => void;
  onSpeak: (text: string) => void;
}

export const MobileBottomBar: React.FC<MobileBottomBarProps> = ({
  isListening,
  speechLang,
  hasText,
  translatedText,
  isSpeaking,
  onToggleMic,
  onToggleSpeechLang,
  onClearText,
  onSpeak,
}) => {
  const isKorean = speechLang === 'ko-KR';

  return (
    <nav className="mobile-bottom-bar">
      {/* 1. Mic Language Toggle */}
      <button
        type="button"
        className="mobile-bar-btn lang-toggle"
        onClick={onToggleSpeechLang}
        title="마이크 인식 언어 전환"
      >
        <span className="mobile-bar-flag">{isKorean ? '🇰🇷' : '🇺🇸'}</span>
        <span className="mobile-bar-lang-text">{isKorean ? '한국어' : '영어'}</span>
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
