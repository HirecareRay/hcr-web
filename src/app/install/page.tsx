"use client"

import { useEffect, useState } from "react"
import Image from "next/image"

// QR로 접속하는 발표용 설치 랜딩 페이지. 로그인 불필요(middleware 가드 대상 아님).
export default function InstallPage() {
  const [isIOS, setIsIOS] = useState(false)
  const [isStandalone, setIsStandalone] = useState(false)
  const [deferredPrompt, setDeferredPrompt] = useState<BeforeInstallPromptEvent | null>(null)

  useEffect(() => {
    setIsIOS(/iPad|iPhone|iPod/.test(navigator.userAgent))
    setIsStandalone(window.matchMedia("(display-mode: standalone)").matches)

    const handler = (e: Event) => {
      e.preventDefault()
      setDeferredPrompt(e as BeforeInstallPromptEvent)
    }
    window.addEventListener("beforeinstallprompt", handler)
    return () => window.removeEventListener("beforeinstallprompt", handler)
  }, [])

  async function handleInstall() {
    if (!deferredPrompt) return
    await deferredPrompt.prompt()
    setDeferredPrompt(null)
  }

  return (
    <main className="bg-background flex min-h-dvh flex-col items-center justify-center gap-6 px-6 text-center">
      <Image src="/logo.svg" alt="HcR" width={72} height={72} priority />
      <div>
        <h1 className="text-ink text-xl font-bold">HcR 앱 설치</h1>
        <p className="text-muted mt-1 text-sm">홈 화면에 추가하고 앱처럼 사용해보세요</p>
      </div>

      {isStandalone && <p className="text-primary text-sm font-bold">이미 설치되어 있습니다</p>}

      {!isStandalone && deferredPrompt && (
        <button
          onClick={handleInstall}
          className="bg-primary rounded-full px-8 py-3 text-sm font-bold text-white"
        >
          설치하기
        </button>
      )}

      {!isStandalone && isIOS && (
        <p className="text-muted max-w-xs text-sm">
          하단 공유 버튼(⎋)을 누른 뒤{" "}
          <span className="text-ink font-bold">&quot;홈 화면에 추가&quot;</span>를 선택해주세요
        </p>
      )}

      {!isStandalone && !isIOS && !deferredPrompt && (
        <p className="text-muted max-w-xs text-sm">
          브라우저 메뉴(⋮)에서 <span className="text-ink font-bold">&quot;앱 설치&quot;</span>를
          선택해주세요
        </p>
      )}
    </main>
  )
}

interface BeforeInstallPromptEvent extends Event {
  prompt: () => Promise<void>
}
