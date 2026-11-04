import React, { useState } from 'react';
import { X, Sparkles, Key, Check, AlertCircle, Eye, EyeOff, Save, Volume2, Sliders, Type, Video } from 'lucide-react';
import { AppSettings, TranslationEngine, TranslationTone, AppFontFamily } from '../../types';
import { GeminiTranslatorService } from '../../services/translation/geminiTranslator';
import './SettingsModal.css';

interface SettingsModalProps {
  settings: AppSettings;
  isOpen: boolean;
  onClose: () => void;
  onSave: (newSettings: AppSettings) => void;
}

export const SettingsModal: React.FC<SettingsModalProps> = ({
  settings,
  isOpen,
  onClose,
  onSave,
}) => {
  const [engine, setEngine] = useState<TranslationEngine>(settings.engine);
  const [apiKey, setApiKey] = useState(settings.geminiApiKey);
  const [model, setModel] = useState(settings.geminiModel || 'gemini-1.5-flash');
  const [tone, setTone] = useState<TranslationTone>(settings.tone);
  const [autoTts, setAutoTts] = useState(settings.autoTts);
  const [ttsVoiceRate, setTtsVoiceRate] = useState(settings.ttsVoiceRate || 1.0);
  const [fontFamily, setFontFamily] = useState<AppFontFamily>(settings.fontFamily || 'noto-sans');
  const [showKey, setShowKey] = useState(false);

  // API key connection testing state
  const [testing, setTesting] = useState(false);
  const [testResult, setTestResult] = useState<{ success: boolean; message: string } | null>(null);

  if (!isOpen) return null;

  const handleTestApiKey = async () => {
    if (!apiKey.trim()) {
      setTestResult({ success: false, message: 'API 키를 먼저 입력해 주세요.' });
      return;
    }

    setTesting(true);
    setTestResult(null);

    try {
      const tester = new GeminiTranslatorService(apiKey, model);
      const res = await tester.translate('Hello world');
      if (res.translatedText) {
        setTestResult({
          success: true,
          message: `연결 성공! (응답: "${res.translatedText}", ${res.latencyMs}ms)`,
        });
      }
    } catch (err: any) {
      setTestResult({
        success: false,
        message: err.message || 'API 키 검증에 실패했습니다.',
      });
    } finally {
      setTesting(false);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSave({
      ...settings,
      engine,
      geminiApiKey: apiKey.trim(),
      geminiModel: model,
      tone,
      autoTts,
      ttsVoiceRate,
      fontFamily,
    });
    onClose();
  };

  return (
    <div className="modal-backdrop" onClick={onClose}>
      <div className="modal-dialog" onClick={(e) => e.stopPropagation()}>
        {/* Modal Header */}
        <div className="modal-header">
          <div className="modal-title-group">
            <Sliders size={20} className="modal-icon" />
            <h3 className="modal-title">환경 설정</h3>
          </div>
          <button type="button" className="modal-close-btn" onClick={onClose}>
            <X size={20} />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="modal-form">
          <div className="modal-body">
            {/* 1. Translation Engine Choice */}
            <div className="setting-section">
              <label className="section-label">번역 엔진 선택</label>
              <div className="engine-radio-grid">
                <div
                  className={`engine-card-option ${engine === 'free' ? 'selected' : ''}`}
                  onClick={() => setEngine('free')}
                >
                  <div className="engine-card-top">
                    <span className="engine-title">무료 기본 엔진</span>
                    {engine === 'free' && <Check size={16} className="selected-check" />}
                  </div>
                  <p className="engine-desc">
                    별도 키 입력 없이 즉시 사용 가능한 빠른 기본 번역
                  </p>
                </div>

                <div
                  className={`engine-card-option ${engine === 'gemini' ? 'selected' : ''}`}
                  onClick={() => setEngine('gemini')}
                >
                  <div className="engine-card-top">
                    <span className="engine-title gemini-title">
                      <Sparkles size={14} /> Gemini AI 엔진
                    </span>
                    {engine === 'gemini' && <Check size={16} className="selected-check" />}
                  </div>
                  <p className="engine-desc">
                    자연스러운 한국어 구어체 및 어조(존댓말/격식) 완벽 제어
                  </p>
                </div>
              </div>
            </div>

            {/* 2. Gemini Settings (Shown or highlighted) */}
            {engine === 'gemini' && (
              <div className="setting-section gemini-settings-box">
                <div className="gemini-box-header">
                  <label className="section-label">
                    <Key size={14} />
                    <span>Gemini API 키 설정</span>
                  </label>
                  <a
                    href="https://aistudio.google.com/app/apikey"
                    target="_blank"
                    rel="noreferrer"
                    className="get-api-key-link"
                    title="Google AI Studio에서 10초 만에 무료 API Key 발급받기"
                  >
                    <span>무료 API 키 발급받기 ↗</span>
                  </a>
                </div>
                <div className="input-with-actions">
                  <input
                    type={showKey ? 'text' : 'password'}
                    placeholder="AIzaSy... (Google AI Studio API Key)"
                    value={apiKey}
                    onChange={(e) => setApiKey(e.target.value)}
                    className="api-key-input"
                  />
                  <button
                    type="button"
                    className="icon-action-btn"
                    onClick={() => setShowKey(!showKey)}
                    title={showKey ? '키 숨기기' : '키 보기'}
                  >
                    {showKey ? <EyeOff size={16} /> : <Eye size={16} />}
                  </button>
                  <button
                    type="button"
                    className="test-key-btn"
                    onClick={handleTestApiKey}
                    disabled={testing || !apiKey}
                  >
                    {testing ? '검증 중...' : '연결 테스트'}
                  </button>
                </div>

                {testResult && (
                  <div className={`test-feedback ${testResult.success ? 'success' : 'error'}`}>
                    {testResult.success ? (
                      <Check size={14} />
                    ) : (
                      <AlertCircle size={14} />
                    )}
                    <span>{testResult.message}</span>
                  </div>
                )}

                <div className="gemini-sub-row">
                  <div className="sub-field">
                    <label className="sub-label">모델 선택</label>
                    <select
                      value={model}
                      onChange={(e) => setModel(e.target.value)}
                      className="select-input"
                    >
                      <option value="gemini-1.5-flash">Gemini 1.5 Flash (권장: 초고속)</option>
                      <option value="gemini-2.0-flash">Gemini 2.0 Flash (최신 모델)</option>
                      <option value="gemini-1.5-pro">Gemini 1.5 Pro (정밀 번역)</option>
                    </select>
                  </div>
                </div>
              </div>
            )}

            {/* 3. Tone of Translation */}
            <div className="setting-section">
              <label className="section-label">번역 어조 / 스타일</label>
              <div className="tone-grid">
                {[
                  { value: 'natural', label: '자연스러운 표준체', desc: '일상에서 가장 자연스러운 해요체' },
                  { value: 'polite', label: '정중한 존댓말', desc: '예의 바른 하십시오/해요체' },
                  { value: 'casual', label: '친근한 반말', desc: '친구와 대화하듯 편안한 어조' },
                  { value: 'formal', label: '격식 보고체', desc: '비즈니스 및 뉴스 발표체' },
                ].map((item) => (
                  <button
                    key={item.value}
                    type="button"
                    className={`tone-card ${tone === item.value ? 'active' : ''}`}
                    onClick={() => setTone(item.value as TranslationTone)}
                  >
                    <span className="tone-label">{item.label}</span>
                    <span className="tone-desc">{item.desc}</span>
                  </button>
                ))}
              </div>
            </div>

            {/* 4. Font Family Setting (Default: Noto Sans) */}
            <div className="setting-section">
              <label className="section-label">
                <Type size={14} />
                <span>글꼴 (폰트) 일괄 설정</span>
              </label>
              <p className="setting-sub-desc">
                전체 화면과 플로팅 자막, 회의 스트림에 적용되는 기본 글꼴을 선택합니다. (기본: Noto Sans)
              </p>
              <div className="font-options-grid">
                {[
                  {
                    id: 'noto-sans',
                    name: 'Noto Sans (노토 산스)',
                    tag: '기본 / 권장',
                    desc: '구글 개발 5개국어 범용 고딕 서체로 화면 가독성이 가장 뛰어납니다.',
                    fontFamily: 'var(--font-family-noto)',
                  },
                  {
                    id: 'pretendard',
                    name: 'Pretendard (프리텐다드)',
                    tag: '모던 UI',
                    desc: 'Apple 산돌고딕 스타일의 깔끔하고 현대적인 시스템 UI 서체.',
                    fontFamily: 'var(--font-family-pretendard)',
                  },
                  {
                    id: 'nanum-gothic',
                    name: '나눔고딕 (Nanum Gothic)',
                    tag: '네이버',
                    desc: '친근하고 또렷한 획 굵기의 한글 표준 고딕 서체.',
                    fontFamily: 'var(--font-family-nanum)',
                  },
                  {
                    id: 'system',
                    name: '시스템 기본 글꼴 (System)',
                    tag: 'OS 표준',
                    desc: '운영체제(Windows Segoe UI, macOS San Francisco) 기본 글꼴.',
                    fontFamily: 'var(--font-family-system)',
                  },
                ].map((item) => (
                  <button
                    key={item.id}
                    type="button"
                    className={`font-card ${fontFamily === item.id ? 'active' : ''}`}
                    onClick={() => {
                      setFontFamily(item.id as AppFontFamily);
                      let cssVar = 'var(--font-family-noto)';
                      if (item.id === 'pretendard') cssVar = 'var(--font-family-pretendard)';
                      else if (item.id === 'nanum-gothic') cssVar = 'var(--font-family-nanum)';
                      else if (item.id === 'system') cssVar = 'var(--font-family-system)';
                      document.documentElement.style.setProperty('--font-family', cssVar);
                    }}
                  >
                    <div className="font-card-header">
                      <span className="font-name" style={{ fontFamily: item.fontFamily }}>
                        {item.name}
                      </span>
                      <span className={`font-tag ${item.id === 'noto-sans' ? 'recommend' : ''}`}>
                        {item.tag}
                      </span>
                    </div>
                    <p className="font-desc">{item.desc}</p>
                    <div className="font-sample-preview" style={{ fontFamily: item.fontFamily }}>
                      가나다라 ABC 123 LiveLingua KR 실시간 회의 번역
                    </div>
                  </button>
                ))}
              </div>
            </div>

            {/* 4. Audio & Push-to-Talk Settings */}
            <div className="setting-section">
              <label className="section-label">
                <Volume2 size={14} />
                <span>음성 및 무전기(PTT) 모드</span>
              </label>

              {/* Push-to-Talk Mode Switch */}
              <div className="toggle-row">
                <div className="toggle-info">
                  <span className="toggle-title">무전기 모드 (Push-to-Talk)</span>
                  <span className="toggle-desc">
                    키보드 <strong>Spacebar</strong>를 누르고 있는 동안에만 마이크가 켜지고, 손을 떼면 즉시 번역됩니다.
                  </span>
                </div>
                <label className="switch-wrapper">
                  <input
                    type="checkbox"
                    checked={settings.pushToTalk}
                    onChange={(e) => onSave({ ...settings, pushToTalk: e.target.checked })}
                  />
                  <span className="switch-slider"></span>
                </label>
              </div>

              <div className="toggle-row">
                <div className="toggle-info">
                  <span className="toggle-title">번역 완료 시 자동 읽기 (Auto TTS)</span>
                  <span className="toggle-desc">새로운 문장 번역이 완료되면 자동으로 한국어/영어 발음을 들려줍니다.</span>
                </div>
                <label className="switch-wrapper">
                  <input
                    type="checkbox"
                    checked={autoTts}
                    onChange={(e) => setAutoTts(e.target.checked)}
                  />
                  <span className="switch-slider"></span>
                </label>
              </div>

              <div className="slider-row">
                <div className="slider-label-group">
                  <span className="slider-label">음성 읽기 속도</span>
                  <span className="slider-value">{ttsVoiceRate.toFixed(1)}x</span>
                </div>
                <input
                  type="range"
                  min="0.8"
                  max="1.4"
                  step="0.1"
                  value={ttsVoiceRate}
                  onChange={(e) => setTtsVoiceRate(parseFloat(e.target.value))}
                  className="range-slider"
                />
              </div>
            </div>

            {/* 5. Custom Glossary (전문 용어 사전) */}
            <div className="setting-section">
              <label className="section-label">
                <span>사내/업무 맞춤 전문 용어 사전 (Glossary)</span>
              </label>
              <p className="setting-sub-desc">
                자주 오번역되는 고유명사나 사내 약어를 등록하면, 번역 시 지정된 단어로 100% 자동 치환됩니다.
              </p>

              <div className="glossary-items-list">
                {(settings.glossary || []).map((item) => (
                  <div key={item.id} className="glossary-row">
                    <input
                      type="checkbox"
                      checked={item.enabled}
                      onChange={(e) => {
                        const updated = settings.glossary.map((g) =>
                          g.id === item.id ? { ...g, enabled: e.target.checked } : g
                        );
                        onSave({ ...settings, glossary: updated });
                      }}
                      className="glossary-checkbox"
                      title="적용 여부"
                    />
                    <span className="glossary-src">{item.sourceWord}</span>
                    <span className="glossary-arrow">➔</span>
                    <span className="glossary-tgt">{item.targetWord}</span>
                    <button
                      type="button"
                      className="glossary-del-btn"
                      onClick={() => {
                        const updated = settings.glossary.filter((g) => g.id !== item.id);
                        onSave({ ...settings, glossary: updated });
                      }}
                      title="용어 삭제"
                    >
                      <X size={13} />
                    </button>
                  </div>
                ))}
              </div>

              {/* Add New Word to Glossary */}
              <div className="glossary-add-row">
                <input
                  type="text"
                  placeholder="원문 단어 (예: K8s, PR)"
                  id="new-glossary-src"
                  className="glossary-input"
                />
                <input
                  type="text"
                  placeholder="대체 단어 (예: 쿠버네티스)"
                  id="new-glossary-tgt"
                  className="glossary-input"
                />
                <button
                  type="button"
                  className="glossary-add-btn"
                  onClick={() => {
                    const srcInput = document.getElementById('new-glossary-src') as HTMLInputElement;
                    const tgtInput = document.getElementById('new-glossary-tgt') as HTMLInputElement;
                    if (srcInput && tgtInput && srcInput.value.trim() && tgtInput.value.trim()) {
                      const newItem = {
                        id: Date.now().toString(),
                        sourceWord: srcInput.value.trim(),
                        targetWord: tgtInput.value.trim(),
                        enabled: true,
                      };
                      onSave({
                        ...settings,
                        glossary: [...(settings.glossary || []), newItem],
                      });
                      srcInput.value = '';
                      tgtInput.value = '';
                    }
                  }}
                >
                  추가
                </button>
              </div>
            </div>

            {/* 6. Google Meet (Google Chat) Webhook Integration */}
            <div className="setting-section">
              <label className="section-label">
                <span>Google Meet (Google Chat) 회의록 자동 전송 연동</span>
              </label>
              <p className="setting-sub-desc">
                Google Chat 스페이스의 웹훅 URL을 등록하면, Google Meet 회의 종료 시 AI 3줄 요약과 To-do 목록이 해당 구글 챗 대화방으로 즉시 전송됩니다.
              </p>
              <input
                type="text"
                placeholder="https://chat.googleapis.com/v1/spaces/.../messages?key=...&token=..."
                value={settings.googleMeetWebhookUrl || ''}
                onChange={(e) => onSave({ ...settings, googleMeetWebhookUrl: e.target.value.trim() })}
                className="glossary-input"
                style={{ width: '100%', boxSizing: 'border-box' }}
              />
            </div>

            {/* 7. Zoom Team Chat Webhook Integration */}
            <div className="setting-section">
              <label className="section-label">
                <span>Zoom Team Chat 회의록 자동 전송 연동</span>
              </label>
              <p className="setting-sub-desc">
                Zoom Team Chat 채널의 Incoming Webhook URL을 등록하면, Zoom 회의 종료 시 요약 보고서와 To-do 목록이 줌 대화방으로 즉시 전송됩니다.
              </p>
              <input
                type="text"
                placeholder="https://integrations.zoom.us/chat/webhooks/incomingwebhook/..."
                value={settings.zoomWebhookUrl || ''}
                onChange={(e) => onSave({ ...settings, zoomWebhookUrl: e.target.value.trim() })}
                className="glossary-input"
                style={{ width: '100%', boxSizing: 'border-box' }}
              />
            </div>

            {/* 8. Slack Webhook Integration */}
            <div className="setting-section">
              <label className="section-label">
                <span>슬랙(Slack) 회의록 자동 전송 연동</span>
              </label>
              <p className="setting-sub-desc">
                슬랙 인커밍 웹훅 URL을 등록하면, 회의 종료 시 AI 3줄 요약과 To-do 목록이 팀 슬랙 채널로 즉시 전송됩니다.
              </p>
              <input
                type="text"
                placeholder="https://hooks.slack.com/services/T.../B.../..."
                value={settings.slackWebhookUrl || ''}
                onChange={(e) => onSave({ ...settings, slackWebhookUrl: e.target.value.trim() })}
                className="glossary-input"
                style={{ width: '100%', boxSizing: 'border-box' }}
              />
            </div>

            {/* 9. Microsoft Teams Webhook Integration */}
            <div className="setting-section">
              <label className="section-label">
                <span>Microsoft Teams(팀즈) 회의록 자동 전송 연동</span>
              </label>
              <p className="setting-sub-desc">
                팀즈 채널의 인커밍 웹훅 URL을 등록하면, 회의 종료 시 3줄 요약과 To-do 목록이 팀즈 대화방으로 즉시 전송됩니다.
              </p>
              <input
                type="text"
                placeholder="https://...webhook.office.com/webhookb2/..."
                value={settings.teamsWebhookUrl || ''}
                onChange={(e) => onSave({ ...settings, teamsWebhookUrl: e.target.value.trim() })}
                className="glossary-input"
                style={{ width: '100%', boxSizing: 'border-box' }}
              />
            </div>

            {/* 10. Frequently Used Meeting Room URLs (Google Meet & Zoom) */}
            <div className="setting-section meeting-urls-section">
              <label className="section-label">
                <Video size={14} />
                <span>자주 사용하는 화상 회의 주소 (Google Meet · Zoom)</span>
              </label>
              <p className="setting-sub-desc">
                자주 참석하거나 주최하는 고정 회의실 링크를 등록해 두시면, 상단 [회의 연동] 허브 및 HUD/스트림의 [Meet], [Zoom] 버튼 클릭 시 해당 주소로 즉시 입장합니다.
              </p>

              <div className="meeting-url-fields-group">
                <div className="meeting-url-field">
                  <div className="url-field-header">
                    <span className="url-brand-tag meet">Google Meet 회의 주소</span>
                    {settings.googleMeetUrl && <span className="url-set-badge">등록됨 ✓</span>}
                  </div>
                  <input
                    type="text"
                    placeholder="https://meet.google.com/abc-defg-hij"
                    value={settings.googleMeetUrl || ''}
                    onChange={(e) => onSave({ ...settings, googleMeetUrl: e.target.value.trim() })}
                    className="glossary-input"
                    style={{ width: '100%', boxSizing: 'border-box' }}
                  />
                </div>

                <div className="meeting-url-field">
                  <div className="url-field-header">
                    <span className="url-brand-tag zoom">Zoom 회의 주소 / 초대 링크</span>
                    {settings.zoomUrl && <span className="url-set-badge">등록됨 ✓</span>}
                  </div>
                  <input
                    type="text"
                    placeholder="https://zoom.us/j/1234567890?pwd=... 또는 zoom.us 초대 링크"
                    value={settings.zoomUrl || ''}
                    onChange={(e) => onSave({ ...settings, zoomUrl: e.target.value.trim() })}
                    className="glossary-input"
                    style={{ width: '100%', boxSizing: 'border-box' }}
                  />
                </div>
              </div>
            </div>
          </div>

          {/* Modal Footer */}
          <div className="modal-footer">
            <button type="button" className="modal-btn secondary" onClick={onClose}>
              취소
            </button>
            <button type="submit" className="modal-btn primary">
              <Save size={16} />
              <span>설정 저장</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
