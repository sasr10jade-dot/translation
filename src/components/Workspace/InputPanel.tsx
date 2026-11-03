import React from 'react';
import { Mic, MicOff, Trash2, Clipboard, Volume2, ArrowLeftRight, Sparkles } from 'lucide-react';
import { AudioVisualizerCanvas } from './AudioVisualizerCanvas';
import { AudioVisualizerService } from '../../services/audioVisualizer';
import { QuickChips } from './QuickChips';
import { SupportedLang, TargetLang } from '../../types';

interface InputPanelProps {
  text: string;
  interimText: string;
  sourceLang: SupportedLang;
  targetLang?: TargetLang;
  detectedLang: 'ko' | 'en';
  speechLang: 'ko-KR' | 'en-US';
  isListening: boolean;
  volume: number;
  visualizerService: AudioVisualizerService;
  onVolumeChange?: (volume: number) => void;
  onTextChange: (newText: string) => void;
  onToggleMic: () => void;
  onToggleSpeechLang: () => void;
  onClearText: () => void;
  onSelectPrompt: (promptText: string) => void;
  onPasteClipboard: () => void;
}

export const InputPanel: React.FC<InputPanelProps> = ({
  text,
  interimText,
  sourceLang,
  detectedLang,
  speechLang,
  isListening,
  volume,
  visualizerService,
  onVolumeChange,
  onTextChange,
  onToggleMic,
  onToggleSpeechLang,
  onClearText,
  onSelectPrompt,
  onPasteClipboard,
}) => {
  const displayText = interimText ? (text ? `${text} ${interimText}` : interimText) : text;
  const wordCount = text.trim() ? text.trim().split(/\s+/).length : 0;
  const charCount = text.length;

  const isSpeechKorean = speechLang === 'ko-KR';

  return (
    <div className="workspace-panel input-panel">
      {/* Panel Top bar */}
      <div className="panel-header">
        <div className="panel-header-left">
          <span className={`lang-tag ${detectedLang === 'ko' ? 'ko' : 'en'}`}>
            {sourceLang === 'auto'
              ? `자동 감지: ${detectedLang === 'ko' ? '한국어' : '영어'}`
              : sourceLang === 'ko'
              ? '한국어 (KO)'
              : '영어 (EN)'}
          </span>
          <span className="panel-title">원문 입력</span>

          {text.trim() && sourceLang === 'auto' && (
            <span className="live-detect-pill" title="입력 텍스트를 정밀 분석하여 언어를 자동 판별했습니다.">
              <Sparkles size={11} />
              <span>{detectedLang === 'ko' ? '한국어 감지됨' : '영어 감지됨'}</span>
            </span>
          )}
        </div>

        {/* Mic Control & Speech Lang Switcher */}
        <div className="mic-control-wrapper">
          {/* Mic Speech Lang Quick Switcher */}
          <button
            type="button"
            className="speech-lang-toggle-btn"
            onClick={onToggleSpeechLang}
            title="마이크가 들을 언어를 즉시 전환합니다"
          >
            <span className="speech-lang-flag">{isSpeechKorean ? '🇰🇷' : '🇺🇸'}</span>
            <span className="speech-lang-text">{isSpeechKorean ? '한국어 음성' : '영어 음성'}</span>
            <ArrowLeftRight size={12} className="speech-lang-icon" />
          </button>

          {/* Mic Button */}
          <button
            type="button"
            className={`mic-toggle-btn ${isListening ? 'active' : ''}`}
            onClick={onToggleMic}
            title={isListening ? '마이크 끄기' : '마이크 켜기 (실시간 음성 인식)'}
          >
            {isListening ? <Mic size={18} className="mic-spin" /> : <MicOff size={18} />}
            <span className="mic-btn-text">
              {isListening ? '음성 청취 중' : '마이크 켜기'}
            </span>
          </button>
        </div>
      </div>

      {/* Audio Visualizer strip */}
      <div className="visualizer-container">
        <AudioVisualizerCanvas
          visualizerService={visualizerService}
          isListening={isListening}
          volume={volume}
          onVolumeChange={onVolumeChange}
        />
      </div>

      {/* Text Area with Live recognition feedback */}
      <div className="textarea-wrapper">
        <textarea
          className="text-input"
          placeholder={
            isSpeechKorean
              ? '한국어로 말씀하시거나 텍스트를 입력하세요 (자동으로 영어로 번역됩니다)...'
              : '영어로 말씀하시거나 영문을 입력하세요 (자동으로 한국어로 번역됩니다)...'
          }
          value={displayText}
          onChange={(e) => onTextChange(e.target.value)}
          spellCheck={false}
        />
        {interimText && (
          <div className="interim-floating-pill">
            <Volume2 size={13} className="interim-icon" />
            <span>음성 실시간 감지 중...</span>
          </div>
        )}
      </div>

      {/* Action bottom toolbar */}
      <div className="panel-footer">
        <div className="counter-group">
          <span className="stat-pill">{charCount}자</span>
          <span className="stat-pill">{wordCount}단어</span>
          <span className="mic-listening-guide">
            {isListening
              ? `🎙️ ${isSpeechKorean ? '한국어' : '영어'} 발화 대기 중...`
              : '마이크 버튼을 누르면 무제한 청취가 시작됩니다'}
          </span>
        </div>

        <div className="action-buttons-group">
          <button
            type="button"
            className="panel-action-btn"
            onClick={onPasteClipboard}
            title="클립보드에서 텍스트 붙여넣기"
          >
            <Clipboard size={15} />
            <span>붙여넣기</span>
          </button>

          <button
            type="button"
            className="panel-action-btn danger"
            onClick={onClearText}
            disabled={!text && !interimText}
            title="입력 내용 지우기"
          >
            <Trash2 size={15} />
            <span>비우기</span>
          </button>
        </div>
      </div>

      {/* Quick sample chips */}
      <QuickChips sourceLang={isSpeechKorean ? 'ko' : 'en'} onSelectPrompt={onSelectPrompt} />
    </div>
  );
};
