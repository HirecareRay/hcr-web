/**
 * useNonverbalCapture.ts
 *
 * 비언어 캡처 "오케스트레이션" 훅입니다. 지표 산출원(produceMetrics)을 외부에서 주입받아
 * 소스에 비의존적입니다 — 2단계(가짜 데이터 관통)에선 더미 제너레이터를, 3단계에선 MediaPipe
 * 기반 산출원을 같은 자리에 끼웁니다. 이 훅이 하는 일:
 *
 *   rAF 루프(detect 주기 제한) → produceMetrics → 답변 구간 & throttle 통과 시 landmark_frame 송신
 *                              → 이벤트 감지(stepEventDetector) → event_snapshot(종류·메타) 송신
 *
 * 송신은 answering(답변 구간)에서만 일어납니다. 그 외에는 라이브 오버레이용으로 지표만 갱신합니다.
 */

"use client"

import { useCallback, useEffect, useMemo, useRef, useState } from "react"
import type { EventSnapshotMessage, LandmarkFrameMessage } from "../types/interviewProtocol"
import { emptyFaceMetrics, type FaceMetrics, type NonverbalEvent } from "../types/nonverbal"
import { metricsToFrame } from "../lib/metricsToFrame"
import { shouldEmit } from "../lib/throttle"
import {
  defaultEventConfig,
  initialDetectorState,
  stepEventDetector,
  type EventDetectorConfig,
  type EventDetectorState,
} from "../lib/nonverbalEvents"

// 한 프레임의 비언어 지표를 만들어내는 산출원. 더미/실(MediaPipe) 모두 이 시그니처를 따릅니다.
export type MetricsProducer = (video: HTMLVideoElement, now: number) => FaceMetrics

interface CaptureConfig {
  detectIntervalMs: number // detect 주기 상한(성능) — rAF 매 프레임이 아니라 이 간격으로
  sendIntervalMs: number // landmark_frame 송신 주기(~1s)
  eventConfig: EventDetectorConfig
}

const defaultCaptureConfig: CaptureConfig = {
  detectIntervalMs: 100,
  sendIntervalMs: 1000,
  eventConfig: defaultEventConfig,
}

interface UseNonverbalCaptureParams {
  videoRef: React.RefObject<HTMLVideoElement | null>
  active: boolean // 캡처 루프 on/off (카메라 준비됐을 때 true)
  answering: boolean // 답변 구간 → 송신 게이팅
  produceMetrics: MetricsProducer
  // 송신 성공 여부를 돌려준다(소켓이 닫혀 있으면 false) — 실제 송신된 프레임만 카운트한다.
  sendLandmark: (frame: LandmarkFrameMessage) => boolean
  sendEventSnapshot: (snapshot: EventSnapshotMessage) => boolean
  config?: Partial<CaptureConfig>
}

export interface NonverbalCaptureView {
  metrics: FaceMetrics // 최신 지표(라이브 오버레이용)
  recentEvents: NonverbalEvent[] // 최근 감지 이벤트(데모 로그용, 최신순)
  sentFrameCount: number // 송신한 landmark_frame 수(검증용)
}

const maxRecentEvents = 8

// 오버레이(지표 표시)용 state 갱신 주기 — detect 주기(100ms)마다 setState 하면 리렌더가
// 잦으므로 표시 갱신만 별도로 throttle 한다. 송신/이벤트 감지는 영향받지 않는다.
const overlayIntervalMs = 200

export function useNonverbalCapture({
  videoRef,
  active,
  answering,
  produceMetrics,
  sendLandmark,
  sendEventSnapshot,
  config,
}: UseNonverbalCaptureParams): NonverbalCaptureView {
  // tick 이 매 렌더 재생성되지 않도록 메모이즈. config 를 인라인으로 넘기는 호출자는
  // 신원(identity) 안정화를 위해 스스로 메모이즈해야 한다(React 표준 관례).
  const cfg = useMemo<CaptureConfig>(() => ({ ...defaultCaptureConfig, ...config }), [config])

  const [metrics, setMetrics] = useState<FaceMetrics>(emptyFaceMetrics)
  const [recentEvents, setRecentEvents] = useState<NonverbalEvent[]>([])
  const [sentFrameCount, setSentFrameCount] = useState(0)

  // 루프 사이에 유지할 가변 상태(리렌더 유발 없이)
  const rafRef = useRef<number | null>(null)
  const lastTickAtRef = useRef<number | null>(null)
  const lastSendAtRef = useRef<number | null>(null)
  const lastOverlayAtRef = useRef<number | null>(null)
  const detectorStateRef = useRef<EventDetectorState>(initialDetectorState)

  // answering 토글 시 송신·이벤트 누적 상태를 리셋(이전 답변 잔상 제거)
  useEffect(() => {
    lastSendAtRef.current = null
    detectorStateRef.current = initialDetectorState
  }, [answering])

  const tick = useCallback(
    (now: number) => {
      const video = videoRef.current
      if (!video) return

      // detect 주기 제한 — 매 rAF 프레임마다 추론하지 않음(GPU 부하 완화)
      if (!shouldEmit(lastTickAtRef.current, now, cfg.detectIntervalMs)) return
      lastTickAtRef.current = now

      const next = produceMetrics(video, now)

      // 오버레이 표시는 detect 주기보다 낮은 빈도로만 갱신(리렌더 절감)
      if (shouldEmit(lastOverlayAtRef.current, now, overlayIntervalMs)) {
        lastOverlayAtRef.current = now
        setMetrics(next)
      }

      if (!answering) return // 답변 구간이 아니면 오버레이만, 송신 없음

      // landmark_frame ~1s throttle 송신 — 소켓이 닫혀 있어 실제 송신에 실패하면
      // 카운트하지 않는다(검증 지표가 실제 전송 수를 반영하도록).
      if (shouldEmit(lastSendAtRef.current, now, cfg.sendIntervalMs)) {
        lastSendAtRef.current = now
        if (sendLandmark(metricsToFrame(next))) setSentFrameCount((c) => c + 1)
      }

      // 이벤트 감지 → event_snapshot(종류·메타만) 송신.
      // 화면 캡처(이미지)는 하지 않는다 — 백엔드가 이벤트 횟수만 집계에 쓰고 이미지는
      // 읽지도 저장하지도 않으므로, 얼굴 사진을 전송하지 않는다(대역폭·프라이버시).
      const stepped = stepEventDetector(detectorStateRef.current, next, now, cfg.eventConfig)
      detectorStateRef.current = stepped.state
      if (stepped.events.length > 0) {
        for (const event of stepped.events) {
          sendEventSnapshot({
            type: "event_snapshot",
            event: event.kind,
            meta: event.meta,
          })
        }
        setRecentEvents((prev) => [...stepped.events, ...prev].slice(0, maxRecentEvents))
      }
    },
    [
      videoRef,
      answering,
      produceMetrics,
      sendLandmark,
      sendEventSnapshot,
      cfg.detectIntervalMs,
      cfg.sendIntervalMs,
      cfg.eventConfig,
    ]
  )

  // rAF 루프 — active 동안만 돕니다.
  useEffect(() => {
    if (!active) return

    const loop = () => {
      tick(performance.now())
      rafRef.current = requestAnimationFrame(loop)
    }
    rafRef.current = requestAnimationFrame(loop)

    return () => {
      if (rafRef.current !== null) cancelAnimationFrame(rafRef.current)
      rafRef.current = null
      lastTickAtRef.current = null
    }
  }, [active, tick])

  return { metrics, recentEvents, sentFrameCount }
}
