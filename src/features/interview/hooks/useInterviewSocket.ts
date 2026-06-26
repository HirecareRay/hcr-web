/**
 * useInterviewSocket.ts
 *
 * 실시간 면접방의 WebSocket "두뇌" 훅입니다 (Phase 1 walking skeleton).
 * 브라우저가 FastAPI(`/interviews/ws/{sessionId}`)에 **직접** 연결합니다
 * (배치 REST 슬라이스의 useInterview 와 달리 BFF 를 거치지 않음).
 *
 * 수신 메시지는 interviewProtocolSchema 의 Zod 로 검증한 뒤 타입별로 분기합니다.
 * 지금은 더미 왕복 확인이 목적이며, 재연결·에러복구는 Phase 6 에서 다룹니다.
 */

"use client"

import { useCallback, useEffect, useRef, useState } from "react"
import {
  downstreamEventSchema,
  eventSnapshotMessageSchema,
  landmarkFrameMessageSchema,
} from "../types/interviewProtocolSchema"
import type {
  ControlAction,
  EventSnapshotMessage,
  LandmarkFrameMessage,
  QuestionEvent,
  SummaryEvent,
} from "../types/interviewProtocol"

const WS_BASE = process.env.NEXT_PUBLIC_INTERVIEW_WS_URL ?? "ws://localhost:8000"

export type SocketState = "idle" | "connecting" | "open" | "closed"

export interface InterviewSocketView {
  state: SocketState
  question: QuestionEvent | null // 현재 질문
  transcript: string // 누적 자막(transcript_delta)
  evaluation: string // 누적 평가(eval_delta)
  summary: SummaryEvent | null // 최종 요약
}

const EMPTY_VIEW: InterviewSocketView = {
  state: "idle",
  question: null,
  transcript: "",
  evaluation: "",
  summary: null,
}

export function useInterviewSocket(sessionId: string | null) {
  const socketRef = useRef<WebSocket | null>(null)
  const [view, setView] = useState<InterviewSocketView>(EMPTY_VIEW)

  // 수신 메시지 1건을 검증 후 뷰 상태에 반영합니다.
  const applyMessage = useCallback((raw: unknown) => {
    const parsed = downstreamEventSchema.safeParse(raw)
    if (!parsed.success) return // 계약 위반 메시지는 무시(스키마가 방어)

    const event = parsed.data
    setView((prev) => {
      switch (event.type) {
        case "question":
          // 새 질문 시작 — 이전 답변의 자막·평가는 비웁니다.
          return { ...prev, question: event, transcript: "", evaluation: "" }
        case "transcript_delta":
          return { ...prev, transcript: prev.transcript + event.delta }
        case "eval_delta":
          return { ...prev, evaluation: prev.evaluation + event.delta }
        case "summary":
          return { ...prev, summary: event }
      }
    })
  }, [])

  // sessionId 가 정해지면 연결하고, 언마운트/변경 시 정리합니다.
  useEffect(() => {
    if (!sessionId) return

    const socket = new WebSocket(`${WS_BASE}/interviews/ws/${sessionId}`)
    socketRef.current = socket
    setView({ ...EMPTY_VIEW, state: "connecting" })

    socket.onopen = () => setView((prev) => ({ ...prev, state: "open" }))
    socket.onclose = () => setView((prev) => ({ ...prev, state: "closed" }))
    socket.onmessage = (e) => {
      try {
        applyMessage(JSON.parse(e.data))
      } catch {
        // JSON 이 아닌 프레임은 무시
      }
    }

    return () => {
      socket.close()
      socketRef.current = null
    }
  }, [sessionId, applyMessage])

  // ── 업스트림 송신 액션 ──────────────────────────────────────────────────────
  const sendControl = useCallback((action: ControlAction) => {
    socketRef.current?.send(JSON.stringify({ type: "control", action }))
  }, [])

  // 오디오 청크(binary)는 JSON 이 아니라 바이너리 프레임으로 보냅니다.
  const sendAudio = useCallback((chunk: ArrayBuffer | Blob) => {
    socketRef.current?.send(chunk)
  }, [])

  // 비언어 지표 프레임(landmark_frame) 송신 — 계약 위반 프레임이 서버로 새지 않도록
  // 송신 직전 Zod 로 1차 검증한 뒤 raw snake_case JSON 으로 보냅니다.
  const sendLandmark = useCallback((frame: LandmarkFrameMessage) => {
    const parsed = landmarkFrameMessageSchema.safeParse(frame)
    if (!parsed.success) return
    socketRef.current?.send(JSON.stringify(parsed.data))
  }, [])

  // 이벤트 증거 스냅샷(event_snapshot) 송신 — 시선이탈·무표정 등 감지 시.
  const sendEventSnapshot = useCallback((snapshot: EventSnapshotMessage) => {
    const parsed = eventSnapshotMessageSchema.safeParse(snapshot)
    if (!parsed.success) return
    socketRef.current?.send(JSON.stringify(parsed.data))
  }, [])

  return {
    ...view,
    answerStart: useCallback(() => sendControl("answer_start"), [sendControl]),
    answerEnd: useCallback(() => sendControl("answer_end"), [sendControl]),
    next: useCallback(() => sendControl("next"), [sendControl]),
    sendAudio,
    sendLandmark,
    sendEventSnapshot,
  }
}
