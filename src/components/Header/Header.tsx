import React, { useState, useEffect } from 'react';
import {
  Languages,
  Mic,
  MicOff,
  Settings,
  History,
  Sparkles,
  Tv,
  Headphones,
  Maximize,
  Minimize,
  Download,
  ArrowLeftRight,
  LayoutTemplate,
  Columns2,
  Sun,
  Moon,
} from 'lucide-react';
import { AppSettings, AppTheme, SupportedLang, TargetLang, ViewMode } from '../../types';
import './Header.css';

interface HeaderProps {
  settings: AppSettings;
  theme: AppTheme;
  isListening: boolean;
  historyCount: number;
  showHistory: boolean;
  viewMode: ViewMode;
  sourceLang: SupportedLang;
  targetLang: TargetLang;
  fontScale: number;
  canInstallPWA: boolean;
  onInstallPWA: () => void;
  onToggleTheme: () => void;
  onChangeViewMode: (mode: ViewMode) => void;
  onChangeFontScale: (delta: number) => void;
  onSwapLanguages: () => void;
  onToggleHistory: () => void;
  onOpenSettings: () => void;
  onOpenAudioGuide: () => void;
}

export const Header: React.FC<HeaderProps> = ({
  settings,
  theme,
  isListening,
  historyCount,
  showHistory,
  viewMode,
  sourceLang,
  targetLang,
  fontScale,
  canInstallPWA,
  onInstallPWA,
  onToggleTheme,
  onChangeViewMode,
  onChangeFontScale,
  onSwapLanguages,
  onToggleHistory,
  onOpenSettings,
  onOpenAudioGuide,
}) => {
  const [isFullscreen, setIsFullscreen] = useState(false);

  useEffect(() => {
    const handleFullscreenChange = () => {
      setIsFullscreen(!!document.fullscreenElement);
    };
    document.addEventListener('fullscreenchange', handleFullscreenChange);
    return () => {
      document.removeEventListener('fullscreenchange', handleFullscreenChange);
    };
  }, []);

  const toggleFullscreen = async () => {
    try {
      if (!document.fullscreenElement) {
        await document.documentElement.requestFullscreen();
      } else {
        await document.exitFullscreen();
      }
    } catch {
      //
    }
  };

  return (
    <header className="app-header">
      {/* Brand Logo */}
      <div className="header-brand">
        <div className="brand-icon-wrapper">
          <Languages className="brand-icon" size={24} />
          <span className="brand-dot"></span>
        </div>
        <div className="brand-text">
          <div className="brand-title-row">
            <h1 className="brand-title">LiveLingua KR</h1>
            <span className="brand-tag">PRO</span>
          </div>
          <p className="brand-subtitle">실시간 양방향 영한·한영 번역기</p>
        </div>
      </div>

      {/* Center: Language Direction & Swap */}
      <div className="header-lang-swap-bar">
        <button
          type="button"
          className="lang-swap-btn"
          onClick={onSwapLanguages}
          title="언어 방향 전환 (영어 ⇄ 한국어)"
        >
          <span className={`lang-chip ${sourceLang === 'en' ? 'active-en' : sourceLang === 'ko' ? 'active-ko' : 'active-auto'}`}>
            {sourceLang === 'auto' ? '자동 감지' : sourceLang === 'en' ? '영어 (EN)' : '한국어 (KO)'}
          </span>
          <div className="swap-icon-circle">
            <ArrowLeftRight size={14} />
          </div>
          <span className={`lang-chip ${targetLang === 'ko' ? 'active-ko' : 'active-en'}`}>
            {targetLang === 'ko' ? '한국어 (KO)' : '영어 (EN)'}
          </span>
        </button>
      </div>

      {/* Right Controls */}
      <div className="header-status-group">
        {/* PWA Desktop App Install Button */}
        {canInstallPWA && (
          <button
            type="button"
            className="header-btn pwa-install-btn"
            onClick={onInstallPWA}
            title="바탕화면에 독립 실행 앱으로 바로가기 설치"
          >
            <Download size={16} className="pwa-icon" />
            <span className="btn-label">바탕화면 앱 설치</span>
          </button>
        )}

        {/* View Mode Segmented Controls */}
        <div className="view-mode-segmented">
          <button
            type="button"
            className={`mode-tab ${viewMode === 'normal' ? 'active' : ''}`}
            onClick={() => onChangeViewMode('normal')}
            title="기본 일반 모드"
          >
            <LayoutTemplate size={15} />
            <span>일반</span>
          </button>
          <button
            type="button"
            className={`mode-tab ${viewMode === 'wide' ? 'active' : ''}`}
            onClick={() => onChangeViewMode('wide')}
            title="대형 50:50 분할 모드"
          >
            <Columns2 size={15} />
            <span>대형 50:50</span>
          </button>
          <button
            type="button"
            className={`mode-tab ${viewMode === 'hud' ? 'active' : ''}`}
            onClick={() => onChangeViewMode('hud')}
            title="화상 회의용 플로팅 자막 HUD"
          >
            <Tv size={15} />
            <span>자막 HUD</span>
          </button>
        </div>

        {/* Font Scale Adjuster */}
        <div className="font-scale-control" title="전체 폰트 크기 확대/축소">
          <button
            type="button"
            className="scale-btn"
            onClick={() => onChangeFontScale(-0.1)}
            disabled={fontScale <= 0.8}
            title="글자 크기 축소 (A-)"
          >
            A-
          </button>
          <span className="scale-val">{Math.round(fontScale * 100)}%</span>
          <button
            type="button"
            className="scale-btn"
            onClick={() => onChangeFontScale(0.1)}
            disabled={fontScale >= 1.5}
            title="글자 크기 확대 (A+)"
          >
            A+
          </button>
        </div>

        {/* Theme Toggle Button */}
        <button
          type="button"
          className="header-btn theme-toggle-btn"
          onClick={onToggleTheme}
          title={theme === 'dark' ? '일반 밝은 모드로 전환 (라이트 테마)' : '다크 모드로 전환'}
        >
          {theme === 'dark' ? <Sun size={16} /> : <Moon size={16} />}
        </button>

        {/* Fullscreen Button */}
        <button
          type="button"
          className={`header-btn fullscreen-btn ${isFullscreen ? 'active' : ''}`}
          onClick={toggleFullscreen}
          title={isFullscreen ? '전체 화면 해제 (ESC)' : '화면 전체로 키우기'}
        >
          {isFullscreen ? <Minimize size={16} /> : <Maximize size={16} />}
        </button>

        {/* Audio Guide Button */}
        <button
          type="button"
          className="header-btn guide-btn"
          onClick={onOpenAudioGuide}
          title="화상 회의 상대방 목소리 캡처(스테레오 믹스) 가이드"
        >
          <Headphones size={16} />
        </button>

        {/* Engine status badge */}
        <div className={`engine-badge ${settings.engine === 'gemini' ? 'gemini' : 'free'}`}>
          {settings.engine === 'gemini' ? (
            <>
              <Sparkles size={13} className="sparkle-icon" />
              <span>Gemini Flash</span>
            </>
          ) : (
            <>
              <span className="status-dot"></span>
              <span>무료 엔진</span>
            </>
          )}
        </div>

        {/* Mic status indicator */}
        <div className={`mic-status-pill ${isListening ? 'active' : ''}`}>
          {isListening ? (
            <>
              <Mic size={14} className="mic-pulse-icon" />
              <span>{sourceLang === 'ko' ? '한글 음성 인식' : '영어 음성 인식'}</span>
            </>
          ) : (
            <>
              <MicOff size={14} />
              <span>대기</span>
            </>
          )}
        </div>

        {/* History toggle button */}
        <button
          className={`header-btn ${showHistory ? 'active' : ''}`}
          onClick={onToggleHistory}
          title="번역 기록 보기/숨기기"
        >
          <History size={16} />
          {historyCount > 0 && <span className="counter-badge">{historyCount}</span>}
        </button>

        {/* Settings button */}
        <button
          className="header-btn settings-btn"
          onClick={onOpenSettings}
          title="환경 설정 (API 키, 번역 어조 등)"
        >
          <Settings size={16} />
        </button>
      </div>
    </header>
  );
};
