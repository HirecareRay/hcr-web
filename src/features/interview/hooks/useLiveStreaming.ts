/**
 * useLiveStreaming.ts
 *
 * 라이브 면접방의 "실시간 멀티모달" 배선을 한곳에 모은 오케스트레이션 훅입니다.
 * 데모(wsSkeletonDemo·nonverbalDemo)에서 검증한 조각들을 실제 면접 루프에 조립합니다:
 *
 *   useInterviewSocket   : 세션당 WS 연결 1개(질문/자막/평가/요약 수신 + control/landmark/audio 송신)
 *   useFaceLandmarker    : 동의+카메라일 때만 MediaPipe 모델 로드(무거운 초기화 게이트)
 *   useNonverbalCapture  : 답변 구간에만 landmark_frame(~1s)·event_snapshot 송신
 *   useAudioStreamer     : 답변 구간 & 음성 모드에만 audio_chunk 송신
 *
 * 송신 게이팅 원칙:
 *   - 비언어(영상): 동의 + 카메라 트랙 있을 때 캡처, 답변 구간에만 송신. 영상 원본은 전송하지 않음.
 *   - 오디오: 음성 모드 + 답변 구간에만 송신. (카메라/동의와 무관 — 마이크 권한만 필요)
 *   - 답변 모드가 음성↔텍스트 어느 쪽이든 비언어 캡처는 독립적으로 계속됨(태도 평가).
 *
 * 페이지(interviewRoomPage)는 이 훅의 control 트리거를 상태머신 전이에 연결만 하면 됩니다.
 */

"use client"

import { useInterviewSocket } from "./useInterviewSocket"
import { useFaceLandmarker } from "./useFaceLandmarker"
import { useNonverbalCapture } from "./useNonverbalCapture"
import { useAudioStreamer } from "./useAudioStreamer"
import type { InterviewMode, InterviewPhase } from "../types/interviewSession"
import type { FaceMetrics, NonverbalEvent } from "../types/nonverbal"
import type { QuestionEvent, SummaryEvent } from "../types/interviewProtocol"
import type { SocketState } from "./useInterviewSocket"

interface UseLiveStreamingParams {
  sessionId: string | null // WS 연결 키(REST 세션과 동일 ID — 백엔드 상관용)
  phase: InterviewPhase
  mode: InterviewMode
  videoRef: React.RefObject<HTMLVideoElement | null> // VideoStage 가 노출한 분석용 영상 element
  stream: MediaStream | null
  consented: boolean // 카메라 비언어 분석 동의
}

export interface LiveStreamingView {
  // ── WS 다운스트림 뷰 ──
  socketState: SocketState
  question: QuestionEvent | null
  transcript: string
  evaluation: string
  summary: SummaryEvent | null
  // ── 비언어 라이브 상태 ──
  metrics: FaceMetrics
  recentEvents: NonverbalEvent[]
  sentFrameCount: number
  faceLoading: boolean
  faceError: string | null
  // ── control 트리거(상태머신 전이에 연결) ──
  answerStart: () => void
  answerEnd: () => void
  next: () => void
  sendTextAnswer: (text: string) => boolean // 텍스트 모드 답변 송신
}

export function useLiveStreaming({
  sessionId,
  phase,
  mode,
  videoRef,
  stream,
  consented,
}: UseLiveStreamingParams): LiveStreamingView {
  const socket = useInterviewSocket(sessionId)

  const hasVideoTrack = !!stream && stream.getVideoTracks().length > 0
  const answering = phase === "answering"

  // 동의 + 카메라가 있을 때만 무거운 모델을 로드합니다.
  const faceEnabled = consented && hasVideoTrack
  const { loading: faceLoading, error: faceError, produceMetrics } = useFaceLandmarker(faceEnabled)

  // 비언어 캡처 — 답변 구간에만 송신, 그 외에는 오버레이용 지표만 갱신.
  const capture = useNonverbalCapture({
    videoRef,
    active: faceEnabled,
    answering,
    produceMetrics,
    sendLandmark: socket.sendLandmark,
    sendEventSnapshot: socket.sendEventSnapshot,
  })

  // 오디오 스트리밍 — 음성 모드 & 답변 구간에만.
  useAudioStreamer({
    stream,
    sendAudio: socket.sendAudio,
    active: answering && mode === "voice",
  })

  // socket.answerStart/answerEnd/next 는 useInterviewSocket 내부에서 이미 useCallback 으로
  // 안정화돼 있으므로(매 렌더 동일 신원), 추가 래핑 없이 그대로 노출합니다. 이렇게 하면
  // 상위(interviewRoomPage)의 핸들러 메모이제이션이 transcript/eval 수신마다 깨지지 않습니다.
  return {
    socketState: socket.state,
    question: socket.question,
    transcript: socket.transcript,
    evaluation: socket.evaluation,
    summary: socket.summary,
    metrics: capture.metrics,
    recentEvents: capture.recentEvents,
    sentFrameCount: capture.sentFrameCount,
    faceLoading,
    faceError,
    answerStart: socket.answerStart,
    answerEnd: socket.answerEnd,
    next: socket.next,
    sendTextAnswer: socket.sendTextAnswer,
  }
}
