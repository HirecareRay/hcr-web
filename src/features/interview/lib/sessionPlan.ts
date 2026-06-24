/**
 * sessionPlan.ts
 *
 * 면접 세션 "계획" 관련 순수 계산 로직입니다.
 * 화면/장치/네트워크에 의존하지 않는 순수 함수만 모아, 추후 단위 테스트를 쉽게 붙일 수 있게 격리합니다.
 */

// 시작 화면에서 고를 수 있는 전체 면접 시간(초) — 10 / 15 / 20분
export const durationOptionsSec = [600, 900, 1200] as const

/**
 * 전체 면접 시간(초) → 질문 수.
 * 한 질문당 질문 제시 + 답변 + 채점에 대략 ~200초가 든다고 보고 환산하며, 3~8문항으로 클램프합니다.
 */
export function deriveQuestionCount(totalDurationSec: number): number {
  const raw = Math.round(totalDurationSec / 200)
  return Math.max(3, Math.min(8, raw))
}

/**
 * 질문 1개당 "권장 답변 시간"(초) — 안내용일 뿐 강제 마감하지 않습니다.
 * 전체 시간을 질문 수로 나눈 뒤, 질문 제시/채점 여유를 빼고 약 60%를 답변에 배분합니다.
 */
export function recommendedAnswerSec(totalDurationSec: number, questionCount: number): number {
  if (questionCount <= 0) return 0
  return Math.round((totalDurationSec / questionCount) * 0.6)
}

/**
 * 전체 시간(초)을 사람이 읽는 라벨로 — 예: 600 → "10분".
 */
export function durationLabel(totalDurationSec: number): string {
  return `${Math.round(totalDurationSec / 60)}분`
}
