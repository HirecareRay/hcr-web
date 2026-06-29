/**
 * nonverbalDemo.tsx
 *
 * Phase 4(비언어 분석) 검증 화면입니다. 웹캠 → 지표 산출(더미 또는 MediaPipe) →
 * 답변 구간 동안 landmark_frame(~1s)·event_snapshot 송신을 눈으로 확인합니다.
 *
 *   - "더미" 모드: MediaPipe 없이 사인파 지표로 송신 파이프(게이팅·throttle·이벤트)를 관통(2단계).
 *   - "MediaPipe" 모드: 실제 얼굴 추론으로 지표를 계산해 송신(3단계).
 *
 * 사용: 백엔드(uvicorn) 실행 → `/interview/{companyId}/nonverbal-demo` → 연결 → 카메라 → 답변 시작.
 * SSR 회피를 위해 라우트에서 dynamic(ssr:false) 로 로드합니다.
 */

"use client"

import { useCallback, useEffect, useRef, useState } from "react"
import { useInterviewSocket } from "../hooks/useInterviewSocket"
import { useMediaStream } from "../hooks/useMediaStream"
import { useFaceLandmarker } from "../hooks/useFaceLandmarker"
import { useNonverbalCapture, type MetricsProducer } from "../hooks/useNonverbalCapture"
import { createDummyMetricsProducer } from "../lib/dummyMetrics"
import { CaptureConsentNotice } from "./captureConsentNotice"

const STATE_LABEL: Record<string, string> = {
  idle: "대기",
  connecting: "연결 중…",
  open: "연결됨 🟢",
  closed: "끊김 🔴",
}

type Mode = "dummy" | "mediapipe"

interface Props {
  companyId: string
}

export function NonverbalDemo({ companyId }: Props) {
  const [sessionId, setSessionId] = useState<string | null>(null)
  const [mode, setMode] = useState<Mode>("dummy")
  const [answering, setAnswering] = useState(false)
  const [consented, setConsented] = useState(false) // 카메라·스냅샷 전송 동의

  const socket = useInterviewSocket(sessionId)
  const connected = socket.state === "open"

  const { stream, permission, error: mediaError, request } = useMediaStream()
  const videoRef = useRef<HTMLVideoElement | null>(null)
  const cameraReady = permission === "granted" && !!stream

  // MediaPipe 모델은 해당 모드일 때만 로드(enabled 게이트)
  const {
    ready: faceReady,
    loading: faceLoading,
    error: faceError,
    produceMetrics: faceProduceMetrics,
  } = useFaceLandmarker(mode === "mediapipe")

  // 더미 산출원은 한 번만 생성(클라이언트에서 lazy init)
  const dummyRef = useRef<MetricsProducer | null>(null)
  if (!dummyRef.current) dummyRef.current = createDummyMetricsProducer()

  const produceMetrics = useCallback<MetricsProducer>(
    (video, now) =>
      mode === "mediapipe" ? faceProduceMetrics(video, now) : dummyRef.current!(video, now),
    [mode, faceProduceMetrics]
  )

  const capture = useNonverbalCapture({
    videoRef,
    active: cameraReady,
    answering,
    produceMetrics,
    sendLandmark: socket.sendLandmark,
    sendEventSnapshot: socket.sendEventSnapshot,
  })

  // 스트림을 <video> 에 연결
  useEffect(() => {
    const video = videoRef.current
    if (video && stream) {
      video.srcObject = stream
      video.play().catch(() => {
        // 브라우저 autoplay 정책으로 차단될 수 있음 — 사용자 제스처 없이 재생 시도 시 정상
      })
    }
  }, [stream])

  const connect = () => setSessionId(`nv-${companyId}-${Date.now()}`)
  const enableCamera = () => request({ video: true, audio: false })

  const startAnswer = () => {
    setAnswering(true)
    socket.answerStart()
  }
  const endAnswer = () => {
    setAnswering(false)
    socket.answerEnd()
  }

  const fmt = (n: number | null, digits = 2) => (n === null ? "—" : n.toFixed(digits))

  return (
    <div className="mx-auto max-w-xl space-y-4 px-4 py-6">
      <header className="space-y-1">
        <h1 className="text-lg font-semibold">비언어 분석 데모 (Phase 4)</h1>
        <p className="text-sm text-gray-500">
          WS: <span className="font-medium">{STATE_LABEL[socket.state]}</span>
          {sessionId && <span className="ml-2 text-gray-400">({sessionId})</span>}
        </p>
      </header>

      {/* 카메라·스냅샷 전송 동의 (동의 전엔 카메라를 켤 수 없음) */}
      <CaptureConsentNotice agreed={consented} onAgreedChange={setConsented} />

      {/* 모드 토글 */}
      <div className="flex gap-2 text-sm">
        {(["dummy", "mediapipe"] as const).map((m) => (
          <button
            key={m}
            type="button"
            onClick={() => setMode(m)}
            className={
              "rounded border px-3 py-1.5 " +
              (mode === m ? "border-black bg-black text-white" : "border-gray-300")
            }
          >
            {m === "dummy" ? "더미" : "MediaPipe"}
          </button>
        ))}
        {mode === "mediapipe" && (
          <span className="self-center text-xs text-gray-500">
            {faceLoading
              ? "모델 로딩…"
              : faceReady
                ? "모델 준비됨 ✅"
                : faceError
                  ? "로드 실패"
                  : "—"}
          </span>
        )}
      </div>
      {mode === "mediapipe" && faceError && <p className="text-xs text-red-500">{faceError}</p>}

      {/* 컨트롤 */}
      <div className="flex flex-wrap gap-2 text-sm">
        <button
          type="button"
          onClick={connect}
          disabled={socket.state === "connecting" || connected}
          className="rounded bg-black px-3 py-1.5 text-white disabled:opacity-40"
        >
          연결
        </button>
        <button
          type="button"
          onClick={enableCamera}
          disabled={!consented || cameraReady || permission === "requesting"}
          title={!consented ? "먼저 카메라 사용에 동의해 주세요" : undefined}
          className="rounded border px-3 py-1.5 disabled:opacity-40"
        >
          카메라 켜기
        </button>
        <button
          type="button"
          onClick={startAnswer}
          disabled={!connected || answering}
          className="rounded border px-3 py-1.5 disabled:opacity-40"
        >
          답변 시작
        </button>
        <button
          type="button"
          onClick={endAnswer}
          disabled={!connected || !answering}
          className="rounded border px-3 py-1.5 disabled:opacity-40"
        >
          답변 종료
        </button>
        <button
          type="button"
          onClick={socket.next}
          disabled={!connected}
          className="rounded border px-3 py-1.5 disabled:opacity-40"
        >
          다음 / 요약
        </button>
      </div>
      {mediaError && <p className="text-xs text-red-500">{mediaError}</p>}

      {/* 카메라 미리보기 — 표시만 거울처럼 좌우반전(-scale-x-100). MediaPipe 는 CSS 변환과
          무관하게 원본 픽셀을 읽으므로, gaze 부호가 화면 직관과 반대로 보일 수 있다(지표는 원본 좌표계). */}
      <video ref={videoRef} muted playsInline className="w-full -scale-x-100 rounded bg-black/80" />

      {/* 실시간 지표 */}
      <div className="grid grid-cols-2 gap-2 text-sm">
        <Metric
          label="gaze_x"
          hint="시선 좌우"
          value={fmt(capture.metrics.gazeX)}
          warn={isAway(capture.metrics.gazeX)}
        />
        <Metric
          label="gaze_y"
          hint="시선 위아래"
          value={fmt(capture.metrics.gazeY)}
          warn={isAway(capture.metrics.gazeY)}
        />
        <Metric label="head_yaw" hint="고개 좌우(도리)" value={fmt(capture.metrics.headYaw, 1)} />
        <Metric
          label="head_pitch"
          hint="고개 위아래(끄덕)"
          value={fmt(capture.metrics.headPitch, 1)}
        />
        <Metric label="head_roll" hint="고개 갸웃" value={fmt(capture.metrics.headRoll, 1)} />
        <Metric label="expression" hint="표정" value={capture.metrics.expression ?? "—"} />
      </div>
      <p className="text-xs text-gray-500">
        답변 중: <span className="font-medium">{answering ? "예 (송신 중)" : "아니오"}</span> ·
        송신한 landmark_frame: <span className="font-medium">{capture.sentFrameCount}</span>
      </p>

      {/* 최근 이벤트 */}
      <div className="rounded border p-3">
        <p className="mb-1 text-xs font-medium text-gray-400">최근 이벤트 (event_snapshot 송신)</p>
        {capture.recentEvents.length === 0 ? (
          <p className="text-sm text-gray-400">—</p>
        ) : (
          <ul className="space-y-1 text-sm">
            {capture.recentEvents.map((e, i) => (
              <li key={`${e.kind}-${i}`} className="break-words">
                <span className="font-medium">{e.kind}</span>{" "}
                <span className="text-gray-500">{JSON.stringify(e.meta)}</span>
              </li>
            ))}
          </ul>
        )}
      </div>

      {/* 최종 요약(비언어) */}
      {socket.summary && (
        <div className="rounded border border-green-300 bg-green-50 p-3 text-sm">
          <p className="font-semibold">최종 요약 · 점수 {socket.summary.overallScore}</p>
          <p className="mt-1">비언어: {socket.summary.nonverbalFeedback}</p>
        </div>
      )}
    </div>
  )
}

function isAway(value: number | null): boolean {
  return value !== null && Math.abs(value) > 0.3
}

function Metric({
  label,
  hint,
  value,
  warn,
}: {
  label: string
  hint: string
  value: string
  warn?: boolean
}) {
  return (
    <div className={"rounded border p-2 " + (warn ? "border-red-300 bg-red-50" : "")}>
      <p className="text-xs text-gray-400">
        {label} <span className="text-gray-500">· {hint}</span>
      </p>
      <p className="font-mono text-sm">{value}</p>
    </div>
  )
}
