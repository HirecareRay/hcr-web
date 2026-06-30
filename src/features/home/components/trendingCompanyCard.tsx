/**
 * trendingCompanyCard.tsx
 *
 * "오늘 많이 분석된 채용공고" 한 장의 카드.
 * 랭킹 뱃지 + 로고 원 + 회사명/모회사 + 리포트 보기 링크로 구성됩니다.
 */

import Link from "next/link"
import { ArrowRight } from "lucide-react"
import { cn } from "@/lib/utils"
import { routes } from "@/constants/routes"
import type { TrendingCompany } from "../types/home"

// 랭킹 뱃지 색 — 금/은/동, 4위 이하는 중립
function rankBadgeClass(rank: number): string {
  if (rank === 1) return "bg-[#f4b400] text-white" // 금
  if (rank === 2) return "bg-[#b4bcc8] text-white" // 은
  if (rank === 3) return "bg-[#cd7f32] text-white" // 동
  return "bg-warm-bg text-muted"
}

export function TrendingCompanyCard({ company }: { company: TrendingCompany }) {
  return (
    <article className="border-warm-border relative flex w-44 shrink-0 snap-start flex-col items-center rounded-2xl border bg-white p-4 shadow-sm md:w-auto">
      <span
        className={cn(
          "absolute top-3 left-3 flex size-6 items-center justify-center rounded-full text-xs font-bold",
          rankBadgeClass(company.rank)
        )}
      >
        {company.rank}
      </span>

      <div
        className="mt-2 flex size-20 items-center justify-center rounded-full text-sm font-bold text-white"
        style={{ backgroundColor: company.logoColor }}
      >
        {company.logoText}
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
