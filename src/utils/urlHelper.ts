/**
 * URL 프로토콜 누락 방어 유틸리티
 * 사용자가 'meet.google.com/...' 또는 'zoom.us/...'처럼 https://를 생략하고 입력했을 때
 * 브라우저 상대 경로로 처리되어 404가 뜨는 문제를 방지합니다.
 */
export const normalizeMeetingUrl = (url?: string, fallback: string = ''): string => {
  const trimmed = (url || '').trim();
  if (!trimmed) return fallback;
  if (!/^https?:\/\//i.test(trimmed)) {
    return `https://${trimmed}`;
  }
  return trimmed;
};
