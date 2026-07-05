"use client"

// 소셜 로그인 버튼 3종(카카오·구글·네이버) + 콜백 실패 에러 표시.
// 클릭 시 startSocialLogin 이 state 를 심고 provider 인가 페이지로 이동한다.
// 로그인 성공 흐름은 서버 콜백(302) → AuthProvider 의 /auth/me 복원이 담당하므로 여기선 이동만 한다.

import { useEffect, useState } from "react"
import { logger } from "@/lib/logger"
import { socialProviderIds, socialProviders, type SocialProvider } from "../social/providers"
import { startSocialLogin } from "../social/socialLogin"
import { ProviderLogo } from "../social/providerLogos"

// provider별 원형 아이콘 버튼 스타일 — 각 사 브랜드 컬러(색상 임의값은 허용, px 임의값 아님).
const providerButtonClass: Record<SocialProvider, string> = {
  kakao: "bg-[#FEE500] text-[#191600] hover:brightness-95",
  google: "border-warm-border border bg-white text-ink hover:bg-warm-bg",
  naver: "bg-[#03C75A] text-white hover:brightness-95",
}

export function SocialLoginButtons() {
  const [error, setError] = useState("")

  // 콜백이 실패 시 /login?error=<메시지> 로 되돌려보낸다 — 마운트 시 한 번 읽어 노출.
  // (useSearchParams 의 Suspense 요구를 피하려 window 에서 직접 읽는다.)
  useEffect(() => {
    const message = new URLSearchParams(window.location.search).get("error")
    if (message) setError(message)
  }, [])

  function handleClick(provider: SocialProvider) {
    setError("")
    try {
      startSocialLogin(provider)
    } catch (e) {
      // 주로 client_id 미설정(.env 미완성) — 사용자에게 안내
      logger.error(`소셜 로그인 시작 실패 (${provider})`, e)
      setError(`${socialProviders[provider].label} 로그인을 시작할 수 없습니다`)
    }
  }

  return (
    <div className="space-y-3">
      <div className="flex items-center gap-3">
        <span className="border-warm-border h-px flex-1 border-t" />
        <span className="text-muted text-xs">간편 로그인</span>
        <span className="border-warm-border h-px flex-1 border-t" />
      </div>

      {error && (
        <div className="border-warm-border bg-coral-light rounded-xl border px-3.5 py-2.5">
          <p className="text-error text-xs font-medium">{error}</p>
        </div>
      )}

      {/* 원형 아이콘 버튼 3개 — 가로 한 줄 중앙 정렬(카드 없이 가볍게) */}
      <div className="flex justify-center gap-4">
        {socialProviderIds.map((provider) => (
          <button
            key={provider}
            type="button"
            onClick={() => handleClick(provider)}
            aria-label={`${socialProviders[provider].label} 로그인`}
            title={`${socialProviders[provider].label} 로그인`}
            className={`flex h-12 w-12 items-center justify-center rounded-full shadow-sm transition-colors ${providerButtonClass[provider]}`}
          >
            <ProviderLogo provider={provider} size={22} />
          </button>
        ))}
      </div>
    </div>
  )
}
