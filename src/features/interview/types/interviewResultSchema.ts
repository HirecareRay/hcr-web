/**
 * interviewResultSchema.ts
 *
 * 면접 결과 응답 계약(contract)의 런타임 검증 스키마입니다.
 * `interviewResult.ts`의 타입 정의를 Zod로 1:1 미러링한 것으로,
 * 컴파일 타임 타입 ↔ 런타임 검증을 함께 강제합니다.
 *
 * 사용처:
 *   - BFF(route.ts): DB/LLM 대신 더미를 응답하기 전, 응답이 계약을 지키는지 parse.
 *     → 나중에 실제 산출물로 교체해도 이 parse를 통과해야만 응답되므로,
 *       프론트가 기대하는 형태가 깨지면 그 즉시 서버에서 잡힙니다.
 *
 * 파일 맨 아래 동기화 단언(_AssertSync) 덕분에,
 * interviewResult.ts 타입과 이 스키마 중 한쪽만 바뀌면 컴파일 에러가 납니다.
 */

import { z } from "zod"
import type { InterviewResult } from "./interviewResult"

// ─── 메타 ─────────────────────────────────────────────────────────────────────
export const resultMetaSchema = z.object({
  resultId: z.string(),
  companyId: z.string(),
  companyName: z.string(),
  jobTitle: z.string(),
  conductedAt: z.string(),
  durationSec: z.number(),
  mode: z.enum(["text", "voice"]),
  questionCount: z.number(),
})

// ─── 종합 점수 ────────────────────────────────────────────────────────────────
export const overallScoreSchema = z.object({
  score: z.number(),
  grade: z.string(),
  headline: z.string(),
})

// ─── 멀티모달 피드백 ──────────────────────────────────────────────────────────
export const feedbackMetricSchema = z.object({
  label: z.string(),
  score: z.number(),
  value: z.string(),
  comment: z.string(),
})

export const modalFeedbackSchema = z.object({
  score: z.number(),
  summary: z.string(),
  metrics: z.array(feedbackMetricSchema),
})

export const feedbackGroupSchema = z.object({
  expression: modalFeedbackSchema,
  voice: modalFeedbackSchema,
  answer: modalFeedbackSchema,
})

// ─── 보완점 및 보완 방법 ──────────────────────────────────────────────────────
export const improvementItemSchema = z.object({
  area: z.string(),
  problem: z.string(),
  method: z.string(),
})

// ─── 질답 스크립트 ────────────────────────────────────────────────────────────
export const scriptEvaluationSchema = z.object({
  score: z.number(),
  good: z.string(),
  improve: z.string(),
})

export const scriptItemSchema = z.object({
  no: z.number(),
  category: z.enum(["company", "job", "common"]),
  question: z.string(),
  answer: z.string(),
  evaluation: scriptEvaluationSchema,
})

// ─── 추천 질문 리스트 ─────────────────────────────────────────────────────────
export const recommendedQuestionsSchema = z.object({
  company: z.array(z.string()),
  job: z.array(z.string()),
})

// ─── 면접 다시 보기 ───────────────────────────────────────────────────────────
export const replayMarkerSchema = z.object({
  atSec: z.number(),
  no: z.number(),
  label: z.string(),
})

export const interviewReplaySchema = z.object({
  available: z.boolean(),
  mediaUrl: z.string().nullable(),
  durationSec: z.number(),
  markers: z.array(replayMarkerSchema),
})

// ─── 이전 면접 연습과의 차이 ──────────────────────────────────────────────────
export const metricDeltaSchema = z.object({
  label: z.string(),
  previous: z.number(),
  current: z.number(),
  delta: z.number(),
  direction: z.enum(["up", "down", "same"]),
})

export const interviewComparisonSchema = z.object({
  previousResultId: z.string(),
  previousDate: z.string(),
  attemptCount: z.number(),
  deltas: z.array(metricDeltaSchema),
  summary: z.string(),
})

// ─── 결과 리포트 전체 ─────────────────────────────────────────────────────────
export const interviewResultSchema = z.object({
  meta: resultMetaSchema,
  overall: overallScoreSchema,
  feedback: feedbackGroupSchema,
  strengths: z.array(z.string()),
  weaknesses: z.array(z.string()),
  improvements: z.array(improvementItemSchema),
  script: z.array(scriptItemSchema),
  recommendedQuestions: recommendedQuestionsSchema,
  replay: interviewReplaySchema,
  comparison: interviewComparisonSchema.nullable(),
})

/**
 * 타입 동기화 단언.
 * interviewResult.ts의 InterviewResult와 위 스키마의 추론 타입이 양방향으로
 * 일치하지 않으면 컴파일 에러가 발생합니다. (둘 중 하나만 수정하면 바로 잡힘)
 */
type SchemaResult = z.infer<typeof interviewResultSchema>
type _AssertSync = [SchemaResult] extends [InterviewResult]
  ? [InterviewResult] extends [SchemaResult]
    ? true
    : never
  : never
// eslint-disable-next-line @typescript-eslint/no-unused-vars
const _assertSync: _AssertSync = true
