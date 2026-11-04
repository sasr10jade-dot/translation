import React from 'react';
import { QuickPrompt, TargetLang } from '../../types';

interface QuickChipsProps {
  currentLang: TargetLang;
  onSelectPrompt: (text: string) => void;
}

const SAMPLE_PROMPTS: QuickPrompt[] = [
  // 1. Korean
  {
    id: 'ko-1',
    category: 'business',
    label: '음성/화면 확인 (KO)',
    text: "제 목소리 잘 들리시나요? 화면 공유도 정상적으로 보이시는지 확인 부탁드립니다.",
    lang: 'ko',
  },
  {
    id: 'ko-2',
    category: 'business',
    label: '안건 진행 (KO)',
    text: "다음 안건인 신규 기능 개발 일정 및 배포 계획으로 넘어가겠습니다.",
    lang: 'ko',
  },
  // 2. English
  {
    id: 'en-1',
    category: 'business',
    label: '화면/음성 확인 (EN)',
    text: "Can everyone hear me clearly and see my shared screen?",
    lang: 'en',
  },
  {
    id: 'en-2',
    category: 'business',
    label: '안건 진행 (EN)',
    text: "Let's move on to the next agenda item regarding the product roadmap.",
    lang: 'en',
  },
  // 3. Japanese
  {
    id: 'ja-1',
    category: 'business',
    label: '회의 인사 (JA)',
    text: "本日はお時間をいただき、ありがとうございます。よろしくお願いいたします。",
    lang: 'ja',
  },
  {
    id: 'ja-2',
    category: 'business',
    label: '화면 확인 (JA)',
    text: "画面の共有は問題なく見えていますでしょうか？",
    lang: 'ja',
  },
  // 4. Chinese
  {
    id: 'zh-1',
    category: 'business',
    label: '음성 확인 (ZH)',
    text: "大家早上好！请问能清楚听到我的声音和看到共享屏幕吗？",
    lang: 'zh',
  },
  {
    id: 'zh-2',
    category: 'business',
    label: '안건 진행 (ZH)',
    text: "那我们接下来讨论下一个会议议题和具体计划。",
    lang: 'zh',
  },
  // 5. French
  {
    id: 'fr-1',
    category: 'business',
    label: '회의 인사 (FR)',
    text: "Bonjour à tous! Merci de vous être joints à cette réunion.",
    lang: 'fr',
  },
  {
    id: 'fr-2',
    category: 'business',
    label: '음성 확인 (FR)',
    text: "Est-ce que tout le monde m'entend bien et voit mon écran partagé?",
    lang: 'fr',
  },
];

export const QuickChips: React.FC<QuickChipsProps> = ({ currentLang, onSelectPrompt }) => {
  // 현재 선택된 언어의 칩들을 우선 표시
  const displayedPrompts = SAMPLE_PROMPTS.filter((p) => p.lang === currentLang);
  const fallbackPrompts = SAMPLE_PROMPTS.filter((p) => p.lang !== currentLang).slice(0, 4);
  const promptsToShow = displayedPrompts.length > 0 ? displayedPrompts : fallbackPrompts;

  return (
    <div className="quick-chips-container">
      <span className="chips-title">회의 예시:</span>
      <div className="chips-list">
        {promptsToShow.map((prompt) => (
          <button
            key={prompt.id}
            type="button"
            className="chip-item"
            onClick={() => onSelectPrompt(prompt.text)}
            title={prompt.text}
          >
            {prompt.label}
          </button>
        ))}
      </div>
    </div>
  );
};
