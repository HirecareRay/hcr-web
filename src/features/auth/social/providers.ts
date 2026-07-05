// 소셜 로그인(OAuth) provider 설정 — 프론트·BFF 콜백이 공유하는 단일 출처.
//
// 흐름은 "authorization code" 방식(백엔드와 확정 계약):
//   버튼 클릭 → provider 인가 페이지 이동 → 우리 콜백(/api/auth/callback/{provider})으로 code 회신
//   → BFF 가 code 를 FastAPI POST /auth/social/{provider} 로 넘겨 우리 JWT 교환.
//
// client_secret 은 여기(프론트)에 절대 두지 않는다 — 백엔드 .env 전용.
// 공개값(client_id·redirect_uri)만 NEXT_PUBLIC_ 로 브라우저에 실린다.

// provider 화이트리스트 — 콜백 route 가 임의 문자열을 막는 데 쓴다.
export const socialProviderIds = ["kakao", "google", "naver"] as const

export type SocialProvider = (typeof socialProviderIds)[number]

// 임의 문자열이 허용된 provider 인지 좁히는 타입가드(콜백에서 400/404 판정).
export function isSocialProvider(value: string): value is SocialProvider {
  return (socialProviderIds as readonly string[]).includes(value)
}

interface SocialProviderConfig {
  // 화면 표시 이름
  label: string
  // provider 인가 엔드포인트
  authorizeUrl: string
  // 요청 scope — 없으면 쿼리에서 생략(kakao·naver 는 동의항목을 콘솔에서 관리)
  scope?: string
  // 공개 client_id — NEXT_PUBLIC_ 이므로 브라우저에 인라인됨.
  // 주의: Next 는 process.env.NEXT_PUBLIC_* 를 "정적 참조"만 치환하므로 동적 접근(process.env[key])은 금물.
  clientId?: string
  // provider 콘솔에 등록된 redirect_uri. 비우면 런타임에 origin 기준으로 조립(socialLogin.ts).
  redirectUri?: string
}

export const socialProviders: Record<SocialProvider, SocialProviderConfig> = {
  kakao: {
    label: "카카오",
    authorizeUrl: "https://kauth.kakao.com/oauth/authorize",
    clientId: process.env.NEXT_PUBLIC_KAKAO_CLIENT_ID,
    redirectUri: process.env.NEXT_PUBLIC_KAKAO_REDIRECT_URI,
  },
  google: {
    label: "Google",
    authorizeUrl: "https://accounts.google.com/o/oauth2/v2/auth",
    scope: "openid email profile",
    clientId: process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID,
    redirectUri: process.env.NEXT_PUBLIC_GOOGLE_REDIRECT_URI,
  },
  naver: {
    label: "네이버",
    authorizeUrl: "https://nid.naver.com/oauth2.0/authorize",
    clientId: process.env.NEXT_PUBLIC_NAVER_CLIENT_ID,
    redirectUri: process.env.NEXT_PUBLIC_NAVER_REDIRECT_URI,
  },
}
