/**
 * interviewProtocol.ts
 *
 * AI 모의 면접 "실시간 멀티모달" WebSocket/SSE 프로토콜의 타입 정의입니다.
 * 백엔드(FastAPI) `app/interview/schemas.py` 를 1:1 미러링한 계약으로,
 * 양쪽 CLAUDE.md "계약 ②" 표와 항상 일치시킵니다(한쪽을 고치면 다른쪽도).
 *
 * 이 파일은 "실시간 스트리밍" 로드맵(Phase 1+)의 계약입니다.
 * 현재 더미 기반 배치 슬라이스(interviewSession.ts / interviewResult.ts, REST)와
 * 별개로 공존합니다 — 실시간 구간을 붙일 때 이 계약을 사용합니다.
 *
 * 표기 규칙 (중요 · 백엔드와 동일):
 *   - 업스트림(브라우저 → FastAPI): 브라우저가 보내는 raw snake_case 키 그대로.
 *     → 필드명이 snake_case 인 이유 (백엔드가 alias 변환 없이 받음).
 *   - 다운스트림(FastAPI → 브라우저): camelCase 로 직렬화된 페이로드.
 *     단 판별 필드 `type` 의 "값"(예: "transcript_delta")은 snake 그대로.
 *
 * ⚠️ audio_chunk(binary, webm/opus)는 JSON 메시지가 아니라 WS binary 프레임이므로
 *    이 타입 유니온에 없습니다. WS 핸들러에서 텍스트/바이너리 프레임으로 분기합니다.
 */

// ─── 세션 상태머신 (FE·BE 공통) ──────────────────────────────────────────────
//   idle → question → answering → evaluating → (finished | summary)
export type SessionStatus =
  | "idle"
  | "question"
  | "answering"
  | "evaluating"
  | "finished"
  | "summary"

// control 업스트림 메시지의 전이 액션
export type ControlAction = "answer_start" | "answer_end" | "next"

// ─── 업스트림 (브라우저 → FastAPI, raw snake_case) ───────────────────────────

// 세션 전이 신호 (답변 시작·종료·다음 질문)
export interface ControlMessage {
  type: "control"
  action: ControlAction
}

// 얼굴 랜드마크 기반 비언어 지표 (주기 ~1s)
// 구체 지표는 Phase 4(MediaPipe)에서 확정 — 아래는 잠정 필드.
export interface LandmarkFrameMessage {
  type: "landmark_frame"
  gaze_x?: number | null
  gaze_y?: number | null
  head_yaw?: number | null
  head_pitch?: number | null
  head_roll?: number | null
  expression?: string | null
}

// 이벤트 발생 시 증거 스냅샷 (시선이탈·무표정 등)
export interface EventSnapshotMessage {
  type: "event_snapshot"
  event: string
  image: string // base64 data URL 또는 업로드 URL
  meta: Record<string, unknown>
}

// 텍스트 모드 답변 (타이핑) — 음성 대신 직접 입력한 답변 본문.
// 백엔드는 answer_end 시 이 텍스트를 답변으로 사용한다(오디오 전사 대체).
export interface TextAnswerMessage {
  type: "text_answer"
  text: string
}

// 업스트림 JSON 메시지 유니온 (audio_chunk binary 는 제외 — 파일 상단 주석 참고)
export type UpstreamMessage =
  | ControlMessage
  | LandmarkFrameMessage
  | EventSnapshotMessage
  | TextAnswerMessage

// ─── 다운스트림 (FastAPI → 브라우저, camelCase 페이로드) ──────────────────────

// 생성된 면접 질문 (+TTS용 텍스트)
export interface QuestionEvent {
  type: "question"
  questionId: string
  text: string
  ttsText?: string | null
  // 메인(기본) 질문인지 직전 답변 기반 꼬리질문인지 — 배지·흐름 표시용
  kind: "main" | "follow_up"
}

// 실시간 자막 토큰 (STT 부분 결과)
export interface TranscriptDeltaEvent {
  type: "transcript_delta"
  delta: string
  isFinal: boolean
}

// 답변 평가 토큰 스트림 (LLM 생성 중간 토큰)
export interface EvalDeltaEvent {
  type: "eval_delta"
  delta: string
}

// 최종 통합 리포트 (언어 + 비언어)
// 상세 필드는 Phase 5(통합 리포트)에서 확장 — 아래는 최소 합의셋.
export interface SummaryEvent {
  type: "summary"
  overallScore: number
  languageFeedback: string
  nonverbalFeedback: string
  improvements: string[]
}

// 다운스트림 이벤트 유니온
export type DownstreamEvent = QuestionEvent | TranscriptDeltaEvent | EvalDeltaEvent | SummaryEvent
