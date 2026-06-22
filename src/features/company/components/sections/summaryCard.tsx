/**
 * summaryCard.tsx
 *
 * 회사 탭 최상단의 "한눈에 보기" 카드입니다.
 * 취준생이 스크롤 전 3초 안에 회사를 판단할 수 있도록 핵심만 모았습니다.
 * (산업 · 규모 · 평균연봉 · 평판 · 채용중 여부 · 인재상 키워드)
 *
 * 별도 데이터 출처가 아니라 보고서 내 사실 데이터(①)를 모아 보여주는 요약 뷰입니다.
 */

import { Star, Users, Wallet } from "lucide-react"
import { formatKrwShort } from "../../lib/formatters"

interface Props {
  industry: string
  employeeCount: number
  avgSalary: number | null
  rating: number
  openingCount: number
  talentValues: string | null
}

export function SummaryCard({
  industry,
  employeeCount,
  avgSalary,
  rating,
  openingCount,
  talentValues,
}: Props) {
  const talentKeywords =
    talentValues
      ?.split(/[,·]/)
      .map((keyword) => keyword.trim())
      .filter(Boolean) ?? []

  const stats = [
    { icon: Users, label: "임직원", value: `${employeeCount.toLocaleString()}명` },
    { icon: Wallet, label: "평균연봉", value: formatKrwShort(avgSalary) },
    { icon: Star, label: "잡플래닛", value: `${rating.toFixed(1)}점` },
  ]

  return (
    <section className="bg-coral-light rounded-2xl p-5">
      <div className="flex items-center justify-between">
        <span className="text-primary text-sm font-semibold">{industry}</span>
        {openingCount > 0 && (
          <span className="bg-primary rounded-full px-2.5 py-1 text-xs font-bold text-white">
            채용중 {openingCount}
          </span>
        )}
      </div>

      <dl className="mt-4 grid grid-cols-3 gap-2">
        {stats.map((stat) => (
          <div key={stat.label} className="rounded-xl bg-white/70 px-2 py-3 text-center">
            <stat.icon className="text-primary mx-auto h-4 w-4" />
            <dt className="text-muted mt-1 text-xs">{stat.label}</dt>
            <dd className="text-ink mt-0.5 text-sm font-bold">{stat.value}</dd>
          </div>
        ))}
      </dl>

      {talentKeywords.length > 0 && (
        <div className="mt-4">
          <p className="text-muted text-xs font-medium">인재상</p>
          <div className="mt-1.5 flex flex-wrap gap-1.5">
            {talentKeywords.map((keyword) => (
              <span
                key={keyword}
                className="text-primary rounded-full bg-white px-3 py-1 text-xs font-semibold"
              >
                {keyword}
              </span>
            ))}
          </div>
        </div>
      )}
    </section>
  )
}
