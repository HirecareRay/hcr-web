/**
 * wsSkeletonDemo.tsx
 *
 * 실시간 면접 WS 왕복(Phase 1 walking skeleton)을 눈으로 확인하는 데모 위젯입니다.
 * 기존 배치 REST 라이브룸(InterviewRoomPage)과 무관한 독립 화면으로,
 * useInterviewSocket 훅이 FastAPI WS 와 더미 메시지를 주고받는 걸 보여줍니다.
 *
 * 사용: 백엔드(uvicorn) 실행 후 `/interview/{companyId}/ws-demo` 접속 → "연결".
 */

"use client"

import { useState } from "react"
import { useInterviewSocket } from "../hooks/useInterviewSocket"

const STATE_LABEL: Record<string, string> = {
  idle: "대기",
  connecting: "연결 중…",
  open: "연결됨 🟢",
  closed: "끊김 🔴",
}

interface Props {
  companyId: string
}

export function WsSkeletonDemo({ companyId }: Props) {
  // "연결" 누르기 전에는 sessionId 가 null → 훅이 연결하지 않음
  const [sessionId, setSessionId] = useState<string | null>(null)
  const socket = useInterviewSocket(sessionId)
  const connected = socket.state === "open"

  const connect = () => setSessionId(`demo-${companyId}-${Date.now()}`)

  // 더미 오디오 청크(binary) 전송 — 백엔드가 "(오디오 N바이트 수신)" 자막으로 응답
  const sendDummyAudio = () => socket.sendAudio(new Uint8Array(2048).buffer)

  return (
    <div className="mx-auto max-w-xl space-y-4 px-4 py-6">
      <header className="space-y-1">
        <h1 className="text-lg font-semibold">실시간 면접 WS 데모 (Phase 1)</h1>
        <p className="text-sm text-gray-500">
          상태: <span className="font-medium">{STATE_LABEL[socket.state]}</span>
          {sessionId && <span className="ml-2 text-gray-400">({sessionId})</span>}
        </p>
      </header>

      <div className="flex flex-wrap gap-2">
        <button
          type="button"
          onClick={connect}
          disabled={socket.state === "connecting" || connected}
          className="rounded bg-black px-3 py-1.5 text-sm text-white disabled:opacity-40"
        >
          연결
        </button>
        <button
          type="button"
          onClick={socket.answerStart}
          disabled={!connected}
          className="rounded border px-3 py-1.5 text-sm disabled:opacity-40"
        >
          답변 시작
        </button>
        <button
          type="button"
          onClick={socket.answerEnd}
          disabled={!connected}
          className="rounded border px-3 py-1.5 text-sm disabled:opacity-40"
        >
          답변 종료(전사·평가)
        </button>
        <button
          type="button"
          onClick={socket.next}
          disabled={!connected}
          className="rounded border px-3 py-1.5 text-sm disabled:opacity-40"
        >
          다음 질문 / 요약
        </button>
        <button
          type="button"
          onClick={sendDummyAudio}
          disabled={!connected}
          className="rounded border px-3 py-1.5 text-sm disabled:opacity-40"
        >
          오디오 2KB 전송
        </button>
      </div>

      <DemoField label="현재 질문" value={socket.question?.text ?? "—"} />
      <DemoField label="자막(transcript)" value={socket.transcript || "—"} />
      <DemoField label="평가(eval)" value={socket.evaluation || "—"} />

      {socket.summary && (
        <div className="rounded border border-green-300 bg-green-50 p-3 text-sm">
          <p className="font-semibold">최종 요약 · 점수 {socket.summary.overallScore}</p>
          <p className="mt-1">언어: {socket.summary.languageFeedback}</p>
          <p>비언어: {socket.summary.nonverbalFeedback}</p>
          <p className="mt-1 text-gray-600">개선점: {socket.summary.improvements.join(", ")}</p>
        </div>
      )}
    </div>
  )
}

function DemoField({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded border p-3">
      <p className="mb-1 text-xs font-medium text-gray-400">{label}</p>
      <p className="text-sm break-words whitespace-pre-wrap">{value}</p>
    </div>
  )
}
