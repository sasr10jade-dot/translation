import { MeetingSummary } from '../types';

export const SlackService = {
  async sendMeetingSummary(
    webhookUrl: string,
    summary: MeetingSummary,
    recordCount: number
  ): Promise<boolean> {
    const trimmedUrl = webhookUrl.trim();
    if (!trimmedUrl) {
      throw new Error('슬랙 웹훅 URL이 설정되지 않았습니다. [설정]에서 Webhook URL을 입력해 주세요.');
    }

    const keyPointsText = summary.keyPoints.map((p, i) => `${i + 1}. ${p}`).join('\n');
    const actionsText = summary.actionItems.map((a) => `• [ ] ${a}`).join('\n');
    const timeStr = new Date(summary.createdAt).toLocaleString('ko-KR');

    const payload = {
      text: `📋 [LiveLingua KR] 화상 회의록 요약 (${timeStr})`,
      blocks: [
        {
          type: 'header',
          text: {
            type: 'plain_text',
            text: '📋 화상 회의록 AI 요약 보고서',
            emoji: true,
          },
        },
        {
          type: 'context',
          elements: [
            {
              type: 'mrkdwn',
              text: `*회의 일시:* ${timeStr} | *총 대화 발화:* ${recordCount}건 | *엔진:* LiveLingua KR`,
            },
          ],
        },
        {
          type: 'divider',
        },
        {
          type: 'section',
          text: {
            type: 'mrkdwn',
            text: `*📌 핵심 논의 안건 (3줄 요약)*\n${keyPointsText}`,
          },
        },
        {
          type: 'section',
          text: {
            type: 'mrkdwn',
            text: `*✅ 후속 조치 사항 (Action Items / To-do)*\n${actionsText}`,
          },
        },
      ],
    };

    try {
      // Slack webhook 전송
      await fetch(trimmedUrl, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
        mode: 'no-cors', // 브라우저 CORS 제한 우회
      });
      return true;
    } catch (err: any) {
      throw new Error('슬랙 전송 실패: ' + (err.message || String(err)));
    }
  },
};
