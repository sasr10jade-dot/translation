// Web Speech API Types Declaration
interface IWindowSpeechRecognition extends Window {
  SpeechRecognition?: any;
  webkitSpeechRecognition?: any;
}

export interface SpeechRecognitionCallbacks {
  onResult: (interimTranscript: string, finalTranscript: string) => void;
  onStart: () => void;
  onEnd: () => void;
  onError: (errorMessage: string) => void;
}

export class SpeechRecognitionService {
  private recognition: any = null;
  // 사용자가 명시적으로 켰는지 여부 (사용자가 끄기 전까지는 절대 false가 되지 않음)
  private isUserActive = false;
  private currentLang: 'en-US' | 'ko-KR' = 'en-US';
  private callbacks: SpeechRecognitionCallbacks;
  private restartTimer: any = null;

  constructor(callbacks: SpeechRecognitionCallbacks, initialLang: 'en-US' | 'ko-KR' = 'en-US') {
    this.callbacks = callbacks;
    this.currentLang = initialLang;
    this.initRecognition();
  }

  public setLang(lang: 'en-US' | 'ko-KR') {
    if (this.currentLang === lang) return;
    this.currentLang = lang;
    const wasActive = this.isUserActive;
    this.stopInternal();
    this.initRecognition();
    if (wasActive) {
      this.start();
    }
  }

  public getLang(): 'en-US' | 'ko-KR' {
    return this.currentLang;
  }

  public static isSupported(): boolean {
    const win = window as unknown as IWindowSpeechRecognition;
    return !!(win.SpeechRecognition || win.webkitSpeechRecognition);
  }

  private initRecognition() {
    const win = window as unknown as IWindowSpeechRecognition;
    const SpeechRecognitionClass = win.SpeechRecognition || win.webkitSpeechRecognition;

    if (!SpeechRecognitionClass) {
      this.callbacks.onError('현재 브라우저에서는 음성 인식을 지원하지 않습니다. Chrome 또는 Edge 브라우저를 권장합니다.');
      return;
    }

    try {
      const isMobile = typeof navigator !== 'undefined' && /Android|iPhone|iPad|iPod|Mobile/i.test(navigator.userAgent);
      this.recognition = new SpeechRecognitionClass();
      this.recognition.lang = this.currentLang || 'en-US';
      // 모바일 브라우저는 continuous: false일 때 인식률이 극대화되고 문장이 즉시 확정됨
      this.recognition.continuous = !isMobile;
      this.recognition.interimResults = true;
      this.recognition.maxAlternatives = 1;

      this.recognition.onstart = () => {
        this.callbacks.onStart();
      };

      this.recognition.onresult = (event: any) => {
        let interimTranscript = '';
        let finalTranscript = '';

        for (let i = event.resultIndex; i < event.results.length; ++i) {
          const item = event.results[i];
          const text = item[0]?.transcript || '';
          if (item.isFinal) {
            finalTranscript += text + ' ';
          } else {
            interimTranscript += text;
          }
        }

        this.callbacks.onResult(interimTranscript.trim(), finalTranscript.trim());
      };

      this.recognition.onerror = (event: any) => {
        // 침묵(no-speech)이나 일시적인 음성 끊김은 에러로 처리하지 않고 계속 대기
        if (event.error === 'no-speech') {
          return;
        }

        if (event.error === 'not-allowed' || event.error === 'service-not-allowed') {
          this.isUserActive = false;
          this.callbacks.onError('마이크 사용 권한이 거부되었습니다. 브라우저 주소창에서 마이크 권한을 허용해 주세요.');
          this.callbacks.onEnd();
          return;
        }

        // 기타 에러 시에도 사용자가 끄지 않았다면 재시도
        if (event.error === 'network') {
          // 네트워크 일시 불안정 시에도 유지
        }
      };

      this.recognition.onend = () => {
        // [핵심] 사용자가 직접 끄지 않은 상태라면 침묵으로 인해 브라우저가 끊었어도 즉시 무한 자동 재시작!
        if (this.isUserActive) {
          clearTimeout(this.restartTimer);
          this.restartTimer = setTimeout(() => {
            if (this.isUserActive) {
              try {
                this.recognition.start();
              } catch {
                // 이미 시작된 경우 무시
              }
            }
          }, 150);
        } else {
          this.callbacks.onEnd();
        }
      };
    } catch (err: any) {
      this.callbacks.onError('음성 인식 초기화 실패: ' + (err.message || String(err)));
    }
  }

  public start(): boolean {
    this.isUserActive = true;
    if (!this.recognition) {
      this.initRecognition();
    }
    if (!this.recognition) return false;

    clearTimeout(this.restartTimer);
    try {
      this.recognition.start();
      return true;
    } catch (err: any) {
      if (err.name === 'InvalidStateError') {
        // 이미 실행 중이면 정상
        return true;
      }
      // 실패 시 200ms 후 재시도
      this.restartTimer = setTimeout(() => {
        if (this.isUserActive) {
          try {
            this.recognition.start();
          } catch {}
        }
      }, 200);
      return true;
    }
  }

  // 사용자가 직접 버튼을 눌러 끌 때만 호출됨
  public stop() {
    this.isUserActive = false;
    clearTimeout(this.restartTimer);
    this.stopInternal();
    this.callbacks.onEnd();
  }

  private stopInternal() {
    if (this.recognition) {
      try {
        this.recognition.stop();
      } catch {}
    }
  }

  public isListening(): boolean {
    return this.isUserActive;
  }
}
