import { MeetingSummary } from '../types';

export const ZoomService = {
  async sendMeetingSummary(
    webhookUrl: string,
    summary: MeetingSummary,
    recordCount: number
  ): Promise<boolean> {
    const trimmedUrl = webhookUrl.trim();
    if (!trimmedUrl) {
      throw new Error(
        'Zoom 웹훅 URL이 설정되지 않았습니다. [설정]에서 Zoom Webhook URL을 입력해 주세요.'
      );
    }
    if (!trimmedUrl.startsWith('http://') && !trimmedUrl.startsWith('https://')) {
      throw new Error('올바른 웹훅 URL(https://...)을 입력해 주세요.');
    }

    const timeStr = new Date(summary.createdAt).toLocaleString('ko-KR');
    const keyPointsText = summary.keyPoints.map((p, i) => `${i + 1}. ${p}`).join('\n');
    const actionsText = summary.actionItems.map((a) => `• [ ] ${a}`).join('\n');

    // Zoom Team Chat Incoming Webhook Format
    const payload = {
      text: `📋 [Zoom 회의록] AI 요약 보고서 (${timeStr})\n\n총 발화 건수: ${recordCount}건\n\n*📌 핵심 논의 안건 (3줄 요약)*\n${keyPointsText}\n\n*✅ 후속 조치 사항 (Action Items)*\n${actionsText}`,
      content: {
        head: {
          text: '📋 Zoom 회의록 AI 요약 보고서',
          sub_head: {
            text: `회의 일시: ${timeStr} | 총 발화: ${recordCount}건`,
          },
        },
        body: [
          {
            type: 'message',
            text: `*📌 핵심 논의 안건 (3줄 요약)*\n${keyPointsText}`,
          },
          {
            type: 'message',
            text: `*✅ 후속 조치 사항 (Action Items / To-do)*\n${actionsText}`,
          },
        ],
      },
      is_markdown_support: true,
    };

    try {
      await fetch(trimmedUrl, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
        mode: 'no-cors', // 브라우저 CORS 제한 우회
      });
      return true;
    } catch (err: any) {
      throw new Error('Zoom 전송 실패: ' + (err.message || String(err)));
    }
  },
};
