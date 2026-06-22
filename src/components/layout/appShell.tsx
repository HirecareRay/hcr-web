"use client"

import { usePathname } from "next/navigation"
import { NavBar } from "./navBar"

// 폰 프레임을 적용하지 않는 경로 (Swagger API 독스 등 풀폭이 필요한 화면)
const fullWidthPrefixes = ["/docs"]

/**
 * 앱 셸 — 콘텐츠를 docs처럼 화면 폭에 꽉 채우고 가운데 정렬한다.
 *
 * - 높이 = 화면 세로 100%(100dvh), 본문(main)만 스크롤·하단 네비바 고정
 * - 본문 폭 = 화면을 꽉 채우되 읽기 좋은 최대폭(max-w-4xl)으로 중앙 정렬
 * - 네비바는 풀폭 배경 + 내부 콘텐츠만 본문과 같은 폭으로 정렬
 * - 단, fullWidthPrefixes 경로는 셸/네비바 없이 그대로 렌더
 */
export function AppShell({ children }: { children: React.ReactNode }) {
  const pathname = usePathname()
  const isFullWidth = fullWidthPrefixes.some((prefix) => pathname.startsWith(prefix))

  if (isFullWidth) {
    return <>{children}</>
  }

  return (
    <div className="bg-background flex h-dvh w-full flex-col overflow-hidden">
      <main className="flex-1 overflow-y-auto">
        <div className="mx-auto w-full max-w-4xl">{children}</div>
      </main>
      <NavBar />
    </div>
  )
}
