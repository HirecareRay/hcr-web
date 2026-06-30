/**
 * interviewCompanyPicks.tsx
 *
 * 면접 진입 화면의 "기업으로 연습하기" 섹션입니다.
 * 홈 피드의 트렌딩 기업을 재사용해 바로가기 칩으로 보여주고, 누르면 그 기업으로 면접을 시작합니다.
 *   → /interview/[companyId]
 *
 * 데이터 출처: 홈 피드 BFF(`/api/home/feed`)의 trending(현재 데모/더미, CJ ENM 1건만 실데이터).
 * 실제 "면접용 기업 목록" 백엔드가 붙으면 이 훅만 교체하면 된다(다음 작업).
 */

"use client"

import Link from "next/link"
import { ArrowRight } from "lucide-react"
import { useHomeFeed } from "@/features/home/hooks/useHomeFeed"
import { routes } from "@/constants/routes"
import type { TrendingCompany } from "@/features/home/types/home"

// 홈 트렌딩 섹션과 동일한 반응형: 모바일은 가로 스크롤 캐러셀, 데스크탑(md+)은 5열 그리드.
const listClass =
  "-mx-4 flex snap-x snap-mandatory gap-3 overflow-x-auto px-4 pb-1 md:mx-0 md:grid md:grid-cols-5 md:overflow-visible md:px-0"

export function InterviewCompanyPicks() {
  const { data, isLoading, isError } = useHomeFeed()
  const companies = data?.trending ?? []

  // 로딩 중엔 자리만 잡아 레이아웃이 흔들리지 않게(스켈레톤 칩).
  if (isLoading) {
    return (
      <section className="space-y-2.5">
        <SectionTitle />
        <div className={listClass}>
          {Array.from({ length: 5 }).map((_, i) => (
            <div
              key={i}
              className="border-warm-border h-36 w-36 shrink-0 animate-pulse rounded-2xl border bg-white md:w-auto"
            />
          ))}
        </div>
      </section>
    )
  }

  // 에러/빈 목록이면 섹션을 숨겨 진입 흐름을 막지 않는다(주 경로는 "기업 없이 시작").
  if (isError || companies.length === 0) return null

  return (
    <section className="space-y-2.5">
      <SectionTitle />
      <div className={listClass}>
        {companies.map((company) => (
          <CompanyPickCard key={company.companyId} company={company} />
        ))}
      </div>
    </section>
  )
}

function SectionTitle() {
  return (
    <div className="flex items-baseline justify-between">
      <h2 className="text-ink text-sm font-bold">기업으로 연습하기</h2>
      <span className="text-disabled text-xs">눌러서 바로 면접 시작</span>
    </div>
  )
}

function CompanyPickCard({ company }: { company: TrendingCompany }) {
  return (
    <Link
      href={routes.interview(company.companyId)}
      className="border-warm-border hover:border-primary group flex w-36 shrink-0 snap-start flex-col items-center rounded-2xl border bg-white p-4 shadow-sm transition-colors md:w-auto"
    >
      <div
        className="flex size-16 items-center justify-center rounded-full text-sm font-bold text-white"
        style={{ backgroundColor: company.logoColor }}
      >
        {company.logoText}
      </div>
      <h3 className="text-ink mt-2.5 line-clamp-1 text-center text-sm font-bold">{company.name}</h3>
      <p className="text-disabled line-clamp-1 text-center text-xs">{company.parentName}</p>
      <span className="text-primary mt-2.5 inline-flex items-center gap-0.5 text-xs font-semibold">
        면접 보기
        <ArrowRight className="size-3 transition-transform group-hover:translate-x-0.5" />
      </span>
    </Link>
  )
}
