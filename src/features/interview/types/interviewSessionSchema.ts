/**
 * interviewSessionSchema.ts
 *
 * 라이브 면접방 응답 계약의 런타임 검증 스키마입니다.
 * `interviewSession.ts`의 타입을 Zod로 1:1 미러링해 컴파일 타임 타입 ↔ 런타임 검증을 함께 강제합니다.
 *
 * 사용처(BFF):
 *   - POST /api/interview/sessions          → interviewSessionStartSchema.parse
 *   - POST /api/interview/sessions/:id/answer → liveEvaluationSchema.parse
 *   - POST /api/interview/sessions/:id/stt    → sttResultSchema.parse
 *   더미를 실제 산출물로 바꿔도 형태가 깨지면 그 즉시 서버에서 잡힙니다.
 *
 * 파일 맨 아래 동기화 단언 덕분에, 타입과 스키마 중 한쪽만 바뀌면 컴파일 에러가 납니다.
 */

import { z } from "zod"
import type {
  AnswerSubmission,
  InterviewSessionStart,
  LiveEvaluation,
  SttResult,
} from "./interviewSession"

const interviewModeSchema = z.enum(["text", "voice"])
const questionCategorySchema = z.enum(["company", "job", "common"])

// ─── 질문 ─────────────────────────────────────────────────────────────────────
export const liveQuestionSchema = z.object({
  no: z.number(),
  category: questionCategorySchema,
  question: z.string(),
  recommendedAnswerSec: z.number(),
})

// ─── 세션 시작 응답 ───────────────────────────────────────────────────────────
export const interviewSessionStartSchema = z.object({
  sessionId: z.string(),
  companyId: z.string(),
  jobTitle: z.string(),
  mode: interviewModeSchema,
  totalDurationSec: z.number(),
  questionCount: z.number(),
  questions: z.array(liveQuestionSchema),
})

// ─── 답변 제출 payload (요청 검증용) ──────────────────────────────────────────
export const answerSubmissionSchema = z.object({
  no: z.number(),
  answerText: z.string(),
  elapsedSec: z.number(),
  hasVideo: z.boolean(),
  hasAudio: z.boolean(),
})

// ─── 모달 점수 ────────────────────────────────────────────────────────────────
export const modalScoreSchema = z.object({
  score: z.number(),
  label: z.string(),
})

// ─── 답변 1건 평가 ────────────────────────────────────────────────────────────
export const liveEvaluationSchema = z.object({
  no: z.number(),
  answerScore: z.number(),
  expression: modalScoreSchema,
  voice: modalScoreSchema,
  good: z.string(),
  improve: z.string(),
})

// ─── 전사 결과 ────────────────────────────────────────────────────────────────
export const sttResultSchema = z.object({
  transcript: z.string(),
})

/**
 * 타입 동기화 단언.
 * 응답 계약 타입과 스키마 추론 타입이 양방향으로 일치하지 않으면 컴파일 에러가 납니다.
 */
type AssertSync<A, B> = [A] extends [B] ? ([B] extends [A] ? true : never) : never
// eslint-disable-next-line @typescript-eslint/no-unused-vars
const _assertStart: AssertSync<
  z.infer<typeof interviewSessionStartSchema>,
  InterviewSessionStart
> = true
// eslint-disable-next-line @typescript-eslint/no-unused-vars
const _assertSubmission: AssertSync<z.infer<typeof answerSubmissionSchema>, AnswerSubmission> = true
// eslint-disable-next-line @typescript-eslint/no-unused-vars
const _assertEvaluation: AssertSync<z.infer<typeof liveEvaluationSchema>, LiveEvaluation> = true
// eslint-disable-next-line @typescript-eslint/no-unused-vars
const _assertStt: AssertSync<z.infer<typeof sttResultSchema>, SttResult> = true
