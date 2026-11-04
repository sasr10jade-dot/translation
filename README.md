# 🎙️ LiveLingua KR (실시간 영어-한국어 번역기)

> 브라우저 내장 음성 인식(STT)과 하이브리드 번역 엔진(무료 기본 + Gemini AI)을 탑재한 실시간 영한 번역 웹 애플리케이션입니다.

---

## ✨ 핵심 기능

1. **화상 회의 전용 플로팅 자막 HUD (Meeting Subtitle HUD) & PIP 자막**
   - Zoom, Google Meet 화면을 가리지 않도록 화면 하단에 반투명 자막 바 또는 브라우저 밖으로 띄우는 Chrome PIP 플로팅 자막을 제공합니다.
   - 배경 투명도(40%~98%) 조절, 글자 크기(작게/보통/크게) 조절, 직전 대화 롤링 표시 기능 탑재.

2. **Google Meet & Zoom 화상 회의 연동 허브 & 오디오 캡처**
   - 상단 **[회의 연동 🎥]** 버튼을 통해 Google Meet(`meet.google.com`) 및 Zoom(`zoom.us`) 바로가기 및 원클릭 회의 시작을 지원합니다.
   - **브라우저 탭 오디오 실시간 캡처**: 별도 프로그램 설치 없이 Chrome 화면/탭 공유의 [오디오 공유] 기능을 활용하여 Google Meet / Zoom 탭의 소리를 실시간으로 캡처 및 모니터링합니다.
   - **Windows 스테레오 믹스 & Mac BlackHole 가이드** 제공.

3. **Google Meet · Zoom · Teams · Slack 4대 협업 도구 회의록 자동 전송**
   - 회의 종료 후 [AI 회의록 3줄 요약]에서 핵심 안건 3줄 요약과 To-do(Action Items)를 Google Meet(Google Chat 스페이스), Zoom Team Chat, Microsoft Teams, Slack 채널로 웹훅을 통해 원클릭 자동 전송합니다.

3. **실시간 음성 인식 (STT)**
   - 마이크 버튼을 켜면 영어 발화를 실시간으로 캡처하여 중간 단어(Interim)와 확정 문장(Final)을 즉각 텍스트로 변환합니다.
   - Web Audio API 기반의 **반응형 Canvas 오디오 파형(Visualizer)** 이 마이크 음성 진폭에 맞춰 네온 애니메이션을 보여줍니다.

4. **하이브리드 번역 엔진**
   - **무료 기본 엔진**: 별도 API 키 입력 없이 즉시 고속으로 동작 (Zero-Config).
   - **Gemini AI 엔진**: 우측 상단 [설정]에서 Google AI Studio API 키를 입력하면 최신 `gemini-1.5-flash` / `gemini-2.0-flash` 모델로 자연스러운 문맥과 어조를 반영합니다.
   - **어조(Tone) 제어**: 자연스러운 일상 표준체(해요체), 정중한 존댓말, 친근한 반말, 격식 보고체 중 선택 가능.

5. **텍스트 직접 입력 및 디바운스 실시간 번역**
   - 마이크 음성뿐만 아니라 키보드 타이핑 또는 클립보드 붙여넣기 시 500ms 디바운스로 실시간 번역이 생성됩니다.
   - 실제 화상 회의에서 자주 쓰는 실전 비즈니스 영어 표현 칩(화면 공유, 안건 진행, 음성 확인 등) 탑재.

6. **한국어 음성 읽기 (TTS) & 히스토리 내보내기**
   - 번역된 한국어 문장을 Web SpeechSynthesis로 들을 수 있으며, 모든 회의 번역 기록을 **TXT / JSON 파일로 다운로드**하여 회의록으로 활용할 수 있습니다.

7. **Noto Sans 일괄 기본 적용 & 환경설정 글꼴 변경**
   - 구글 개발 5개국어 범용 고딕인 **Noto Sans**를 전체 화면, 자막 HUD, PIP에 일괄 적용하여 장시간 회의 시 눈의 피로를 낮추고 가독성을 극대화했습니다.
   - [환경설정 ⚙️]에서 **Noto Sans(기본/권장)**, **Pretendard(프리텐다드)**, **나눔고딕**, **시스템 기본 글꼴** 중 자유롭게 일괄 전환할 수 있습니다.

---

## 🚀 빠른 시작 (실행 방법)

### 1. 개발 서버 실행
```bash
npm run dev
```
브라우저에서 `http://localhost:5000` 접속 (Chrome 또는 Edge 권장 - Web Speech API 완벽 지원)

### 2. 프로덕션 빌드
```bash
npm run build
npm run preview
```

---

## 🛠️ 기술 스택
- **프론트엔드**: React 19, TypeScript, Vite
- **디자인**: Pure Vanilla CSS (다크 글래스모피즘, 반응형 그리드)
- **아이콘**: Lucide React
- **AI / SDK**: `@google/generative-ai`
