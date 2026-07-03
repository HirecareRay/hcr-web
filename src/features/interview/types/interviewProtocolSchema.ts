/**
 * interviewProtocolSchema.ts
 *
 * 실시간 면접 프로토콜(interviewProtocol.ts)의 런타임 검증 스키마입니다.
 * 타입을 Zod로 1:1 미러링해 컴파일 타임 타입 ↔ 런타임 검증을 함께 강제합니다.
 *
 * 사용처(WS 핸들러 · 추후):
 *   - 업스트림 수신: upstreamMessageSchema.parse 로 브라우저→서버 메시지 검증
 *   - 다운스트림 송신/수신: downstreamEventSchema.parse 로 서버→브라우저 이벤트 검증
 *   메시지 형태가 깨지면 그 즉시 parse 에서 잡힙니다.
 *
 * 파일 맨 아래 동기화 단언 덕분에, 타입과 스키마 중 한쪽만 바뀌면 컴파일 에러가 납니다.
 *
 * 표기 규칙(백엔드와 동일): 업스트림은 raw snake_case 키, 다운스트림은 camelCase
 * 페이로드 + snake `type` 값. 자세한 내용은 interviewProtocol.ts 주석 참고.
 */

import { z } from "zod"
import type {
  ControlMessage,
  DownstreamEvent,
  EvalDeltaEvent,
  EventSnapshotMessage,
  LandmarkFrameMessage,
  QuestionEvent,
  SummaryEvent,
  TextAnswerMessage,
  TranscriptDeltaEvent,
  UpstreamMessage,
  VoiceMetricMessage,
} from "./interviewProtocol"

// ─── 상태머신 ─────────────────────────────────────────────────────────────────
export const sessionStatusSchema = z.enum([
  "idle",
  "question",
  "answering",
  "evaluating",
  "finished",
  "summary",
])

export const controlActionSchema = z.enum(["answer_start", "answer_end", "next"])

// ─── 업스트림 (raw snake_case) ────────────────────────────────────────────────
export const controlMessageSchema = z.object({
  type: z.literal("control"),
  action: controlActionSchema,
})

export const landmarkFrameMessageSchema = z.object({
  type: z.literal("landmark_frame"),
  gaze_x: z.number().nullish(),
  gaze_y: z.number().nullish(),
  head_yaw: z.number().nullish(),
  head_pitch: z.number().nullish(),
  head_roll: z.number().nullish(),
  expression: z.string().nullish(),
})

// 이미지(증거 스냅샷)는 더 이상 전송하지 않는다 — 이벤트 종류·메타만 계약에 둔다.
export const eventSnapshotMessageSchema = z.object({
  type: z.literal("event_snapshot"),
  event: z.string(),
  meta: z.record(z.string(), z.unknown()),
})

export const textAnswerMessageSchema = z.object({
  type: z.literal("text_answer"),
  text: z.string(),
})

// 4필드 모두 optional — 결측은 키를 생략해 보내므로(.optional), 타입의 `?: number` 와 일치시킨다.
// (null 을 보내지 않으므로 nullish 가 아니라 optional. 동기화 단언이 이를 강제한다.)
export const voiceMetricMessageSchema = z.object({
  type: z.literal("voice_metric"),
  decibel: z.number().optional(),
  pitch: z.number().optional(),
  speech_rate: z.number().optional(),
  tremor: z.number().optional(),
})

export const upstreamMessageSchema = z.discriminatedUnion("type", [
  controlMessageSchema,
  landmarkFrameMessageSchema,
  eventSnapshotMessageSchema,
  textAnswerMessageSchema,
  voiceMetricMessageSchema,
])

// ─── 다운스트림 (camelCase 페이로드 / snake type 값) ──────────────────────────
export const questionEventSchema = z.object({
  type: z.literal("question"),
  questionId: z.string(),
  text: z.string(),
  ttsText: z.string().nullish(),
  kind: z.enum(["main", "follow_up"]),
  // 마지막 질문 표식(백엔드가 마지막 질문에만 true) — 미지정 허용(하위호환)
  isLast: z.boolean().optional(),
  // 면접관 페르소나 3필드 — 백엔드 default 는 "" 이나 구버전 호환 위해 optional.
  // 비어 있으면 프론트가 배지·하이라이트·목소리 매핑을 생략하고 폴백한다.
  personaId: z.string().optional(),
  roleLabel: z.string().optional(),
  voice: z.string().optional(),
})

export const transcriptDeltaEventSchema = z.object({
  type: z.literal("transcript_delta"),
  delta: z.string(),
  isFinal: z.boolean(),
})

export const evalDeltaEventSchema = z.object({
  type: z.literal("eval_delta"),
  delta: z.string(),
})

export const summaryEventSchema = z.object({
  type: z.literal("summary"),
  overallScore: z.number(),
  languageFeedback: z.string(),
  nonverbalFeedback: z.string(),
  improvements: z.array(z.string()),
})

export const downstreamEventSchema = z.discriminatedUnion("type", [
  questionEventSchema,
  transcriptDeltaEventSchema,
  evalDeltaEventSchema,
  summaryEventSchema,
])

/**
 * 타입 동기화 단언.
 * 프로토콜 타입과 스키마 추론 타입이 양방향으로 일치하지 않으면 컴파일 에러가 납니다.
 * (둘 중 하나만 수정하면 바로 잡힘)
 */
type AssertSync<A, B> = [A] extends [B] ? ([B] extends [A] ? true : never) : never

// 업스트림
/* eslint-disable @typescript-eslint/no-unused-vars */
const _assertControl: AssertSync<z.infer<typeof controlMessageSchema>, ControlMessage> = true
const _assertLandmark: AssertSync<
  z.infer<typeof landmarkFrameMessageSchema>,
  LandmarkFrameMessage
> = true
const _assertSnapshot: AssertSync<
  z.infer<typeof eventSnapshotMessageSchema>,
  EventSnapshotMessage
> = true
const _assertTextAnswer: AssertSync<
  z.infer<typeof textAnswerMessageSchema>,
  TextAnswerMessage
> = true
const _assertVoiceMetric: AssertSync<
  z.infer<typeof voiceMetricMessageSchema>,
  VoiceMetricMessage
> = true
const _assertUpstream: AssertSync<z.infer<typeof upstreamMessageSchema>, UpstreamMessage> = true

// 다운스트림
const _assertQuestion: AssertSync<z.infer<typeof questionEventSchema>, QuestionEvent> = true
const _assertTranscript: AssertSync<
  z.infer<typeof transcriptDeltaEventSchema>,
  TranscriptDeltaEvent
> = true
const _assertEval: AssertSync<z.infer<typeof evalDeltaEventSchema>, EvalDeltaEvent> = true
const _assertSummary: AssertSync<z.infer<typeof summaryEventSchema>, SummaryEvent> = true
const _assertDownstream: AssertSync<z.infer<typeof downstreamEventSchema>, DownstreamEvent> = true
/* eslint-enable @typescript-eslint/no-unused-vars */
