/**
 * interviewRoomPage.tsx
 *
 * 라이브 면접방의 최상위 컨테이너입니다(WS 주도). 상태머신(phase)에 따라 화면을 분기하고,
 * 질문·자막·평가·요약을 백엔드 WS 이벤트로 받아 진행합니다.
 *   setup → (REST로 세션 시작) → connecting(첫 질문 대기) → asking → answering
 *         → evaluating(평가 표시·다음 대기) → asking … → finished → 결과 리포트
 *
 * REST(useInterview.start)는 세션 식별자(sessionId)와 전체 시간 확보용으로만 쓰고,
 * 질문 진행·채점은 WS(useLiveStreaming)가 담당합니다.
 */

"use client"

import { useCallback, useEffect, useRef, useState } from "react"
import { useRouter } from "next/navigation"
import { Loader2, WifiOff } from "lucide-react"
import { routes } from "@/constants/routes"
import { useInterview } from "../hooks/useInterview"
import { useMediaStream } from "../hooks/useMediaStream"
import { useTts } from "../hooks/useTts"
import { useInterviewTimer } from "../hooks/useInterviewTimer"
import { useLiveStreaming } from "../hooks/useLiveStreaming"
import { useInterviewSessionStore } from "../store/interviewSessionStore"
import { useInterviewSummaryStore } from "../store/interviewSummaryStore"
import { InterviewSetup } from "./room/interviewSetup"
import { SessionTimerBar } from "./room/sessionTimerBar"
import { VideoStage } from "./room/videoStage"
import { InterviewerPanel } from "./room/interviewerPanel"
import { AnswerPanel } from "./room/answerPanel"
import { EvaluationPanel } from "./room/evaluationPanel"
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
  const liveQuestionNo = useInterviewSessionStore((s) => s.liveQuestionNo)
  const beginAnswering = useInterviewSessionStore((s) => s.beginAnswering)
  const presentQuestion = useInterviewSessionStore((s) => s.presentQuestion)
  const beginEvaluating = useInterviewSessionStore((s) => s.beginEvaluating)
  const finishNow = useInterviewSessionStore((s) => s.finishNow)
  const reset = useInterviewSessionStore((s) => s.reset)
  const cameraConsented = useInterviewSessionStore((s) => s.cameraConsented)
  const setCameraConsent = useInterviewSessionStore((s) => s.setCameraConsent)
  const setLiveSummary = useInterviewSummaryStore((s) => s.setSummary)
  const clearLiveSummary = useInterviewSummaryStore((s) => s.clearSummary)

  // ─── 미디어 · 음성 · 세션 ───
  const { start, isStarting, startError } = useInterview()
  const media = useMediaStream()
  const tts = useTts()

  const [answerText, setAnswerText] = useState("")
  // 음성 모드 자막(편집 가능). STT 자막을 사용자가 교정한 값이며, 제출 시 text_answer 로 보낸다.
  const [voiceAnswer, setVoiceAnswer] = useState("")
  const [voiceAnswerDirty, setVoiceAnswerDirty] = useState(false) // 사용자가 손대면 자동 동기화 중단
  // 제출한 답변 본문 — evaluating 단계의 "내 답변" 표시 출처. WS 자막 echo(중복 위험) 대신
  // 실제 백엔드에 보낸 텍스트를 그대로 보여줘 WYSIWYG 를 보장한다.
  const [submittedAnswer, setSubmittedAnswer] = useState("")
  const [nextRequested, setNextRequested] = useState(false) // "다음 질문" 누른 뒤 도착 대기
  const mode: InterviewMode = config?.mode ?? "text"

  // ─── 실시간 스트리밍(WS + 비언어 + 오디오) ───
  // VideoStage 가 노출하는 <video> 픽셀을 MediaPipe 가 그대로 읽습니다(디코드 1회).
  const analysisVideoRef = useRef<HTMLVideoElement | null>(null)
  // WS 티켓이 401(세션 만료)이면 로그인으로 보내고, 끝나면 원래 면접 URL 로 복귀시킨다.
  const handleAuthExpired = useCallback(() => {
    const back = encodeURIComponent(routes.interview(companyId))
    router.replace(`${routes.login}?redirect=${back}`)
  }, [router, companyId])

  const live = useLiveStreaming({
    sessionId: session?.sessionId ?? null,
    companyId,
    jobTitle: config?.jobTitle ?? null,
    phase,
    mode,
    videoRef: analysisVideoRef,
    stream: media.stream,
    consented: cameraConsented,
    onAuthExpired: handleAuthExpired,
  })
  // 안정 신원 함수만 구조분해(핸들러 deps 안전).
  const {
    answerStart: wsAnswerStart,
    answerEnd: wsAnswerEnd,
    next: wsNext,
    sendTextAnswer: wsSendTextAnswer,
  } = live
  const liveQuestion = live.question

  // 전체 시간 카운트다운 — setup/finished를 제외한 단계에서 작동, 0이면 즉시 종료
  const running = phase !== "setup" && phase !== "finished"
  const remainingSec = useInterviewTimer(session?.totalDurationSec ?? 0, running, finishNow)

  // 세션이 바뀌면(새 면접·재시도) 질문 가드를 비워, 같은 id(m0)로 다시 시작해도 막히지 않게.
  const lastPresentedRef = useRef<string | null>(null)
  useEffect(() => {
    lastPresentedRef.current = null
  }, [session?.sessionId])

  // 새 WS 질문(메인/꼬리) 도착 → asking 진입 + TTS 발화. questionId 당 1회만.
  useEffect(() => {
    if (!liveQuestion) return
    if (lastPresentedRef.current === liveQuestion.questionId) return
    lastPresentedRef.current = liveQuestion.questionId
    setAnswerText("")
    setVoiceAnswer("")
    setVoiceAnswerDirty(false)
    setSubmittedAnswer("")
    setNextRequested(false)
    presentQuestion()
    void tts.speak(liveQuestion.ttsText ?? liveQuestion.text)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [liveQuestion?.questionId])

  // 음성 모드: 사용자가 자막을 직접 고치기 전까지는 들어오는 STT 자막을 편집칸에 반영한다.
  // 한 번이라도 손대면(dirty) 자동 동기화를 멈춰, 교정 내용이 새 delta 로 덮이지 않게 한다.
  useEffect(() => {
    if (mode !== "voice" || phase !== "answering") return
    if (voiceAnswerDirty) return
    setVoiceAnswer(live.transcript)
  }, [mode, phase, voiceAnswerDirty, live.transcript])

  // 최종 요약 도착 → 결과 페이지로 넘길 핸드오프 스토어에 담고 종료 전이
  useEffect(() => {
    if (!live.summary) return
    setLiveSummary(live.summary)
    finishNow()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [live.summary])

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
      // 새 면접 시작 → 직전 세션의 요약 핸드오프를 비워 옛 결과가 새 면접에 섞이지 않게 한다.
      clearLiveSummary()
      const cfg: InterviewConfig = { companyId, ...payload }
      start(cfg)
    },
    [companyId, start, clearLiveSummary]
  )

  const handleBeginAnswering = useCallback(() => {
    tts.cancel()
    setVoiceAnswer("") // 이전 답변 자막 비우고
    setVoiceAnswerDirty(false) // 새 답변은 다시 STT 자동 동기화부터
    setSubmittedAnswer("") // 이전 답변 본문이 새 답변에 새지 않게(재답변 흐름 방어)
    wsAnswerStart() // WS control: 답변 시작
    beginAnswering()
  }, [tts, wsAnswerStart, beginAnswering])

  // 음성 자막 편집 — 사용자가 손대면 dirty 로 표시해 자동 동기화를 멈춘다.
  const handleVoiceAnswerChange = useCallback((value: string) => {
    setVoiceAnswer(value)
    setVoiceAnswerDirty(true)
  }, [])

  // 답변 종료 — 입력/교정 텍스트를 text_answer 로 송신(백엔드가 STT 대신 이 텍스트를 답변으로 채택)
  // 후 종료 신호, 평가 단계로(평가 토큰 스트림 표시).
  const handleEndAnswer = useCallback(() => {
    const answer = mode === "voice" ? voiceAnswer.trim() : answerText.trim()
    if (answer) wsSendTextAnswer(answer)
    setSubmittedAnswer(answer) // evaluating 단계 "내 답변" 표시용(보낸 텍스트 그대로)
    wsAnswerEnd()
    beginEvaluating()
  }, [mode, voiceAnswer, answerText, wsSendTextAnswer, wsAnswerEnd, beginEvaluating])

  // 다음 질문 요청 — 백엔드가 꼬리질문/다음 메인 또는 요약을 보낸다. 도착까지 대기 표시.
  const handleNext = useCallback(() => {
    setNextRequested(true)
    wsNext()
  }, [wsNext])

  const handleRetry = useCallback(() => reset(), [reset]) // 연결 실패 시 처음부터(재연결은 Phase 6)

  // ─── 렌더 ───
  if (phase === "setup") {
    return (
      <InterviewSetup
        stream={media.stream}
        permission={media.permission}
        deviceError={media.error}
        isStarting={isStarting}
        startError={startError}
        cameraConsented={cameraConsented}
        onCameraConsentChange={setCameraConsent}
        onRequestDevices={() => media.request({ video: true, audio: true })}
        onStart={handleStart}
      />
    )
  }

  if (!session) return null

  // 첫 질문 도착 전 — 연결 게이트(연결 중 / 끊김 재시도)
  if (!liveQuestion) {
    const closed = live.socketState === "closed"
    return (
      <div className="flex min-h-[60vh] flex-col items-center justify-center gap-3 px-4 text-center">
        {closed ? (
          <>
            <WifiOff className="text-error h-8 w-8" />
            <p className="text-ink text-sm font-semibold">면접관과 연결이 끊어졌어요</p>
            <p className="text-muted text-xs">네트워크를 확인하고 다시 시도해 주세요.</p>
            <button
              type="button"
              onClick={handleRetry}
              className="bg-primary mt-1 rounded-xl px-4 py-2.5 text-sm font-semibold text-white"
            >
              다시 시도
            </button>
          </>
        ) : (
          <>
            <Loader2 className="text-primary h-8 w-8 animate-spin" />
            <p className="text-muted text-sm">면접관과 연결 중…</p>
          </>
        )}
      </div>
    )
  }

  const connectionLost = live.socketState === "closed"

  return (
    <div className="space-y-4 px-4 py-4">
      {connectionLost && (
        <div className="border-error/30 bg-error/10 text-error flex items-center justify-between gap-2 rounded-xl border p-3 text-xs">
          <span className="flex items-center gap-1.5">
            <WifiOff className="h-4 w-4" />
            연결이 끊어졌어요. 답변이 전달되지 않을 수 있어요.
          </span>
          <button type="button" onClick={handleRetry} className="font-semibold underline">
            다시 시도
          </button>
        </div>
      )}

      <SessionTimerBar
        remainingSec={remainingSec}
        totalSec={session.totalDurationSec}
        questionNo={liveQuestionNo}
      />

      <div className="relative">
        <VideoStage stream={media.stream} videoRef={analysisVideoRef} />
        <div className="absolute top-2 right-2">
          <ListeningIndicator active={listening} />
        </div>
      </div>

      <InterviewerPanel
        questionText={liveQuestion.text}
        questionNo={liveQuestionNo}
        isFollowUp={liveQuestion.questionId.startsWith("f")}
        isSpeaking={tts.isSpeaking}
        ttsSupported={tts.supported}
        onReplay={() => void tts.speak(liveQuestion.ttsText ?? liveQuestion.text)}
      />

      {phase === "evaluating" ? (
        <EvaluationPanel
          transcript={submittedAnswer || live.transcript}
          nextRequested={nextRequested}
          onNext={handleNext}
        />
      ) : (
        <AnswerPanel
          mode={mode}
          phase={phase}
          answerText={answerText}
          voiceAnswer={voiceAnswer}
          onAnswerTextChange={setAnswerText}
          onVoiceAnswerChange={handleVoiceAnswerChange}
          onBeginAnswering={handleBeginAnswering}
          onEndAnswer={handleEndAnswer}
        />
      )}
    </div>
  )
}
