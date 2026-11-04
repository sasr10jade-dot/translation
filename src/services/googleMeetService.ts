import { MeetingSummary } from '../types';

export const GoogleMeetService = {
  async sendMeetingSummary(
    webhookUrl: string,
    summary: MeetingSummary,
    recordCount: number
  ): Promise<boolean> {
    const trimmedUrl = webhookUrl.trim();
    if (!trimmedUrl) {
      throw new Error(
        'Google Meet(Google Chat) 웹훅 URL이 설정되지 않았습니다. [설정]에서 Webhook URL을 입력해 주세요.'
      );
    }
    if (!trimmedUrl.startsWith('http://') && !trimmedUrl.startsWith('https://')) {
      throw new Error('올바른 웹훅 URL(https://...)을 입력해 주세요.');
    }

    const timeStr = new Date(summary.createdAt).toLocaleString('ko-KR');
    const keyPointsText = summary.keyPoints.map((p, i) => `${i + 1}. ${p}`).join('\n');
    const actionsText = summary.actionItems.map((a) => `• [ ] ${a}`).join('\n');

    // Google Chat Card v2 + Fallback Text Payload
    const payload = {
      text: `📋 [Google Meet 회의록] AI 요약 보고서 (${timeStr})`,
      cardsV2: [
        {
          cardId: `meet-summary-${Date.now()}`,
          card: {
            header: {
              title: '📋 Google Meet 회의록 AI 요약 보고서',
              subtitle: `회의 일시: ${timeStr} | 총 발화: ${recordCount}건`,
              imageUrl: 'https://fonts.gstatic.com/s/i/productlogos/meet_2020q4/v6/web-48dp/logo_meet_2020q4_color_2x_web_48dp.png',
              imageType: 'SQUARE',
            },
            sections: [
              {
                header: '📌 핵심 논의 안건 (3줄 요약)',
                collapsible: false,
                widgets: [
                  {
                    textParagraph: {
                      text: keyPointsText.replace(/\n/g, '<br>'),
                    },
                  },
                ],
              },
              {
                header: '✅ 후속 조치 사항 (Action Items / To-do)',
                collapsible: false,
                widgets: [
                  {
                    textParagraph: {
                      text: actionsText.replace(/\n/g, '<br>'),
                    },
                  },
                ],
              },
            ],
          },
        },
      ],
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
      throw new Error('Google Meet 전송 실패: ' + (err.message || String(err)));
    }
  },
};
