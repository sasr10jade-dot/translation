import React from 'react';
import { Mic, MicOff, Trash2, Clipboard, Volume2, Sparkles } from 'lucide-react';
import { AudioVisualizerCanvas } from './AudioVisualizerCanvas';
import { AudioVisualizerService } from '../../services/audioVisualizer';
import { QuickChips } from './QuickChips';
import { SupportedLang, TargetLang, SpeechLangCode, LANGUAGES_MAP } from '../../types';

interface InputPanelProps {
  text: string;
  interimText: string;
  sourceLang: SupportedLang;
  targetLang?: TargetLang;
  detectedLang: TargetLang;
  speechLang: SpeechLangCode;
  speakerRole: 'me' | 'partner';
  isListening: boolean;
  volume: number;
  visualizerService: AudioVisualizerService;
  onVolumeChange?: (volume: number) => void;
  onTextChange: (newText: string) => void;
  onToggleMic: () => void;
  onChangeSpeechLang: (lang: SpeechLangCode) => void;
  onToggleSpeakerRole: () => void;
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
  speakerRole,
  isListening,
  volume,
  visualizerService,
  onVolumeChange,
  onTextChange,
  onToggleMic,
  onChangeSpeechLang,
  onToggleSpeakerRole,
  onClearText,
  onSelectPrompt,
  onPasteClipboard,
}) => {
  const displayText = interimText ? (text ? `${text} ${interimText}` : interimText) : text;
  const wordCount = text.trim() ? text.trim().split(/\s+/).length : 0;
  const charCount = text.length;

  const currentMeta = LANGUAGES_MAP[detectedLang] || LANGUAGES_MAP.ko;

  return (
    <div className="workspace-panel input-panel">
      {/* Panel Top bar */}
      <div className="panel-header">
        <div className="panel-header-left">
          <span className={`lang-tag ${detectedLang}`}>
            {sourceLang === 'auto'
              ? `자동 감지: ${currentMeta.flag} ${currentMeta.label}`
              : `${currentMeta.flag} ${currentMeta.label}`}
          </span>
          <span className="panel-title">원문 입력</span>

          {text.trim() && sourceLang === 'auto' && (
            <span className="live-detect-pill" title="입력 텍스트를 정밀 분석하여 언어를 자동 판별했습니다.">
              <Sparkles size={11} />
              <span>{currentMeta.label} 감지됨</span>
            </span>
          )}
        </div>

        {/* Mic Control & 5-Language Speech Selector */}
        <div className="mic-control-wrapper">
          {/* Speaker Role Switcher (나 vs 상대방) */}
          <button
            type="button"
            className={`speaker-role-btn ${speakerRole}`}
            onClick={onToggleSpeakerRole}
            title="현재 발화 주체 전환 (내가 말하기 vs 상대방 듣기)"
          >
            <span>{speakerRole === 'me' ? '👤 나 (Me)' : '👥 상대방'}</span>
          </button>

          {/* 5-Language Speech Lang Dropdown */}
          <select
            value={speechLang}
            onChange={(e) => onChangeSpeechLang(e.target.value as SpeechLangCode)}
            className="speech-lang-select"
            title="마이크가 들을 음성 언어 선택"
          >
            <option value="ko-KR">🇰🇷 한국어 음성</option>
            <option value="en-US">🇺🇸 영어 음성</option>
            <option value="ja-JP">🇯🇵 일본어 음성</option>
            <option value="zh-CN">🇨🇳 중국어 음성</option>
            <option value="fr-FR">🇫🇷 프랑스어 음성</option>
          </select>

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
          placeholder={`${currentMeta.label}로 말씀하시거나 텍스트를 입력하세요 (자동 감지 및 실시간 번역)...`}
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
              ? `🎙️ ${speechLang.split('-')[0].toUpperCase()} 발화 대기 중...`
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
      <QuickChips currentLang={detectedLang} onSelectPrompt={onSelectPrompt} />
    </div>
  );
};
