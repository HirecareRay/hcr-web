/**
 * useInterview.ts
 *
 * 라이브 면접방의 "두뇌" 훅입니다.
 * 스토어(상태머신) + 서비스(BFF 호출) + React Query mutation을 한데 묶어
 * 컴포넌트가 start()/submit()만 호출하면 단계가 흘러가게 합니다.
 */

"use client"

import { useCallback } from "react"
import { useMutation } from "@tanstack/react-query"
import {
  startSession as startSessionApi,
  submitAnswer as submitAnswerApi,
} from "../services/interviewService"
import { useInterviewSessionStore } from "../store/interviewSessionStore"
import type { AnswerSubmission, InterviewConfig } from "../types/interviewSession"

export function useInterview() {
  const configure = useInterviewSessionStore((s) => s.configure)
  const beginSession = useInterviewSessionStore((s) => s.beginSession)
  const recordEvaluation = useInterviewSessionStore((s) => s.recordEvaluation)

  // 세션 시작 — 설정 저장 후 질문 목록을 받아 상태머신을 asking으로 진입시킵니다.
  const startMutation = useMutation({
    mutationFn: (config: InterviewConfig) => startSessionApi(config),
    onSuccess: (session) => beginSession(session),
  })

  // 답변 제출 — 백그라운드(논블로킹) 채점. UI는 막지 않고 즉시 다음 질문으로 넘어가며,
  // 채점 결과는 도착하는 대로 스토어에 누적만 합니다. (실패해도 면접 흐름은 끊기지 않음)
  const answerMutation = useMutation({
    mutationFn: (submission: AnswerSubmission) => {
      const sessionId = useInterviewSessionStore.getState().session?.sessionId
      if (!sessionId) throw new Error("세션이 시작되지 않았습니다")
      return submitAnswerApi(sessionId, submission)
    },
    onSuccess: (evaluation) => recordEvaluation(evaluation),
  })

  const start = useCallback(
    (config: InterviewConfig) => {
      configure(config)
      startMutation.mutate(config)
    },
    [configure, startMutation]
  )

  const submit = useCallback(
    (submission: AnswerSubmission) => answerMutation.mutate(submission),
    [answerMutation]
  )

  return {
    start,
    submit,
    isStarting: startMutation.isPending,
    startError: startMutation.isError,
    retryStart: startMutation.reset,
  }
}
