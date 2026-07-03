/**
 * insightSection.tsx
 *
 * AI 인사이트 (②, LLM 추론) — 비전·성장 가능성 + SWOT.
 *
 * ⚠️ 사실 데이터(①)와 달리 출처가 단정되지 않는 추론입니다.
 *    "AI 분석" 배지 + 안내 문구로 ①과 시각적으로 분리해,
 *    취준생이 확정된 사실로 오인하지 않게 합니다.
 */

import { Sparkles } from "lucide-react"
import type { InsightSection as InsightData } from "../../types/company"

interface Props {
  data: InsightData
}

const swotItems = [
  { key: "strengths", title: "강점", badge: "S", tone: "text-primary" },
  { key: "weaknesses", title: "약점", badge: "W", tone: "text-muted" },
  { key: "opportunities", title: "기회", badge: "O", tone: "text-primary" },
  { key: "threats", title: "위협", badge: "T", tone: "text-muted" },
] as const

export function InsightSection({ data }: Props) {
  return (
    <section className="border-warm-border rounded-2xl border bg-white p-5 shadow-sm">
      <div className="mb-4 flex items-center gap-2">
        <h2 className="text-ink text-base font-bold">AI 인사이트</h2>
        <span className="bg-coral-light text-primary inline-flex items-center gap-1 rounded-full px-2 py-0.5 text-xs font-semibold">
          <Sparkles className="h-3 w-3" />
          AI 분석
        </span>
      </div>

      {/* 비전 · 성장 가능성 */}
      <p className="text-ink text-sm leading-relaxed">{data.vision}</p>

      {/* 업계 현황 */}
      {data.industry && (
        <div className="mt-5">
          <p className="text-muted text-xs font-semibold">업계 현황</p>
          <p className="text-ink mt-1.5 text-sm leading-relaxed">{data.industry}</p>
        </div>
      )}

      {/* 주요 경쟁사 */}
      {data.competitors.length > 0 && (
        <div className="mt-5">
          <p className="text-muted text-xs font-semibold">주요 경쟁사</p>
          <ul className="mt-2 space-y-2">
            {data.competitors.map((competitor) => (
              <li key={competitor.name} className="bg-warm-bg rounded-xl px-3 py-2.5">
                <p className="text-ink text-sm font-semibold">{competitor.name}</p>
                <p className="text-muted mt-0.5 text-xs leading-relaxed">
                  {competitor.description}
                </p>
              </li>
            ))}
          </ul>
        </div>
      )}

      {/* SWOT 2x2 */}
      <div className="mt-5 grid grid-cols-2 gap-2">
        {swotItems.map(({ key, title, badge, tone }) => (
          <div key={key} className="bg-warm-bg rounded-xl p-3">
            <div className={`flex items-center gap-1.5 text-xs font-bold ${tone}`}>
              <span className="rounded bg-white px-1.5 py-0.5">{badge}</span>
              <span>{title}</span>
            </div>
            <ul className="mt-2 space-y-1">
              {data.swot[key].map((item) => (
                <li key={item} className="text-muted text-xs leading-relaxed">
                  · {item}
                </li>
              ))}
            </ul>
          </div>
        ))}
      </div>

      <p className="text-disabled mt-4 text-xs leading-relaxed">
        ※ AI가 뉴스·공시 등을 바탕으로 추론한 내용으로, 실제와 다를 수 있습니다.
      </p>
    </section>
  )
}
