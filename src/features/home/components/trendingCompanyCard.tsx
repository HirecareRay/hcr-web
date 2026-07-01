/**
 * trendingCompanyCard.tsx
 *
 * "가장 많이 분석한 기업 TOP 5" 한 장의 카드.
 * 랭킹 뱃지 + 로고 원 + 회사명/모회사 + 리포트 보기 링크로 구성됩니다.
 */

import Link from "next/link"
import { ArrowRight } from "lucide-react"
import { cn } from "@/lib/utils"
import { routes } from "@/constants/routes"
import type { TrendingCompany } from "../types/home"
import { CompanyLogo } from "./companyLogo"

// 랭킹 뱃지 배경/글자색 — 상위 3위는 금·은·동 메달색, 4위부터는 중립 톤.
function rankBadgeClass(rank: number): string {
  if (rank === 1) return "bg-amber-400 text-white" // 금
  if (rank === 2) return "bg-slate-300 text-slate-700" // 은
  if (rank === 3) return "bg-amber-700 text-white" // 동
  return "bg-warm-bg text-muted"
}

export function TrendingCompanyCard({ company }: { company: TrendingCompany }) {
  return (
    <article className="border-warm-border relative flex w-44 shrink-0 snap-start flex-col items-center rounded-2xl border bg-white p-4 shadow-sm md:w-auto">
      <span
        className={cn(
          "absolute top-2.5 left-2.5 inline-flex size-6 items-center justify-center rounded-full text-xs font-bold tabular-nums shadow-sm ring-2 ring-white",
          rankBadgeClass(company.rank)
        )}
      >
        {company.rank}
      </span>

      <div className="mt-2">
        <CompanyLogo
          logoUrl={company.logoUrl}
          logoText={company.logoText}
          logoColor={company.logoColor}
        />
      </div>

      <h3 className="text-ink mt-3 line-clamp-1 text-center text-base font-bold">{company.name}</h3>
      {/* 업종명 길이가 0·1·2줄로 제각각이라 항상 2줄 높이를 확보해 카드 높이를 통일한다.
          한글 단어가 어색하게 끊기지 않도록 break-keep, 2줄 초과는 말줄임 처리. */}
      <p className="text-disabled line-clamp-2 min-h-8 text-center text-xs break-keep">
        {company.parentName}
      </p>

      <Link
        href={routes.company(company.companyId)}
        className="bg-coral-light text-primary mt-3 flex w-full items-center justify-center gap-1 rounded-lg py-2 text-xs font-bold"
      >
        리포트 보기
        <ArrowRight className="size-3.5" />
      </Link>
    </article>
  )
}
