import { NavBar } from "./navBar"

/**
 * 앱 프레임 셸 — 콘텐츠를 화면 가운데 폰 모양 기둥으로 제한한다.
 *
 * - 프레임 높이 = 화면 세로 100%(100dvh)
 * - 프레임 폭   = 높이 × 폰 비율(9 / 19.5), 단 화면 폭을 넘지 않음
 *   → 데스크탑: 폰 한 대가 가운데 떠 있는 모양
 *   → 실제 모바일: 화면 폭을 꽉 채움(max-w fallback)
 * - 헤더 없음. 본문(main)만 스크롤, 하단 네비바는 고정
 */
export function AppShell({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex min-h-dvh w-full justify-center bg-[#f7f9fb]">
      <div className="bg-background flex h-dvh w-full max-w-[calc(100dvh*9/19.5)] flex-col overflow-hidden shadow-sm">
        <main className="flex-1 overflow-y-auto">{children}</main>
        <NavBar />
      </div>
    </div>
  )
}
