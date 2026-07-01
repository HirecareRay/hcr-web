/**
 * sessionPlan.ts
 *
 * 면접 세션 "계획" 관련 순수 계산 로직입니다.
 * 화면/장치/네트워크에 의존하지 않는 순수 함수만 모아, 추후 단위 테스트를 쉽게 붙일 수 있게 격리합니다.
 */

// 시작 화면에서 고를 수 있는 전체 면접 시간(초) — 10 / 15 / 20분
export const durationOptionsSec = [600, 900, 1200] as const

/**
 * 전체 면접 시간(초) → "메인 질문(주제) 개수".
 *
 * 면접 길이는 시간이 아니라 메인 질문 수가 정한다(백엔드에 시간 제한 로직 없음 — 질문을 다 풀면
 * 종료). 이 값은 WS 접속 시 questionCount 로 백엔드에 전달돼 "생성할 메인 주제 수"가 된다.
 * 답변에 따라 꼬리질문이 그 위에 적응형으로 얹히므로 총 질문 수는 이보다 많고 유동적이다 —
 * 이 값으로 총량을 못 박지 않는다. 그래서 꼬리질문 여유를 감안해 시간 대비 보수적으로 매핑한다.
 * (백엔드가 1~10 clamp + 결측 시 기본값 우회를 하므로 표에 없는 값이 와도 안전하다.)
 */
const mainQuestionByDurationSec: Record<number, number> = {
  600: 3, // 10분 → 메인 주제 3개
  900: 4, // 15분 → 메인 주제 4개
  1200: 5, // 20분 → 메인 주제 5개
}

export function deriveQuestionCount(totalDurationSec: number): number {
  return mainQuestionByDurationSec[totalDurationSec] ?? 4
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
