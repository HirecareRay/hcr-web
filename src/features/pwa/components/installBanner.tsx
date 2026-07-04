"use client"

import { useEffect, useState } from "react"
import { X } from "lucide-react"
import { usePwaInstallPrompt } from "@/features/pwa/hooks/usePwaInstallPrompt"

const DISMISSED_KEY = "pwa-install-dismissed"

// 앱 내 상시 노출 설치 유도 배너 — 한 번 닫으면 localStorage에 기록해 다시 안 뜸
export function InstallBanner() {
  const { isIOS, isStandalone, canPrompt, promptInstall } = usePwaInstallPrompt()
  const [dismissed, setDismissed] = useState(true)

  useEffect(() => {
    setDismissed(localStorage.getItem(DISMISSED_KEY) === "1")
  }, [])

  function dismiss() {
    localStorage.setItem(DISMISSED_KEY, "1")
    setDismissed(true)
  }

  if (isStandalone || dismissed || !(canPrompt || isIOS)) return null

  return (
    <div className="bg-warm-bg border-warm-border flex items-center gap-3 border-b px-4 py-2.5">
      <p className="text-ink flex-1 text-sm">
        {canPrompt
          ? "홈 화면에 추가하고 앱처럼 사용해보세요"
          : "하단 공유 버튼(⎋)에서 홈 화면에 추가할 수 있어요"}
      </p>
      {canPrompt && (
        <button
          onClick={promptInstall}
          className="bg-primary shrink-0 rounded-full px-4 py-1.5 text-xs font-bold text-white"
        >
          설치하기
        </button>
      )}
      <button onClick={dismiss} aria-label="닫기" className="text-disabled shrink-0">
        <X className="size-4" />
      </button>
    </div>
  )
}
