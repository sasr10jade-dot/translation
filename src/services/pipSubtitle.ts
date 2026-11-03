export class PipSubtitleService {
  private static instance: PipSubtitleService;
  private canvas: HTMLCanvasElement;
  private ctx: CanvasRenderingContext2D;
  private video: HTMLVideoElement;
  private isPipActive = false;
  private currentEnText = '';
  private currentKoText = '';

  private constructor() {
    this.canvas = document.createElement('canvas');
    this.canvas.width = 640;
    this.canvas.height = 180;
    this.ctx = this.canvas.getContext('2d')!;

    this.video = document.createElement('video');
    this.video.muted = true;
    this.video.playsInline = true;

    // PIP 창 닫힘 감지
    this.video.addEventListener('leavepictureinpicture', () => {
      this.isPipActive = false;
    });

    this.renderCanvas();
  }

  public static getInstance(): PipSubtitleService {
    if (!PipSubtitleService.instance) {
      PipSubtitleService.instance = new PipSubtitleService();
    }
    return PipSubtitleService.instance;
  }

  public isSupported(): boolean {
    return typeof document !== 'undefined' && 'pictureInPictureEnabled' in document;
  }

  public isActive(): boolean {
    return this.isPipActive;
  }

  public updateSubtitle(enText: string, koText: string) {
    this.currentEnText = enText;
    this.currentKoText = koText;
    this.renderCanvas();
  }

  private renderCanvas() {
    const ctx = this.ctx;
    const w = this.canvas.width;
    const h = this.canvas.height;

    // 1. Dark Glass Background
    ctx.fillStyle = '#0b0f19';
    ctx.fillRect(0, 0, w, h);

    // Accent line on top
    const grad = ctx.createLinearGradient(0, 0, w, 0);
    grad.addColorStop(0, '#6366f1');
    grad.addColorStop(1, '#06b6d4');
    ctx.fillStyle = grad;
    ctx.fillRect(0, 0, w, 4);

    // 2. English Source Line
    ctx.fillStyle = '#94a3b8';
    ctx.font = '500 18px "Noto Sans KR", sans-serif';
    ctx.fillText('EN: ' + (this.currentEnText ? this.truncate(this.currentEnText, 55) : 'Listening to speech...'), 24, 48);

    // 3. Korean Translation Line (Large & Bold)
    ctx.fillStyle = '#ffffff';
    ctx.font = '700 28px "Noto Sans KR", sans-serif';
    ctx.fillText(this.currentKoText ? this.truncate(this.currentKoText, 40) : '실시간 번역 자막 대기 중...', 24, 110);

    // Status pill
    ctx.fillStyle = 'rgba(99, 102, 241, 0.3)';
    ctx.beginPath();
    ctx.roundRect(w - 120, h - 34, 100, 22, 11);
    ctx.fill();
    ctx.fillStyle = '#a5b4fc';
    ctx.font = '700 11px sans-serif';
    ctx.fillText('LiveLingua KR', w - 108, h - 19);
  }

  private truncate(str: string, maxLen: number): string {
    return str.length > maxLen ? str.slice(0, maxLen) + '...' : str;
  }

  public async togglePip(): Promise<boolean> {
    if (!this.isSupported()) return false;

    try {
      if (document.pictureInPictureElement) {
        await document.exitPictureInPicture();
        this.isPipActive = false;
        return false;
      }

      // Canvas stream to video
      const stream = (this.canvas as any).captureStream(30);
      this.video.srcObject = stream;
      await this.video.play();
      await this.video.requestPictureInPicture();
      this.isPipActive = true;
      return true;
    } catch {
      this.isPipActive = false;
      return false;
    }
  }
}
