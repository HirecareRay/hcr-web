/**
 * interviewHistory.ts
 *
 * 마이페이지 "AI 면접 기록" 목록의 데이터 타입 정의입니다.
 * BFF API(`/api/interview/sessions/history`)의 응답 contract 이기도 합니다.
 *
 * 결과 리포트(interviewResult.ts)가 "한 세션의 상세"라면, 이 타입은 그 세션들을
 * 카드 한 줄로 요약한 "목록"입니다. 각 항목의 resultId 로 상세(전체 리포트)를 조회합니다.
 *
 * 데이터 출처(미래):
 *   - 각 항목 ← 유저의 면접 세션 결과(InterviewResult)를 요약           [세션 영속화 필요]
 *   - score/grade/headline ← 해당 세션 overall                          [AI 추론 결과 저장분]
 *
 * 현재 백엔드는 DB 대신 더미를 응답합니다(company 리포트·결과와 동일 패턴).
 * 실연결 시 BFF 라우트 내부만 실제 조회로 교체합니다.
 */

export type InterviewMode = "text" | "voice"

// ─── 목록 항목 (세션 요약) ────────────────────────────────────────────────────
export interface InterviewHistoryItem {
  resultId: string // 세션 결과 식별자 — 상세 조회의 1급 키
  companyId: string // 해당 세션의 회사 식별자 (일반 면접이면 "general")
  companyName: string // 회사명 (일반 면접이면 "일반 면접" 등 라벨)
  jobTitle: string // 지원 직무
  conductedAt: string // 면접 진행 시각 (ISO)
  mode: InterviewMode // 텍스트/음성 응답 방식
  score: number // 종합 점수 0~100 (overall.score)
  grade: string // 등급 라벨 (예: "A", "B+")
  headline: string // AI 한 줄 총평 — 카드 미리보기용
  questionCount: number // 질문 수
}

// ─── 목록 전체 ────────────────────────────────────────────────────────────────
export interface InterviewHistory {
  items: InterviewHistoryItem[] // 최신순 정렬 (conductedAt 내림차순)
  total: number // 전체 세션 수 (추후 페이지네이션 대비)
}
