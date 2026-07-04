"use client"

import { useEffect, useState } from "react"

interface BeforeInstallPromptEvent extends Event {
  prompt: () => Promise<void>
}

// PWA 설치 유도 공통 로직 — /install 랜딩 페이지와 인앱 설치 배너가 공유
export function usePwaInstallPrompt() {
  const [isIOS, setIsIOS] = useState(false)
  const [isStandalone, setIsStandalone] = useState(false)
  const [isInApp, setIsInApp] = useState(false)
  const [deferredPrompt, setDeferredPrompt] = useState<BeforeInstallPromptEvent | null>(null)

  useEffect(() => {
    setIsIOS(/iPad|iPhone|iPod/.test(navigator.userAgent))
    setIsStandalone(window.matchMedia("(display-mode: standalone)").matches)
    // 카카오톡·인스타그램·라인 등 인앱 WebView — beforeinstallprompt 자체가 발생하지 않고
    // iOS도 진짜 Safari가 아니라 공유 버튼으로 홈 화면 추가가 안 됨(플랫폼 제약, 코드로 우회 불가)
    setIsInApp(/KAKAOTALK|Instagram|FBAN|FBAV|Line\//i.test(navigator.userAgent))

    const handler = (e: Event) => {
      e.preventDefault()
      setDeferredPrompt(e as BeforeInstallPromptEvent)
    }
    window.addEventListener("beforeinstallprompt", handler)
    return () => window.removeEventListener("beforeinstallprompt", handler)
  }, [])

  async function promptInstall() {
    if (!deferredPrompt) return
    await deferredPrompt.prompt()
    setDeferredPrompt(null)
  }

  return { isIOS, isStandalone, isInApp, canPrompt: !!deferredPrompt, promptInstall }
}
