import React, { useState, useEffect } from 'react';
import { RotateCcw, Volume2, Copy, Check, X, Sparkles, FastForward } from 'lucide-react';
import { TranslationRecord } from '../../types';
import './GoldenReplayModal.css';

interface GoldenReplayModalProps {
  isOpen: boolean;
  onClose: () => void;
  records: TranslationRecord[];
  onSpeak: (text: string, rate?: number) => void;
}

export const GoldenReplayModal: React.FC<GoldenReplayModalProps> = ({
  isOpen,
  onClose,
  records,
  onSpeak,
}) => {
  // 최근 발화 최대 3건 가져오기 (가장 최신순)
  const recentItems = records.slice(0, 3);
  const [selectedIndex, setSelectedIndex] = useState(0);
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    if (isOpen) {
      setSelectedIndex(0);
      setCopied(false);
      // 열리자마자 가장 최근 발화를 0.85배속으로 즉시 1회 자동 재생하여 귀로 확인
      if (recentItems.length > 0) {
        const item = recentItems[0];
        const textToSpeak = item.sourceLang === 'ko' ? item.translatedText : item.sourceText;
        onSpeak(textToSpeak, 0.85);
      }
    }
  }, [isOpen]);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && isOpen) {
        onClose();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  const currentItem = recentItems[selectedIndex];

  const handleCopy = (text: string) => {
    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="golden-replay-overlay" onClick={onClose}>
      <div className="golden-replay-card" onClick={(e) => e.stopPropagation()}>
        {/* Header */}
        <div className="replay-header">
          <div className="replay-title-group">
            <div className="replay-icon-badge">
              <RotateCcw size={16} />
            </div>
            <div>
              <h3 className="replay-title">골든 리플레이 (방금 발화 되감기)</h3>
              <span className="replay-sub">단축키: Alt + R · ESC로 닫기</span>
            </div>
          </div>
          <button type="button" className="replay-close-btn" onClick={onClose}>
            <X size={18} />
          </button>
        </div>

        {recentItems.length === 0 ? (
          <div className="replay-empty">
            <p>되감을 직전 발화 기록이 아직 없습니다.</p>
          </div>
        ) : (
          <>
            {/* 1, 2, 3번째 직전 문장 선택 탭 */}
            {recentItems.length > 1 && (
              <div className="replay-tabs">
                {recentItems.map((item, idx) => (
                  <button
                    key={item.id}
                    type="button"
                    className={`replay-tab-chip ${selectedIndex === idx ? 'active' : ''}`}
                    onClick={() => {
                      setSelectedIndex(idx);
                      const toSpeak = item.sourceLang === 'ko' ? item.translatedText : item.sourceText;
                      onSpeak(toSpeak, 0.85);
                    }}
                  >
                    <span>{idx === 0 ? '방금 발화 (최신)' : `${idx + 1}번째 직전`}</span>
                    <span className="tab-speaker-tag">
                      {item.speaker === 'me' ? '나' : '상대방'}
                    </span>
                  </button>
                ))}
              </div>
            )}

            {/* Main Replay Content Display */}
            {currentItem && (
              <div className="replay-main-content">
                {/* Source English Box */}
                <div className="replay-box source-box">
                  <div className="box-top">
                    <span className="lang-tag source">{currentItem.sourceLang.toUpperCase()} 원문</span>
                    <div className="audio-actions">
                      <button
                        type="button"
                        className="replay-sound-btn slow"
                        onClick={() => onSpeak(currentItem.sourceText, 0.8)}
                        title="0.8배속으로 또박또박 느리게 듣기"
                      >
                        <Volume2 size={13} />
                        <span>0.8x 느리게</span>
                      </button>
                      <button
                        type="button"
                        className="replay-sound-btn normal"
                        onClick={() => onSpeak(currentItem.sourceText, 1.0)}
                        title="정상 1.0배속으로 듣기"
                      >
                        <FastForward size={13} />
                        <span>1.0x</span>
                      </button>
                      <button
                        type="button"
                        className="replay-sound-btn copy"
                        onClick={() => handleCopy(currentItem.sourceText)}
                        title="원문 복사"
                      >
                        {copied ? <Check size={13} /> : <Copy size={13} />}
                      </button>
                    </div>
                  </div>
                  <p className="replay-text source-text">{currentItem.sourceText}</p>
                </div>

                {/* Target Translation Box */}
                <div className="replay-box target-box">
                  <div className="box-top">
                    <span className="lang-tag target">{currentItem.targetLang.toUpperCase()} 번역</span>
                    <div className="audio-actions">
                      <button
                        type="button"
                        className="replay-sound-btn normal"
                        onClick={() => onSpeak(currentItem.translatedText, 1.0)}
                        title="한국어 번역 읽기"
                      >
                        <Volume2 size={13} />
                        <span>발음 듣기</span>
                      </button>
                      <button
                        type="button"
                        className="replay-sound-btn copy"
                        onClick={() => handleCopy(currentItem.translatedText)}
                        title="번역문 복사"
                      >
                        {copied ? <Check size={13} /> : <Copy size={13} />}
                      </button>
                    </div>
                  </div>
                  <p className="replay-text target-text">{currentItem.translatedText}</p>
                </div>

                {/* Cultural Nuance Coach Card if available */}
                {currentItem.nuanceTip && (
                  <div className="replay-nuance-card">
                    <div className="nuance-badge">
                      <Sparkles size={12} />
                      <span>{currentItem.nuanceTip.title}</span>
                    </div>
                    <p className="nuance-text">{currentItem.nuanceTip.explanation}</p>
                  </div>
                )}
              </div>
            )}
          </>
        )}

        {/* Footer */}
        <div className="replay-footer">
          <span className="replay-tip-text">
            💡 <strong>꿀팁:</strong> 상대방 말이 너무 빠를 땐 언제든 <strong>Alt + R</strong>을 눌러 느린 속도로 확인하세요!
          </span>
          <button type="button" className="replay-confirm-btn" onClick={onClose}>
            <span>확인 완료</span>
          </button>
        </div>
      </div>
    </div>
  );
};
