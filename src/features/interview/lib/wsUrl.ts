/**
 * wsUrl.ts
 *
 * 면접 WebSocket 접속 URL을 조립하는 순수 함수입니다.
 * 쿼리(ticket·companyId) 조립을 한 곳에 모아, 인코딩 누락·오타를 막고 테스트하기 쉽게 합니다.
 *
 *   wss://<host>/interviews/ws/{sessionId}?companyId={ObjectId}&jobTitle={직무}&questionCount={정수}&ticket={ticket}
 *
 * - ticket: WS 접속용 단기 티켓(필수). 면접은 로그인 필수이므로 항상 동봉한다.
 * - companyId: 기업 분석 컨텍스트 주입용(선택). 없으면 회사 컨텍스트만 생략된다.
 * - jobTitle: 지원 직무(선택). 백엔드가 질문 생성 컨텍스트로 쓴다. 없으면 직무 컨텍스트만 생략.
 * - questionCount: "메인 질문(주제) 개수"(선택, 정수). 사용자의 면접 시간 선택이 이 값으로 반영된다.
 *     꼬리질문은 답변에 따라 그 위에 얹히므로 총 질문 수는 이보다 많고 유동적이다 — 총량을 못 박지 않는다.
 *     백엔드가 1~10 clamp + 결측/비정상 시 기본값 우회를 하므로, 없거나 이상해도 안전하다.
 * - 값은 URLSearchParams 로 자동 인코딩된다(encodeURIComponent 동일 효과).
 */

interface BuildInterviewWsUrlParams {
  base: string // WS 베이스(예: wss://host 또는 ws://localhost:8000)
  sessionId: string // REST 세션과 동일 ID(백엔드 상관용)
  ticket: string // WS 접속 티켓(필수)
  companyId?: string | null // 기업 ObjectId(선택)
  jobTitle?: string | null // 지원 직무(선택)
  questionCount?: number | null // 메인 질문(주제) 개수(선택, 정수)
}

export function buildInterviewWsUrl({
  base,
  sessionId,
  ticket,
  companyId,
  jobTitle,
  questionCount,
}: BuildInterviewWsUrlParams): string {
  const path = `${base}/interviews/ws/${encodeURIComponent(sessionId)}`

  const params = new URLSearchParams()
  if (companyId) params.set("companyId", companyId)
  if (jobTitle) params.set("jobTitle", jobTitle)
  // 정수로만 실어 보낸다(백엔드가 clamp/기본값 처리하므로 범위 검증은 서버에 맡긴다).
  if (typeof questionCount === "number" && Number.isFinite(questionCount)) {
    params.set("questionCount", String(Math.trunc(questionCount)))
  }
  params.set("ticket", ticket)

  return `${path}?${params.toString()}`
}
