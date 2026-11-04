import React, { useState, useEffect } from 'react';
import { X, Sparkles, CheckSquare, Copy, Check, Download, RefreshCw, FileText, Send } from 'lucide-react';
import { TranslationRecord, AppSettings, MeetingSummary } from '../../types';
import { GoogleGenerativeAI } from '@google/generative-ai';
import { SlackService } from '../../services/slackService';
import { TeamsService } from '../../services/teamsService';
import { GoogleMeetService } from '../../services/googleMeetService';
import { ZoomService } from '../../services/zoomService';
import './MeetingSummaryModal.css';

interface MeetingSummaryModalProps {
  isOpen: boolean;
  records: TranslationRecord[];
  settings: AppSettings;
  onClose: () => void;
  onOpenSettings: () => void;
}

export const MeetingSummaryModal: React.FC<MeetingSummaryModalProps> = ({
  isOpen,
  records,
  settings,
  onClose,
  onOpenSettings,
}) => {
  const [loading, setLoading] = useState(false);
  const [summary, setSummary] = useState<MeetingSummary | null>(null);
  const [copied, setCopied] = useState(false);
  const [googleMeetSending, setGoogleMeetSending] = useState(false);
  const [googleMeetSuccess, setGoogleMeetSuccess] = useState(false);
  const [zoomSending, setZoomSending] = useState(false);
  const [zoomSuccess, setZoomSuccess] = useState(false);
  const [slackSending, setSlackSending] = useState(false);
  const [slackSuccess, setSlackSuccess] = useState(false);
  const [teamsSending, setTeamsSending] = useState(false);
  const [teamsSuccess, setTeamsSuccess] = useState(false);

  const handleSendGoogleMeet = async () => {
    if (!summary) return;
    if (!settings.googleMeetWebhookUrl.trim()) {
      alert('Google Meet(Google Chat) Webhook URL이 설정되지 않았습니다. [환경설정]에서 URL을 입력해 주세요.');
      onClose();
      onOpenSettings();
      return;
    }

    setGoogleMeetSending(true);
    try {
      await GoogleMeetService.sendMeetingSummary(settings.googleMeetWebhookUrl, summary, records.length);
      setGoogleMeetSuccess(true);
      setTimeout(() => setGoogleMeetSuccess(false), 3000);
    } catch (err: any) {
      alert(err.message || 'Google Meet 전송에 실패했습니다.');
    } finally {
      setGoogleMeetSending(false);
    }
  };

  const handleSendZoom = async () => {
    if (!summary) return;
    if (!settings.zoomWebhookUrl.trim()) {
      alert('Zoom Webhook URL이 설정되지 않았습니다. [환경설정]에서 Zoom Webhook URL을 입력해 주세요.');
      onClose();
      onOpenSettings();
      return;
    }

    setZoomSending(true);
    try {
      await ZoomService.sendMeetingSummary(settings.zoomWebhookUrl, summary, records.length);
      setZoomSuccess(true);
      setTimeout(() => setZoomSuccess(false), 3000);
    } catch (err: any) {
      alert(err.message || 'Zoom 전송에 실패했습니다.');
    } finally {
      setZoomSending(false);
    }
  };

  const handleSendSlack = async () => {
    if (!summary) return;
    if (!settings.slackWebhookUrl.trim()) {
      alert('슬랙 Webhook URL이 설정되지 않았습니다. [환경설정]에서 URL을 입력해 주세요.');
      onClose();
      onOpenSettings();
      return;
    }

    setSlackSending(true);
    try {
      await SlackService.sendMeetingSummary(settings.slackWebhookUrl, summary, records.length);
      setSlackSuccess(true);
      setTimeout(() => setSlackSuccess(false), 3000);
    } catch (err: any) {
      alert(err.message || '슬랙 전송에 실패했습니다.');
    } finally {
      setSlackSending(false);
    }
  };

  const handleSendTeams = async () => {
    if (!summary) return;
    if (!settings.teamsWebhookUrl.trim()) {
      alert('Microsoft Teams Webhook URL이 설정되지 않았습니다. [환경설정]에서 Teams Webhook URL을 입력해 주세요.');
      onClose();
      onOpenSettings();
      return;
    }

    setTeamsSending(true);
    try {
      await TeamsService.sendMeetingSummary(settings.teamsWebhookUrl, summary, records.length);
      setTeamsSuccess(true);
      setTimeout(() => setTeamsSuccess(false), 3000);
    } catch (err: any) {
      alert(err.message || 'Teams 전송에 실패했습니다.');
    } finally {
      setTeamsSending(false);
    }
  };

  const generateSummary = async () => {
    if (records.length === 0) return;
    setLoading(true);

    const dialogText = records
      .map((r) => `[${r.sourceLang.toUpperCase()}] ${r.sourceText} ➔ [${r.targetLang.toUpperCase()}] ${r.translatedText}`)
      .join('\n');

    // 1. Gemini AI가 설정된 경우: 고성능 LLM 회의록 요약
    if (settings.engine === 'gemini' && settings.geminiApiKey.trim()) {
      try {
        const genAI = new GoogleGenerativeAI(settings.geminiApiKey);
        const model = genAI.getGenerativeModel({
          model: settings.geminiModel || 'gemini-1.5-flash',
          generationConfig: { temperature: 0.2 },
        });

        const prompt = `System: You are an executive meeting assistant.
Analyze this bilingual video conference transcript.
Generate:
1. Exactly 3 bullet points summarizing the core discussions (in Korean).
2. Bullet points of Action Items / To-do tasks with assigned responsibilities if mentioned (in Korean).

Format strictly as:
[KEY_POINTS]
- point 1
- point 2
- point 3
[ACTION_ITEMS]
- action 1
- action 2

Transcript:
${dialogText}`;

        const res = await model.generateContent(prompt);
        const text = res.response.text();

        const keyPoints: string[] = [];
        const actionItems: string[] = [];

        let currentSection: 'keys' | 'actions' | null = null;
        for (const line of text.split('\n')) {
          const trimmed = line.trim();
          if (trimmed.includes('[KEY_POINTS]')) {
            currentSection = 'keys';
            continue;
          }
          if (trimmed.includes('[ACTION_ITEMS]')) {
            currentSection = 'actions';
            continue;
          }
          if (trimmed.startsWith('-') || trimmed.startsWith('•') || trimmed.match(/^\d+\./)) {
            const clean = trimmed.replace(/^[-•\d.]\s*/, '');
            if (clean) {
              if (currentSection === 'keys') keyPoints.push(clean);
              if (currentSection === 'actions') actionItems.push(clean);
            }
          }
        }

        setSummary({
          keyPoints: keyPoints.length > 0 ? keyPoints.slice(0, 3) : ['회의 주요 안건이 원활하게 논의되었습니다.'],
          actionItems: actionItems.length > 0 ? actionItems : ['특정된 추가 액션 아이템이 없습니다.'],
          createdAt: Date.now(),
        });
        setLoading(false);
        return;
      } catch {
        // Fallback to local heuristic
      }
    }

    // 2. 무료 모드 / 로컬 요약 엔진 (휴리스틱 분석)
    setTimeout(() => {
      const allTranslated = records.map((r) => r.translatedText).filter(Boolean);
      const points = allTranslated.slice(0, 3);
      if (points.length < 3) {
        points.push('안건 공유 및 실시간 번역 협업 완료');
      }

      // To-do 관련 키워드가 포함된 문장 필터
      const actionKeywords = ['확인', '부탁', '검토', '일정', '배포', '공유', '체크', '진행', 'to-do', 'check'];
      const actions = allTranslated
        .filter((t) => actionKeywords.some((k) => t.toLowerCase().includes(k)))
        .slice(0, 4);

      if (actions.length === 0) {
        actions.push('회의록 정리본 및 추가 후속 사항 공유');
      }

      setSummary({
        keyPoints: points,
        actionItems: actions,
        createdAt: Date.now(),
      });
      setLoading(false);
    }, 600);
  };

  useEffect(() => {
    if (isOpen) {
      generateSummary();
    }
  }, [isOpen]);

  if (!isOpen) return null;

  const getFullMarkdown = () => {
    if (!summary) return '';
    const meetingUrl = settings.googleMeetUrl || settings.zoomUrl;
    const meetingLine = meetingUrl ? `회의 링크: ${meetingUrl}\n` : '';
    return `# 📋 화상 회의록 요약 보고서
일시: ${new Date().toLocaleString('ko-KR')}
${meetingLine}총 발화 수: ${records.length}건

## 📌 핵심 논의 안건 (3줄 요약)
${summary.keyPoints.map((p, i) => `${i + 1}. ${p}`).join('\n')}

## ✅ 후속 조치 사항 (Action Items / To-do)
${summary.actionItems.map((a) => `- [ ] ${a}`).join('\n')}

---
생성: LiveLingua KR Meeting AI Assistant`;
  };

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(getFullMarkdown());
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {}
  };

  const handleDownloadMarkdown = () => {
    const md = getFullMarkdown();
    const blob = new Blob([md], { type: 'text/markdown;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `회의록_요약_${new Date().toISOString().slice(0, 10)}.md`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  return (
    <div className="modal-backdrop" onClick={onClose}>
      <div className="modal-dialog summary-dialog" onClick={(e) => e.stopPropagation()}>
        <div className="modal-header">
          <div className="modal-title-group">
            <Sparkles size={20} className="modal-icon sparkle-anim" />
            <h3 className="modal-title">AI 회의록 3줄 요약 & To-do</h3>
          </div>
          <button type="button" className="modal-close-btn" onClick={onClose}>
            <X size={20} />
          </button>
        </div>

        <div className="modal-body">
          {loading ? (
            <div className="summary-loading">
              <div className="spinner-orbit"></div>
              <p className="summary-loading-text">
                {records.length}개의 회의 대화를 분석하여 3줄 요약과 To-do 목록을 추출하는 중...
              </p>
            </div>
          ) : summary ? (
            <div className="summary-content-wrapper">
              {/* 3줄 요약 카드 */}
              <div className="summary-card">
                <div className="card-subtitle-group">
                  <FileText size={16} className="subtitle-icon" />
                  <h4 className="card-subtitle">📌 핵심 논의 안건 (3줄 요약)</h4>
                </div>
                <ol className="key-points-list">
                  {summary.keyPoints.map((point, idx) => (
                    <li key={idx} className="point-item">
                      <span className="point-num">{idx + 1}</span>
                      <p className="point-text">{point}</p>
                    </li>
                  ))}
                </ol>
              </div>

              {/* Action Items 카드 */}
              <div className="summary-card action-card">
                <div className="card-subtitle-group">
                  <CheckSquare size={16} className="subtitle-icon check-color" />
                  <h4 className="card-subtitle">✅ 후속 조치 사항 (Action Items / To-do)</h4>
                </div>
                <ul className="action-items-list">
                  {summary.actionItems.map((action, idx) => (
                    <li key={idx} className="action-item">
                      <input type="checkbox" defaultChecked={false} className="action-chk" />
                      <span className="action-text">{action}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          ) : (
            <p className="empty-dialog-text">요약할 대화 내용이 없습니다.</p>
          )}
        </div>

        <div className="modal-footer summary-footer">
          <button
            type="button"
            className="modal-btn secondary"
            onClick={generateSummary}
            disabled={loading}
          >
            <RefreshCw size={14} />
            <span>다시 생성</span>
          </button>

          <div className="footer-right-buttons">
            <button
              type="button"
              className={`modal-btn google-meet-send-btn ${googleMeetSuccess ? 'success' : ''}`}
              onClick={handleSendGoogleMeet}
              disabled={!summary || loading || googleMeetSending}
              title="설정된 Google Meet (Google Chat) 스페이스로 회의록 요약 즉시 전송"
            >
              {googleMeetSuccess ? <Check size={14} /> : <Send size={14} />}
              <span>{googleMeetSuccess ? 'Meet 전송 완료!' : googleMeetSending ? '전송 중...' : 'Google Meet 전송'}</span>
            </button>

            <button
              type="button"
              className={`modal-btn zoom-send-btn ${zoomSuccess ? 'success' : ''}`}
              onClick={handleSendZoom}
              disabled={!summary || loading || zoomSending}
              title="설정된 Zoom Team Chat 채널로 회의록 요약 즉시 전송"
            >
              {zoomSuccess ? <Check size={14} /> : <Send size={14} />}
              <span>{zoomSuccess ? 'Zoom 전송 완료!' : zoomSending ? '전송 중...' : 'Zoom 전송'}</span>
            </button>

            <button
              type="button"
              className={`modal-btn teams-send-btn ${teamsSuccess ? 'success' : ''}`}
              onClick={handleSendTeams}
              disabled={!summary || loading || teamsSending}
              title="설정된 Microsoft Teams 채널로 회의록 요약 즉시 전송"
            >
              {teamsSuccess ? <Check size={14} /> : <Send size={14} />}
              <span>{teamsSuccess ? 'Teams 전송 완료!' : teamsSending ? '전송 중...' : 'Teams 전송'}</span>
            </button>

            <button
              type="button"
              className={`modal-btn slack-send-btn ${slackSuccess ? 'success' : ''}`}
              onClick={handleSendSlack}
              disabled={!summary || loading || slackSending}
              title="설정된 슬랙 채널로 회의록 요약 즉시 전송"
            >
              {slackSuccess ? <Check size={14} /> : <Send size={14} />}
              <span>{slackSuccess ? '슬랙 전송 완료!' : slackSending ? '전송 중...' : '슬랙 전송'}</span>
            </button>

            <button
              type="button"
              className="modal-btn secondary"
              onClick={handleCopy}
              disabled={!summary || loading}
            >
              {copied ? <Check size={14} /> : <Copy size={14} />}
              <span>{copied ? '복사됨!' : '요약 복사'}</span>
            </button>

            <button
              type="button"
              className="modal-btn primary"
              onClick={handleDownloadMarkdown}
              disabled={!summary || loading}
            >
              <Download size={14} />
              <span>Markdown 저장</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
