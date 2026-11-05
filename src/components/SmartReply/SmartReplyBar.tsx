import React, { useState } from 'react';
import { ThumbsUp, ThumbsDown, Clock, HelpCircle, Volume2, Copy, Check, Send, Sparkles, X } from 'lucide-react';
import { SmartReplyService, SmartReplyIntent, SmartReplyOption } from '../../services/smartReplyService';
import './SmartReplyBar.css';

interface SmartReplyBarProps {
  partnerText: string;
  apiKey?: string;
  modelName?: string;
  onSelectReply: (replyText: string) => void;
  onSpeak: (text: string) => void;
}

export const SmartReplyBar: React.FC<SmartReplyBarProps> = ({
  partnerText,
  apiKey,
  modelName,
  onSelectReply,
  onSpeak,
}) => {
  const [activeIntent, setActiveIntent] = useState<SmartReplyIntent | null>(null);
  const [loading, setLoading] = useState(false);
  const [replies, setReplies] = useState<SmartReplyOption[]>([]);
  const [copiedId, setCopiedId] = useState<number | null>(null);

  const handleIntentClick = async (intent: SmartReplyIntent) => {
    if (activeIntent === intent) {
      setActiveIntent(null);
      setReplies([]);
      return;
    }

    setActiveIntent(intent);
    setLoading(true);

    try {
      const generated = await SmartReplyService.generateReplies(
        partnerText,
        intent,
        apiKey,
        modelName
      );
      setReplies(generated);
    } catch {
      //
    } finally {
      setLoading(false);
    }
  };

  const handleCopy = (text: string, idx: number) => {
    navigator.clipboard.writeText(text);
    setCopiedId(idx);
    setTimeout(() => setCopiedId(null), 2000);
  };

  return (
    <div className="smart-reply-wrapper">
      {/* 4 Intent Chips Bar */}
      <div className="smart-reply-chips-row">
        <div className="smart-label">
          <Sparkles size={13} className="sparkle-icon" />
          <span>AI 즉답</span>
        </div>

        <button
          type="button"
          className={`intent-chip agree ${activeIntent === 'agree' ? 'active' : ''}`}
          onClick={() => handleIntentClick('agree')}
          title="상대방 의견에 적극 찬성/동의하는 비즈니스 영어 표현"
        >
          <ThumbsUp size={12} />
          <span>적극 동의</span>
        </button>

        <button
          type="button"
          className={`intent-chip disagree ${activeIntent === 'disagree' ? 'active' : ''}`}
          onClick={() => handleIntentClick('disagree')}
          title="정중하고 외교적인 반대 및 대안 제시 표현"
        >
          <ThumbsDown size={12} />
          <span>정중한 거절</span>
        </button>

        <button
          type="button"
          className={`intent-chip schedule ${activeIntent === 'schedule' ? 'active' : ''}`}
          onClick={() => handleIntentClick('schedule')}
          title="일정 조율 또는 추가 검토 시간 요청 표현"
        >
          <Clock size={12} />
          <span>검토/일정 조율</span>
        </button>

        <button
          type="button"
          className={`intent-chip clarify ${activeIntent === 'clarify' ? 'active' : ''}`}
          onClick={() => handleIntentClick('clarify')}
          title="추가 확인 및 구체적 질문 표현"
        >
          <HelpCircle size={12} />
          <span>추가 질문</span>
        </button>

        {activeIntent && (
          <button
            type="button"
            className="smart-reply-close-btn"
            onClick={() => {
              setActiveIntent(null);
              setReplies([]);
            }}
            title="즉답 닫기"
          >
            <X size={14} />
          </button>
        )}
      </div>

      {/* Suggested Replies Drawer */}
      {activeIntent && (
        <div className="smart-reply-results-drawer">
          {loading ? (
            <div className="reply-loading">
              <Sparkles size={14} className="spin-icon" />
              <span>상대방 발화 문맥에 맞춘 비즈니스 즉답 추천 생성 중...</span>
            </div>
          ) : (
            <div className="reply-cards-list">
              {replies.map((r, idx) => (
                <div key={idx} className="reply-card">
                  <div className="reply-card-top">
                    <span className="reply-style-tag">
                      {r.style === 'short' ? '⚡ 간결하고 즉각적인 답변' : '💼 격식 있고 정중한 비즈니스 표현'}
                    </span>
                    <div className="reply-card-actions">
                      <button
                        type="button"
                        className="reply-action-icon-btn"
                        onClick={() => onSpeak(r.en)}
                        title="원어민 발음 듣기"
                      >
                        <Volume2 size={13} />
                      </button>
                      <button
                        type="button"
                        className="reply-action-icon-btn"
                        onClick={() => handleCopy(r.en, idx)}
                        title="채팅창용 복사"
                      >
                        {copiedId === idx ? <Check size={13} className="success" /> : <Copy size={13} />}
                      </button>
                      <button
                        type="button"
                        className="reply-use-btn"
                        onClick={() => {
                          onSelectReply(r.en);
                          setActiveIntent(null);
                        }}
                        title="이 답변을 내 입력창으로 보내기"
                      >
                        <Send size={12} />
                        <span>선택 사용</span>
                      </button>
                    </div>
                  </div>
                  <p className="reply-en-text">{r.en}</p>
                  <p className="reply-ko-text">{r.ko}</p>
                </div>
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  );
};
