/**
 * interviewSetup.tsx
 *
 * 면접 시작 전 준비 화면입니다.
 *   - 지원 직무 입력
 *   - 응답 모드 선택(텍스트/음성)
 *   - 전체 면접 시간 선택(10/15/20분) → 예상 질문 수 자동 표시
 *   - 카메라·마이크 권한 요청 + 미리보기
 *   - "면접 시작"
 *
 * 장치/세션 로직은 부모(InterviewRoomPage)가 핸들러로 내려줍니다.
 */

"use client"

import { useState } from "react"
import { Camera, Mic, Type } from "lucide-react"
import { cn } from "@/lib/utils"
import { deriveQuestionCount, durationLabel, durationOptionsSec } from "../../lib/sessionPlan"
import type { InterviewMode } from "../../types/interviewSession"
import type { MediaPermission } from "../../hooks/useMediaStream"
import { VideoStage } from "./videoStage"
import { CaptureConsentNotice } from "../captureConsentNotice"

interface StartPayload {
  mode: InterviewMode
  totalDurationSec: number
  jobTitle: string
}

interface Props {
  stream: MediaStream | null
  permission: MediaPermission
  deviceError: string | null
  isStarting: boolean
  startError: boolean
  cameraConsented: boolean
  onCameraConsentChange: (consented: boolean) => void
  onRequestDevices: () => void
  onStart: (payload: StartPayload) => void
}

const optionButton = (selected: boolean) =>
  cn(
    "flex-1 rounded-xl border px-3 py-2.5 text-sm font-semibold transition-colors",
    selected ? "border-primary bg-coral-light text-primary" : "border-warm-border text-muted"
  )

export function InterviewSetup({
  stream,
  permission,
  deviceError,
  isStarting,
  startError,
  cameraConsented,
  onCameraConsentChange,
  onRequestDevices,
  onStart,
}: Props) {
  const [jobTitle, setJobTitle] = useState("")
  const [mode, setMode] = useState<InterviewMode>("voice")
  const [totalDurationSec, setTotalDurationSec] = useState<number>(durationOptionsSec[1])

  const questionCount = deriveQuestionCount(totalDurationSec)
  // 카메라 권한이 있으면 가장 좋지만, 텍스트 모드는 장치 없이도 시작 가능하게 둡니다.
  const canStart = !isStarting && (permission === "granted" || mode === "text")

  const handleStart = () => {
    onStart({ mode, totalDurationSec, jobTitle: jobTitle.trim() || "일반 직무" })
  }

  return (
    <div className="space-y-5 px-4 py-5">
      <header>
        <h1 className="text-ink text-xl font-bold">AI 모의 면접 준비</h1>
        <p className="text-muted mt-1 text-sm">설정을 고르고 면접을 시작하세요.</p>
      </header>

      {/* 지원 직무 */}
      <div className="space-y-1.5">
        <label className="text-ink text-sm font-semibold">지원 직무</label>
        <input
          value={jobTitle}
          onChange={(event) => setJobTitle(event.target.value)}
          placeholder="예: 콘텐츠 마케팅"
          className="border-warm-border text-ink placeholder:text-disabled focus:border-primary w-full rounded-xl border px-3 py-2.5 text-sm outline-none"
        />
      </div>

      {/* 응답 모드 */}
      <div className="space-y-1.5">
        <span className="text-ink text-sm font-semibold">응답 방식</span>
        <div className="flex gap-2">
          <button
            type="button"
            onClick={() => setMode("voice")}
            className={optionButton(mode === "voice")}
          >
            <Mic className="mr-1 inline h-4 w-4" />
            음성
          </button>
          <button
            type="button"
            onClick={() => setMode("text")}
            className={optionButton(mode === "text")}
          >
            <Type className="mr-1 inline h-4 w-4" />
            텍스트
          </button>
        </div>
      </div>

      {/* 전체 면접 시간 */}
      <div className="space-y-1.5">
        <span className="text-ink text-sm font-semibold">면접 시간</span>
        <div className="flex gap-2">
          {durationOptionsSec.map((sec) => (
            <button
              key={sec}
              type="button"
              onClick={() => setTotalDurationSec(sec)}
              className={optionButton(totalDurationSec === sec)}
            >
              {durationLabel(sec)}
            </button>
          ))}
        </div>
        <p className="text-disabled text-xs">
          예상 질문 {questionCount}개 · 전체 시간이 끝나면 면접이 종료됩니다
        </p>
      </div>

      {/* 카메라·마이크 */}
      <div className="space-y-2">
        <span className="text-ink text-sm font-semibold">카메라 · 마이크</span>
        <VideoStage stream={stream} />
        {permission !== "granted" && (
          <>
            {/* 동의 전에는 카메라를 켤 수 없게 게이트합니다(프라이버시). */}
            <CaptureConsentNotice agreed={cameraConsented} onAgreedChange={onCameraConsentChange} />
            <button
              type="button"
              onClick={onRequestDevices}
              disabled={permission === "requesting" || !cameraConsented}
              title={!cameraConsented ? "먼저 카메라 분석에 동의해 주세요" : undefined}
              className="border-warm-border text-ink inline-flex items-center gap-1.5 rounded-xl border px-4 py-2.5 text-sm font-semibold disabled:opacity-50"
            >
              <Camera className="h-4 w-4" />
              {permission === "requesting"
                ? "권한 요청 중…"
                : !cameraConsented
                  ? "동의 후 카메라를 켤 수 있어요"
                  : "카메라·마이크 켜기"}
            </button>
          </>
        )}
        {deviceError && <p className="text-error text-xs">{deviceError}</p>}
      </div>

      {startError && (
        <p className="text-error text-sm">면접을 시작하지 못했습니다. 다시 시도해 주세요.</p>
      )}

      <button
        type="button"
        onClick={handleStart}
        disabled={!canStart}
        className="bg-primary w-full rounded-xl px-4 py-3 text-base font-semibold text-white transition-opacity disabled:opacity-50"
      >
        {isStarting ? "질문 준비 중…" : "면접 시작"}
      </button>
    </div>
  )
}
