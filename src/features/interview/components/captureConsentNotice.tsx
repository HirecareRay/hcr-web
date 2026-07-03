/**
 * captureConsentNotice.tsx
 *
 * 비언어 분석용 카메라 사용에 대한 프라이버시 고지/동의 카드입니다.
 * 답변 중 얼굴을 분석하되, 분석 서버로는 계산된 숫자 지표와 이벤트 기록만 보냅니다 —
 * 화면 캡처(사진)·원본 영상은 전송하지 않는다는 점을 고지하고 명시적 동의를 받습니다.
 *
 * 데모 화면과 실제 면접방에서 공용으로 씁니다 — 동의 전에는 카메라를 켜지 못하게 게이트하세요.
 */

"use client"

import { ShieldCheck } from "lucide-react"

interface Props {
  agreed: boolean
  onAgreedChange: (agreed: boolean) => void
}

export function CaptureConsentNotice({ agreed, onAgreedChange }: Props) {
  return (
    <div className="border-warm-border rounded-2xl border bg-white p-6 shadow-sm">
      <div className="flex items-start gap-3">
        <div className="bg-primary inline-flex h-10 w-10 shrink-0 items-center justify-center rounded-xl shadow-sm">
          <ShieldCheck className="h-5 w-5 text-white" aria-hidden />
        </div>
        <div className="space-y-1">
          <h2 className="text-ink text-base font-bold">카메라 분석 및 프라이버시 안내</h2>
          <p className="text-muted text-sm">
            면접 답변 중 비언어(시선·표정·자세)를 분석합니다. 아래 내용을 확인하고 동의해 주세요.
          </p>
        </div>
      </div>

      <ul className="text-muted mt-4 space-y-2 text-sm">
        <li className="flex gap-2">
          <span className="text-primary mt-px font-bold">·</span>
          <span>답변하는 동안에만 카메라로 얼굴 지표(시선·고개 각도·표정)를 계산합니다.</span>
        </li>
        <li className="flex gap-2">
          <span className="text-primary mt-px font-bold">·</span>
          <span>
            <span className="text-ink font-semibold">영상 원본은 전송하지 않습니다.</span> 계산된
            숫자 지표만 분석 서버로 전달됩니다.
          </span>
        </li>
        <li className="flex gap-2">
          <span className="text-primary mt-px font-bold">·</span>
          <span>
            시선 이탈·무표정이 일정 시간 지속되면 그 사실을{" "}
            <span className="text-ink font-semibold">이벤트로 기록</span>해 피드백에 반영합니다 —
            이때도 화면을 캡처하거나 사진을 저장·전송하지 않습니다.
          </span>
        </li>
      </ul>

      <label className="border-warm-border bg-warm-bg mt-4 flex cursor-pointer items-start gap-3 rounded-xl border px-3.5 py-3">
        <input
          type="checkbox"
          checked={agreed}
          onChange={(e) => onAgreedChange(e.target.checked)}
          className="accent-primary mt-0.5 h-4 w-4 shrink-0"
        />
        <span className="text-ink text-sm">
          위 내용을 확인했으며, 카메라 사용과 비언어 지표 전송에 동의합니다.
        </span>
      </label>
    </div>
  )
}
