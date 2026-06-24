/**
 * interviewSession.ts
 *
 * AI 라이브 면접방(`/interview/[companyId]`)의 데이터 타입 정의입니다.
 * "면접 보는 중" 루프(질문 제시 → 답변 → 채점)의 계약이며,
 * BFF API(`/api/interview/sessions/*`)의 요청/응답 contract이기도 합니다.
 *
 * 각 영역의 데이터 출처(미래):
 *   - questions          ← 기업/직무 컨텍스트 기반 LLM 생성        [AI 생성 · 현재 더미]
 *   - evaluation.answer  ← 답변 텍스트 → LLM 평가                 [AI 추론 · 현재 더미]
 *   - evaluation.expression ← 면접 영상 → 비전 모델               [인프라 미존재 · 현재 더미]
 *   - evaluation.voice   ← 오디오 → 음성 감성 분석               [인프라 미존재 · 현재 더미]
 *   - stt.transcript     ← 오디오 → Whisper STT                  [인프라 미존재 · 현재 더미]
 *
 * 분석(표정/음성)은 "더미 우선": 캡처 UI는 실제로 동작하되 점수는 BFF 더미를 받습니다.
 * 실연결 시 BFF 내부만 실제 모델 호출로 교체하면 됩니다(company 리포트와 동일 패턴).
 */

import type { InterviewMode, QuestionCategory } from "./interviewResult"

// 라이브룸에서도 같은 모드 계약을 쓰므로 재노출합니다(결과 타입과 단일 출처).
export type { InterviewMode } from "./interviewResult"

// ─── 진행 단계 (상태머신) ─────────────────────────────────────────────────────
//   setup      : 시작 전 — 장치 권한 · 모드 · 전체 시간 선택
//   asking     : AI가 질문을 제시(+TTS로 읽음)
//   answering  : 사용자가 답변 중(🔴 듣는 중) — 텍스트 입력 또는 음성 녹음
//   finished   : 종료 — 결과 리포트로 이동
//
// 질문별 피드백으로 흐름을 끊지 않는다: 답변 제출 → 즉시 다음 질문 → 끝까지 본 뒤 결과만.
// 채점은 백그라운드(논블로킹)로 호출해 평가를 누적만 하고 UI는 막지 않는다.
export type InterviewPhase = "setup" | "asking" | "answering" | "finished"

// ─── 시작 화면에서 고른 설정 ──────────────────────────────────────────────────
export interface InterviewConfig {
  companyId: string
  jobTitle: string // 지원 직무
  mode: InterviewMode // 텍스트/음성 응답 방식
  totalDurationSec: number // 전체 면접 제한 시간(초) — 이것만 실제 제한
}

// ─── 개별 질문 ────────────────────────────────────────────────────────────────
export interface LiveQuestion {
  no: number // 질문 번호(1부터)
  category: QuestionCategory // 회사/직무/공통
  question: string
  recommendedAnswerSec: number // 권장 답변 시간(안내용 — 강제 마감하지 않음)
}

// ─── 세션 시작 응답 (BFF) ─────────────────────────────────────────────────────
// 질문 목록을 한 번에 받아 클라이언트가 순차 진행합니다.
export interface InterviewSessionStart {
  sessionId: string
  companyId: string
  jobTitle: string
  mode: InterviewMode
  totalDurationSec: number
  questionCount: number
  questions: LiveQuestion[]
}

// ─── 답변 제출 payload ────────────────────────────────────────────────────────
export interface AnswerSubmission {
  no: number // 어떤 질문에 대한 답변인지
  answerText: string // 텍스트 입력 또는 STT 전사 결과
  elapsedSec: number // 이 답변에 쓴 시간(초)
  hasVideo: boolean // 표정 분석용 캡처 여부(더미 신호)
  hasAudio: boolean // 음성 분석용 캡처 여부(더미 신호)
}

// ─── 모달(표정/음성) 단일 점수 ───────────────────────────────────────────────
export interface ModalScore {
  score: number // 0~100
  label: string // 한 줄 코멘트
}

// ─── 답변 1건 평가 (제출 후 일괄) ─────────────────────────────────────────────
export interface LiveEvaluation {
  no: number
  answerScore: number // 답변(텍스트) 점수 0~100
  expression: ModalScore // 표정 (더미)
  voice: ModalScore // 음성 감성 (더미)
  good: string // 잘한 점
  improve: string // 개선점
}

// ─── 음성 모드: 오디오 → 전사 ─────────────────────────────────────────────────
export interface SttResult {
  transcript: string
}
