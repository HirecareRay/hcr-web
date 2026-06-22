/**
 * aiSummary.tsx
 *
 * 섹션별 요약 문장을 "✨ AI 요약" 마커와 함께 일관되게 보여줍니다.
 * 재무·뉴스·채용·평판의 summary는 LLM이 쓴 해석이므로, 스크롤 내내
 * "AI가 정리해줬다"는 인상을 줍니다. (숫자·평점·원문 자체엔 붙이지 않습니다.)
 */

import { Sparkles } from "lucide-react"

interface Props {
  children: React.ReactNode
}

export function AiSummary({ children }: Props) {
  return (
    <div className="bg-warm-bg rounded-lg px-4 py-3">
      <div className="text-primary flex items-center gap-1 text-xs font-semibold">
        <Sparkles className="h-3 w-3" />
        AI 요약
      </div>
      <p className="text-muted mt-1.5 text-sm leading-relaxed">{children}</p>
    </div>
  )
}
