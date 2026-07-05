"use client"

// 로그인 필수 페이지를 감싸는 클라이언트 가드.
//
// 미들웨어(middleware.ts)는 Edge 라 쿠키 "존재"만 확인한다 — 만료·무효 토큰 쿠키가 남아
// 있으면 통과시켜, 실제론 비로그인인데 페이지가 렌더되는 구멍이 있다. AuthProvider 가
// /auth/me 로 쿠키를 실제 검증해 스토어 status 를 확정(authenticated/unauthenticated)하므로,
// 이 가드가 그 결과를 보고 unauthenticated 면 로그인으로 돌려보낸다(미들웨어와 이중 방어).
//
// status 가 확정되기 전(loading)·리다이렉트 대기 중엔 보호 콘텐츠를 렌더하지 않아,
// 비로그인 상태에서 화면이 잠깐이라도 노출되는 것을 막는다.

import { useEffect } from "react"
import { useRouter, usePathname } from "next/navigation"
import { routes } from "@/constants/routes"
import { useAuthStore } from "../store/authStore"

export function RequireAuth({ children }: { children: React.ReactNode }) {
  const status = useAuthStore((s) => s.status)
  const router = useRouter()
  const pathname = usePathname()

  useEffect(() => {
    if (status === "unauthenticated") {
      // 로그인 후 원래 페이지로 복귀시킨다(미들웨어와 동일한 redirect 규약).
      router.replace(`${routes.login}?redirect=${encodeURIComponent(pathname)}`)
    }
  }, [status, router, pathname])

  // 인증 확정 전(loading)·리다이렉트 대기(unauthenticated)엔 보호 콘텐츠를 감춘다.
  if (status !== "authenticated") return null
  return <>{children}</>
}
