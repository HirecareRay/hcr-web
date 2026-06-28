/**
 * useAudioStreamer.ts
 *
 * (음성 모드) 답변 구간 동안 마이크 오디오를 timeslice 단위로 잘라
 * WebSocket 업스트림(audio_chunk, binary)으로 흘려보내는 훅입니다.
 *
 * 답변 구간 동안 마이크 오디오를 잘라 WS 로 흘려보내면, 백엔드가 실시간 전사(STT)·평가에
 * 사용합니다. 영상 트랙이 섞인 스트림에서 오디오 트랙만 분리해 녹음합니다(아래 참고).
 *
 * active(=답변 중 & 음성 모드)일 때만 녹음/송신하고, 꺼지면 즉시 정지합니다.
 * 미지원 브라우저/코덱이면 조용히 no-op 합니다(면접 흐름은 막지 않음).
 */

"use client"

import { useEffect, useRef } from "react"

interface UseAudioStreamerParams {
  stream: MediaStream | null
  // WS 송신 함수(소켓이 닫혀 있으면 내부적으로 no-op) — useInterviewSocket.sendAudio.
  sendAudio: (chunk: ArrayBuffer | Blob) => boolean
  active: boolean // 답변 구간 & 음성 모드일 때만 true
  timesliceMs?: number // 청크 주기(기본 250ms)
}

// webm/opus 를 우선 시도하고, 미지원이면 브라우저 기본값으로 폴백합니다.
function pickMimeType(): string | undefined {
  if (typeof MediaRecorder === "undefined") return undefined
  const preferred = "audio/webm;codecs=opus"
  try {
    if (MediaRecorder.isTypeSupported(preferred)) return preferred
  } catch {
    // isTypeSupported 자체가 없으면 기본값 사용
  }
  return undefined
}

export function useAudioStreamer({
  stream,
  sendAudio,
  active,
  timesliceMs = 250,
}: UseAudioStreamerParams): void {
  // 송신 함수는 렌더마다 신원이 바뀔 수 있으므로 ref 로 최신값을 들고 effect 의존성에서 제외합니다.
  const sendAudioRef = useRef(sendAudio)
  useEffect(() => {
    sendAudioRef.current = sendAudio
  }, [sendAudio])

  const recorderRef = useRef<MediaRecorder | null>(null)

  useEffect(() => {
    // 마이크 트랙이 있는 스트림이 active 일 때만 녹음을 돌립니다.
    if (!active || !stream || stream.getAudioTracks().length === 0) return
    if (typeof MediaRecorder === "undefined") return

    // 영상+음성이 섞인 스트림에 audio 전용 mimeType 으로 녹음하면 start 시 NotSupportedError 가 난다.
    // 오디오 트랙만 뽑아 별도 스트림으로 녹음한다(영상 원본은 어차피 전송 대상이 아님 — landmark_frame 만 전송).
    let recorder: MediaRecorder
    try {
      const audioStream = new MediaStream(stream.getAudioTracks())
      const mimeType = pickMimeType()
      recorder = new MediaRecorder(audioStream, mimeType ? { mimeType } : undefined)
    } catch (error) {
      console.error("오디오 스트리머 시작 실패:", error)
      return
    }

    recorder.ondataavailable = (event) => {
      if (event.data.size > 0) sendAudioRef.current(event.data)
    }
    recorder.onerror = (event) => {
      console.error("오디오 스트리머 오류:", event)
    }

    try {
      recorder.start(timesliceMs)
    } catch (error) {
      console.error("오디오 스트리머 start 실패:", error)
      return
    }
    recorderRef.current = recorder

    return () => {
      try {
        if (recorder.state !== "inactive") recorder.stop()
      } catch (error) {
        console.error("오디오 스트리머 정지 실패:", error)
      }
      recorderRef.current = null
    }
  }, [active, stream, timesliceMs])
}
