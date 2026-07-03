/**
 * useInterview.ts
 *
 * 라이브 면접방의 세션 시작 훅입니다(WS 주도).
 * REST 로 세션(식별자·전체시간)을 확보하고 상태머신을 connecting 으로 진입시킵니다.
 * 질문 진행·채점은 WS(useLiveStreaming)가 담당하므로 여기서는 start()만 노출합니다.
 */

"use client"

import { useCallback } from "react"
import { useMutation } from "@tanstack/react-query"
import { startSession as startSessionApi } from "../services/interviewService"
import { useInterviewSessionStore } from "../store/interviewSessionStore"
import type { InterviewConfig } from "../types/interviewSession"

export function useInterview() {
  const configure = useInterviewSessionStore((s) => s.configure)
  const beginSession = useInterviewSessionStore((s) => s.beginSession)

  // 세션 시작 — 설정 저장 후 세션을 받아 상태머신을 connecting(첫 질문 대기)으로 진입시킵니다.
  const startMutation = useMutation({
    mutationFn: (config: InterviewConfig) => startSessionApi(config),
    onSuccess: (session) => beginSession(session),
  })

  const start = useCallback(
    (config: InterviewConfig) => {
      configure(config)
      startMutation.mutate(config)
    },
    [configure, startMutation]
  )

  return {
    start,
    isStarting: startMutation.isPending,
    startError: startMutation.isError,
    retryStart: startMutation.reset,
  }
}
