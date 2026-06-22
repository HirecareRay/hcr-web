/**
 * aiHero.tsx
 *
 * 리포트 최상단 AI 총평 히어로 카드입니다.
 * "AI가 전 데이터를 읽고 취준생 시점으로 정리해줬다"는 인상을 가장 먼저 줍니다.
 * 내용은 AI 인사이트(②, LLM 종합)에서 옵니다.
 */

import { Sparkles } from "lucide-react"

interface Props {
  headline: string
  keyPoints: string[]
}

export function AiHero({ headline, keyPoints }: Props) {
  return (
    <section className="from-coral-deep to-coral-beam overflow-hidden rounded-2xl bg-gradient-to-br p-5 text-white shadow-sm">
      <div className="flex items-center gap-1.5 text-xs font-semibold text-white/90">
        <Sparkles className="h-3.5 w-3.5" />
        AI 기업 분석
      </div>

      <p className="mt-2 text-base leading-relaxed font-bold">{headline}</p>

      {keyPoints.length > 0 && (
        <div className="mt-4 rounded-xl bg-white/15 p-3">
          <p className="text-xs font-semibold text-white/80">지원 전 알아둘 핵심</p>
          <ul className="mt-2 space-y-1.5">
            {keyPoints.map((point, index) => (
              <li key={point} className="flex gap-2 text-sm leading-relaxed">
                <span className="font-bold text-white/60">{index + 1}</span>
                <span>{point}</span>
              </li>
            ))}
          </ul>
        </div>
      )}
    </section>
  )
}
