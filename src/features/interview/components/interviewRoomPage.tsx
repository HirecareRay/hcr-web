/**
 * interviewRoomPage.tsx
 *
 * 라이브 면접방의 최상위 컨테이너입니다. 상태머신(phase)에 따라 화면을 분기하고,
 * 미디어 스트림·TTS·STT·타이머·세션 진행을 한곳에서 조율합니다.
 *   setup → (질문 준비) → asking → answering → evaluating → feedback → … → finished → 결과 리포트
 */

"use client"

import { useCallback, useEffect, useRef, useState } from "react"
import { useRouter } from "next/navigation"
import { routes } from "@/constants/routes"
import { useInterview } from "../hooks/useInterview"
import { useMediaStream } from "../hooks/useMediaStream"
import { useStt } from "../hooks/useStt"
import { useTts } from "../hooks/useTts"
import { useInterviewTimer } from "../hooks/useInterviewTimer"
import { selectCurrentQuestion, useInterviewSessionStore } from "../store/interviewSessionStore"
import { InterviewSetup } from "./room/interviewSetup"
import { SessionTimerBar } from "./room/sessionTimerBar"
import { VideoStage } from "./room/videoStage"
import { InterviewerPanel } from "./room/interviewerPanel"
import { AnswerPanel } from "./room/answerPanel"
import { ListeningIndicator } from "./room/listeningIndicator"
import type { InterviewConfig, InterviewMode } from "../types/interviewSession"

interface Props {
  companyId: string
}

export function InterviewRoomPage({ companyId }: Props) {
  const router = useRouter()

  // ─── 상태머신 ───
  const phase = useInterviewSessionStore((s) => s.phase)
  const session = useInterviewSessionStore((s) => s.session)
  const config = useInterviewSessionStore((s) => s.config)
  const listening = useInterviewSessionStore((s) => s.listening)
  const beginAnswering = useInterviewSessionStore((s) => s.beginAnswering)
  const advanceQuestion = useInterviewSessionStore((s) => s.advanceQuestion)
  const finishNow = useInterviewSessionStore((s) => s.finishNow)
  const reset = useInterviewSessionStore((s) => s.reset)
  const currentQuestion = useInterviewSessionStore(selectCurrentQuestion)

  // ─── 미디어 · 음성 · 세션 ───
  const { start, submit, isStarting, startError } = useInterview()
  const media = useMediaStream()
  const tts = useTts()
  const stt = useStt(session?.sessionId ?? null)

  const [answerText, setAnswerText] = useState("")
  const answerStartRef = useRef<number>(0)
  const mode: InterviewMode = config?.mode ?? "text"

  // 전체 시간 카운트다운 — setup/finished를 제외한 단계에서 작동, 0이면 즉시 종료
  const running = phase !== "setup" && phase !== "finished"
  const remainingSec = useInterviewTimer(session?.totalDurationSec ?? 0, running, finishNow)

  // 질문이 바뀌고 asking 단계면 TTS로 질문을 읽어줌
  useEffect(() => {
    if (phase === "asking" && currentQuestion) {
      setAnswerText("")
      void tts.speak(currentQuestion.question)
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [phase, currentQuestion?.no])

  // 종료되면 미디어/음성을 정리하고 결과 리포트로 이동
  useEffect(() => {
    if (phase === "finished") {
      tts.cancel()
      media.stop()
      router.push(routes.interviewResult(companyId))
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [phase])

  // 언마운트 시 스토어 정리(다음 면접에 이전 세션이 남지 않게)
  useEffect(() => () => reset(), [reset])

  const handleStart = useCallback(
    (payload: { mode: InterviewMode; totalDurationSec: number; jobTitle: string }) => {
      const cfg: InterviewConfig = { companyId, ...payload }
      start(cfg)
    },
    [companyId, start]
  )

  const handleBeginAnswering = useCallback(() => {
    tts.cancel()
    answerStartRef.current = Date.now()
    beginAnswering()
  }, [tts, beginAnswering])

  const handleStartRecording = useCallback(() => {
    if (media.stream) stt.start(media.stream)
  }, [media.stream, stt])

  // 녹음을 멈추고 전사 결과를 답변 박스에 채움(이미 입력이 있으면 보존)
  const handleStopRecording = useCallback(async () => {
    const transcript = await stt.stopAndTranscribe()
    if (transcript) setAnswerText((prev) => (prev.trim() ? prev : transcript))
  }, [stt])

  // 답변 제출 — 백그라운드로 채점만 던지고(논블로킹) 즉시 다음 질문으로 넘어갑니다.
  const handleSubmit = useCallback(() => {
    if (!currentQuestion) return
    const elapsedSec = Math.max(1, Math.round((Date.now() - answerStartRef.current) / 1000))
    submit({
      no: currentQuestion.no,
      answerText: answerText.trim(),
      elapsedSec,
      hasVideo: Boolean(media.stream?.getVideoTracks().length),
      hasAudio: mode === "voice" && Boolean(media.stream?.getAudioTracks().length),
    })
    advanceQuestion()
  }, [currentQuestion, answerText, media.stream, mode, submit, advanceQuestion])

  // ─── 렌더 ───
  if (phase === "setup") {
    return (
      <InterviewSetup
        stream={media.stream}
        permission={media.permission}
        deviceError={media.error}
        isStarting={isStarting}
        startError={startError}
        onRequestDevices={() => media.request({ video: true, audio: true })}
        onStart={handleStart}
      />
    )
  }

  // 세션/질문이 아직 없거나 종료 이동 중이면 렌더하지 않음
  if (!session || !currentQuestion) return null

  return (
    <div className="space-y-4 px-4 py-4">
      <SessionTimerBar
        remainingSec={remainingSec}
        totalSec={session.totalDurationSec}
        questionNo={currentQuestion.no}
        questionCount={session.questionCount}
      />

      <div className="relative">
        <VideoStage stream={media.stream} />
        <div className="absolute top-2 right-2">
          <ListeningIndicator active={listening} />
        </div>
      </div>

      <InterviewerPanel
        question={currentQuestion}
        isSpeaking={tts.isSpeaking}
        ttsSupported={tts.supported}
        onReplay={() => void tts.speak(currentQuestion.question)}
      />

      <AnswerPanel
        mode={mode}
        phase={phase}
        answerText={answerText}
        recommendedAnswerSec={currentQuestion.recommendedAnswerSec}
        isRecording={stt.isRecording}
        isTranscribing={stt.isTranscribing}
        onAnswerTextChange={setAnswerText}
        onBeginAnswering={handleBeginAnswering}
        onStartRecording={handleStartRecording}
        onStopRecording={handleStopRecording}
        onSubmit={handleSubmit}
      />
    </div>
  )
}
