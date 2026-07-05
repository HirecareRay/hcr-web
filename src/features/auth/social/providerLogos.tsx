// 소셜 provider 브랜드 로고 — 자체 포함 인라인 SVG(외부 요청 없음).
// 카카오·네이버는 currentColor(버튼 텍스트색)를 따르고, 구글은 브랜드 4색 고정.

import type { SocialProvider } from "./providers"

function KakaoLogo({ size }: { size: number }) {
  // 카카오톡 말풍선 심벌 — 버튼 텍스트색(#191600)을 따라감
  return (
    <svg viewBox="0 0 18 18" width={size} height={size} fill="currentColor" aria-hidden="true">
      <path d="M9 1.5C4.86 1.5 1.5 4.14 1.5 7.4c0 2.1 1.4 3.94 3.5 5.02-.15.53-.56 2.02-.64 2.34-.1.4.15.4.3.29.12-.08 1.9-1.29 2.68-1.82.54.08 1.1.12 1.66.12 4.14 0 7.5-2.64 7.5-5.9S13.14 1.5 9 1.5z" />
    </svg>
  )
}

function GoogleLogo({ size }: { size: number }) {
  // 구글 'G' — 브랜드 4색 고정(다크/라이트 무관)
  return (
    <svg viewBox="0 0 18 18" width={size} height={size} aria-hidden="true">
      <path
        fill="#4285F4"
        d="M17.64 9.2c0-.64-.06-1.25-.16-1.84H9v3.48h4.84a4.14 4.14 0 0 1-1.8 2.72v2.26h2.92c1.71-1.57 2.68-3.89 2.68-6.62z"
      />
      <path
        fill="#34A853"
        d="M9 18c2.43 0 4.47-.8 5.96-2.18l-2.92-2.26c-.8.54-1.84.86-3.04.86-2.34 0-4.32-1.58-5.02-3.7H.96v2.34A9 9 0 0 0 9 18z"
      />
      <path
        fill="#FBBC05"
        d="M3.98 10.72a5.4 5.4 0 0 1 0-3.44V4.94H.96a9 9 0 0 0 0 8.12l3.02-2.34z"
      />
      <path
        fill="#EA4335"
        d="M9 3.58c1.32 0 2.5.45 3.44 1.35l2.58-2.58C13.47.9 11.43 0 9 0A9 9 0 0 0 .96 4.94l3.02 2.34C4.68 5.16 6.66 3.58 9 3.58z"
      />
    </svg>
  )
}

function NaverLogo({ size }: { size: number }) {
  // 네이버 'N' — 버튼 텍스트색(흰색)을 따라감. 심벌이 커 보여 살짝 작게.
  return (
    <svg
      viewBox="0 0 18 18"
      width={size * 0.85}
      height={size * 0.85}
      fill="currentColor"
      aria-hidden="true"
    >
      <path d="M11.63 9.63 6.16 1.8H1.8v14.4h4.57V8.36l5.47 7.84h4.36V1.8h-4.57v7.83z" />
    </svg>
  )
}

const logos: Record<SocialProvider, (props: { size: number }) => React.ReactElement> = {
  kakao: KakaoLogo,
  google: GoogleLogo,
  naver: NaverLogo,
}

export function ProviderLogo({ provider, size = 18 }: { provider: SocialProvider; size?: number }) {
  const Logo = logos[provider]
  return <Logo size={size} />
}
