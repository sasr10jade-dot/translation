import React, { useState } from 'react';
import {
  X,
  BookOpen,
  Mic,
  Keyboard,
  Tv,
  PictureInPicture2,
  Sparkles,
  BookMarked,
  CheckCircle2,
  HelpCircle,
  ArrowRight,
  Headphones,
  Users,
  Send,
} from 'lucide-react';
import './UserGuideModal.css';

interface UserGuideModalProps {
  isOpen: boolean;
  onClose: () => void;
  onOpenSettings: () => void;
}

export const UserGuideModal: React.FC<UserGuideModalProps> = ({
  isOpen,
  onClose,
  onOpenSettings,
}) => {
  const [activeTab, setActiveTab] = useState<'voice' | 'shortcuts' | 'modes' | 'intelligence'>('voice');

  if (!isOpen) return null;

  return (
    <div className="modal-backdrop" onClick={onClose}>
      <div className="modal-dialog guide-modal-dialog" onClick={(e) => e.stopPropagation()}>
        {/* Header */}
        <div className="modal-header">
          <div className="modal-title-group">
            <BookOpen size={20} className="modal-icon guide-book-icon" />
            <h3 className="modal-title">LiveLingua KR 공식 사용자 가이드북</h3>
            <span className="guide-version-badge">최신 현행화</span>
          </div>
          <button type="button" className="modal-close-btn" onClick={onClose}>
            <X size={20} />
          </button>
        </div>

        {/* Tab Navigation */}
        <div className="guide-tab-nav">
          <button
            type="button"
            className={`guide-tab-btn ${activeTab === 'voice' ? 'active' : ''}`}
            onClick={() => setActiveTab('voice')}
          >
            <Mic size={14} />
            <span>음성 & 5개국어 마이크</span>
          </button>
          <button
            type="button"
            className={`guide-tab-btn ${activeTab === 'shortcuts' ? 'active' : ''}`}
            onClick={() => setActiveTab('shortcuts')}
          >
            <Keyboard size={14} />
            <span>무전기(PTT) & 단축키</span>
          </button>
          <button
            type="button"
            className={`guide-tab-btn ${activeTab === 'modes' ? 'active' : ''}`}
            onClick={() => setActiveTab('modes')}
          >
            <Tv size={14} />
            <span>4대 뷰 & PIP 자막</span>
          </button>
          <button
            type="button"
            className={`guide-tab-btn ${activeTab === 'intelligence' ? 'active' : ''}`}
            onClick={() => setActiveTab('intelligence')}
          >
            <Sparkles size={14} />
            <span>AI 회의록 & 협업 도구 연동</span>
          </button>
        </div>

        {/* Modal Body with Rich Guides */}
        <div className="modal-body guide-modal-body">
          {/* TAB 1: Voice & 5 Languages */}
          {activeTab === 'voice' && (
            <div className="guide-content-section">
              <div className="guide-feature-card highlight">
                <div className="guide-card-header">
                  <div className="guide-icon-box cyan">
                    <Users size={18} />
                  </div>
                  <div>
                    <h4 className="guide-feature-title">발화자 자동 분리 (나 vs 상대방)</h4>
                    <p className="guide-feature-sub">대화 타임라인에서 내가 한 말과 상대방의 말이 명확히 나뉩니다.</p>
                  </div>
                </div>
                <p className="guide-text">
                  마이크 상단의 <strong>[👤 나 (Me)] ⇄ [👥 상대방]</strong> 스위치를 탭하여 발화 주체를 전환하세요:
                </p>
                <div className="guide-tips-list">
                  <div className="guide-tip-row">
                    <span className="tip-badge">👤 나 (Me)</span>
                    <span>우측 인디고 말풍선에 배치되어 내 발언이 기록됩니다.</span>
                  </div>
                  <div className="guide-tip-row">
                    <span className="tip-badge en">👥 상대방</span>
                    <span>좌측 시안/글래스 말풍선에 배치되어 외국인 동료의 발언이 기록됩니다.</span>
                  </div>
                </div>
              </div>

              <div className="guide-feature-card">
                <div className="guide-card-header">
                  <div className="guide-icon-box purple">
                    <ArrowRight size={18} />
                  </div>
                  <div>
                    <h4 className="guide-feature-title">5개국어 마이크 음성 인식 (STT)</h4>
                    <p className="guide-feature-sub">국가별 원어민 발음을 정밀하게 수음합니다.</p>
                  </div>
                </div>
                <p className="guide-text">
                  마이크 옆 언어 선택창에서 <strong>🇰🇷 한국어, 🇺🇸 영어, 🇯🇵 일본어, 🇨🇳 중국어, 🇫🇷 프랑스어</strong> 중 말할 언어를 선택하면, 해당 국가의 음운 엔진이 100% 최적화되어 수음합니다.
                </p>
              </div>

              <div className="guide-feature-card">
                <div className="guide-card-header">
                  <div className="guide-icon-box amber">
                    <Headphones size={18} />
                  </div>
                  <div>
                    <h4 className="guide-feature-title">Google Meet & Zoom 회의 상대방 소리 캡처 팁</h4>
                    <p className="guide-feature-sub">상대방 스피커 소리를 번역기에 직결하는 법</p>
                  </div>
                </div>
                <p className="guide-text">
                  상단 <strong>[회의 연동 🎥]</strong> 버튼을 누르면 Google Meet 및 Zoom 바로가기와 함께 <strong>[브라우저 탭 오디오 실시간 캡처]</strong>를 제공합니다. 또한 Windows 작업표시줄 스피커 우클릭 ➔ <strong>[소리 설정]</strong> ➔ 입력 장치에서 <strong>'스테레오 믹스 (Stereo Mix)'</strong>를 기본 마이크로 설정하시면, 상대방의 목소리가 번역기로 직결 수음됩니다.
                </p>
              </div>
            </div>
          )}

          {/* TAB 2: Shortcuts & Push-to-Talk */}
          {activeTab === 'shortcuts' && (
            <div className="guide-content-section">
              <div className="guide-feature-card highlight">
                <div className="guide-card-header">
                  <div className="guide-icon-box green">
                    <Mic size={18} />
                  </div>
                  <div>
                    <h4 className="guide-feature-title">무전기 모드 (Push-to-Talk) 활용</h4>
                    <p className="guide-feature-sub">키보드 타건 소음과 주변 잡음을 100% 차단</p>
                  </div>
                </div>
                <p className="guide-text">
                  [설정 ⚙️]에서 <strong>[무전기 모드]</strong>를 활성화하면:
                </p>
                <div className="shortcut-box">
                  <div className="key-cap large">Spacebar (누르고 있는 동안)</div>
                  <span className="shortcut-desc">마이크가 켜져 목소리를 수음합니다.</span>
                </div>
                <div className="shortcut-box">
                  <div className="key-cap large">Spacebar (손을 떼면)</div>
                  <span className="shortcut-desc">마이크가 꺼지며 즉시 고품질 번역을 생성합니다.</span>
                </div>
              </div>

              <div className="guide-feature-card">
                <h4 className="guide-feature-title">⚡ 필수 업무 단축키</h4>
                <div className="shortcuts-table">
                  <div className="shortcut-table-row">
                    <div className="keys-wrap">
                      <span className="key-cap">Ctrl</span>
                      <span className="key-plus">+</span>
                      <span className="key-cap">Shift</span>
                      <span className="key-plus">+</span>
                      <span className="key-cap">S</span>
                    </div>
                    <span className="action-desc">언어 방향 즉시 맞교환 (⇄ Swap)</span>
                  </div>

                  <div className="shortcut-table-row">
                    <div className="keys-wrap">
                      <span className="key-cap">Ctrl</span>
                      <span className="key-plus">+</span>
                      <span className="key-cap">Shift</span>
                      <span className="key-plus">+</span>
                      <span className="key-cap">C</span>
                    </div>
                    <span className="action-desc">번역된 결과 텍스트 즉시 복사</span>
                  </div>

                  <div className="shortcut-table-row">
                    <div className="keys-wrap">
                      <span className="key-cap">헤더 [A-] [A+]</span>
                    </div>
                    <span className="action-desc">글자 크기 80% ~ 150% 원클릭 실시간 확대/축소 (설정에서 Noto Sans 등 글꼴 일괄 변경)</span>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* TAB 3: 4 View Modes & PIP */}
          {activeTab === 'modes' && (
            <div className="guide-content-section">
              <div className="guide-feature-card highlight">
                <div className="guide-card-header">
                  <div className="guide-icon-box cyan">
                    <PictureInPicture2 size={18} />
                  </div>
                  <div>
                    <h4 className="guide-feature-title">크롬 PIP 플로팅 자막 (Always-on-top)</h4>
                    <p className="guide-feature-sub">다른 창(Teams, Zoom, PPT) 위에도 항상 떠 있습니다.</p>
                  </div>
                </div>
                <p className="guide-text">
                  헤더의 <strong>[PIP 자막]</strong> 버튼을 누르면 브라우저 바깥으로 작은 자막 창이 분리됩니다.
                  노트북 모니터가 1개뿐이어도 회의 발표 화면을 가리지 않고 상대방의 말을 자막처럼 실시간으로 확인하실 수 있습니다.
                </p>
              </div>

              <div className="guide-feature-card">
                <h4 className="guide-feature-title">🖥️ 4대 맞춤 화면 모드</h4>
                <div className="modes-grid-guide">
                  <div className="mode-guide-item">
                    <span className="mode-name">1. 일반 모드 (기본)</span>
                    <p className="mode-desc">정갈한 카드 패널로 구성된 표준 업무 및 타이핑 번역용 뷰.</p>
                  </div>
                  <div className="mode-guide-item">
                    <span className="mode-name">2. 대형 50:50 모드</span>
                    <p className="mode-desc">모니터 전체를 좌우로 꽉 채워 원거리에서도 시원하게 보이는 듀얼 스크린.</p>
                  </div>
                  <div className="mode-guide-item">
                    <span className="mode-name">3. 스트림 모드 (회의 타임라인)</span>
                    <p className="mode-desc">카카오톡/슬랙처럼 발화와 뉘앙스 코치가 시간순으로 누적되는 대화 피드.</p>
                  </div>
                  <div className="mode-guide-item">
                    <span className="mode-name">4. 자막 HUD 모드</span>
                    <p className="mode-desc">화상 회의 창 위에 얹어두는 넷플릭스 스타일의 반투명 하단 자막 바.</p>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* TAB 4: Intelligence & Teams/Slack */}
          {activeTab === 'intelligence' && (
            <div className="guide-content-section">
              <div className="guide-feature-card highlight">
                <div className="guide-card-header">
                  <div className="guide-icon-box amber">
                    <Sparkles size={18} />
                  </div>
                  <div>
                    <h4 className="guide-feature-title">글로벌 비즈니스 문화 & 뉘앙스 코치</h4>
                    <p className="guide-feature-sub">직역하면 오해하기 쉬운 동서양 완곡 표현을 자동 해설</p>
                  </div>
                </div>
                <p className="guide-text">
                  스트림 모드에서 회의 중 문화적 주의가 필요한 표현이 감지되면 <strong>황금빛 해설 카드</strong>가 자동으로 나타납니다:
                </p>
                <ul className="guide-bullets">
                  <li>🇯🇵 <strong>일본 비즈니스:</strong> <code>検討させていただきます (검토하겠습니다)</code> ➔ 사실상 완곡한 거절/보류 알림.</li>
                  <li>🇺🇸 <strong>서양 비즈니스:</strong> <code>With all due respect</code> ➔ 강력한 반론 예고 신호.</li>
                  <li>🇨🇳 <strong>중국 비즈니스:</strong> <code>哪里哪里</code> ➔ 겸양의 미덕 표현.</li>
                </ul>
              </div>

              <div className="guide-feature-card">
                <div className="guide-card-header">
                  <div className="guide-icon-box purple">
                    <Send size={18} />
                  </div>
                  <div>
                    <h4 className="guide-feature-title">Google Meet · Zoom · Teams · Slack 4대 협업 도구 웹훅 자동 전송</h4>
                    <p className="guide-feature-sub">회의 종료 후 1초 만에 팀 채널로 요약 보고서 발송</p>
                  </div>
                </div>
                <p className="guide-text">
                  [설정 ⚙️]에서 Google Meet(Google Chat), Zoom Team Chat, Teams 또는 Slack 웹훅 URL을 등록해 두시면,
                  스트림 화면 ➔ <strong>[AI 회의록 3줄 요약]</strong> 창에서 <strong>[Google Meet 전송]</strong>, <strong>[Zoom 전송]</strong>, <strong>[Teams 전송 🚀]</strong>, <strong>[슬랙 전송]</strong> 원클릭으로 핵심 안건과 To-do 목록이 팀 대화방으로 즉시 공유됩니다.
                </p>
              </div>

              <div className="guide-feature-card">
                <div className="guide-card-header">
                  <div className="guide-icon-box green">
                    <BookMarked size={18} />
                  </div>
                  <div>
                    <h4 className="guide-feature-title">사내 맞춤 전문 용어 사전 (Glossary)</h4>
                    <p className="guide-feature-sub">고유명사나 사내 약어 오번역을 원천 차단</p>
                  </div>
                </div>
                <p className="guide-text">
                  [설정 ⚙️]에서 <code>K8s ➔ 쿠버네티스</code>, <code>PR ➔ 풀 리퀘스트</code> 등 사내 용어를 등록해 두시면, 번역 시 지정된 단어로 100% 자동 치환됩니다.
                </p>
              </div>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="modal-footer guide-modal-footer">
          <div className="footer-left-hint">
            <HelpCircle size={15} />
            <span>설정에서 단축키, 웹훅, 전문용어 사전을 언제든 변경하실 수 있습니다.</span>
          </div>
          <div className="footer-right-group">
            <button
              type="button"
              className="modal-btn secondary"
              onClick={() => {
                onClose();
                onOpenSettings();
              }}
            >
              <span>환경설정 열기 ➔</span>
            </button>
            <button type="button" className="modal-btn primary" onClick={onClose}>
              <CheckCircle2 size={15} />
              <span>확인했습니다</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
