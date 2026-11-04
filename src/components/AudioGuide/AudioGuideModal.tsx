import React, { useState, useEffect, useRef } from 'react';
import {
  X,
  Headphones,
  Mic,
  MicOff,
  CheckCircle2,
  AlertTriangle,
  ExternalLink,
  PictureInPicture2,
  Video,
  Monitor,
  Volume2,
  Radio,
  Check,
  Sparkles,
} from 'lucide-react';
import { AudioVisualizerService } from '../../services/audioVisualizer';
import './AudioGuideModal.css';

interface AudioGuideModalProps {
  isOpen: boolean;
  onClose: () => void;
  isPipActive?: boolean;
  onTogglePip?: () => void;
  isListening?: boolean;
  onToggleMic?: () => void;
  visualizerService?: AudioVisualizerService;
  googleMeetUrl?: string;
  zoomUrl?: string;
  onOpenSettings?: () => void;
}

export const AudioGuideModal: React.FC<AudioGuideModalProps> = ({
  isOpen,
  onClose,
  isPipActive = false,
  onTogglePip,
  isListening = false,
  onToggleMic,
  visualizerService,
  googleMeetUrl,
  zoomUrl,
  onOpenSettings,
}) => {
  const [activeTab, setActiveTab] = useState<'quick' | 'guide'>('quick');
  const [isTabAudioCaptured, setIsTabAudioCaptured] = useState(false);
  const [captureVolume, setCaptureVolume] = useState(0);
  const tabStreamRef = useRef<MediaStream | null>(null);
  const audioContextRef = useRef<AudioContext | null>(null);
  const animFrameRef = useRef<number | null>(null);

  useEffect(() => {
    return () => {
      stopTabAudio();
    };
  }, []);

  const handleStartTabCapture = async () => {
    if (!navigator.mediaDevices || !navigator.mediaDevices.getDisplayMedia) {
      alert('현재 브라우저에서는 화면/탭 공유 오디오 캡처를 지원하지 않습니다. Chrome 또는 Edge 브라우저를 사용해 주세요.');
      return;
    }

    try {
      const stream = await navigator.mediaDevices.getDisplayMedia({
        video: true,
        audio: {
          echoCancellation: false,
          noiseSuppression: false,
          autoGainControl: false,
        },
      });

      const audioTracks = stream.getAudioTracks();
      if (audioTracks.length === 0) {
        alert(
          '⚠️ 오디오 트랙이 감지되지 않았습니다!\n\nChrome 화면/탭 공유 창 하단의 [오디오 공유] 또는 [시스템 오디오 공유] 체크박스를 반드시 체크한 후 공유해 주세요.'
        );
        stream.getTracks().forEach((t) => t.stop());
        return;
      }

      tabStreamRef.current = stream;
      setIsTabAudioCaptured(true);

      // Connect to Web Audio API to detect volume
      try {
        const AudioCtx = window.AudioContext || (window as any).webkitAudioContext;
        const ctx = new AudioCtx();
        audioContextRef.current = ctx;
        const analyser = ctx.createAnalyser();
        analyser.fftSize = 256;
        const source = ctx.createMediaStreamSource(stream);
        source.connect(analyser);

        const buffer = new Uint8Array(analyser.frequencyBinCount);
        const checkVol = () => {
          if (!tabStreamRef.current) return;
          analyser.getByteFrequencyData(buffer);
          let sum = 0;
          for (let i = 0; i < buffer.length; i++) sum += buffer[i];
          const avg = sum / buffer.length;
          setCaptureVolume(Math.min(100, Math.round((avg / 128) * 100)));
          animFrameRef.current = requestAnimationFrame(checkVol);
        };
        checkVol();

        // Also connect to visualizer service if provided
        if (visualizerService) {
          visualizerService.startWithStream(stream).catch(() => {});
        }
      } catch {}

      // Handle stream stop by user
      stream.getVideoTracks().forEach((track) => {
        track.onended = () => {
          stopTabAudio();
        };
      });
      stream.getAudioTracks().forEach((track) => {
        track.onended = () => {
          stopTabAudio();
        };
      });
    } catch (err: any) {
      if (err.name !== 'NotAllowedError') {
        alert('화면/탭 오디오 캡처 중 오류가 발생했습니다: ' + (err.message || String(err)));
      }
    }
  };

  const stopTabAudio = () => {
    if (animFrameRef.current) {
      cancelAnimationFrame(animFrameRef.current);
      animFrameRef.current = null;
    }
    if (audioContextRef.current && audioContextRef.current.state !== 'closed') {
      audioContextRef.current.close().catch(() => {});
      audioContextRef.current = null;
    }
    if (tabStreamRef.current) {
      tabStreamRef.current.getTracks().forEach((t) => t.stop());
      tabStreamRef.current = null;
    }
    setIsTabAudioCaptured(false);
    setCaptureVolume(0);
    if (visualizerService) {
      visualizerService.stop();
    }
  };

  if (!isOpen) return null;

  return (
    <div className="modal-backdrop" onClick={onClose}>
      <div className="modal-dialog audio-guide-dialog" onClick={(e) => e.stopPropagation()}>
        <div className="modal-header">
          <div className="modal-title-group">
            <Video size={20} className="modal-icon accent" />
            <h3 className="modal-title">화상 회의 연동 & 오디오 캡처 허브</h3>
            <span className="hub-badge">Google Meet · Zoom · Teams</span>
          </div>
          <button type="button" className="modal-close-btn" onClick={onClose}>
            <X size={20} />
          </button>
        </div>

        {/* Tab Switcher */}
        <div className="hub-tab-bar">
          <button
            type="button"
            className={`hub-tab-btn ${activeTab === 'quick' ? 'active' : ''}`}
            onClick={() => setActiveTab('quick')}
          >
            <Radio size={14} />
            <span>원클릭 회의 연동 & 런처</span>
          </button>
          <button
            type="button"
            className={`hub-tab-btn ${activeTab === 'guide' ? 'active' : ''}`}
            onClick={() => setActiveTab('guide')}
          >
            <Headphones size={14} />
            <span>오디오 연결 & 스테레오 믹스 가이드</span>
          </button>
        </div>

        <div className="modal-body hub-modal-body">
          {activeTab === 'quick' ? (
            <div className="quick-connect-container">
              {/* Meeting App Launch Cards Grid */}
              <div className="meeting-platforms-grid">
                {/* 1. Google Meet Card */}
                <div className="platform-card meet-card">
                  <div className="platform-card-top">
                    <div className="platform-brand">
                      <div className="platform-icon meet-icon">
                        <Video size={18} />
                      </div>
                      <div>
                        <h4 className="platform-title">Google Meet (구글 미트)</h4>
                        <span className="platform-sub">
                          {googleMeetUrl ? '내 전용 회의실 등록됨' : 'meet.google.com'}
                        </span>
                      </div>
                    </div>
                    <span className={`platform-tag meet-tag ${googleMeetUrl ? 'custom' : ''}`}>
                      {googleMeetUrl ? '고정 링크' : '웹 바로 연동'}
                    </span>
                  </div>
                  <p className="platform-desc">
                    {googleMeetUrl ? (
                      <>등록된 내 구글 미트 회의실(<code>{googleMeetUrl.length > 32 ? googleMeetUrl.slice(0, 32) + '...' : googleMeetUrl}</code>)로 즉시 입장합니다.</>
                    ) : (
                      <>Google Meet 회의 창 위에 <strong>PIP 플로팅 자막</strong>을 띄워 상대방의 영어 발화를 실시간 한국어로 확인하세요.</>
                    )}
                  </p>
                  <div className="platform-actions">
                    <button
                      type="button"
                      className="platform-btn meet-btn"
                      onClick={() => window.open(googleMeetUrl || 'https://meet.google.com/new', '_blank')}
                      title={googleMeetUrl ? '등록된 내 회의실 바로 열기' : '새 Google Meet 회의 열기'}
                    >
                      <ExternalLink size={13} />
                      <span>{googleMeetUrl ? '내 회의실 열기' : '새 회의 열기'}</span>
                    </button>
                    <button
                      type="button"
                      className="platform-btn outline"
                      onClick={() => window.open('https://meet.google.com', '_blank')}
                    >
                      <span>회의 참가</span>
                    </button>
                  </div>
                </div>

                {/* 2. Zoom Card */}
                <div className="platform-card zoom-card">
                  <div className="platform-card-top">
                    <div className="platform-brand">
                      <div className="platform-icon zoom-icon">
                        <Monitor size={18} />
                      </div>
                      <div>
                        <h4 className="platform-title">Zoom (줌 회의)</h4>
                        <span className="platform-sub">
                          {zoomUrl ? '내 전용 회의실 등록됨' : 'zoom.us'}
                        </span>
                      </div>
                    </div>
                    <span className={`platform-tag zoom-tag ${zoomUrl ? 'custom' : ''}`}>
                      {zoomUrl ? '고정 링크' : '웹 & 앱 호환'}
                    </span>
                  </div>
                  <p className="platform-desc">
                    {zoomUrl ? (
                      <>등록된 내 Zoom 회의실(<code>{zoomUrl.length > 32 ? zoomUrl.slice(0, 32) + '...' : zoomUrl}</code>)로 즉시 입장합니다.</>
                    ) : (
                      <>Zoom 앱 또는 웹 클라이언트 회의 화면 위로 반투명 PIP 자막을 띄워 회의에 집중할 수 있습니다.</>
                    )}
                  </p>
                  <div className="platform-actions">
                    <button
                      type="button"
                      className="platform-btn zoom-btn"
                      onClick={() => window.open(zoomUrl || 'https://zoom.us/join', '_blank')}
                      title={zoomUrl ? '등록된 내 Zoom 회의실 바로 입장' : 'Zoom 회의 참가'}
                    >
                      <ExternalLink size={13} />
                      <span>{zoomUrl ? '내 회의실 입장' : '회의 참가'}</span>
                    </button>
                    <button
                      type="button"
                      className="platform-btn outline"
                      onClick={() => window.open('https://zoom.us/start/videomeeting', '_blank')}
                    >
                      <span>새 회의 시작</span>
                    </button>
                  </div>
                </div>

                {/* 3. Microsoft Teams Card */}
                <div className="platform-card teams-card">
                  <div className="platform-card-top">
                    <div className="platform-brand">
                      <div className="platform-icon teams-icon">
                        <Headphones size={18} />
                      </div>
                      <div>
                        <h4 className="platform-title">Microsoft Teams (팀즈)</h4>
                        <span className="platform-sub">teams.microsoft.com</span>
                      </div>
                    </div>
                    <span className="platform-tag teams-tag">웹 & 데스크톱</span>
                  </div>
                  <p className="platform-desc">
                    Teams 웹 및 데스크톱 회의와 완벽하게 호환되며, 회의록을 Teams 채널로 원클릭 전송할 수 있습니다.
                  </p>
                  <div className="platform-actions">
                    <button
                      type="button"
                      className="platform-btn teams-btn"
                      onClick={() => window.open('https://teams.microsoft.com', '_blank')}
                    >
                      <ExternalLink size={13} />
                      <span>Teams 웹 열기</span>
                    </button>
                  </div>
                </div>
              </div>

              {/* Direct Tab / System Audio Capture Section */}
              <div className="tab-audio-capture-box">
                <div className="capture-box-header">
                  <div className="capture-title-group">
                    <Volume2 size={18} className="capture-icon" />
                    <div>
                      <h4 className="capture-title">브라우저 탭 오디오 실시간 캡처 (Google Meet · Zoom 탭 소리 직결)</h4>
                      <p className="capture-subtitle">
                        별도 설정 없이 Chrome 브라우저의 Google Meet 또는 Zoom 탭의 소리를 실시간으로 캡처합니다.
                      </p>
                    </div>
                  </div>
                  {isTabAudioCaptured ? (
                    <button
                      type="button"
                      className="capture-action-btn stop"
                      onClick={stopTabAudio}
                    >
                      <span>캡처 중지</span>
                    </button>
                  ) : (
                    <button
                      type="button"
                      className="capture-action-btn start"
                      onClick={handleStartTabCapture}
                    >
                      <Radio size={14} className="pulse-icon" />
                      <span>탭 오디오 캡처 시작</span>
                    </button>
                  )}
                </div>

                {isTabAudioCaptured && (
                  <div className="capture-status-row">
                    <div className="capture-active-indicator">
                      <span className="status-ping"></span>
                      <span>🟢 회의 탭 오디오 수음 중</span>
                    </div>
                    <div className="volume-meter-wrapper">
                      <span className="vol-label">수음 볼륨</span>
                      <div className="vol-bar-bg">
                        <div
                          className="vol-bar-fill"
                          style={{ width: `${Math.min(100, captureVolume * 1.5)}%` }}
                        ></div>
                      </div>
                      <span className="vol-text">{captureVolume}%</span>
                    </div>
                  </div>
                )}

                <div className="capture-guide-note">
                  <AlertTriangle size={14} className="note-icon" />
                  <span>
                    [캡처 시작] 클릭 후 열리는 Chrome 공유 창에서 <strong>'Chrome 탭'</strong> ➔ <strong>'Google Meet' 또는 'Zoom' 탭</strong>을 선택하고, 창 하단의 <strong>[오디오 공유]</strong> 체크박스를 꼭 체크해 주세요!
                  </span>
                </div>
              </div>

              {/* Floating Subtitle & Mic Quick Controls */}
              <div className="quick-controls-bar">
                <div className="quick-ctrl-info">
                  <Sparkles size={16} className="ctrl-icon" />
                  <span>화상 회의 편의 기능</span>
                </div>
                <div className="quick-ctrl-buttons">
                  {onTogglePip && (
                    <button
                      type="button"
                      className={`quick-pill-btn ${isPipActive ? 'active' : ''}`}
                      onClick={onTogglePip}
                      title="모든 창 위에 항상 떠 있는 PIP 플로팅 자막"
                    >
                      <PictureInPicture2 size={14} />
                      <span>{isPipActive ? 'PIP 자막 끄기' : 'PIP 플로팅 자막 켜기'}</span>
                    </button>
                  )}

                  {onToggleMic && (
                    <button
                      type="button"
                      className={`quick-pill-btn mic ${isListening ? 'active' : ''}`}
                      onClick={onToggleMic}
                      title="실시간 음성 인식 토글"
                    >
                      {isListening ? <Mic size={14} /> : <MicOff size={14} />}
                      <span>{isListening ? '음성 번역 듣는 중' : '음성 번역 시작'}</span>
                    </button>
                  )}
                </div>
              </div>
            </div>
          ) : (
            <div className="guide-content-container">
              {/* Method 1: Stereo Mix */}
              <div className="guide-card recommended">
                <div className="guide-card-header">
                  <span className="method-badge">방법 1 (가장 추천 - Zoom/Teams 앱용)</span>
                  <h4 className="guide-card-title">Windows 스테레오 믹스 (Stereo Mix) 활성화</h4>
                </div>
                <p className="guide-desc">
                  컴퓨터 스피커에서 나오는 Zoom / Meet 상대방의 목소리를 번역기 마이크 입력으로 바로 연결합니다.
                </p>
                <ol className="step-list">
                  <li>
                    <CheckCircle2 size={14} className="step-icon" />
                    <span>작업표시줄 우측 하단 <strong>스피커 아이콘 우클릭 ➔ '소리 설정'</strong> 이동</span>
                  </li>
                  <li>
                    <CheckCircle2 size={14} className="step-icon" />
                    <span>입력 장치에서 <strong>'스테레오 믹스(Stereo Mix)'</strong>를 활성화하고 기본 장치로 설정</span>
                  </li>
                  <li>
                    <CheckCircle2 size={14} className="step-icon" />
                    <span>LiveLingua KR 화면에서 <strong>[마이크 켜기]</strong>를 누르면 상대방 목소리가 즉시 번역됩니다!</span>
                  </li>
                </ol>
              </div>

              {/* Method 2: Google Meet & Zoom Web Guide */}
              <div className="guide-card">
                <div className="guide-card-header">
                  <span className="method-badge meet-badge">방법 2 (무설치 - Google Meet & Zoom 웹)</span>
                  <h4 className="guide-card-title">Chrome 브라우저 탭 오디오 공유 및 스피커 수음</h4>
                </div>
                <p className="guide-desc">
                  Chrome 브라우저에서 Google Meet(meet.google.com) 또는 Zoom 웹(zoom.us/join)을 띄우고, LiveLingua의 [탭 오디오 캡처]를 켜거나 스피커 소리를 마이크가 수음하도록 하면 별도 드라이버 설치 없이 깨끗하게 번역됩니다.
                </p>
              </div>

              {/* Method 3: Mac Users Guide */}
              <div className="guide-card">
                <div className="guide-card-header">
                  <span className="method-badge neutral">방법 3 (Mac 사용자 안내)</span>
                  <h4 className="guide-card-title">Mac BlackHole 가상 오디오 케이블 연동</h4>
                </div>
                <p className="guide-desc">
                  macOS에서는 무료 가상 오디오 드라이버인 <strong>BlackHole (2ch)</strong>를 설치한 후, '오디오 MIDI 설정'에서 다중 출력 장치를 구성하시면 Zoom/Google Meet 사운드가 LiveLingua로 직접 루프백 입력됩니다.
                </p>
              </div>

              <div className="guide-tip-box">
                <AlertTriangle size={16} className="tip-icon" />
                <p className="tip-text">
                  <strong>프로 팁:</strong> 내가 발화할 때는 <strong>헤드셋 마이크</strong>로, 외국인 동료들이 회의를 진행할 때는 <strong>스테레오 믹스 또는 탭 오디오 캡처</strong>를 활성화하시면 끊김 없이 실시간 양방향 소통이 가능합니다.
                </p>
              </div>
            </div>
          )}
        </div>

        <div className="modal-footer hub-modal-footer">
          <div className="footer-status-text">
            <span>LiveLingua PRO 화상 회의 어시스턴트</span>
            {onOpenSettings && (
              <button
                type="button"
                className="hub-settings-link"
                onClick={() => {
                  onClose();
                  onOpenSettings();
                }}
                title="Google Meet 및 Zoom 고정 회의실 링크 등록"
              >
                <span>회의 주소 등록/설정 ⚙️</span>
              </button>
            )}
          </div>
          <button type="button" className="modal-btn primary" onClick={onClose}>
            <Check size={15} />
            <span>확인 완료</span>
          </button>
        </div>
      </div>
    </div>
  );
};
