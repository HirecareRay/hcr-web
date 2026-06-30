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
import { getWsTicket, WsTicketError } from "../services/interviewService"
import { buildInterviewWsUrl } from "../lib/wsUrl"
import { logger } from "@/lib/logger"

const WS_BASE = process.env.NEXT_PUBLIC_INTERVIEW_WS_URL ?? "ws://localhost:8000"

export interface InterviewSocketOptions {
  companyId?: string | null // 기업 분석 컨텍스트 주입용(선택)
  jobTitle?: string | null // 지원 직무 — 질문 생성 컨텍스트(선택)
  onAuthExpired?: () => void // 티켓 401(세션 만료) 시 호출 — 보통 로그인 페이지로 보냄
}

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

export function useInterviewSocket(sessionId: string | null, options: InterviewSocketOptions = {}) {
  const { companyId, jobTitle, onAuthExpired } = options
  const socketRef = useRef<WebSocket | null>(null)
  const [view, setView] = useState<InterviewSocketView>(EMPTY_VIEW)

  // 콜백을 ref 로 고정해, onAuthExpired 의 신원이 바뀌어도 연결 effect 가 재실행되지 않게 한다.
  const onAuthExpiredRef = useRef(onAuthExpired)
  onAuthExpiredRef.current = onAuthExpired

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

  // sessionId 가 정해지면 ① 단기 티켓을 발급받고 ② 그 티켓으로 WS 를 연다.
  // 티켓은 1회용·60초 만료라 발급 직후 바로 연결한다(재연결 시 이 effect 가 다시 돌며
  // 매번 새 티켓을 받는다). 발급은 비동기라, 그 사이 언마운트/세션 변경되면 cancelled 로 차단한다.
  //
  // ⚠️ TODO(Phase 6 · 배포 전 필수): 이 채널로 얼굴 스냅샷(event_snapshot)·음성(audio_chunk)이
  //   흐른다. 인증은 단기 WS 티켓으로 해결됐으나, 평문(ws://)이라 로컬 데모 한정으로만 안전하다.
  //   배포 전: wss:// 강제(프라이버시 데이터 평문 전송 금지) + origin 검증.
  useEffect(() => {
    if (!sessionId) return

    let cancelled = false
    setView({ ...EMPTY_VIEW, state: "connecting" })

    async function connect(sid: string) {
      let ticket: string
      try {
        const issued = await getWsTicket()
        ticket = issued.ticket
      } catch (err) {
        if (cancelled) return
        // 401(세션 만료) → 로그인으로. 그 외 실패 → 연결 포기(익명 폴백 없음).
        if (err instanceof WsTicketError && err.isAuthError) {
          onAuthExpiredRef.current?.()
        } else {
          logger.error("WS 티켓 발급 실패", err)
        }
        setView((prev) => ({ ...prev, state: "closed" }))
        return
      }

      // 발급 도중 언마운트/세션 변경됐으면 연결하지 않는다.
      if (cancelled) return

      const url = buildInterviewWsUrl({
        base: WS_BASE,
        sessionId: sid,
        ticket,
        companyId,
        jobTitle,
      })
      const socket = new WebSocket(url)
      socketRef.current = socket

      // cancelled 가드: cleanup 으로 닫힌 옛 소켓의 onclose 가 뒤늦게 발화해, 새 실행이
      // 세팅한 "connecting" 상태를 "closed" 로 덮거나 언마운트 후 setView 하지 않도록 막는다.
      socket.onopen = () => {
        if (cancelled) return
        setView((prev) => ({ ...prev, state: "open" }))
      }
      socket.onclose = () => {
        if (cancelled) return
        setView((prev) => ({ ...prev, state: "closed" }))
      }
      socket.onmessage = (e) => {
        if (cancelled) return
        try {
          applyMessage(JSON.parse(e.data))
        } catch {
          // JSON 이 아닌 프레임은 무시
        }
      }
    }

    void connect(sessionId)

    return () => {
      cancelled = true
      socketRef.current?.close()
      socketRef.current = null
    }
  }, [sessionId, companyId, jobTitle, applyMessage])

  // ── 업스트림 송신 액션 ──────────────────────────────────────────────────────

  // 모든 송신의 공통 관문. 소켓이 OPEN 일 때만 보내고, 닫힘/네트워크 오류로 인한 예외를
  // 흡수한다. 비언어 캡처는 rAF 루프에서 매초 landmark_frame 을 보내므로, 닫힌(CLOSING/
  // CLOSED) 소켓에 send 하면 던지는 InvalidStateError 가 루프를 오염시키지 않도록 차단한다.
  // 송신 성공 여부를 boolean 으로 돌려주어, 손실 프레임을 호출 측이 셀 수 있게 한다.
  // (버퍼링·재연결은 Phase 6 범위 — 지금은 손실 프레임을 다음 프레임으로 자연 복구한다.)
  const safeSend = useCallback((data: string | ArrayBuffer | Blob): boolean => {
    const socket = socketRef.current
    if (!socket || socket.readyState !== WebSocket.OPEN) return false
    try {
      socket.send(data)
      return true
    } catch (err) {
      logger.error("WS 송신 실패", err)
      return false
    }
  }, [])

  const sendControl = useCallback(
    (action: ControlAction) => safeSend(JSON.stringify({ type: "control", action })),
    [safeSend]
  )

  // 오디오 청크(binary)는 JSON 이 아니라 바이너리 프레임으로 보냅니다.
  const sendAudio = useCallback((chunk: ArrayBuffer | Blob) => safeSend(chunk), [safeSend])

  // 텍스트 모드 답변(타이핑) 송신 — 백엔드가 answer_end 시 오디오 전사 대신 이 텍스트를 쓴다.
  const sendTextAnswer = useCallback(
    (text: string) => safeSend(JSON.stringify({ type: "text_answer", text })),
    [safeSend]
  )

  // 비언어 지표 프레임(landmark_frame) 송신 — 계약 위반 프레임이 서버로 새지 않도록
  // 송신 직전 Zod 로 1차 검증한 뒤 raw snake_case JSON 으로 보냅니다.
  const sendLandmark = useCallback(
    (frame: LandmarkFrameMessage): boolean => {
      const parsed = landmarkFrameMessageSchema.safeParse(frame)
      if (!parsed.success) return false
      return safeSend(JSON.stringify(parsed.data))
    },
    [safeSend]
  )

  // 이벤트 증거 스냅샷(event_snapshot) 송신 — 시선이탈·무표정 등 감지 시.
  const sendEventSnapshot = useCallback(
    (snapshot: EventSnapshotMessage): boolean => {
      const parsed = eventSnapshotMessageSchema.safeParse(snapshot)
      if (!parsed.success) return false
      return safeSend(JSON.stringify(parsed.data))
    },
    [safeSend]
  )

  return {
    ...view,
    answerStart: useCallback(() => sendControl("answer_start"), [sendControl]),
    answerEnd: useCallback(() => sendControl("answer_end"), [sendControl]),
    next: useCallback(() => sendControl("next"), [sendControl]),
    sendAudio,
    sendTextAnswer,
    sendLandmark,
    sendEventSnapshot,
  }
}
