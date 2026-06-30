/**
 * useVoiceMetric.ts
 *
 * (음성 모드) 답변 구간 동안 마이크 오디오를 Web Audio(AnalyserNode)로 분석해
 * 발화 물리지표(voice_metric)를 ~1s 주기로 WebSocket 업스트림에 흘려보내는 훅입니다.
 *
 * useAudioStreamer(audio_chunk)·useNonverbalCapture(landmark_frame)와 같은 패턴:
 *   - 같은 WS 연결을 공유(별도 연결 없음) — 송신 함수만 주입받음
 *   - active(=답변 중 & 음성 모드 & 말하는 중)일 때만 분석/송신, 꺼지면 즉시 정지
 *   - 저빈도(~1s) 송신 — landmark_frame 과 동일
 *
 * 정직성: Web Audio 로 실제 뽑은 지표만 채워 보냅니다(decibel·pitch). 결측은 키를 생략해
 * 서버 집계에서 제외되게 합니다. v1 은 speech_rate·tremor 를 보내지 않습니다.
 *
 * 미지원/마이크 없음/권한 거부/오류 시 조용히 no-op 합니다(면접 흐름을 막지 않음).
 */

"use client"

import { useEffect, useRef } from "react"
import type { VoiceMetricMessage } from "../types/interviewProtocol"
import { computeDecibelDbfs, estimatePitchHz, silenceFloorDb } from "../lib/voiceMetrics"

interface UseVoiceMetricParams {
  stream: MediaStream | null
  // WS 송신 함수(소켓이 닫혀 있으면 내부적으로 no-op) — useInterviewSocket.sendVoiceMetric.
  sendVoiceMetric: (metric: VoiceMetricMessage) => boolean
  active: boolean // 답변 구간 & 음성 모드 & 말하는 중일 때만 true
  intervalMs?: number // 송신 주기(기본 1000ms)
}

// 시간영역 표본 수 — autocorrelation pitch 추정에 충분한 길이(2의 거듭제곱).
const fftSize = 2048

// 브라우저 prefix 폴백 포함 AudioContext 생성자 조회.
function getAudioContextCtor(): typeof AudioContext | undefined {
  if (typeof window === "undefined") return undefined
  return (
    window.AudioContext ??
    (window as unknown as { webkitAudioContext?: typeof AudioContext }).webkitAudioContext
  )
}

export function useVoiceMetric({
  stream,
  sendVoiceMetric,
  active,
  intervalMs = 1000,
}: UseVoiceMetricParams): void {
  // 송신 함수는 렌더마다 신원이 바뀔 수 있으므로 ref 로 최신값을 들고 effect 의존성에서 제외한다.
  const sendRef = useRef(sendVoiceMetric)
  useEffect(() => {
    sendRef.current = sendVoiceMetric
  }, [sendVoiceMetric])

  useEffect(() => {
    if (!active || !stream || stream.getAudioTracks().length === 0) return

    const AudioCtor = getAudioContextCtor()
    if (!AudioCtor) return // 미지원 브라우저 — 조용히 비활성

    let audioContext: AudioContext
    let source: MediaStreamAudioSourceNode
    let analyser: AnalyserNode
    try {
      audioContext = new AudioCtor()
      // 오디오 트랙만 뽑아 별도 스트림으로 분석한다(영상 트랙 무관).
      const audioStream = new MediaStream(stream.getAudioTracks())
      source = audioContext.createMediaStreamSource(audioStream)
      analyser = audioContext.createAnalyser()
      analyser.fftSize = fftSize
      source.connect(analyser)
      // 자동재생 정책으로 suspended 상태면 재개 시도(실패해도 면접 흐름은 막지 않음).
      void audioContext.resume().catch(() => {})
    } catch (error) {
      console.error("음성 지표 분석 시작 실패:", error)
      return
    }

    const buffer = new Float32Array(analyser.fftSize)
    const sampleRate = audioContext.sampleRate

    const tick = () => {
      analyser.getFloatTimeDomainData(buffer)
      const decibel = computeDecibelDbfs(buffer)
      const pitch = estimatePitchHz(buffer, sampleRate)

      // 실제 뽑은 지표만 채운다 — 결측은 키를 아예 넣지 않아(조건부 스프레드) 서버 집계에서 제외.
      const metric: VoiceMetricMessage = {
        type: "voice_metric",
        ...(decibel > silenceFloorDb && { decibel: Math.round(decibel * 10) / 10 }),
        ...(pitch !== null && { pitch: Math.round(pitch) }),
      }

      // 완전 무음(아무 지표도 못 뽑음)이면 보내지 않는다.
      if (metric.decibel === undefined && metric.pitch === undefined) return
      sendRef.current(metric)
    }

    const timer = setInterval(tick, intervalMs)

    return () => {
      clearInterval(timer)
      try {
        source.disconnect()
        void audioContext.close().catch(() => {})
      } catch (error) {
        console.error("음성 지표 분석 정리 실패:", error)
      }
    }
  }, [active, stream, intervalMs])
}
