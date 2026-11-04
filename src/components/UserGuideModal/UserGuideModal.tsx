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
  Download,
  CheckCircle2,
  HelpCircle,
  ArrowRight,
  Headphones,
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
  const [activeTab, setActiveTab] = useState<'voice' | 'shortcuts' | 'modes' | 'features'>('voice');

  if (!isOpen) return null;

  return (
    <div className="modal-backdrop" onClick={onClose}>
      <div className="modal-dialog guide-modal-dialog" onClick={(e) => e.stopPropagation()}>
        {/* Header */}
        <div className="modal-header">
          <div className="modal-title-group">
            <BookOpen size={20} className="modal-icon guide-book-icon" />
            <h3 className="modal-title">LiveLingua KR 종합 사용자 가이드</h3>
            <span className="guide-version-badge">PRO 매뉴얼</span>
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
            <Mic size={15} />
            <span>음성 인식 & 마이크</span>
          </button>
          <button
            type="button"
            className={`guide-tab-btn ${activeTab === 'shortcuts' ? 'active' : ''}`}
            onClick={() => setActiveTab('shortcuts')}
          >
            <Keyboard size={15} />
            <span>무전기(PTT) & 단축키</span>
          </button>
          <button
            type="button"
            className={`guide-tab-btn ${activeTab === 'modes' ? 'active' : ''}`}
            onClick={() => setActiveTab('modes')}
          >
            <Tv size={15} />
            <span>4대 뷰 & PIP 자막</span>
          </button>
          <button
            type="button"
            className={`guide-tab-btn ${activeTab === 'features' ? 'active' : ''}`}
            onClick={() => setActiveTab('features')}
          >
            <Sparkles size={15} />
            <span>AI 회의록 & 사전 & PWA</span>
          </button>
        </div>

        {/* Modal Body with Rich Guides */}
        <div className="modal-body guide-modal-body">
          {/* TAB 1: Voice & Microphone */}
          {activeTab === 'voice' && (
            <div className="guide-content-section">
              <div className="guide-feature-card">
                <div className="guide-card-header">
                  <div className="guide-icon-box cyan">
                    <Mic size={18} />
                  </div>
                  <div>
                    <h4 className="guide-feature-title">무제한 마이크 연속 청취 (24시간 유지)</h4>
                    <p className="guide-feature-sub">사용자가 직접 끄기 전까지 침묵에도 절대 꺼지지 않습니다.</p>
                  </div>
                </div>
                <p className="guide-text">
                  브라우저의 자동 꺼짐 버그를 해결하여, 회의 중 몇 분 동안 침묵이 이어져도 마이크가 상시 대기합니다.
                  오직 사용자가 직접 <strong>[마이크 끄기]</strong>를 누를 때만 마이크가 안전하게 종료됩니다.
                </p>
              </div>

              <div className="guide-feature-card">
                <div className="guide-card-header">
                  <div className="guide-icon-box purple">
                    <ArrowRight size={18} />
                  </div>
                  <div>
                    <h4 className="guide-feature-title">마이크 인식 언어 원터치 전환 (0.1초 전환)</h4>
                    <p className="guide-feature-sub">말하는 사람에 따라 마이크 언어를 즉시 변경하세요.</p>
                  </div>
                </div>
                <div className="guide-tips-list">
                  <div className="guide-tip-row">
                    <span className="tip-badge">내가 말할 때</span>
                    <span>마이크 옆 <strong>[🇰🇷 한국어 음성]</strong> 클릭 ➔ 한국어 발음을 100% 수음하여 영어로 번역</span>
                  </div>
                  <div className="guide-tip-row">
                    <span className="tip-badge en">외국인이 말할 때</span>
                    <span>마이크 옆 <strong>[🇺🇸 영어 음성]</strong> 클릭 ➔ 원어민 영어 발음을 100% 수음하여 한국어로 번역</span>
                  </div>
                </div>
              </div>

              <div className="guide-feature-card highlight">
                <div className="guide-card-header">
                  <div className="guide-icon-box amber">
                    <Headphones size={18} />
                  </div>
                  <div>
                    <h4 className="guide-feature-title">화상 회의 상대방 스피커 소리 캡처 팁</h4>
                    <p className="guide-feature-sub">Zoom, Teams 상대방의 목소리를 번역기에 입력하는 법</p>
                  </div>
                </div>
                <p className="guide-text">
                  Windows 작업표시줄 스피커 우클릭 ➔ <strong>[소리 설정]</strong> ➔ 입력 장치에서 <strong>'스테레오 믹스 (Stereo Mix)'</strong>를 기본으로 켜두시면, 헤드셋 없이도 컴퓨터에서 나오는 상대방의 영어 소리가 번역기로 직결됩니다.
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
                    <h4 className="guide-feature-title">무전기 모드 (Push-to-Talk) 활용법</h4>
                    <p className="guide-feature-sub">키보드 소음과 주변 잡음을 100% 차단하는 프로 회의 팁</p>
                  </div>
                </div>
                <p className="guide-text">
                  상단 [설정 ⚙️]에서 <strong>[무전기 모드]</strong>를 활성화하면:
                </p>
                <div className="shortcut-box">
                  <div className="key-cap large">Spacebar (누르고 있는 동안)</div>
                  <span className="shortcut-desc">마이크가 켜져 내 목소리를 듣습니다.</span>
                </div>
                <div className="shortcut-box">
                  <div className="key-cap large">Spacebar (손을 떼면)</div>
                  <span className="shortcut-desc">마이크가 꺼지며 즉시 고품질 번역이 완성됩니다.</span>
                </div>
              </div>

              <div className="guide-feature-card">
                <h4 className="guide-feature-title">⚡ 필수 글로벌 단축키 모음</h4>
                <div className="shortcuts-table">
                  <div className="shortcut-table-row">
                    <div className="keys-wrap">
                      <span className="key-cap">Ctrl</span>
                      <span className="key-plus">+</span>
                      <span className="key-cap">Shift</span>
                      <span className="key-plus">+</span>
                      <span className="key-cap">S</span>
                    </div>
                    <span className="action-desc">번역 방향 즉시 맞교환 (영어 ⇄ 한국어)</span>
                  </div>

                  <div className="shortcut-table-row">
                    <div className="keys-wrap">
                      <span className="key-cap">Ctrl</span>
                      <span className="key-plus">+</span>
                      <span className="key-cap">Shift</span>
                      <span className="key-plus">+</span>
                      <span className="key-cap">C</span>
                    </div>
                    <span className="action-desc">번역된 결과 텍스트를 클립보드에 즉시 복사</span>
                  </div>

                  <div className="shortcut-table-row">
                    <div className="keys-wrap">
                      <span className="key-cap">F11</span>
                      <span className="key-desc">또는 [화면 키우기]</span>
                    </div>
                    <span className="action-desc">모니터 전체를 꽉 채우는 Fullscreen 듀얼 뷰 전환</span>
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
                    <h4 className="guide-feature-title">크롬 PIP 플로팅 자막 (최상단 고정)</h4>
                    <p className="guide-feature-sub">다른 창(Zoom, PPT)을 전체화면으로 띄워도 항상 보입니다.</p>
                  </div>
                </div>
                <p className="guide-text">
                  헤더의 <strong>[PIP 자막]</strong> 버튼을 누르면 브라우저 바깥으로 작은 자막 창이 분리됩니다.
                  노트북 모니터가 1개뿐이어도 회의 발표 화면을 가리지 않고 상대방의 말을 자막처럼 실시간으로 볼 수 있습니다.
                </p>
              </div>

              <div className="guide-feature-card">
                <h4 className="guide-feature-title">🖥️ 4대 맞춤 뷰 모드 비교</h4>
                <div className="modes-grid-guide">
                  <div className="mode-guide-item">
                    <span className="mode-name">1. 일반 모드 (기본)</span>
                    <p className="mode-desc">아늑한 여백과 정갈한 카드 패널로 구성된 표준 업무용 레이아웃.</p>
                  </div>
                  <div className="mode-guide-item">
                    <span className="mode-name">2. 대형 50:50 모드</span>
                    <p className="mode-desc">모니터 전체를 좌우로 꽉 채워 원거리에서도 시원하게 보이는 듀얼 스크린.</p>
                  </div>
                  <div className="mode-guide-item">
                    <span className="mode-name">3. 스트림 모드</span>
                    <p className="mode-desc">카카오톡/슬랙처럼 발화가 타임라인 순서로 착착 누적되는 대화 피드.</p>
                  </div>
                  <div className="mode-guide-item">
                    <span className="mode-name">4. 자막 HUD 모드</span>
                    <p className="mode-desc">화상 회의 창 위에 반투명하게 얹어두는 넷플릭스 스타일 하단 자막 바.</p>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* TAB 4: AI Summary, Glossary, PWA */}
          {activeTab === 'features' && (
            <div className="guide-content-section">
              <div className="guide-feature-card highlight">
                <div className="guide-card-header">
                  <div className="guide-icon-box purple">
                    <Sparkles size={18} />
                  </div>
                  <div>
                    <h4 className="guide-feature-title">AI 회의록 3줄 요약 & Action Items 추출</h4>
                    <p className="guide-feature-sub">회의가 끝난 후 1초 만에 요약 보고서를 생성하세요.</p>
                  </div>
                </div>
                <p className="guide-text">
                  상단 모드에서 <strong>[스트림]</strong> 선택 ➔ <strong>[AI 회의록 3줄 요약]</strong> 버튼을 누르면:
                </p>
                <ul className="guide-bullets">
                  <li>📌 <strong>핵심 논의 안건 (3줄 요약)</strong></li>
                  <li>✅ <strong>후속 조치 사항 (To-do 체크리스트)</strong></li>
                </ul>
                <p className="guide-text" style={{ marginTop: '0.4rem' }}>
                  Markdown 파일 다운로드 또는 원클릭 복사로 팀원들에게 즉시 공유할 수 있습니다.
                </p>
              </div>

              <div className="guide-feature-card">
                <div className="guide-card-header">
                  <div className="guide-icon-box amber">
                    <BookMarked size={18} />
                  </div>
                  <div>
                    <h4 className="guide-feature-title">사내 맞춤 전문 용어 사전 (Glossary)</h4>
                    <p className="guide-feature-sub">고유명사나 사내 약어 오번역을 원천 차단합니다.</p>
                  </div>
                </div>
                <p className="guide-text">
                  [설정 ⚙️] 하단에서 <code>K8s ➔ 쿠버네티스</code>, <code>PR ➔ 풀 리퀘스트</code> 처럼 사내 용어를 등록해 두시면, 번역 시 지정된 단어로 100% 자동 치환됩니다.
                </p>
              </div>

              <div className="guide-feature-card">
                <div className="guide-card-header">
                  <div className="guide-icon-box green">
                    <Download size={18} />
                  </div>
                  <div>
                    <h4 className="guide-feature-title">바탕화면 PWA 앱 & 바로가기 파일</h4>
                    <p className="guide-feature-sub">주소창 없이 PC 프로그램처럼 원클릭 실행</p>
                  </div>
                </div>
                <p className="guide-text">
                  상단 <strong>[앱 설치 (PWA)]</strong> 버튼을 눌러 브라우저 앱으로 설치하거나, <strong>.url 바로가기 파일</strong>을 다운로드하여 바탕화면에 두고 더블클릭으로 바로 실행하세요.
                </p>
              </div>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="modal-footer guide-modal-footer">
          <div className="footer-left-hint">
            <HelpCircle size={15} />
            <span>설정에서 번역 엔진, 어조, 단축키를 변경하실 수 있습니다.</span>
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
