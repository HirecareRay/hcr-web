/**
 * useInterviewSocket.ts
 *
 * 실시간 면접방의 WebSocket "두뇌" 훅입니다.
 *
 * hcr-backend 서버·DB 폐쇄로 실제 WS 연결 대신, REST 세션 시작(POST /api/interview/sessions)이
 * 이미 만들어둔 interviewSessionStore.session.questions 를 "WS가 순서대로 보내주는 것처럼"
 * 타이머로 재생한다. question → (답변) → next → question … → summary 순서만 재현하면
 * 화면 전이(interviewRoomPage 상태머신)는 실제 WS와 동일하게 동작한다.
 *
 * ⚠️ 이 훅을 쓰는 ws-demo/nonverbal-demo 데모 페이지는 questions 없이 자체 sessionId만
 *    쓰므로(REST 세션 미생성) 이 mock으로도 첫 질문이 오지 않는다 — 원래도 Phase 1 스켈레톤
 *    데모였고 백엔드 의존이라 별도 처리하지 않는다.
 */

// 아래는 원래 FastAPI 직접 연결 로직 (백엔드 복구 시 이 블록으로 되돌리세요):
//
// "use client"
//
// import { useCallback, useEffect, useRef, useState } from "react"
// import {
//   downstreamEventSchema,
//   eventSnapshotMessageSchema,
//   landmarkFrameMessageSchema,
//   voiceMetricMessageSchema,
// } from "../types/interviewProtocolSchema"
// import type {
//   ControlAction,
//   EventSnapshotMessage,
//   LandmarkFrameMessage,
//   QuestionEvent,
//   SummaryEvent,
//   VoiceMetricMessage,
// } from "../types/interviewProtocol"
// import { getWsTicket, WsTicketError } from "../services/interviewService"
// import { buildInterviewWsUrl } from "../lib/wsUrl"
// import { logger } from "@/lib/logger"
//
// const WS_BASE = process.env.NEXT_PUBLIC_INTERVIEW_WS_URL ?? "ws://localhost:8000"
//
// (원본 전체 구현 — 브라우저가 FastAPI `/interviews/ws/{sessionId}` 에 직접 연결,
//  티켓 발급 → WebSocket 오픈 → downstreamEventSchema 로 수신 메시지 검증 → 상태 반영,
//  control/landmark/audio/voice_metric 을 zod 1차 검증 후 raw JSON/binary 로 송신)

"use client"

import { useCallback, useEffect, useRef, useState } from "react"
import type {
  EventSnapshotMessage,
  LandmarkFrameMessage,
  QuestionEvent,
  SummaryEvent,
  VoiceMetricMessage,
} from "../types/interviewProtocol"
import type { LiveQuestion } from "../types/interviewSession"
import { useInterviewSessionStore } from "../store/interviewSessionStore"
import { getPersona } from "../lib/personas"
import { getDummyQuestionSeed } from "../lib/mockQuestionSeeds"

export interface InterviewSocketOptions {
  companyId?: string | null // 기업 분석 컨텍스트 주입용(선택) — mock에서는 미사용
  jobTitle?: string | null // 지원 직무 — 질문 생성 컨텍스트(선택) — mock에서는 미사용
  onAuthExpired?: () => void // 티켓 401(세션 만료) 시 호출 — mock 티켓은 항상 성공하므로 미사용
}

export type SocketState = "idle" | "connecting" | "open" | "closed"

export interface InterviewSocketView {
  state: SocketState
  question: QuestionEvent | null // 현재 질문
  transcript: string // 누적 자막(transcript_delta)
  evaluation: string // 누적 평가(eval_delta) — 현재 UI가 쓰지 않아 mock은 채우지 않음
  summary: SummaryEvent | null // 최종 요약
}

const EMPTY_VIEW: InterviewSocketView = {
  state: "idle",
  question: null,
  transcript: "",
  evaluation: "",
  summary: null,
}

// "AI가 질문을 준비/평가하는" 느낌을 주기 위한 인위적 지연.
const MOCK_THINKING_DELAY_MS = 900

// 음성 모드 답변 중 자막이 흘러들어오는 것처럼 보이게 하는 더미 문장(단어 단위로 트리클).
//
// 예전 버전: 카테고리별 풀에서 questionNo % pool.length 로 대략 로테이션 — dummyQuestions.ts의
// 실제 질문 순서와 안 맞아(예: no=1 자기소개인데 강점/약점 답변이 나오는 등) 질문-답변 매핑이 어긋났다.
// const MOCK_TRANSCRIPTS: Record<LiveQuestion["category"], string[]> = {
//   common: [
//     "안녕하세요 저는 맡은 일은 끝까지 책임지는 성격이고 팀과 적극적으로 소통하며 문제를 해결해 왔습니다",
//     "제 강점은 꼼꼼함이고 약점은 완벽을 추구하다 일정이 지연되는 경우가 있어 우선순위를 정해 보완하고 있습니다",
//     "팀 프로젝트에서 의견 충돌이 있을 때 데이터를 근거로 제시해 합의를 이끌어낸 경험이 있습니다",
//   ],
//   company: [
//     "귀사의 데이터 기반 의사결정 문화에 매력을 느껴 지원했고 입사 후 실제 서비스 지표 개선에 기여하고 싶습니다",
//     "최근 발표하신 신사업 관련 기사를 인상 깊게 보았고 그 방향에 제 역량을 보태고 싶어 지원했습니다",
//     "입사 후에는 담당 서비스의 핵심 지표를 직접 개선하는 프로젝트를 주도해보고 싶습니다",
//   ],
//   job: [
//     "이전 프로젝트에서 데이터 마트를 설계하며 쿼리 성능을 크게 개선한 경험이 이 직무에 강점이 될 것 같습니다",
//     "최근에는 새로운 데이터 파이프라인 도구를 직접 학습하고 사이드 프로젝트에 적용해보았습니다",
//     "결측치가 많은 데이터를 다뤄본 경험이 있고 원인을 분석해 보완하는 전처리 전략을 세운 적이 있습니다",
//   ],
// }
// function mockTranscriptFor(category: LiveQuestion["category"], questionNo: number): string {
//   const pool = MOCK_TRANSCRIPTS[category]
//   return pool[questionNo % pool.length]
// }

// 현재 버전: dummyQuestions.ts(BFF)가 채점에 쓰는 것과 같은 시드(mockQuestionSeeds)를 그대로 써서,
// 화면에 보이는 "답변"이 실제로 그 질문에 매핑된 고정 답변과 항상 일치하게 한다.
function mockTranscriptFor(questionNo: number): string {
  return getDummyQuestionSeed(questionNo)?.answer ?? "질문 의도에 맞춰 구체적인 사례로 답변했습니다"
}

// LiveQuestion.category → 면접관 페르소나(고정 매핑, personas.ts 3인 중 하나).
function personaFor(category: LiveQuestion["category"]) {
  const id =
    category === "job" ? "tech_pressure" : category === "company" ? "culture_fit" : "practical"
  return getPersona(id)
}

function toQuestionEvent(q: LiveQuestion, isLast: boolean): QuestionEvent {
  const persona = personaFor(q.category)
  return {
    type: "question",
    questionId: `mock-q-${q.no}`,
    text: q.question,
    kind: "main",
    isLast,
    personaId: persona?.id,
    roleLabel: persona?.roleLabel,
    voice: persona?.voice,
  }
}

export function useInterviewSocket(
  sessionId: string | null,
  _options: InterviewSocketOptions = {}
) {
  // REST 세션 시작이 이미 만들어둔 질문 목록을 스토어에서 직접 읽는다(props로 새로 안 뚫음).
  const session = useInterviewSessionStore((s) => s.session)
  const [view, setView] = useState<InterviewSocketView>(EMPTY_VIEW)
  const questionIndexRef = useRef(0)
  const timersRef = useRef<ReturnType<typeof setTimeout>[]>([])

  const clearTimers = useCallback(() => {
    timersRef.current.forEach(clearTimeout)
    timersRef.current = []
  }, [])

  // sessionId 가 정해지면 "연결 중" → 첫 질문 도착을 흉내낸다.
  useEffect(() => {
    if (!sessionId || !session || session.questions.length === 0) return

    questionIndexRef.current = 0
    clearTimers()
    setView({ ...EMPTY_VIEW, state: "connecting" })

    const timer = setTimeout(() => {
      const first = session.questions[0]
      setView((prev) => ({
        ...prev,
        state: "open",
        question: toQuestionEvent(first, session.questions.length === 1),
      }))
    }, MOCK_THINKING_DELAY_MS)
    timersRef.current.push(timer)

    return () => clearTimers()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [sessionId])

  // ── 업스트림 액션(mock) ──────────────────────────────────────────────────

  // 답변 구간 동안 더미 자막을 단어 단위로 흘려보낸다(음성 모드에서 "인식 중"처럼 보이게).
  // 현재 질문 번호(no)로 그 질문에 매핑된 고정 답변을 그대로 재생한다.
  const answerStart = useCallback(() => {
    const q = session?.questions[questionIndexRef.current]
    const transcript = mockTranscriptFor(q?.no ?? 1)
    const words = transcript.split(" ")
    words.forEach((_word, i) => {
      const timer = setTimeout(() => {
        setView((prev) => ({ ...prev, transcript: words.slice(0, i + 1).join(" ") }))
      }, i * 150)
      timersRef.current.push(timer)
    })
  }, [session])

  const answerEnd = useCallback(() => clearTimers(), [clearTimers])

  // "다음 질문" 요청 — 남은 질문이 있으면 다음 질문을, 마지막이었으면 summary 를 지연 후 반영한다.
  const next = useCallback(() => {
    if (!session) return
    const nextIndex = questionIndexRef.current + 1

    const timer = setTimeout(() => {
      if (nextIndex >= session.questions.length) {
        setView((prev) => ({
          ...prev,
          summary: {
            type: "summary",
            overallScore: 78,
            languageFeedback: "질문 의도를 정확히 파악하고 논리적으로 답변을 구성했습니다.",
            nonverbalFeedback: "표정과 시선 처리가 대체로 안정적이었습니다.",
            improvements: ["결론을 먼저 말하면 답변 전달력이 더 높아집니다."],
          },
        }))
        return
      }

      questionIndexRef.current = nextIndex
      const q = session.questions[nextIndex]
      setView((prev) => ({
        ...prev,
        transcript: "",
        evaluation: "",
        question: toQuestionEvent(q, nextIndex === session.questions.length - 1),
      }))
    }, MOCK_THINKING_DELAY_MS)
    timersRef.current.push(timer)
  }, [session])

  const sendTextAnswer = useCallback((_text: string): boolean => true, [])
  const sendAudio = useCallback((_chunk: ArrayBuffer | Blob): boolean => true, [])
  const sendLandmark = useCallback((_frame: LandmarkFrameMessage): boolean => true, [])
  const sendEventSnapshot = useCallback((_snapshot: EventSnapshotMessage): boolean => true, [])
  const sendVoiceMetric = useCallback((_metric: VoiceMetricMessage): boolean => true, [])

  return {
    ...view,
    answerStart,
    answerEnd,
    next,
    sendAudio,
    sendTextAnswer,
    sendLandmark,
    sendEventSnapshot,
    sendVoiceMetric,
  }
}
