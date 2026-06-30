"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { Home, Compass, Mic, User } from "lucide-react"
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
  { label: "탐색", href: "#", icon: Compass }, // TODO: 기업 탐색 목록 라우트 연결
  { label: "AI면접", href: routes.interviewEntry, icon: Mic },
  { label: "마이", href: routes.mypage, icon: User }, // 비로그인 시 미들웨어가 /login 으로 보냄
]

export function NavBar() {
  const pathname = usePathname()

  return (
    <nav className="border-warm-border w-full shrink-0 border-t bg-white">
      <ul className="flex">
        {navItems.map(({ label, href, icon: Icon }) => {
          // 면접 진입점은 면접 흐름(/interview/*) 전체에서 활성으로 본다(홈 "/"은 제외돼 안전).
          const isActive =
            href !== "#" &&
            (pathname === href || (href !== routes.home && pathname.startsWith(`${href}/`)))

          return (
            <li key={label} className="relative flex-1">
              {/* 활성 탭 상단 인디케이터 */}
              {isActive && (
                <span className="bg-primary absolute inset-x-0 top-0 mx-auto h-1 w-20 rounded-full" />
              )}

              <Link
                href={href}
                className="flex flex-col items-center gap-1 py-2"
                aria-current={isActive ? "page" : undefined}
              >
                <span
                  className={cn(
                    "flex items-center justify-center rounded-md px-3 py-1 transition-colors",
                    isActive ? "bg-coral-light" : "bg-warm-bg"
                  )}
                >
                  <Icon className={cn("size-5", isActive ? "text-primary" : "text-disabled")} />
                </span>
                <span
                  className={cn("text-xs", isActive ? "text-primary font-bold" : "text-disabled")}
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
