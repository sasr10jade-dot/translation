import { GoogleGenerativeAI } from '@google/generative-ai';

export type SmartReplyIntent = 'agree' | 'disagree' | 'schedule' | 'clarify';

export interface SmartReplyOption {
  en: string;
  ko: string;
  style: 'short' | 'polite';
}

const FALLBACK_TEMPLATES: Record<SmartReplyIntent, SmartReplyOption[]> = {
  agree: [
    {
      en: 'I completely agree with this direction. Let’s proceed.',
      ko: '저도 이 방향에 전적으로 동의합니다. 그대로 진행하시죠.',
      style: 'short',
    },
    {
      en: 'That makes total sense to me. I will follow up on the next steps accordingly.',
      ko: '충분히 공감합니다. 그에 맞춰 다음 단계를 후속 진행하도록 하겠습니다.',
      style: 'polite',
    },
  ],
  disagree: [
    {
      en: 'I see your point, but I have a slight concern regarding the current timeline.',
      ko: '무슨 말씀인지 이해하지만, 현재 일정과 관련해 약간의 우려가 있습니다.',
      style: 'polite',
    },
    {
      en: 'While I understand that perspective, I’d suggest we consider an alternative approach first.',
      ko: '그 관점도 이해하지만, 대안적인 방식을 먼저 검토해보는 것을 제안합니다.',
      style: 'polite',
    },
  ],
  schedule: [
    {
      en: 'Could I take a closer look and get back to you by tomorrow?',
      ko: '제가 좀 더 자세히 검토한 뒤 내일까지 회신드려도 괜찮을까요?',
      style: 'short',
    },
    {
      en: 'Let me align with my team on this schedule and circle back with a confirmed timeline.',
      ko: '이 일정에 대해 팀원들과 먼저 조율한 후 확정된 일정으로 다시 말씀드리겠습니다.',
      style: 'polite',
    },
  ],
  clarify: [
    {
      en: 'Could you elaborate a bit more on that specific point?',
      ko: '방금 말씀하신 특정 부분에 대해 조금만 더 자세히 설명해주실 수 있을까요?',
      style: 'short',
    },
    {
      en: 'Just to make sure we are on the same page, do you mean we should prioritize this item?',
      ko: '제가 정확히 이해한 것인지 확인차 여쭙는데, 이 항목을 우선순위로 두자는 의미이신가요?',
      style: 'polite',
    },
  ],
};

export const SmartReplyService = {
  async generateReplies(
    partnerText: string,
    intent: SmartReplyIntent,
    apiKey?: string,
    modelName: string = 'gemini-1.5-flash'
  ): Promise<SmartReplyOption[]> {
    const trimmed = partnerText.trim();

    // 1. Gemini AI 모드
    if (apiKey && apiKey.trim() && trimmed) {
      try {
        const genAI = new GoogleGenerativeAI(apiKey.trim());
        const model = genAI.getGenerativeModel({ model: modelName });

        const intentDescriptions: Record<SmartReplyIntent, string> = {
          agree: 'Agreement / Approval (동의 및 찬성)',
          disagree: 'Polite Disagreement or Alternative Proposal (정중한 반대 또는 대안 제시)',
          schedule: 'Schedule Negotiation or Need Review Time (일정 조율 또는 검토 시간 요청)',
          clarify: 'Asking for Clarification or Confirmation (추가 확인 및 질문)',
        };

        const prompt = `You are an elite native executive business communication coach.
The foreign colleague in a video meeting just said:
"${trimmed}"

Generate exactly TWO concise, highly idiomatic business reply sentences in English for the intent:
${intentDescriptions[intent]}.

Requirements:
- Option 1 (short): A crisp, natural 1-sentence reaction.
- Option 2 (polite): A diplomatic, professional corporate phrase.
- Provide natural Korean translations for both options.
- Return ONLY valid JSON in this exact structure, with no markdown code fences:
{"replies":[{"en":"...","ko":"...","style":"short"},{"en":"...","ko":"...","style":"polite"}]}`;

        const response = await model.generateContent(prompt);
        let text = response.response.text().trim();
        text = text.replace(/```json/g, '').replace(/```/g, '').trim();

        const parsed = JSON.parse(text);
        if (Array.isArray(parsed.replies) && parsed.replies.length > 0) {
          return parsed.replies.slice(0, 2);
        }
      } catch (err) {
        console.warn('Gemini SmartReply error, falling back to heuristics:', err);
      }
    }

    // 2. 무료 템플릿 폴백
    return FALLBACK_TEMPLATES[intent] || FALLBACK_TEMPLATES.agree;
  },
};
