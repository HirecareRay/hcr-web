"use client"

/**
 * companyReport.tsx
 *
 * 회사 보고서의 최상위 컴포넌트입니다.
 * useCompanyReport 훅으로 데이터를 받아 로딩/에러/정상 상태를 분기하고,
 * 정상일 때 각 섹션 컴포넌트를 조합해 렌더링합니다.
 */

import { useState } from "react"
import Link from "next/link"
import { Sparkles } from "lucide-react"
import { routes } from "@/constants/routes"
import { useCompanyReport } from "../hooks/useCompanyReport"
import { ReportTabs } from "./reportTabs"
import { AiHero } from "./aiHero"
import { SummaryCard } from "./sections/summaryCard"
import { OverviewSection } from "./sections/overviewSection"
import { FinancialSection } from "./sections/financialSection"
import { EmployeeSection } from "./sections/employeeSection"
import { ReviewSection } from "./sections/reviewSection"
import { GrowthSection } from "./sections/growthSection"
import { HiringSection } from "./sections/hiringSection"
import { InsightSection } from "./sections/insightSection"

interface Props {
  companyId: string
}

// 앱 UI라 라우트를 쪼개지 않고 탭으로 "2페이지"를 나눕니다.
//   회사     : 이 회사가 어떤 곳인지 파악 (개요·임직원·재무)
//   채용·면접 : 지원/면접 준비에 필요한 정보 (채용공고·최근 뉴스)
const reportTabs = [
  { key: "company", label: "회사" },
  { key: "hiring", label: "채용·면접" },
] as const

type TabKey = (typeof reportTabs)[number]["key"]

export function CompanyReport({ companyId }: Props) {
  const { data, isLoading, isError, refetch } = useCompanyReport(companyId)
  const [activeTab, setActiveTab] = useState<TabKey>("company")

  if (isLoading) return <ReportLoading />
  if (isError || !data) return <ReportError onRetry={() => refetch()} />

  // AppShell이 이미 <main> + 폰 프레임 폭을 제공하므로, 여기서는 <div>로 채웁니다.
  return (
    <div className="px-4 py-6">
      <header className="mb-4">
        <p className="text-disabled text-xs font-medium">{data.company.industry}</p>
        <h1 className="text-ink mt-0.5 text-xl font-bold">{data.company.name}</h1>
      </header>

      {/* AI 총평 — 리포트 전체를 종합한 AI 한마디를 가장 먼저 보여줍니다. */}
      <AiHero headline={data.insight.headline} keyPoints={data.insight.keyPoints} />

      {/* 스크롤해도 탭이 상단에 고정되도록 sticky. -mx-4/px-4로 좌우를 꽉 채워 배경이 비치지 않게 함 */}
      <div className="bg-background sticky top-0 z-10 -mx-4 mt-4 mb-4 px-4 pt-1 pb-3">
        <ReportTabs
          tabs={reportTabs}
          active={activeTab}
          onChange={(key) => setActiveTab(key as TabKey)}
        />
      </div>

      <div className="space-y-4">
        {activeTab === "company" ? (
          <>
            <InsightSection data={data.insight} />
            <SummaryCard
              industry={data.company.industry}
              employeeCount={data.employees.totalCount}
              avgSalary={data.employees.avgSalary}
              rating={data.review.overallRating}
              openingCount={data.hiring.openings.length}
              talentValues={data.overview.talentValues}
            />
            <OverviewSection data={data.overview} />
            <EmployeeSection data={data.employees} />
            <FinancialSection data={data.financial} />
            <ReviewSection data={data.review} />
          </>
        ) : (
          <>
            <HiringSection data={data.hiring} />
            <GrowthSection data={data.growth} />
            <InterviewCta companyId={companyId} />
          </>
        )}
      </div>
    </div>
  )
}

/** 분석 데이터를 면접관 컨텍스트로 이어가는 AI 모의면접 진입점 */
function InterviewCta({ companyId }: { companyId: string }) {
  return (
    <Link
      href={routes.interview(companyId)}
      className="from-coral-deep to-coral-beam flex items-center justify-center gap-2 rounded-2xl bg-gradient-to-br px-5 py-4 text-sm font-bold text-white shadow-sm transition-opacity hover:opacity-90"
    >
      <Sparkles className="h-4 w-4" />이 분석으로 AI 모의면접 보기
    </Link>
  )
}

const loadingSteps = ["재무 지표 분석", "최근 뉴스 읽는 중", "채용공고 정리", "면접 포인트 도출"]

function ReportLoading() {
  return (
    <div className="px-4 py-6">
      {/* AI가 분석 중임을 보여주는 히어로 자리 — 단순 스켈레톤보다 "분석 과정"을 노출 */}
      <div className="from-coral-deep to-coral-beam overflow-hidden rounded-2xl bg-gradient-to-br p-5 text-white shadow-sm">
        <div className="flex items-center gap-1.5 text-sm font-semibold">
          <Sparkles className="h-4 w-4 animate-pulse" />
          AI가 기업을 분석하고 있어요
        </div>
        <ul className="mt-3 space-y-1.5">
          {loadingSteps.map((step, index) => (
            <li
              key={step}
              className="flex items-center gap-2 text-sm text-white/90"
              style={{
                animation: "pulse 1.5s ease-in-out infinite",
                animationDelay: `${index * 0.3}s`,
              }}
            >
              <span className="h-1.5 w-1.5 rounded-full bg-white/70" />
              {step}
            </li>
          ))}
        </ul>
      </div>

      <div className="mt-4 space-y-4">
        {[0, 1, 2].map((i) => (
          <div key={i} className="bg-warm-bg h-40 animate-pulse rounded-2xl" />
        ))}
      </div>
    </div>
  )
}

function ReportError({ onRetry }: { onRetry: () => void }) {
  return (
    <div className="flex min-h-[60vh] flex-col items-center justify-center px-4 text-center">
      <p className="text-muted text-sm">보고서를 불러오지 못했습니다.</p>
      <button
        type="button"
        onClick={onRetry}
        className="bg-primary mt-4 rounded-lg px-4 py-2 text-sm font-medium text-white transition-opacity hover:opacity-90"
      >
        다시 시도
      </button>
    </div>
  )
}
