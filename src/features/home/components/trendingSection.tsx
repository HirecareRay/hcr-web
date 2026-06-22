/**
 * trendingSection.tsx
 *
 * "오늘 많이 분석된 채용공고" 섹션.
 * 모바일은 가로 스크롤 캐러셀, 데스크탑(md+)은 그리드로 펼쳐 보여줍니다.
 */

import { Flame } from "lucide-react"
import { SectionHeader } from "./sectionHeader"
import { TrendingCompanyCard } from "./trendingCompanyCard"
import type { TrendingCompany } from "../types/home"

export function TrendingSection({ companies }: { companies: TrendingCompany[] }) {
  return (
    <section>
      <SectionHeader icon={Flame} title="오늘 많이 분석된 채용공고" />

      <div className="-mx-5 flex snap-x snap-mandatory gap-3 overflow-x-auto px-5 pb-2 md:mx-0 md:grid md:grid-cols-4 md:overflow-visible md:px-0 lg:grid-cols-5">
        {companies.map((company) => (
          <TrendingCompanyCard key={company.companyId} company={company} />
        ))}
      </div>
    </section>
  )
}
