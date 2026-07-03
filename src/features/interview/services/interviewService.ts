/**
 * interviewService.ts
 *
 * 라이브 면접방 도메인의 API 호출을 담당하는 서비스 계층입니다.
 * 컴포넌트/훅은 axios를 직접 쓰지 않고 이 함수를 통해 BFF와 통신합니다.
 *
 * 확장 메모: submitAnswer의 시그니처(LiveEvaluation 반환)는 그대로 두고,
 *   내부 전송만 SSE 스트리밍으로 바꿀 수 있게 격리돼 있습니다(CLAUDE.md 확장 포인트).
 */

import axios from "axios"
import axiosInstance from "@/lib/axiosInstance"
import { apiEndpoints } from "@/constants/api"
import type { ApiResponse } from "@/types/api"
import type {
  AnswerSubmission,
  InterviewConfig,
  InterviewSessionStart,
  LiveEvaluation,
  SttResult,
  WsTicket,
} from "../types/interviewSession"

/**
 * WS 티켓 발급 실패를 나타내는 에러. `isAuthError` 가 true 면 세션 만료(401)로,
 * 호출 측은 로그인 페이지로 보낸다(면접은 로그인 필수).
 */
export class WsTicketError extends Error {
  readonly isAuthError: boolean
  constructor(message: string, isAuthError: boolean) {
    super(message)
    this.name = "WsTicketError"
    this.isAuthError = isAuthError
  }
}

/** 면접 세션을 시작하고 질문 목록을 받습니다. */
export async function startSession(config: InterviewConfig): Promise<InterviewSessionStart> {
  const { data } = await axiosInstance.post<ApiResponse<InterviewSessionStart>>(
    apiEndpoints.interview.sessions,
    config
  )

  if (!data.success || !data.data) {
    throw new Error(data.error ?? "면접을 시작하지 못했습니다")
  }

  return data.data
}

/** 한 질문에 대한 답변을 제출하고 평가를 받습니다(제출 후 일괄). */
export async function submitAnswer(
  sessionId: string,
  submission: AnswerSubmission
): Promise<LiveEvaluation> {
  const { data } = await axiosInstance.post<ApiResponse<LiveEvaluation>>(
    apiEndpoints.interview.answer(sessionId),
    submission
  )

  if (!data.success || !data.data) {
    throw new Error(data.error ?? "답변을 채점하지 못했습니다")
  }

  return data.data
}

/**
 * WS 접속용 단기 티켓을 발급받습니다(BFF 경유 — 쿠키 JWT 를 Bearer 로 중계).
 * 발급 직후 바로 연결하세요(만료까지 `expiresIn`초, 1회용). 재연결 시 매번 새로 받아야 합니다.
 * 실패 시 WsTicketError 를 throw 합니다(익명 폴백 없음 — 면접은 로그인 필수).
 */
export async function getWsTicket(): Promise<WsTicket> {
  try {
    const { data } = await axiosInstance.post<ApiResponse<WsTicket>>(
      apiEndpoints.interview.wsTicket
    )

    if (!data.success || !data.data) {
      throw new WsTicketError(data.error ?? "WS 티켓을 발급하지 못했습니다", false)
    }

    return data.data
  } catch (error) {
    if (error instanceof WsTicketError) throw error
    // 401 = 비로그인·세션 만료 → 로그인으로 보내야 함.
    const isAuthError = axios.isAxiosError(error) && error.response?.status === 401
    throw new WsTicketError(
      isAuthError ? "세션이 만료되었습니다" : "WS 티켓을 발급하지 못했습니다",
      isAuthError
    )
  }
}

/** (음성 모드) 녹음된 오디오를 전사 텍스트로 변환합니다. */
export async function transcribeAudio(sessionId: string, audio: Blob): Promise<SttResult> {
  const form = new FormData()
  form.append("audio", audio, "answer.webm")

  const { data } = await axiosInstance.post<ApiResponse<SttResult>>(
    apiEndpoints.interview.stt(sessionId),
    form,
    { headers: { "Content-Type": "multipart/form-data" } }
  )

  if (!data.success || !data.data) {
    throw new Error(data.error ?? "음성을 전사하지 못했습니다")
  }

  return data.data
}
