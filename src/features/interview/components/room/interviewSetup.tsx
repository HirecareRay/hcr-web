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
import { Camera, Mic, ScanFace, Type } from "lucide-react"
import { cn } from "@/lib/utils"
import { PageTopBar } from "@/components/ui/pageTopBar"
import { deriveQuestionCount, durationLabel, durationOptionsSec } from "../../lib/sessionPlan"
import type { InterviewMode } from "../../types/interviewSession"
import type { MediaPermission, RequestOptions } from "../../hooks/useMediaStream"
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
  onRequestDevices: (options: RequestOptions) => void
  onStart: (payload: StartPayload) => void
}

const optionButton = (selected: boolean) =>
  cn(
    "inline-flex flex-1 items-center justify-center gap-1 rounded-xl border px-3 py-2.5 text-sm font-semibold transition-colors",
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
  // 텍스트 모드에서 표정·태도(비언어) 분석을 받을지 여부(선택). 음성 모드는 항상 켜진다.
  const [textNonverbalOn, setTextNonverbalOn] = useState(true)

  const questionCount = deriveQuestionCount(totalDurationSec)

  // 실제로 필요한 장치만 켠다 — 카메라는 표정 분석용, 마이크는 음성 답변(STT)용.
  //   음성 모드: 실제 면접처럼 화상(표정 분석)을 항상 함께 진행한다.
  //   텍스트 모드: 타이핑 중 얼굴 유지가 어려울 수 있어 표정 분석을 선택으로 둔다.
  // 텍스트 모드는 마이크를 절대 열지 않아, 말이 인식돼 답변에 섞이는 일이 없다.
  const cameraFor = (m: InterviewMode) => m === "voice" || textNonverbalOn
  const needsCamera = cameraFor(mode)
  const needsMic = mode === "voice"
  const needsDevices = needsCamera || needsMic

  // 카메라를 쓸 때만 동의가 필요하고, 장치가 필요하면 권한이 있어야 시작할 수 있다.
  const consentOk = !needsCamera || cameraConsented
  const devicesOk = !needsDevices || permission === "granted"
  const canStart = !isStarting && consentOk && devicesOk

  const requestWith = (nextMode: InterviewMode, nextTextNonverbal: boolean) =>
    onRequestDevices({
      video: nextMode === "voice" || nextTextNonverbal,
      audio: nextMode === "voice",
    })

  // 모드/표정 토글이 바뀌면 필요한 장치 구성이 달라진다. 이미 장치를 켠 상태라면
  // 새 제약으로 다시 요청해, 안 쓰는 트랙(예: 텍스트 전환 후 마이크)이 남지 않게 한다.
  const handleModeChange = (nextMode: InterviewMode) => {
    setMode(nextMode)
    if (permission === "granted") requestWith(nextMode, textNonverbalOn)
  }

  const handleTextNonverbalChange = (next: boolean) => {
    setTextNonverbalOn(next)
    // 끄면 동의도 함께 해제해, 남은 영상 트랙으로 캡처가 계속되지 않게 한다.
    if (!next) onCameraConsentChange(false)
    if (permission === "granted") requestWith(mode, next)
  }

  const handleStart = () => {
    onStart({ mode, totalDurationSec, jobTitle: jobTitle.trim() || "일반 직무" })
  }

  return (
    <>
      {/* 시작 전 화면에서만 이탈 허용 — 진입했던 곳(진입 화면·기업 리포트)으로 복귀 */}
      <PageTopBar title="AI 모의 면접" />
      <div className="space-y-4 px-4 py-4">
        <header>
          <h2 className="text-ink text-xl font-bold">AI 모의 면접 준비</h2>
          <p className="text-muted mt-0.5 text-sm">설정을 고르고 면접을 시작하세요.</p>
        </header>

        {/* 지원 직무 */}
        <div className="space-y-1">
          <label className="text-ink text-sm font-semibold">지원 직무</label>
          <input
            value={jobTitle}
            onChange={(event) => setJobTitle(event.target.value)}
            placeholder="예: 콘텐츠 마케팅"
            className="border-warm-border text-ink placeholder:text-disabled focus:border-primary w-full rounded-xl border px-3 py-2.5 text-sm outline-none"
          />
        </div>

        {/* 응답 모드 */}
        <div className="space-y-1">
          <span className="text-ink text-sm font-semibold">응답 방식</span>
          <div className="flex gap-2">
            <button
              type="button"
              onClick={() => handleModeChange("voice")}
              className={optionButton(mode === "voice")}
            >
              <Mic className="h-4 w-4" />
              음성
            </button>
            <button
              type="button"
              onClick={() => handleModeChange("text")}
              className={optionButton(mode === "text")}
            >
              <Type className="h-4 w-4" />
              텍스트
            </button>
          </div>
        </div>

        {/* 전체 면접 시간 */}
        <div className="space-y-1">
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

        {/* 화상·표정 분석 — 음성 모드는 항상 켬, 텍스트 모드는 선택. */}
        <div className="space-y-2">
          <span className="text-ink text-sm font-semibold">화상·표정 분석</span>

          {mode === "voice" ? (
            // 음성 모드 — 실제 면접처럼 화상(표정 분석)을 항상 함께 진행한다.
            <div className="border-warm-border flex items-center gap-3 rounded-xl border px-3.5 py-2.5">
              <span className="bg-coral-light text-primary inline-flex h-9 w-9 shrink-0 items-center justify-center rounded-xl">
                <ScanFace className="h-5 w-5" />
              </span>
              <span className="min-w-0 flex-1">
                <span className="text-ink block text-sm font-semibold">화상 면접으로 진행돼요</span>
                <span className="text-muted mt-0.5 block text-xs">
                  카메라로 표정·시선·자세까지 함께 분석해요.
                </span>
              </span>
            </div>
          ) : (
            // 텍스트 모드 — 타이핑 중 얼굴 유지가 어려울 수 있어 선택으로 둔다.
            <label className="border-warm-border flex cursor-pointer items-center gap-3 rounded-xl border px-3.5 py-2.5">
              <span className="bg-coral-light text-primary inline-flex h-9 w-9 shrink-0 items-center justify-center rounded-xl">
                <ScanFace className="h-5 w-5" />
              </span>
              <span className="min-w-0 flex-1">
                <span className="text-ink block text-sm font-semibold">
                  표정·태도 분석 받기 <span className="text-muted font-normal">(선택)</span>
                </span>
                <span className="text-muted mt-0.5 block text-xs">
                  비언어 태도까지 분석해 피드백에 반영해요.
                </span>
              </span>
              <Toggle checked={textNonverbalOn} onChange={handleTextNonverbalChange} />
            </label>
          )}

          {/* 음성 모드는 답변 전사를 위해 마이크가 필요하다는 안내. */}
          {needsMic && (
            <p className="text-muted flex items-center gap-1.5 text-xs">
              <Mic className="h-3.5 w-3.5" />
              답변 전사를 위해 마이크도 함께 사용해요.
            </p>
          )}
          {/* 텍스트 + 표정 분석 끔 = 어떤 장치도 켜지 않는 순수 텍스트 면접. */}
          {!needsDevices && (
            <p className="text-muted flex items-center gap-1.5 text-xs">
              <Type className="h-3.5 w-3.5" />
              카메라·마이크 없이 텍스트로만 진행해요.
            </p>
          )}

          {/* 카메라를 쓸 때만 미리보기 + 프라이버시 동의를 노출한다. */}
          {needsCamera && (
            <>
              <VideoStage stream={stream} />
              <CaptureConsentNotice
                agreed={cameraConsented}
                onAgreedChange={onCameraConsentChange}
              />
            </>
          )}

          {/* 장치가 필요하고 아직 권한이 없을 때만 켜기 버튼 노출. 카메라를 쓰면 동의 전 비활성. */}
          {needsDevices && permission !== "granted" && (
            <button
              type="button"
              onClick={() => requestWith(mode, textNonverbalOn)}
              disabled={permission === "requesting" || (needsCamera && !cameraConsented)}
              title={
                needsCamera && !cameraConsented ? "먼저 카메라 분석에 동의해 주세요" : undefined
              }
              className="border-warm-border text-ink inline-flex w-full items-center justify-center gap-1.5 rounded-xl border px-4 py-2.5 text-sm font-semibold disabled:opacity-50"
            >
              {needsCamera ? <Camera className="h-4 w-4" /> : <Mic className="h-4 w-4" />}
              {permission === "requesting"
                ? "권한 요청 중…"
                : needsCamera && !cameraConsented
                  ? "동의 후 켤 수 있어요"
                  : deviceButtonLabel(needsCamera, needsMic)}
            </button>
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
    </>
  )
}

function deviceButtonLabel(camera: boolean, mic: boolean): string {
  if (camera && mic) return "카메라·마이크 켜기"
  if (camera) return "카메라 켜기"
  return "마이크 켜기"
}

// 작은 on/off 스위치 — 표정·태도 분석 토글용.
function Toggle({ checked, onChange }: { checked: boolean; onChange: (next: boolean) => void }) {
  return (
    <button
      type="button"
      role="switch"
      aria-checked={checked}
      onClick={() => onChange(!checked)}
      className={cn(
        "relative mt-0.5 inline-flex h-6 w-11 shrink-0 items-center rounded-full transition-colors",
        checked ? "bg-primary" : "bg-warm-border"
      )}
    >
      <span
        className={cn(
          "inline-block h-5 w-5 transform rounded-full bg-white shadow transition-transform",
          checked ? "translate-x-5" : "translate-x-0.5"
        )}
      />
    </button>
  )
}
