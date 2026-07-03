"use client"

/**
 * reportTabs.tsx
 *
 * 보고서 상단의 세그먼트 컨트롤(탭 토글)입니다.
 * 앱 UI라 "2페이지"를 별도 라우트로 쪼개지 않고, 한 화면 안에서 콘텐츠만 전환합니다.
 * 생김새만 담당하며 상태는 부모(companyReport)가 소유합니다.
 */

import { cn } from "@/lib/utils"

interface Tab {
  key: string
  label: string
}

interface Props {
  tabs: readonly Tab[]
  active: string
  onChange: (key: string) => void
}

export function ReportTabs({ tabs, active, onChange }: Props) {
  return (
    <div className="bg-warm-bg flex gap-1 rounded-xl p-1">
      {tabs.map((tab) => {
        const isActive = tab.key === active
        return (
          <button
            key={tab.key}
            type="button"
            onClick={() => onChange(tab.key)}
            aria-pressed={isActive}
            className={cn(
              "flex-1 rounded-lg py-2 text-sm font-medium transition-colors",
              isActive ? "text-ink bg-white shadow-sm" : "text-muted"
            )}
          >
            {tab.label}
          </button>
        )
      })}
    </div>
  )
}
