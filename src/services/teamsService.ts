import { MeetingSummary } from '../types';

export const TeamsService = {
  async sendMeetingSummary(
    webhookUrl: string,
    summary: MeetingSummary,
    recordCount: number
  ): Promise<boolean> {
    const trimmedUrl = webhookUrl.trim();
    if (!trimmedUrl) {
      throw new Error('Microsoft Teams 웹훅 URL이 설정되지 않았습니다. [설정]에서 Teams Webhook URL을 입력해 주세요.');
    }

    const keyPointsText = summary.keyPoints.map((p, i) => `${i + 1}. ${p}`).join('\n\n');
    const actionsText = summary.actionItems.map((a) => `• [ ] ${a}`).join('\n\n');
    const timeStr = new Date(summary.createdAt).toLocaleString('ko-KR');

    // Microsoft Teams Office 365 Connector MessageCard Format
    const payload = {
      '@type': 'MessageCard',
      '@context': 'http://schema.org/extensions',
      themeColor: '6366F1',
      summary: `📋 [Teams 회의록] AI 요약 보고서 (${timeStr})`,
      sections: [
        {
          activityTitle: '📋 Microsoft Teams 회의록 AI 요약 보고서',
          activitySubtitle: `회의 일시: ${timeStr} | 총 발화: ${recordCount}건`,
          markdown: true,
        },
        {
          title: '📌 핵심 논의 안건 (3줄 요약)',
          text: keyPointsText,
          markdown: true,
        },
        {
          title: '✅ 후속 조치 사항 (Action Items / To-do)',
          text: actionsText,
          markdown: true,
        },
      ],
    };

    try {
      await fetch(trimmedUrl, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
        mode: 'no-cors',
      });
      return true;
    } catch (err: any) {
      throw new Error('Teams 전송 실패: ' + (err.message || String(err)));
    }
  },
};
