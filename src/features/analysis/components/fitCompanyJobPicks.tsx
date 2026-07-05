/**
 * fitCompanyJobPicks.tsx
 *
 * 적합도 분석 진입 화면의 "인기 기업 채용공고" 섹션입니다.
 * FitCompanyPicks에 나열된 인기 기업(홈 피드 trending)마다, 검색 페이지 "기업" 탭이 쓰는
 * searchCompanyJobs(회사명)로 관련 채용공고를 조회해 그 첫 건(대표 공고) 1개씩
 * FitCompanyPicks와 동일한 카드 형식(가로 스크롤 카드)으로 보여준다. 카드를 누르면
 * 바로 적합도 분석 페이지로 이동한다.
 */

"use client"

import Link from "next/link"
import { ArrowRight, Briefcase } from "lucide-react"
import { useQueries } from "@tanstack/react-query"
import { useHomeFeed } from "@/features/home/hooks/useHomeFeed"
import { searchCompanyJobs } from "@/features/search/services/searchService"
import type { RelatedJobPosting } from "@/features/search/types/search"

// FitCompanyPicks와 동일한 반응형: 모바일은 가로 스크롤 캐러셀, 데스크탑(md+)은 5열 그리드.
const listClass =
  "-mx-4 flex snap-x snap-mandatory gap-3 overflow-x-auto px-4 pb-1 md:mx-0 md:grid md:grid-cols-5 md:overflow-visible md:px-0"

export function FitCompanyJobPicks() {
  const { data: homeFeed, isLoading, isError } = useHomeFeed()
  const companies = homeFeed?.trending ?? []

  const jobQueries = useQueries({
    queries: companies.map((company) => ({
      queryKey: ["companyJobs", company.name],
      queryFn: () => searchCompanyJobs(company.name),
      enabled: companies.length > 0,
    })),
  })

  // 로딩 중엔 자리만 잡아 레이아웃이 흔들리지 않게(스켈레톤 카드).
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

  if (isError) return null

  // 회사별 관련 공고 중 첫 건(대표 공고) 1개씩만 뽑는다.
  const jobs = jobQueries.map((q) => q.data?.[0]).filter((job): job is RelatedJobPosting => !!job)

  if (jobs.length === 0) return null

  return (
    <section className="space-y-2.5">
      <SectionTitle />
      <div className={listClass}>
        {jobs.map((job) => (
          <JobPickCard key={job.id} job={job} />
        ))}
      </div>
    </section>
  )
}

function SectionTitle() {
  return (
    <div className="flex items-baseline justify-between">
      <h2 className="text-ink text-sm font-bold">인기 기업 채용공고</h2>
      <span className="text-disabled text-xs">눌러서 적합도 분석</span>
    </div>
  )
}

function JobPickCard({ job }: { job: RelatedJobPosting }) {
  return (
    <Link
      href={`/jobs/${job.id}/fit?companyId=${job.companyId}`}
      className="border-warm-border hover:border-primary group flex w-36 shrink-0 snap-start flex-col items-center rounded-2xl border bg-white p-4 shadow-sm transition-colors md:w-auto"
    >
      <span className="bg-coral-light text-primary flex size-16 shrink-0 items-center justify-center rounded-full">
        <Briefcase className="size-6" />
      </span>
      <h3 className="text-ink mt-2.5 line-clamp-2 text-center text-sm font-bold">{job.title}</h3>
      <p className="text-disabled line-clamp-1 text-center text-xs">{job.companyName}</p>
      <span className="text-primary mt-2.5 inline-flex items-center gap-0.5 text-xs font-semibold">
        적합도 분석
        <ArrowRight className="size-3 transition-transform group-hover:translate-x-0.5" />
      </span>
    </Link>
  )
}
