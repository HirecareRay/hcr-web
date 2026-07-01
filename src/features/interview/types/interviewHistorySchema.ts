/**
 * interviewHistorySchema.ts
 *
 * 면접 기록 목록 응답 계약(contract)의 런타임 검증 스키마입니다.
 * `interviewHistory.ts`의 타입 정의를 Zod로 1:1 미러링한 것으로,
 * 컴파일 타임 타입 ↔ 런타임 검증을 함께 강제합니다.
 *
 * 사용처:
 *   - BFF(route.ts): DB 대신 더미를 응답하기 전, 응답이 계약을 지키는지 parse.
 *     → 나중에 실제 조회로 교체해도 이 parse를 통과해야만 응답되므로,
 *       프론트가 기대하는 형태가 깨지면 그 즉시 서버에서 잡힙니다.
 *
 * 파일 맨 아래 동기화 단언(_AssertSync) 덕분에,
 * interviewHistory.ts 타입과 이 스키마 중 한쪽만 바뀌면 컴파일 에러가 납니다.
 */

import { z } from "zod"
import type { InterviewHistory } from "./interviewHistory"

// ─── 목록 항목 ────────────────────────────────────────────────────────────────
export const interviewHistoryItemSchema = z.object({
  resultId: z.string(),
  companyId: z.string(),
  companyName: z.string(),
  jobTitle: z.string(),
  conductedAt: z.string(),
  mode: z.enum(["text", "voice"]),
  score: z.number(),
  grade: z.string(),
  headline: z.string(),
  questionCount: z.number(),
})

// ─── 목록 전체 ────────────────────────────────────────────────────────────────
export const interviewHistorySchema = z.object({
  items: z.array(interviewHistoryItemSchema),
  total: z.number(),
})

/**
 * 타입 동기화 단언.
 * interviewHistory.ts의 InterviewHistory와 위 스키마의 추론 타입이 양방향으로
 * 일치하지 않으면 컴파일 에러가 발생합니다. (둘 중 하나만 수정하면 바로 잡힘)
 */
type SchemaHistory = z.infer<typeof interviewHistorySchema>
type _AssertSync = [SchemaHistory] extends [InterviewHistory]
  ? [InterviewHistory] extends [SchemaHistory]
    ? true
    : never
  : never
// eslint-disable-next-line @typescript-eslint/no-unused-vars
const _assertSync: _AssertSync = true
