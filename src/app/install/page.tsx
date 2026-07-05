"use client"

import Image from "next/image"
import { usePwaInstallPrompt } from "@/features/pwa/hooks/usePwaInstallPrompt"

// QR로 접속하는 발표용 설치 랜딩 페이지. 로그인 불필요(middleware 가드 대상 아님).
export default function InstallPage() {
  const { isIOS, isStandalone, isInApp, canPrompt, promptInstall } = usePwaInstallPrompt()

  return (
    <main className="bg-background flex min-h-dvh flex-col items-center justify-center gap-6 px-6 text-center">
      <Image src="/logo.svg" alt="HcR" width={115} height={72} priority />
      <div>
        <h1 className="text-ink text-xl font-bold">HcR 앱 설치</h1>
        <p className="text-muted mt-1 text-sm">홈 화면에 추가하고 앱처럼 사용해보세요</p>
      </div>

      {isStandalone && <p className="text-primary text-sm font-bold">이미 설치되어 있습니다</p>}

      {!isStandalone && isInApp && (
        <p className="text-muted max-w-xs text-sm">
          우측 상단 메뉴에서{" "}
          <span className="text-ink font-bold">&quot;다른 브라우저로 열기&quot;</span>를
          선택해주세요
        </p>
      )}

      {!isStandalone && !isInApp && canPrompt && (
        <button
          onClick={promptInstall}
          className="bg-primary rounded-full px-8 py-3 text-sm font-bold text-white"
        >
          설치하기
        </button>
      )}

      {!isStandalone && !isInApp && isIOS && (
        <p className="text-muted max-w-xs text-sm">
          하단 공유 버튼(⎋)을 누른 뒤{" "}
          <span className="text-ink font-bold">&quot;홈 화면에 추가&quot;</span>를 선택해주세요
        </p>
      )}

      {!isStandalone && !isInApp && !isIOS && !canPrompt && (
        <p className="text-muted max-w-xs text-sm">
          브라우저 메뉴(⋮)에서 <span className="text-ink font-bold">&quot;앱 설치&quot;</span>를
          선택해주세요
        </p>
      )}

      {!isStandalone && !isIOS && (
        <a href="/HcR.apk" download className="text-muted text-xs underline underline-offset-2">
          APK 파일 직접 다운로드
        </a>
      )}
    </main>
  )
}
