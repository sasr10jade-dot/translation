import React, { useEffect, useRef } from 'react';
import { TranslationRecord, SupportedLang, TargetLang, TranslationStatus, SpeechLangCode } from '../../types';
import { Mic, MicOff, Volume2, Sparkles, Download, FileText, Send } from 'lucide-react';
import './MeetingStream.css';

interface MeetingStreamProps {
  records: TranslationRecord[];
  sourceText: string;
  interimText: string;
  translatedText: string;
  status: TranslationStatus;
  isListening: boolean;
  sourceLang: SupportedLang;
  targetLang: TargetLang;
  speechLang: SpeechLangCode;
  onToggleMic: () => void;
  onChangeSpeechLang: (lang: SpeechLangCode) => void;
  onTextChange: (text: string) => void;
  onSendText: (text: string) => void;
  onSpeak: (text: string) => void;
  onOpenSummary: () => void;
  onExport: (format: 'txt' | 'json') => void;
}

export const MeetingStream: React.FC<MeetingStreamProps> = ({
  records,
  sourceText,
  interimText,
  translatedText,
  status,
  isListening,
  speechLang,
  onToggleMic,
  onChangeSpeechLang,
  onTextChange,
  onSendText,
  onSpeak,
  onOpenSummary,
  onExport,
}) => {
  const bottomAnchorRef = useRef<HTMLDivElement | null>(null);

  // 새 대화가 추가되면 아래로 자동 스크롤
  useEffect(() => {
    bottomAnchorRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [records.length, interimText, translatedText]);

  const formatTime = (ts: number) => {
    const d = new Date(ts);
    return `${d.getHours().toString().padStart(2, '0')}:${d.getMinutes().toString().padStart(2, '0')}`;
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      if (sourceText.trim()) {
        onSendText(sourceText);
      }
    }
  };

  return (
    <div className="stream-container">
      {/* Stream Top Toolbar */}
      <div className="stream-toolbar">
        <div className="stream-title-group">
          <FileText size={18} className="stream-icon" />
          <h2 className="stream-title">실시간 회의 대화 스트림</h2>
          <span className="stream-counter">{records.length}개 발화</span>
        </div>

        <div className="stream-actions">
          {/* AI 3줄 요약 & To-do 추출 버튼 */}
          <button
            type="button"
            className="stream-tool-btn summary-btn"
            onClick={onOpenSummary}
            disabled={records.length === 0}
            title="오늘 나눈 대화에서 핵심 안건 3줄 요약과 Action Items(할 일) 추출"
          >
            <Sparkles size={14} className="sparkle-anim" />
            <span>AI 회의록 3줄 요약</span>
          </button>

          <button
            type="button"
            className="stream-tool-btn"
            onClick={() => onExport('txt')}
            disabled={records.length === 0}
            title="텍스트 파일로 저장"
          >
            <Download size={14} />
            <span>회의록 저장</span>
          </button>
        </div>
      </div>

      {/* Stream Message Feed (Timeline) */}
      <div className="stream-feed">
        {records.length === 0 && !interimText && (
          <div className="stream-empty">
            <p className="empty-stream-title">회의 대화가 아직 시작되지 않았습니다.</p>
            <p className="empty-stream-desc">
              하단 마이크를 켜거나 텍스트를 입력하면, 타임라인에 영어와 한국어 번역이 시간순으로 누적 표시됩니다.
            </p>
          </div>
        )}

        {records.map((r) => (
          <div key={r.id} className="stream-bubble-pair">
            <div className="bubble-header">
              <span className="bubble-speaker">
                {r.sourceLang === 'ko' ? '🇰🇷 발화자 (KO)' : '🇺🇸 발화자 (EN)'}
              </span>
              <span className="bubble-time">{formatTime(r.timestamp)}</span>
            </div>

            {/* Original Source Bubble */}
            <div className="bubble-row source-row">
              <span className="bubble-tag">{r.sourceLang.toUpperCase()}</span>
              <p className="bubble-text source-text">{r.sourceText}</p>
            </div>

            {/* Translated Target Bubble */}
            <div className="bubble-row target-row">
              <span className="bubble-tag target">{r.targetLang.toUpperCase()}</span>
              <p className="bubble-text target-text">{r.translatedText}</p>
              <button
                type="button"
                className="bubble-speak-btn"
                onClick={() => onSpeak(r.translatedText)}
                title="발음 듣기"
              >
                <Volume2 size={14} />
              </button>
            </div>
          </div>
        ))}

        {/* Live Active Preview Bubble */}
        {(interimText || (sourceText && status === 'translating')) && (
          <div className="stream-bubble-pair live-active">
            <div className="bubble-header">
              <span className="bubble-speaker live">🎙️ 현재 실시간 발화 중...</span>
            </div>
            <div className="bubble-row source-row">
              <span className="bubble-tag live">LIVE</span>
              <p className="bubble-text source-text">
                {sourceText} {interimText && <span className="interim-highlight">{interimText}</span>}
              </p>
            </div>
            {translatedText && (
              <div className="bubble-row target-row">
                <span className="bubble-tag target">KO</span>
                <p className="bubble-text target-text">{translatedText}</p>
              </div>
            )}
          </div>
        )}

        <div ref={bottomAnchorRef} />
      </div>

      {/* Stream Input Controller */}
      <div className="stream-input-bar">
        <select
          value={speechLang}
          onChange={(e) => onChangeSpeechLang(e.target.value as SpeechLangCode)}
          className="stream-lang-select"
          title="마이크 음성 언어 선택"
        >
          <option value="ko-KR">🇰🇷 한국어</option>
          <option value="en-US">🇺🇸 영어</option>
          <option value="ja-JP">🇯🇵 일본어</option>
          <option value="zh-CN">🇨🇳 중국어</option>
          <option value="fr-FR">🇫🇷 프랑스어</option>
        </select>

        <button
          type="button"
          className={`stream-mic-btn ${isListening ? 'active' : ''}`}
          onClick={onToggleMic}
          title={isListening ? '마이크 끄기' : '마이크 켜기'}
        >
          {isListening ? <Mic size={18} className="mic-spin" /> : <MicOff size={18} />}
          <span>{isListening ? '듣는 중' : '마이크'}</span>
        </button>

        <input
          type="text"
          className="stream-text-input"
          placeholder="메시지를 입력하고 Enter를 누르거나 마이크를 켜세요..."
          value={sourceText}
          onChange={(e) => onTextChange(e.target.value)}
          onKeyDown={handleKeyDown}
        />

        <button
          type="button"
          className="stream-send-btn"
          onClick={() => {
            if (sourceText.trim()) {
              onSendText(sourceText);
            }
          }}
          disabled={!sourceText.trim()}
          title="전송"
        >
          <Send size={16} />
        </button>
      </div>
    </div>
  );
};
