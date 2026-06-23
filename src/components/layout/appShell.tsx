"use client"

import { usePathname } from "next/navigation"
import { NavBar } from "./navBar"

// 폰 프레임을 적용하지 않는 경로 (Swagger API 독스 등 풀폭이 필요한 화면)
const fullWidthPrefixes = ["/docs"]

/**
 * 앱 셸 — 콘텐츠를 docs처럼 화면 폭에 꽉 채우고 가운데 정렬한다.
 *
 * - 높이 = 화면 세로 100%(100dvh), 본문(main)만 스크롤·하단 네비바 고정
 * - 본문 폭 = 읽기 좋은 최대폭(max-w-4xl)으로 중앙 정렬
 * - 데스크탑에서 양옆 여백(gutter)은 어둡게(--color-gutter), 가운데 콘텐츠 컬럼은
 *   밝게(--color-background) + 옅은 그림자로 띄워 구분한다
 * - 본문(main)과 네비바를 같은 max-w-4xl 컬럼 안에 두고, 스크롤은 컬럼 안쪽
 *   main에만 둔다 → 스크롤바가 생겨도 콘텐츠와 네비바가 어긋나지 않는다
 * - 단, fullWidthPrefixes 경로는 셸/네비바 없이 그대로 렌더
 */
export function AppShell({ children }: { children: React.ReactNode }) {
  const pathname = usePathname()
  const isFullWidth = fullWidthPrefixes.some((prefix) => pathname.startsWith(prefix))

  if (isFullWidth) {
    return <>{children}</>
  }

  return (
    <div className="bg-gutter flex h-dvh w-full justify-center overflow-hidden">
      <div className="bg-background flex h-full w-full max-w-4xl flex-col overflow-hidden shadow-[0_0_1.5rem_rgba(0,0,0,0.06)]">
        <main className="flex-1 overflow-y-auto">{children}</main>
        <NavBar />
      </div>
    </div>
  )
}
