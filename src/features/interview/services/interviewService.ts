/**
 * interviewService.ts
 *
 * 라이브 면접방 도메인의 API 호출을 담당하는 서비스 계층입니다.
 * 컴포넌트/훅은 axios를 직접 쓰지 않고 이 함수를 통해 BFF와 통신합니다.
 *
 * 확장 메모: submitAnswer의 시그니처(LiveEvaluation 반환)는 그대로 두고,
 *   내부 전송만 SSE 스트리밍으로 바꿀 수 있게 격리돼 있습니다(CLAUDE.md 확장 포인트).
 */

import axiosInstance from "@/lib/axiosInstance"
import { apiEndpoints } from "@/constants/api"
import type { ApiResponse } from "@/types/api"
import type {
  AnswerSubmission,
  InterviewConfig,
  InterviewSessionStart,
  LiveEvaluation,
  SttResult,
} from "../types/interviewSession"

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
