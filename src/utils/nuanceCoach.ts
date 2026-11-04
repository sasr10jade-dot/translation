import { NuanceTip } from '../types';

interface NuanceDatabaseItem {
  pattern: RegExp;
  culture: 'ko' | 'en' | 'ja' | 'zh' | 'fr';
  keyword: string;
  title: string;
  explanation: string;
}

const NUANCE_DATABASE: NuanceDatabaseItem[] = [
  // 1. Japanese Business Nuances
  {
    pattern: /検討(させ|いた|致し|し)/,
    culture: 'ja',
    keyword: '検討 (검토)',
    title: '🇯🇵 일본 비즈니스 완곡한 거절/보류 주의',
    explanation: '일본 비즈니스에서 "검토하겠습니다"는 거절하기 곤란할 때 쓰는 대표적인 완곡한 보류/거절 표현입니다. 추가 설득 자료나 수정된 대안을 제시하는 것이 좋습니다.',
  },
  {
    pattern: /善処/,
    culture: 'ja',
    keyword: '善処 (선처/노력)',
    title: '🇯🇵 확답이 아닌 유보적 표현',
    explanation: '"최선을 다하겠다"는 뜻이지만, 실제로는 확답을 피하고 책임을 지지 않겠다는 뉘앙스가 담겨 있습니다.',
  },
  {
    pattern: /前向きに/,
    culture: 'ja',
    keyword: '前向きに (긍정적으로)',
    title: '🇯🇵 의례적인 호의 표현',
    explanation: '"긍정적으로 고려하겠다"고 말해도 계약 확정이 아니며, 내부 조율 과정에서 부결될 가능성이 열려 있습니다.',
  },
  {
    pattern: /難しい/,
    culture: 'ja',
    keyword: '難しい (어렵다)',
    title: '🇯🇵 사실상의 명백한 거절(NO)',
    explanation: '일본 문화에서는 직설적으로 "NO"라고 하지 않고 "조금 어렵다"라고 표현합니다. 이는 99% 거절을 의미합니다.',
  },

  // 2. English Business Nuances
  {
    pattern: /with all due respect/i,
    culture: 'en',
    keyword: 'With all due respect',
    title: '🇺🇸 외람된 말씀이지만 (강한 반대 예고)',
    explanation: '상대방의 의견에 대해 강한 반론이나 반대 의사를 정중히 제기하기 직전에 사용하는 비즈니스 경고 신호입니다.',
  },
  {
    pattern: /take this offline/i,
    culture: 'en',
    keyword: "Take this offline",
    title: '🇺🇸 회의 밖에서 따로 논의 (제동)',
    explanation: '현재 회의의 흐름과 맞지 않거나, 특정 담당자끼리만 처리해야 할 때 회의 진행자가 부드럽게 제동을 걸 때 사용합니다.',
  },
  {
    pattern: /I'm afraid (that)?/i,
    culture: 'en',
    keyword: "I'm afraid that...",
    title: '🇺🇸 정중한 거절/부정적 소식 알림',
    explanation: '요청이나 제안을 정중하지만 단호하게 거절하거나, 일정 지연 등 안 좋은 소식을 전할 때 쓰는 전형적인 영어 표현입니다.',
  },
  {
    pattern: /circle back/i,
    culture: 'en',
    keyword: 'Circle back',
    title: '🇺🇸 추후 재논의/피드백 약속',
    explanation: '지금 당장 결론을 내리기 어려워 추가 확인 후 다시 회신하겠다는 프로페셔널한 팔로업 표현입니다.',
  },

  // 3. Chinese Business Nuances
  {
    pattern: /哪里|哪儿/i,
    culture: 'zh',
    keyword: '哪里哪里 (천만에요)',
    title: '🇨🇳 중국 전통 겸양의 미덕',
    explanation: '칭찬이나 감사를 받았을 때 "어디 그런 말씀을요"라며 겸손을 표하는 중국 비즈니스의 기본 예절입니다.',
  },
  {
    pattern: /慢走/i,
    culture: 'zh',
    keyword: '慢走 (안녕히 가십시오)',
    title: '🇨🇳 배웅할 때의 정중한 인사',
    explanation: '"천천히 조심히 가십시오"라는 뜻으로, 회의나 비즈니스 미팅을 마친 귀한 손님을 배웅할 때 쓰는 대표적인 격식어입니다.',
  },
];

export function detectNuanceTip(text: string): NuanceTip | undefined {
  if (!text.trim()) return undefined;

  for (const item of NUANCE_DATABASE) {
    if (item.pattern.test(text)) {
      return {
        keyword: item.keyword,
        culture: item.culture,
        title: item.title,
        explanation: item.explanation,
      };
    }
  }

  return undefined;
}
