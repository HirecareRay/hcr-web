/**
 * useFaceLandmarker.ts
 *
 * MediaPipe FaceLandmarker 로더 훅(3단계). 무거운 WASM/모델 초기화를 client-only 로 격리합니다.
 *
 * 모드 선택: 우리 캡처 루프(useNonverbalCapture)는 "한 프레임 → FaceMetrics 동기 반환"인 pull 구조라,
 *   push(콜백) 기반의 LIVE_STREAM 대신 **동기 detectForVideo 를 쓰는 VIDEO 모드**가 깔끔히 맞습니다.
 *   추출 지표·백엔드 송신 계약(landmark_frame)은 모드와 무관하게 동일합니다. (필요 시 LIVE_STREAM 으로
 *   바꿔도 produceMetrics 시그니처는 그대로 둘 수 있게 설계)
 *
 * WASM/모델은 번들에 넣지 않고 CDN(jsdelivr) 에서 로드합니다 — 패키지와 동일 버전으로 고정.
 * 배포 시 오프라인/CDN 의존이 문제되면 NEXT_PUBLIC_MEDIAPIPE_* 로 public/ 경로로 갈아끼우면 됩니다.
 */

"use client"

import { useCallback, useEffect, useRef, useState } from "react"
import { computeFaceMetrics, type FaceFrame } from "../lib/gazeMetrics"
import { emptyFaceMetrics, type FaceMetrics } from "../types/nonverbal"
import type { MetricsProducer } from "./useNonverbalCapture"

// 패키지(@mediapipe/tasks-vision)와 동일 버전의 CDN 에셋을 사용합니다.
const VISION_VERSION = "0.10.35"
const WASM_BASE =
  process.env.NEXT_PUBLIC_MEDIAPIPE_WASM_URL ??
  `https://cdn.jsdelivr.net/npm/@mediapipe/tasks-vision@${VISION_VERSION}/wasm`
const MODEL_URL =
  process.env.NEXT_PUBLIC_MEDIAPIPE_MODEL_URL ??
  "https://storage.googleapis.com/mediapipe-models/face_landmarker/face_landmarker/float16/1/face_landmarker.task"

// MediaPipe 인스턴스 타입을 패키지에서 직접 import 하면 SSR 번들에 새므로 최소 형태만 선언합니다.
interface FaceLandmarkerLike {
  detectForVideo: (video: HTMLVideoElement, timestampMs: number) => FaceLandmarkerResult
  close: () => void
}
interface FaceLandmarkerResult {
  faceLandmarks?: { x: number; y: number; z: number }[][]
  faceBlendshapes?: { categories: { categoryName: string; score: number }[] }[]
  facialTransformationMatrixes?: { data: number[] }[]
}

export interface UseFaceLandmarkerResult {
  ready: boolean
  loading: boolean
  error: string | null
  produceMetrics: MetricsProducer
}

// detectForVideo 결과 → 우리 FaceFrame 으로 정규화(첫 번째 얼굴만 사용)
function toFaceFrame(result: FaceLandmarkerResult): FaceFrame {
  return {
    landmarks: result.faceLandmarks?.[0] ?? null,
    blendshapes: result.faceBlendshapes?.[0]?.categories ?? null,
    transformMatrix: result.facialTransformationMatrixes?.[0]?.data ?? null,
  }
}

// enabled=false 면 무거운 모델 로드를 건너뜁니다(예: 더미 모드일 때).
export function useFaceLandmarker(enabled = true): UseFaceLandmarkerResult {
  const [ready, setReady] = useState(false)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const landmarkerRef = useRef<FaceLandmarkerLike | null>(null)
  const lastVideoTimeRef = useRef<number>(-1)
  const lastTsRef = useRef<number>(0)
  const lastMetricsRef = useRef<FaceMetrics>(emptyFaceMetrics)

  useEffect(() => {
    if (!enabled) return
    if (typeof window === "undefined") return // SSR 가드
    let cancelled = false
    setLoading(true)
    setError(null)

    const init = async () => {
      try {
        const vision = await import("@mediapipe/tasks-vision")
        const fileset = await vision.FilesetResolver.forVisionTasks(WASM_BASE)
        const landmarker = await vision.FaceLandmarker.createFromOptions(fileset, {
          baseOptions: { modelAssetPath: MODEL_URL, delegate: "GPU" },
          runningMode: "VIDEO",
          numFaces: 1,
          outputFaceBlendshapes: true,
          outputFacialTransformationMatrixes: true,
        })
        if (cancelled) {
          landmarker.close()
          return
        }
        landmarkerRef.current = landmarker as unknown as FaceLandmarkerLike
        setReady(true)
      } catch (err) {
        console.error("FaceLandmarker 초기화 실패:", err)
        if (!cancelled) setError("얼굴 분석 모델 로드에 실패했습니다. 네트워크를 확인하세요")
      } finally {
        if (!cancelled) setLoading(false)
      }
    }
    init()

    return () => {
      cancelled = true
      landmarkerRef.current?.close()
      landmarkerRef.current = null
      setReady(false)
    }
  }, [enabled])

  // 같은 영상 프레임이면 재추론하지 않고 직전 지표를 재사용합니다.
  const produceMetrics = useCallback<MetricsProducer>((video, now) => {
    const landmarker = landmarkerRef.current
    // 영상이 준비되고 실제 크기가 잡혔을 때만(0x0 프레임은 detectForVideo 가 거부)
    if (!landmarker || video.readyState < 2 || !video.videoWidth || !video.videoHeight) {
      return lastMetricsRef.current
    }

    if (video.currentTime === lastVideoTimeRef.current) return lastMetricsRef.current
    lastVideoTimeRef.current = video.currentTime

    // detectForVideo(VIDEO 모드)는 타임스탬프가 "엄격히 증가"해야 함 — 보장.
    const ts = now > lastTsRef.current ? now : lastTsRef.current + 1
    lastTsRef.current = ts

    try {
      const result = landmarker.detectForVideo(video, ts)
      const metrics = computeFaceMetrics(toFaceFrame(result))
      lastMetricsRef.current = metrics
      return metrics
    } catch (err) {
      console.error("얼굴 추론 실패:", err)
      return lastMetricsRef.current
    }
  }, [])

  return { ready, loading, error, produceMetrics }
}
