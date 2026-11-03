import React from 'react';
import { X, Download, Monitor, Smartphone, CheckCircle, ExternalLink, Sparkles } from 'lucide-react';
import './PWAInstallModal.css';

interface PWAInstallModalProps {
  isOpen: boolean;
  deferredPrompt: any;
  onClose: () => void;
  onDirectPrompt: () => void;
}

export const PWAInstallModal: React.FC<PWAInstallModalProps> = ({
  isOpen,
  deferredPrompt,
  onClose,
  onDirectPrompt,
}) => {
  if (!isOpen) return null;

  // 윈도우 바탕화면 인터넷 바로가기(.url) 파일 다운로드 함수
  const downloadDesktopShortcut = () => {
    const currentUrl = window.location.href;
    const urlContent = `[InternetShortcut]\r\nURL=${currentUrl}\r\nIconIndex=0\r\n`;
    const blob = new Blob([urlContent], { type: 'application/x-mswinurl' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'LiveLingua_실시간번역기.url';
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  return (
    <div className="modal-backdrop" onClick={onClose}>
      <div className="modal-dialog pwa-dialog" onClick={(e) => e.stopPropagation()}>
        <div className="modal-header">
          <div className="modal-title-group">
            <Sparkles size={20} className="modal-icon" />
            <h3 className="modal-title">바탕화면 바로가기 & 앱 설치</h3>
          </div>
          <button type="button" className="modal-close-btn" onClick={onClose}>
            <X size={20} />
          </button>
        </div>

        <div className="modal-body">
          <p className="pwa-intro">
            매번 주소를 입력할 필요 없이, PC 바탕화면 또는 스마트폰 홈 화면에 바로가기를 추가하여 독립 앱으로 즉시 실행하세요.
          </p>

          <div className="pwa-options-grid">
            {/* Option 1: Native PWA Install */}
            <div className="pwa-card highlight">
              <div className="pwa-card-top">
                <span className="pwa-badge">공식 추천</span>
                <Monitor size={22} className="pwa-device-icon" />
              </div>
              <h4 className="pwa-card-title">1. 브라우저 정식 앱으로 설치 (PWA)</h4>
              <p className="pwa-card-desc">
                주소창 없는 깔끔한 독립 윈도우 프로그램으로 바탕화면 및 시작 메뉴에 자동 생성됩니다.
              </p>
              <button
                type="button"
                className="pwa-action-btn primary"
                onClick={() => {
                  if (deferredPrompt) {
                    onDirectPrompt();
                  } else {
                    downloadDesktopShortcut();
                  }
                }}
              >
                <Download size={16} />
                <span>{deferredPrompt ? '바탕화면에 자동 설치하기' : '바로가기 파일 즉시 받기'}</span>
              </button>
            </div>

            {/* Option 2: Windows Shortcut File (.url) */}
            <div className="pwa-card">
              <div className="pwa-card-top">
                <span className="pwa-badge neutral">100% 확실한 방법</span>
                <ExternalLink size={20} className="pwa-device-icon" />
              </div>
              <h4 className="pwa-card-title">2. Windows 바탕화면 바로가기 파일 받기</h4>
              <p className="pwa-card-desc">
                다운로드된 <strong>LiveLingua_실시간번역기.url</strong> 파일을 바탕화면으로 끌어다 놓으면 더블클릭 한 번으로 열립니다.
              </p>
              <button
                type="button"
                className="pwa-action-btn secondary"
                onClick={downloadDesktopShortcut}
              >
                <Download size={15} />
                <span>바로가기 파일(.url) 다운로드</span>
              </button>
            </div>

            {/* Option 3: Mobile Guide */}
            <div className="pwa-mobile-guide">
              <div className="guide-header">
                <Smartphone size={16} className="guide-icon" />
                <span className="guide-title">스마트폰(모바일) 홈 화면에 설치하는 법</span>
              </div>
              <ul className="guide-steps">
                <li>
                  <CheckCircle size={13} className="check-icon" />
                  <span><strong>안드로이드 크롬:</strong> 우측 상단 메뉴(⋮) ➔ <strong>[홈 화면에 추가]</strong> 또는 <strong>[앱 설치]</strong></span>
                </li>
                <li>
                  <CheckCircle size={13} className="check-icon" />
                  <span><strong>아이폰 사파리:</strong> 하단 공유(사각형 화살표) ➔ <strong>[홈 화면에 추가]</strong></span>
                </li>
              </ul>
            </div>
          </div>
        </div>

        <div className="modal-footer">
          <button type="button" className="modal-btn secondary" onClick={onClose}>
            닫기
          </button>
        </div>
      </div>
    </div>
  );
};
