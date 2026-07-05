"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { Home, ChartNoAxesColumn, Mic, User } from "lucide-react"
import { cn } from "@/lib/utils"
import { routes } from "@/constants/routes"

type NavItem = {
  label: string
  href: string
  icon: typeof Home
}

// 하단 탭 항목 — Figma "공통 컴포넌트 / BottomTabBar" 기준
// 라우트 생기면 href만 교체하면 됨
const navItems: NavItem[] = [
  { label: "홈", href: routes.home, icon: Home },
  { label: "적합도 분석", href: routes.fitEntry, icon: ChartNoAxesColumn },
  { label: "AI면접", href: routes.interviewEntry, icon: Mic },
  { label: "마이", href: routes.mypage, icon: User }, // 비로그인 시 미들웨어가 /login 으로 보냄
]

// 서류 적합도 분석 상세(/jobs/[jobId]/fit)는 "적합도 분석" 흐름에 속하므로 네비바에서 같이 활성 처리한다.
// 마이페이지 하위의 적합도 보고서 목록(/mypage/analysis)은 인터뷰 기록(/mypage/interview)과
// 마찬가지로 "마이" 탭 소관이라 별도 처리하지 않는다.
const FIT_DETAIL_RE = /^\/jobs\/[^/]+\/fit(\/|$)/

export function NavBar() {
  const pathname = usePathname()

  return (
    <nav className="border-warm-border w-full shrink-0 border-t bg-white/95 backdrop-blur">
      <ul className="flex">
        {navItems.map(({ label, href, icon: Icon }) => {
          // 면접/적합도 분석 진입점은 각자 흐름 전체에서 활성으로 본다(홈 "/"은 제외돼 안전).
          const isActive =
            pathname === href ||
            (href !== routes.home && pathname.startsWith(`${href}/`)) ||
            (href === routes.fitEntry && FIT_DETAIL_RE.test(pathname))

          return (
            <li key={label} className="flex-1">
              <Link
                href={href}
                className="group flex flex-col items-center gap-1.5 py-2.5"
                aria-current={isActive ? "page" : undefined}
              >
                <Icon
                  className={cn(
                    "size-6 transition-all duration-200",
                    isActive
                      ? "text-primary -translate-y-px scale-105"
                      : "text-disabled group-hover:text-muted"
                  )}
                  strokeWidth={isActive ? 2.5 : 1.9}
                />
                <span
                  className={cn(
                    "text-[0.6875rem] leading-none transition-colors",
                    isActive ? "text-primary font-bold" : "text-disabled group-hover:text-muted"
                  )}
                >
                  {label}
                </span>
              </Link>
            </li>
          )
        })}
      </ul>
    </nav>
  )
}
