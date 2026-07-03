/**
 * interviewResult.ts
 *
 * AI 모의 면접 "결과 리포트"의 데이터 타입 정의입니다.
 * 이 타입은 BFF API(`/api/interview/results/[companyId]`)의 응답 contract이기도 합니다.
 *
 * 각 영역의 데이터 출처(미래):
 *   - feedback.expression ← 면접 영상 → 비전 모델            [인프라 미존재 · AI 추론]
 *   - feedback.voice      ← 오디오 → Whisper + 음성 분석      [인프라 미존재 · AI 추론]
 *   - feedback.answer     ← 답변 텍스트 → LLM 평가            [AI 추론]
 *   - strengths/weaknesses/improvements ← LLM 종합 추론       [AI 추론]
 *   - script              ← STT 전사 + 질문별 LLM 평가        [사실(전사) + 추론(평가)]
 *   - recommendedQuestions ← 기업/직무 컨텍스트 기반 LLM 생성  [AI 생성]
 *   - comparison          ← 세션 히스토리 비교                 [세션 영속화 필요]
 *
 * ⚠️ replay(다시보기)는 계약에서 제외됐습니다 — 녹화 인프라가 없어 가짜로 채우지
 *    않습니다(백엔드 result_schemas.py 와 동기화). 추후 녹화 도입 시 재추가합니다.
 *
 * 현재 백엔드는 DB/LLM 대신 더미 데이터를 응답합니다(company 리포트와 동일 패턴).
 * resultId는 1급 필드입니다 — 면접 결과는 회사가 아니라 "세션" 단위이므로,
 * 추후 `/interview/[companyId]/result/[resultId]` 라우트로 확장돼도 계약이 깨지지 않습니다.
 */

export type InterviewMode = "text" | "voice"
export type DeltaDirection = "up" | "down" | "same"
export type QuestionCategory = "company" | "job" | "common"

// ─── 메타 (세션 식별 정보) ────────────────────────────────────────────────────
export interface ResultMeta {
  resultId: string // 결과(세션) 식별자 — 1급 필드
  companyId: string
  companyName: string
  jobTitle: string // 지원 직무
  conductedAt: string // 면접 진행 시각 (ISO)
  durationSec: number // 총 소요 시간(초)
  mode: InterviewMode // 텍스트/음성 응답 방식
  questionCount: number // 질문 수
}

// ─── 종합 점수 (히어로) ───────────────────────────────────────────────────────
export interface OverallScore {
  score: number // 0~100 종합 점수
  grade: string // 등급 라벨 (예: "A", "B+")
  headline: string // AI 한 줄 총평
}

// ─── 멀티모달 피드백 (표정 · 음성 · 답변) ─────────────────────────────────────
//
// 모든 점수는 0~100으로 정규화해, 레이더/바 등 시각화에 공용으로 씁니다.
// value는 사람이 읽는 원본 표현("118 WPM", "양호" 등)을 보존합니다.
export interface FeedbackMetric {
  label: string // 세부 지표명 (예: "시선 처리", "말 속도")
  score: number // 0~100 정규화 점수
  value: string // 사람이 읽는 값 (예: "118 WPM")
  comment: string // 한 줄 코멘트
}

export interface ModalFeedback {
  score: number // 영역 종합 점수 0~100
  summary: string // 영역 총평
  metrics: FeedbackMetric[]
}

export interface FeedbackGroup {
  expression: ModalFeedback // 표정 피드백
  voice: ModalFeedback // 음성 피드백
  answer: ModalFeedback // 답변 피드백
}

// ─── 보완점 및 보완 방법 ──────────────────────────────────────────────────────
export interface ImprovementItem {
  area: string // 보완 영역 (예: "답변 구조화")
  problem: string // 무엇이 부족했는지
  method: string // 어떻게 보완하는지 (구체적 방법)
}

// ─── 질답 스크립트 (면접 다시 보기 - 텍스트) ──────────────────────────────────
export interface ScriptEvaluation {
  score: number // 해당 답변 점수 0~100
  good: string // 잘한 점
  improve: string // 개선점
}

export interface ScriptItem {
  no: number // 질문 번호(1부터)
  category: QuestionCategory // 질문 분류 (회사/직무/공통)
  question: string
  answer: string // 사용자 답변 전사
  evaluation: ScriptEvaluation // 답변 피드백
}

// ─── 추천 질문 리스트 ─────────────────────────────────────────────────────────
export interface RecommendedQuestions {
  company: string[] // 회사 관련 예상 질문
  job: string[] // 직무 관련 예상 질문
}

// ─── 이전 면접 연습과의 차이 ──────────────────────────────────────────────────
export interface MetricDelta {
  label: string // 비교 지표명
  previous: number // 이전 점수 0~100
  current: number // 이번 점수 0~100
  delta: number // current - previous
  direction: DeltaDirection // 상승/하락/유지
}

export interface InterviewComparison {
  previousResultId: string // 비교 대상(직전) 결과 id
  previousDate: string // 직전 연습 시각 (ISO)
  attemptCount: number // 누적 연습 횟수
  deltas: MetricDelta[] // 지표별 변화
  summary: string // 변화 총평
}

// ─── 결과 리포트 전체 ─────────────────────────────────────────────────────────
export interface InterviewResult {
  meta: ResultMeta
  overall: OverallScore
  feedback: FeedbackGroup
  strengths: string[] // 강점
  weaknesses: string[] // 약점
  improvements: ImprovementItem[] // 보완점 및 보완 방법
  script: ScriptItem[] // 질답 스크립트
  recommendedQuestions: RecommendedQuestions
  comparison: InterviewComparison | null // 첫 면접이면 null
}
