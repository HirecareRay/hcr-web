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
import { WifiOff } from "lucide-react"
import { AiAnalyzingLoader } from "@/components/ui/aiAnalyzingLoader"
import { routes } from "@/constants/routes"
import { useInterview } from "../hooks/useInterview"
import { useMediaStream } from "../hooks/useMediaStream"
import { useTts } from "../hooks/useTts"
import { useInterviewTimer } from "../hooks/useInterviewTimer"
import { useLiveStreaming } from "../hooks/useLiveStreaming"
import { useInterviewSessionStore } from "../store/interviewSessionStore"
import { InterviewSetup } from "./room/interviewSetup"
import { SessionTimerBar } from "./room/sessionTimerBar"
import { VideoStage } from "./room/videoStage"
import { InterviewerPanel } from "./room/interviewerPanel"
import { AnswerPanel, type VoiceStep } from "./room/answerPanel"
import { EvaluationPanel } from "./room/evaluationPanel"
import { ListeningIndicator } from "./room/listeningIndicator"
import type { InterviewConfig, InterviewMode } from "../types/interviewSession"

interface Props {
  companyId: string
}

export function InterviewRoomPage({ companyId }: Props) {
  const router = useRouter()

  // 일반 면접(general)도 companyId 를 그대로 WS 로 실어 보낸다. 백엔드는 이 값을 두 곳에 쓰는데,
  //   ① 기업 컨텍스트 조회 — general 은 ObjectId 가 아니라 조회에 실패하지만 백엔드가 안전하게
  //      무시한다(get_company_context 가 예외를 흡수 → 컨텍스트만 비고 면접은 그대로 진행).
  //   ② 결과 저장 키 — 세션은 이 company_id 로 저장되고, 결과 페이지는 /results/{companyId} 로
  //      조회한다. general 을 null 로 비우면 백엔드가 ''(빈 문자열)로 저장해 'general' 조회와
  //      키가 어긋나 404 가 난다. 저장 키 == 조회 키를 맞추려면 여기서 general 을 반드시 실어야 한다.
  const wsCompanyId = companyId

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

  // ─── 미디어 · 음성 · 세션 ───
  const { start, isStarting, startError } = useInterview()
  const media = useMediaStream()
  const tts = useTts()

  const [answerText, setAnswerText] = useState("")
  // 음성 모드 교정 텍스트(review 단계 편집값). 인식이 끝난 자막을 사용자가 고친 값이며,
  // 제출 시 text_answer 로 보낸다.
  const [voiceAnswer, setVoiceAnswer] = useState("")
  // 음성 모드 answering 하위 단계 — listening(읽기 전용 인식 중) → review(편집·제출).
  const [voiceStep, setVoiceStep] = useState<VoiceStep>("listening")
  // review 단계에서 사용자가 자막을 직접 고쳤는지. 고치기 전까지는 늦게 도착한 STT delta 를
  // 편집칸에 계속 흡수해(끝문장 유실 방지), 손대면 흡수를 멈춰 교정 내용을 덮지 않는다.
  const voiceReviewDirtyRef = useRef(false)
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
    companyId: wsCompanyId,
    jobTitle: config?.jobTitle ?? null,
    phase,
    mode,
    // 음성 모드는 listening(말하는 중)에만 캡처·송신하고, review(검토·수정)에선 멈춘다.
    voiceListening: voiceStep === "listening",
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
    setVoiceStep("listening")
    voiceReviewDirtyRef.current = false
    setSubmittedAnswer("")
    setNextRequested(false)
    presentQuestion()
    void tts.speak(liveQuestion.ttsText ?? liveQuestion.text)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [liveQuestion?.questionId])

  // 음성 자막은 listening 단계에선 읽기 전용으로만 보여주고(LiveTranscriptView), 편집칸에는
  // 넣지 않는다. review 진입 후에도 "사용자가 직접 고치기 전까지는" 늦게 도착한 STT delta 를
  // 계속 편집칸에 반영한다 — STT 지연(0.5~2s)으로 클릭 직후 도착하는 끝문장이 답변에서
  // 유실되지 않도록. 사용자가 손대면(dirty) 흡수를 멈춰 교정 내용을 덮지 않는다.
  useEffect(() => {
    if (mode !== "voice" || voiceStep !== "review") return
    if (voiceReviewDirtyRef.current) return
    setVoiceAnswer(live.transcript)
  }, [mode, voiceStep, live.transcript])

  // 최종 요약(WS summary) 도착 → 종료 전이. 결과 자체는 백엔드가 저장하므로 결과 페이지가
  // /results/{companyId} 로 조회한다(요약을 프론트로 들고 넘기지 않는다).
  useEffect(() => {
    if (!live.summary) return
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
      const cfg: InterviewConfig = { companyId, ...payload }
      start(cfg)
    },
    [companyId, start]
  )

  const handleBeginAnswering = useCallback(() => {
    tts.cancel()
    setVoiceAnswer("") // 이전 답변 교정 텍스트 비우고
    setVoiceStep("listening") // 새 답변은 인식(listening) 단계부터
    voiceReviewDirtyRef.current = false // 새 답변은 다시 자막 흡수부터
    setSubmittedAnswer("") // 이전 답변 본문이 새 답변에 새지 않게(재답변 흐름 방어)
    wsAnswerStart() // WS control: 답변 시작
    beginAnswering()
  }, [tts, wsAnswerStart, beginAnswering])

  // 음성: "답변 입력 완료" — 인식(오디오/지표 송신)을 멈추고 review 단계로.
  // 진입 시 누적 자막을 seed 하고, 위 effect 가 늦은 delta 를 손대기 전까지 계속 흡수한다.
  const handleFinishSpeaking = useCallback(() => {
    voiceReviewDirtyRef.current = false
    setVoiceAnswer(live.transcript)
    setVoiceStep("review")
  }, [live.transcript])

  // 음성 자막 편집 — 사용자가 손대면 dirty 로 표시해 늦은 delta 흡수를 멈춘다.
  const handleVoiceAnswerChange = useCallback((value: string) => {
    voiceReviewDirtyRef.current = true
    setVoiceAnswer(value)
  }, [])

  // 답변 종료(텍스트 종료 / 음성 review 제출) — 입력/교정 텍스트를 text_answer 로 송신
  // (백엔드가 STT 대신 이 텍스트를 답변으로 채택) 후 종료 신호, 평가 단계로(평가 토큰 스트림 표시).
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
        onRequestDevices={(options) =>
          options.video || options.audio ? void media.request(options) : media.stop()
        }
        onStart={handleStart}
      />
    )
  }

  if (!session) return null

  // 첫 질문 도착 전 — 연결 게이트(끊김 재시도 / 첫 질문 생성 중)
  if (!liveQuestion) {
    if (live.socketState === "closed") {
      return (
        <div className="flex min-h-[60vh] flex-col items-center justify-center gap-3 px-4 text-center">
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
        </div>
      )
    }
    return (
      <AiAnalyzingLoader
        center
        title="첫 질문을 준비하고 있어요"
        subtitle="AI 면접관이 곧 면접을 시작합니다"
        steps={["기업·직무 정보 반영", "면접 질문 구성", "면접관 준비"]}
      />
    )
  }

  // 마지막 답변 제출 후 "결과 보기"를 누른 상태 — summary 도착 전까지 전체 화면 결과 정리 로더.
  // summary 가 오면 finishNow → 결과 페이지로 이동한다.
  if (phase === "evaluating" && nextRequested && liveQuestion.isLast) {
    return (
      <AiAnalyzingLoader
        center
        title="면접 결과를 정리하고 있어요"
        subtitle="답변과 표정·음성을 종합해 리포트를 만들고 있어요"
        steps={["답변 내용 종합", "표정·시선 분석", "음성 안정도 분석", "강점·보완점 도출"]}
      />
    )
  }

  const connectionLost = live.socketState === "closed"
  // 카메라 트랙이 실제로 있을 때만 화상 스테이지를 노출한다(표정 분석 off = 순수 텍스트/음성).
  const hasCameraTrack = !!media.stream && media.stream.getVideoTracks().length > 0

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

      {/* 카메라(표정 분석)를 켠 경우에만 화상 스테이지를 노출한다 — 순수 텍스트 면접에선 숨긴다. */}
      {hasCameraTrack && (
        <div className="relative">
          <VideoStage stream={media.stream} videoRef={analysisVideoRef} />
          <div className="absolute top-2 right-2">
            <ListeningIndicator active={listening} />
          </div>
        </div>
      )}

      <InterviewerPanel
        questionText={liveQuestion.text}
        questionNo={liveQuestionNo}
        isFollowUp={liveQuestion.kind === "follow_up"}
        isSpeaking={tts.isSpeaking}
        ttsSupported={tts.supported}
        onReplay={() => void tts.speak(liveQuestion.ttsText ?? liveQuestion.text)}
      />

      {phase === "evaluating" ? (
        nextRequested ? (
          // 다음 질문 생성 대기(마지막 질문 요약 대기는 위에서 전체 화면으로 처리)
          <AiAnalyzingLoader
            title="AI가 다음 질문을 준비하고 있어요"
            steps={["직전 답변 분석", "다음 질문 구성"]}
            skeletonCount={0}
            className="px-0 py-2"
          />
        ) : (
          <EvaluationPanel
            transcript={submittedAnswer || live.transcript}
            isLast={liveQuestion.isLast ?? false}
            onNext={handleNext}
          />
        )
      ) : (
        <AnswerPanel
          mode={mode}
          phase={phase}
          voiceStep={voiceStep}
          stream={media.stream}
          answerText={answerText}
          liveTranscript={live.transcript}
          voiceAnswer={voiceAnswer}
          onAnswerTextChange={setAnswerText}
          onVoiceAnswerChange={handleVoiceAnswerChange}
          onBeginAnswering={handleBeginAnswering}
          onFinishSpeaking={handleFinishSpeaking}
          onEndAnswer={handleEndAnswer}
        />
      )}
    </div>
  )
}
