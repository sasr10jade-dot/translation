import { useState, useEffect, useRef, useCallback, useMemo } from 'react';
import { Header } from './components/Header/Header';
import { DualWorkspace } from './components/Workspace/DualWorkspace';
import { HistoryList } from './components/History/HistoryList';
import { SettingsModal } from './components/Settings/SettingsModal';
import { MeetingHUD } from './components/MeetingHUD/MeetingHUD';
import { MeetingStream } from './components/MeetingStream/MeetingStream';
import { MeetingSummaryModal } from './components/MeetingSummaryModal/MeetingSummaryModal';
import { AudioGuideModal } from './components/AudioGuide/AudioGuideModal';
import { UserGuideModal } from './components/UserGuideModal/UserGuideModal';
import { PWAInstallModal } from './components/PWAInstallModal/PWAInstallModal';
import { MobileBottomBar } from './components/MobileBottomBar/MobileBottomBar';
import { SpeechRecognitionService } from './services/speechRecognition';
import { AudioVisualizerService } from './services/audioVisualizer';
import { SpeechSynthesizerService } from './services/speechSynthesizer';
import { PipSubtitleService } from './services/pipSubtitle';
import { translationManager } from './services/translation';
import { StorageService } from './services/storage';
import { detectLanguage } from './utils/langDetect';
import {
  AppSettings,
  AppTheme,
  SupportedLang,
  TargetLang,
  SpeechLangCode,
  TranslationRecord,
  TranslationStatus,
  ViewMode,
  LANGUAGES_MAP,
} from './types';
import './App.css';

export function App() {
  // Settings & History state
  const [settings, setSettings] = useState<AppSettings>(() => StorageService.getSettings());
  const [records, setRecords] = useState<TranslationRecord[]>(() => StorageService.getHistory());

  // View Mode: 'normal' (default), 'wide', 'hud', 'stream'
  const [viewMode, setViewMode] = useState<ViewMode>(settings.defaultViewMode || 'normal');

  // Font Scale state (0.8 ~ 1.5)
  const [fontScale, setFontScale] = useState<number>(settings.fontScale || 1.0);

  // Theme state ('dark' | 'light')
  const [theme, setTheme] = useState<AppTheme>(() => {
    return (localStorage.getItem('livelingua_theme_v1') as AppTheme) || 'dark';
  });

  // 5-Language Direction state
  const [sourceLang, setSourceLang] = useState<SupportedLang>('auto');
  const [targetLang, setTargetLang] = useState<TargetLang>('ko');
  const [speechLang, setSpeechLang] = useState<SpeechLangCode>('ko-KR');

  // Input & Output Text state
  const [sourceText, setSourceText] = useState('');
  const [interimText, setInterimText] = useState('');
  const [translatedText, setTranslatedText] = useState('');
  const [status, setStatus] = useState<TranslationStatus>('idle');
  const [latencyMs, setLatencyMs] = useState(0);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  // Audio state
  const [isListening, setIsListening] = useState(false);
  const [volume, setVolume] = useState(0);
  const [isSpeaking, setIsSpeaking] = useState(false);

  // Modal / Drawer state
  const [showHistory, setShowHistory] = useState(false);
  const [showSettings, setShowSettings] = useState(false);
  const [showAudioGuide, setShowAudioGuide] = useState(false);
  const [showPWAModal, setShowPWAModal] = useState(false);
  const [showSummaryModal, setShowSummaryModal] = useState(false);
  const [showUserGuide, setShowUserGuide] = useState(false);
  const [isPipActive, setIsPipActive] = useState(false);
  const [toast, setToast] = useState<string | null>(null);

  // PWA Install state
  const [deferredPrompt, setDeferredPrompt] = useState<any>(null);

  // Services instances
  const visualizerService = useMemo(() => new AudioVisualizerService(), []);
  const synthesizerService = useMemo(() => SpeechSynthesizerService.getInstance(), []);
  const recognitionRef = useRef<SpeechRecognitionService | null>(null);

  // Debounce & Translation Race Condition Guard
  const debounceTimerRef = useRef<any>(null);
  const currentRequestIdRef = useRef<number>(0);
  const lastTranslatedTextRef = useRef<string>('');
  const executeTranslationRef = useRef<any>(null);

  // Update PIP Subtitle when text changes
  useEffect(() => {
    PipSubtitleService.getInstance().updateSubtitle(
      sourceText + (interimText ? ` (${interimText})` : ''),
      translatedText
    );
  }, [sourceText, interimText, translatedText]);

  // Theme effect & handler
  useEffect(() => {
    document.documentElement.setAttribute('data-theme', theme);
    localStorage.setItem('livelingua_theme_v1', theme);
  }, [theme]);

  const handleToggleTheme = () => {
    const next = theme === 'dark' ? 'light' : 'dark';
    setTheme(next);
    showToast(next === 'light' ? '일반 밝은 모드(라이트)로 전환되었습니다.' : '다크 모드로 전환되었습니다.');
  };

  // Update global CSS font scale
  useEffect(() => {
    document.documentElement.style.setProperty('--font-scale', fontScale.toString());
  }, [fontScale]);

  const handleChangeFontScale = (delta: number) => {
    setFontScale((prev) => {
      const next = Math.min(1.5, Math.max(0.8, Math.round((prev + delta) * 10) / 10));
      return next;
    });
  };

  const showToast = useCallback((msg: string) => {
    setToast(msg);
    setTimeout(() => {
      setToast(null);
    }, 3200);
  }, []);

  // Capture PWA beforeinstallprompt event
  useEffect(() => {
    const handleBeforeInstallPrompt = (e: Event) => {
      e.preventDefault();
      setDeferredPrompt(e);
    };

    window.addEventListener('beforeinstallprompt', handleBeforeInstallPrompt);

    return () => {
      window.removeEventListener('beforeinstallprompt', handleBeforeInstallPrompt);
    };
  }, []);

  const handleInstallPWA = () => {
    setShowPWAModal(true);
  };

  const handleDirectPWAPrompt = async () => {
    if (deferredPrompt) {
      deferredPrompt.prompt();
      const choiceResult = await deferredPrompt.userChoice;
      if (choiceResult.outcome === 'accepted') {
        showToast('바탕화면에 앱이 성공적으로 설치되었습니다!');
      }
      setDeferredPrompt(null);
      setShowPWAModal(false);
    }
  };

  // Save history on change
  useEffect(() => {
    StorageService.saveHistory(records);
  }, [records]);

  // Save settings
  const handleSaveSettings = (newSettings: AppSettings) => {
    setSettings(newSettings);
    StorageService.saveSettings(newSettings);
    showToast('설정이 성공적으로 저장되었습니다.');
  };

  // 5-Language Selectors
  const handleSelectSourceLang = (lang: SupportedLang) => {
    setSourceLang(lang);
    if (lang !== 'auto') {
      const meta = LANGUAGES_MAP[lang as TargetLang];
      if (meta) {
        setSpeechLang(meta.speechCode);
        recognitionRef.current?.setLang(meta.speechCode);
      }
    }
    showToast(`원문 언어가 [${lang === 'auto' ? '자동 감지' : LANGUAGES_MAP[lang as TargetLang]?.label}]로 설정되었습니다.`);
  };

  const handleSelectTargetLang = (lang: TargetLang) => {
    setTargetLang(lang);
    showToast(`번역 대상 언어가 [${LANGUAGES_MAP[lang]?.label}]로 설정되었습니다.`);
  };

  // Swap Source <-> Target Languages
  const handleSwapLanguages = () => {
    const currentEffectiveSrc: TargetLang = sourceLang === 'auto' ? detectLanguage(sourceText) : (sourceLang as TargetLang);
    const nextSource: SupportedLang = targetLang;
    const nextTarget: TargetLang = currentEffectiveSrc;

    setSourceLang(nextSource);
    setTargetLang(nextTarget);

    const speechCode = LANGUAGES_MAP[nextSource as TargetLang]?.speechCode || 'ko-KR';
    setSpeechLang(speechCode);
    recognitionRef.current?.setLang(speechCode);

    if (translatedText.trim()) {
      setSourceText(translatedText);
      setTranslatedText(sourceText);
      lastTranslatedTextRef.current = translatedText;
    }

    showToast(`언어 방향이 [${LANGUAGES_MAP[nextSource as TargetLang]?.label} ➔ ${LANGUAGES_MAP[nextTarget]?.label}]로 전환되었습니다.`);
  };

  // Core High-Performance Translation Executor
  const executeTranslation = useCallback(
    async (text: string, currentSrc: SupportedLang = sourceLang, currentTgt: TargetLang = targetLang, sourceType: 'mic' | 'text' = 'text') => {
      const trimmed = text.trim();
      if (!trimmed) {
        setTranslatedText('');
        setStatus('idle');
        setErrorMessage(null);
        return;
      }

      if (trimmed === lastTranslatedTextRef.current && status === 'success') {
        return;
      }

      const reqId = ++currentRequestIdRef.current;
      setStatus('translating');
      setErrorMessage(null);

      // 5개국어 자동 언어 감지
      let effectiveSrc: TargetLang = currentSrc === 'auto' ? detectLanguage(trimmed) : (currentSrc as TargetLang);
      let effectiveTgt: TargetLang = currentTgt;

      // 만약 원문과 대상 언어가 같아진 경우 기본 언어(한국어 <-> 영어)로 교차 설정
      if (effectiveSrc === effectiveTgt) {
        effectiveTgt = effectiveSrc === 'ko' ? 'en' : 'ko';
      }

      try {
        const result = await translationManager.translate(
          trimmed,
          settings,
          effectiveSrc,
          effectiveTgt
        );

        if (reqId !== currentRequestIdRef.current) {
          return;
        }

        lastTranslatedTextRef.current = trimmed;
        setTranslatedText(result.translatedText);
        setLatencyMs(result.latencyMs);
        setStatus('success');

        if (result.translatedText) {
          const newRecord: TranslationRecord = {
            id: `${Date.now()}_${Math.random().toString(36).substring(2, 6)}`,
            timestamp: Date.now(),
            sourceText: trimmed,
            translatedText: result.translatedText,
            sourceLang: effectiveSrc,
            targetLang: effectiveTgt,
            sourceType,
            engine: result.engine,
            tone: settings.tone,
            latencyMs: result.latencyMs,
            isFavorite: false,
          };
          setRecords((prev) => [newRecord, ...prev.filter((r) => r.sourceText !== trimmed)]);
        }

        // Auto TTS 옵션 활성화 시 대상 언어 네이티브 보이스로 자동 읽기
        if (settings.autoTts && result.translatedText) {
          setIsSpeaking(true);
          synthesizerService.speak(result.translatedText, effectiveTgt, settings.ttsVoiceRate, () => {
            setIsSpeaking(false);
          });
        }
      } catch (err: any) {
        if (reqId === currentRequestIdRef.current) {
          setStatus('error');
          setErrorMessage(err.message || '번역 중 오류가 발생했습니다.');
        }
      }
    },
    [sourceLang, targetLang, settings, status, synthesizerService]
  );

  executeTranslationRef.current = executeTranslation;

  // Initialize Speech Recognition callbacks
  useEffect(() => {
    recognitionRef.current = new SpeechRecognitionService(
      {
        onStart: () => {
          setIsListening(true);
        },
        onEnd: () => {
          setIsListening(false);
        },
        onResult: (interim, final) => {
          if (interim) {
            setInterimText(interim);
          }
          if (final) {
            setInterimText('');
            setSourceText((prev) => {
              const next = prev ? `${prev} ${final}` : final;
              executeTranslationRef.current?.(next, sourceLang, targetLang, 'mic');
              return next;
            });
          }
        },
        onError: (errMsg) => {
          showToast(errMsg);
          setIsListening(false);
          visualizerService.stop();
        },
      },
      speechLang
    );

    return () => {
      recognitionRef.current?.stop();
      visualizerService.stop();
      synthesizerService.stop();
    };
  }, [showToast, visualizerService, synthesizerService]);

  const handleChangeSpeechLang = (lang: SpeechLangCode) => {
    setSpeechLang(lang);
    recognitionRef.current?.setLang(lang);
    const meta = Object.values(LANGUAGES_MAP).find((m) => m.speechCode === lang);
    showToast(`마이크 음성 언어가 [${meta?.flag} ${meta?.label}]로 설정되었습니다.`);
  };

  const handleCycleSpeechLang = () => {
    const codes: SpeechLangCode[] = ['ko-KR', 'en-US', 'ja-JP', 'zh-CN', 'fr-FR'];
    const nextIdx = (codes.indexOf(speechLang) + 1) % codes.length;
    handleChangeSpeechLang(codes[nextIdx]);
  };

  // Mic Toggle Handler (Mobile resource conflict resolved)
  const handleToggleMic = async () => {
    if (isListening) {
      recognitionRef.current?.stop();
      visualizerService.stop();
      setIsListening(false);
    } else {
      if (!SpeechRecognitionService.isSupported()) {
        showToast('현재 브라우저에서는 음성 인식을 지원하지 않습니다. Chrome/Edge를 권장합니다.');
        return;
      }

      recognitionRef.current?.setLang(speechLang);

      const isMobile = typeof navigator !== 'undefined' && /Android|iPhone|iPad|iPod|Mobile/i.test(navigator.userAgent);

      const recStarted = recognitionRef.current?.start();
      if (recStarted) {
        setIsListening(true);
        if (!isMobile) {
          visualizerService.start().catch(() => {});
        }
      } else {
        showToast('마이크를 시작하지 못했습니다. 브라우저의 마이크 권한을 확인해 주세요.');
      }
    }
  };

  // Push-to-Talk (Spacebar) & Global Keyboard Shortcuts
  useEffect(() => {
    let spacePressed = false;

    const handleKeyDown = (e: KeyboardEvent) => {
      const activeTag = document.activeElement?.tagName.toLowerCase();
      const isInputFocused = activeTag === 'input' || activeTag === 'textarea';

      if (settings.pushToTalk && e.code === 'Space' && !isInputFocused) {
        e.preventDefault();
        if (!spacePressed && !isListening) {
          spacePressed = true;
          handleToggleMic();
          showToast('🎙️ 무전기(PTT): 말씀해 주세요...');
        }
      }

      if ((e.ctrlKey || e.metaKey) && e.shiftKey && e.code === 'KeyS') {
        e.preventDefault();
        handleSwapLanguages();
      }

      if ((e.ctrlKey || e.metaKey) && e.shiftKey && e.code === 'KeyC') {
        e.preventDefault();
        if (translatedText) {
          navigator.clipboard.writeText(translatedText).then(() => {
            showToast('번역 결과가 복사되었습니다!');
          });
        }
      }
    };

    const handleKeyUp = (e: KeyboardEvent) => {
      if (settings.pushToTalk && e.code === 'Space' && spacePressed) {
        spacePressed = false;
        if (isListening) {
          handleToggleMic();
          showToast('무전기 완료 ➔ 번역 생성');
        }
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    window.addEventListener('keyup', handleKeyUp);
    return () => {
      window.removeEventListener('keydown', handleKeyDown);
      window.removeEventListener('keyup', handleKeyUp);
    };
  }, [settings.pushToTalk, isListening, translatedText]);

  // Toggle Chrome Picture-in-Picture Subtitle
  const handleTogglePip = async () => {
    const pip = PipSubtitleService.getInstance();
    if (!pip.isSupported()) {
      showToast('현재 브라우저에서는 PIP 기능을 지원하지 않습니다. Chrome/Edge를 권장합니다.');
      return;
    }
    const active = await pip.togglePip();
    setIsPipActive(active);
    showToast(active ? '화면 최상단 PIP 플로팅 자막이 열렸습니다!' : 'PIP 자막이 닫혔습니다.');
  };

  // Text Change Handler with Auto-Detection & Debounce
  const handleTextChange = (newText: string) => {
    setSourceText(newText);
    if (debounceTimerRef.current) {
      clearTimeout(debounceTimerRef.current);
    }

    if (!newText.trim()) {
      setTranslatedText('');
      setStatus('idle');
      setErrorMessage(null);
      return;
    }

    // 5개국어 자동 언어 감지
    let currentSrc = sourceLang;
    let currentTgt = targetLang;
    if (sourceLang === 'auto' && newText.trim()) {
      const detected = detectLanguage(newText);
      currentSrc = detected;
      currentTgt = detected === targetLang ? (detected === 'ko' ? 'en' : 'ko') : targetLang;
    }

    debounceTimerRef.current = setTimeout(() => {
      executeTranslation(newText, currentSrc, currentTgt, 'text');
    }, settings.debounceMs || 450);
  };

  // Clear Text
  const handleClearText = () => {
    setSourceText('');
    setInterimText('');
    setTranslatedText('');
    setStatus('idle');
    setErrorMessage(null);
    lastTranslatedTextRef.current = '';
    synthesizerService.stop();
    setIsSpeaking(false);
  };

  // Prompt chip select
  const handleSelectPrompt = (promptText: string) => {
    setSourceText(promptText);
    executeTranslation(promptText, sourceLang, targetLang, 'text');
  };

  // Paste from clipboard
  const handlePasteClipboard = async () => {
    try {
      const text = await navigator.clipboard.readText();
      if (text) {
        handleTextChange(text);
        showToast('클립보드 내용을 붙여넣었습니다.');
      }
    } catch {
      showToast('클립보드 읽기 권한을 확인해 주세요.');
    }
  };

  // TTS speak handler
  const handleSpeak = (text: string) => {
    if (!text.trim()) return;
    setIsSpeaking(true);
    synthesizerService.speak(text, targetLang, settings.ttsVoiceRate, () => {
      setIsSpeaking(false);
    });
  };

  const handleStopSpeak = () => {
    synthesizerService.stop();
    setIsSpeaking(false);
  };

  // History operations
  const handleToggleFavorite = (id: string) => {
    setRecords((prev) =>
      prev.map((r) => (r.id === id ? { ...r, isFavorite: !r.isFavorite } : r))
    );
  };

  const handleDeleteRecord = (id: string) => {
    setRecords((prev) => prev.filter((r) => r.id !== id));
    showToast('기록이 삭제되었습니다.');
  };

  const handleClearAllRecords = () => {
    if (window.confirm('정말 모든 번역 기록을 삭제하시겠습니까?')) {
      setRecords([]);
      showToast('모든 기록이 비워졌습니다.');
    }
  };

  const handleExportHistory = (format: 'txt' | 'json') => {
    StorageService.exportAsFile(records, format);
    showToast(`${format.toUpperCase()} 파일로 내보냈습니다.`);
  };

  const handleSelectRecordFromHistory = (rec: TranslationRecord) => {
    setSourceText(rec.sourceText);
    setTranslatedText(rec.translatedText);
    setSourceLang(rec.sourceLang);
    setTargetLang(rec.targetLang);
    setStatus('success');
    setLatencyMs(rec.latencyMs);
    lastTranslatedTextRef.current = rec.sourceText;
    setShowHistory(false);
  };

  // Calculate detected language for input panel
  const detectedLang: TargetLang = sourceText.trim()
    ? detectLanguage(sourceText)
    : ((Object.keys(LANGUAGES_MAP).find((k) => LANGUAGES_MAP[k as TargetLang].speechCode === speechLang) as TargetLang) || 'ko');

  return (
    <div className={`app-layout layout-${viewMode}`}>
      {/* Top Header */}
      <Header
        settings={settings}
        theme={theme}
        isListening={isListening}
        historyCount={records.length}
        showHistory={showHistory}
        viewMode={viewMode}
        sourceLang={sourceLang}
        targetLang={targetLang}
        fontScale={fontScale}
        isPipActive={isPipActive}
        onInstallPWA={handleInstallPWA}
        onToggleTheme={handleToggleTheme}
        onTogglePip={handleTogglePip}
        onChangeViewMode={(mode) => setViewMode(mode)}
        onChangeFontScale={handleChangeFontScale}
        onSelectSourceLang={handleSelectSourceLang}
        onSelectTargetLang={handleSelectTargetLang}
        onSwapLanguages={handleSwapLanguages}
        onToggleHistory={() => setShowHistory(!showHistory)}
        onOpenSettings={() => setShowSettings(true)}
        onOpenAudioGuide={() => setShowAudioGuide(true)}
        onOpenUserGuide={() => setShowUserGuide(true)}
      />

      {/* Main Workspace (displayed in normal & wide modes) */}
      {(viewMode === 'normal' || viewMode === 'wide') && (
        <main className="main-content">
          <DualWorkspace
            sourceLang={sourceLang}
            targetLang={targetLang}
            detectedLang={detectedLang}
            speechLang={speechLang}
            viewMode={viewMode}
            sourceText={sourceText}
            interimText={interimText}
            isListening={isListening}
            volume={volume}
            visualizerService={visualizerService}
            onVolumeChange={setVolume}
            onTextChange={handleTextChange}
            onToggleMic={handleToggleMic}
            onChangeSpeechLang={handleChangeSpeechLang}
            onClearText={handleClearText}
            onSelectPrompt={handleSelectPrompt}
            onPasteClipboard={handlePasteClipboard}
            translatedText={translatedText}
            status={status}
            engine={settings.engine}
            tone={settings.tone}
            latencyMs={latencyMs}
            errorMessage={errorMessage}
            onSpeak={handleSpeak}
            onStopSpeak={handleStopSpeak}
            isSpeaking={isSpeaking}
            onRetry={() => executeTranslation(sourceText, sourceLang, targetLang, 'text')}
          />
        </main>
      )}

      {/* Meeting Stream Mode (Messenger Style Timeline) */}
      {viewMode === 'stream' && (
        <main className="main-content stream-main">
          <MeetingStream
            records={records}
            sourceText={sourceText}
            interimText={interimText}
            translatedText={translatedText}
            status={status}
            isListening={isListening}
            sourceLang={sourceLang}
            targetLang={targetLang}
            speechLang={speechLang}
            onToggleMic={handleToggleMic}
            onChangeSpeechLang={handleChangeSpeechLang}
            onTextChange={handleTextChange}
            onSendText={(text) => executeTranslation(text, sourceLang, targetLang, 'text')}
            onSpeak={handleSpeak}
            onOpenSummary={() => setShowSummaryModal(true)}
            onExport={handleExportHistory}
          />
        </main>
      )}

      {/* Floating Subtitle HUD for Video Meetings */}
      {viewMode === 'hud' && (
        <MeetingHUD
          currentEnglish={sourceText}
          interimEnglish={interimText}
          currentKorean={translatedText}
          recentRecords={records}
          isListening={isListening}
          engine={settings.engine}
          sourceLang={sourceLang}
          targetLang={targetLang}
          onToggleMic={handleToggleMic}
          onExitHUD={() => setViewMode('normal')}
          onSpeak={handleSpeak}
        />
      )}

      {/* History Slide-out Drawer */}
      {showHistory && (
        <HistoryList
          records={records}
          onToggleFavorite={handleToggleFavorite}
          onDeleteRecord={handleDeleteRecord}
          onClearAll={handleClearAllRecords}
          onExport={handleExportHistory}
          onSpeak={handleSpeak}
          onSelectRecord={handleSelectRecordFromHistory}
          onClose={() => setShowHistory(false)}
        />
      )}

      {/* Settings Modal */}
      <SettingsModal
        settings={settings}
        isOpen={showSettings}
        onClose={() => setShowSettings(false)}
        onSave={handleSaveSettings}
      />

      {/* Audio Guide Modal for Video Conference Audio Routing */}
      <AudioGuideModal
        isOpen={showAudioGuide}
        onClose={() => setShowAudioGuide(false)}
      />

      {/* PWA Install & Shortcut Modal */}
      <PWAInstallModal
        isOpen={showPWAModal}
        deferredPrompt={deferredPrompt}
        onClose={() => setShowPWAModal(false)}
        onDirectPrompt={handleDirectPWAPrompt}
      />

      {/* AI Meeting Summary & Action Items Modal */}
      <MeetingSummaryModal
        isOpen={showSummaryModal}
        records={records}
        settings={settings}
        onClose={() => setShowSummaryModal(false)}
      />

      {/* Comprehensive User Guide Modal */}
      <UserGuideModal
        isOpen={showUserGuide}
        onClose={() => setShowUserGuide(false)}
        onOpenSettings={() => setShowSettings(true)}
      />

      {/* Mobile Bottom Floating Action Bar */}
      <MobileBottomBar
        isListening={isListening}
        speechLang={speechLang}
        hasText={!!(sourceText || interimText)}
        translatedText={translatedText}
        isSpeaking={isSpeaking}
        onToggleMic={handleToggleMic}
        onCycleSpeechLang={handleCycleSpeechLang}
        onClearText={handleClearText}
        onSpeak={handleSpeak}
      />

      {/* Toast Notification */}
      {toast && (
        <div className="toast-notification">
          <span>{toast}</span>
        </div>
      )}
    </div>
  );
}

export default App;
