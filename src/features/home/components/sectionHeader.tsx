/**
 * sectionHeader.tsx
 *
 * 홈 각 섹션의 제목 줄(아이콘 + 제목 + 선택적 우측 액션)을 일관되게 보여줍니다.
 */

import type { LucideIcon } from "lucide-react"

interface Props {
  icon: LucideIcon
  title: string
  /** 우측 액션(예: "전체 보기 →"). 없으면 생략 */
  action?: React.ReactNode
}

export function SectionHeader({ icon: Icon, title, action }: Props) {
  return (
    <div className="mb-3 flex items-center justify-between px-1">
      <h2 className="text-ink flex items-center gap-1.5 text-base font-bold">
        <Icon className="text-primary size-5" />
        {title}
      </h2>
      {action}
    </div>
  )
}
