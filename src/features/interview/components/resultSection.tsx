/**
 * resultSection.tsx
 *
 * 면접 결과 각 섹션을 감싸는 공통 카드 래퍼입니다.
 * 제목 + (선택) "AI 분석" 배지 + 우측 부가정보 + 본문을 일관된 스타일로 보여줍니다.
 *
 * 참고: company의 reportSection과 거의 동일합니다. 추후 두 feature가 공유하면
 *       components/ui 로 추출할 후보입니다(지금은 feature 독립성을 위해 로컬 유지).
 */

import { Sparkles } from "lucide-react"

interface Props {
  title: string
  meta?: string
  /** AI 추론 영역임을 표시(사실 데이터와 시각적으로 분리) */
  aiBadge?: boolean
  children: React.ReactNode
}

export function ResultSection({ title, meta, aiBadge, children }: Props) {
  return (
    <section className="border-warm-border rounded-2xl border bg-white p-5 shadow-sm">
      <div className="mb-4 flex items-center justify-between gap-2">
        <div className="flex items-center gap-2">
          <h2 className="text-ink text-base font-bold">{title}</h2>
          {aiBadge && (
            <span className="bg-coral-light text-primary inline-flex items-center gap-1 rounded-full px-2 py-0.5 text-xs font-semibold">
              <Sparkles className="h-3 w-3" />
              AI 분석
            </span>
          )}
        </div>
        {meta && <span className="text-disabled shrink-0 text-xs">{meta}</span>}
      </div>
      {children}
    </section>
  )
}
