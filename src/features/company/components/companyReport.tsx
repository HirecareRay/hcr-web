"use client"

/**
 * companyReport.tsx
 *
 * 회사 보고서의 최상위 컴포넌트입니다.
 * useCompanyReport 훅으로 데이터를 받아 로딩/에러/정상 상태를 분기하고,
 * 정상일 때 각 섹션 컴포넌트를 조합해 렌더링합니다.
 */

import { useCompanyReport } from "../hooks/useCompanyReport"
import { OverviewSection } from "./sections/overviewSection"
import { FinancialSection } from "./sections/financialSection"
import { EmployeeSection } from "./sections/employeeSection"
import { GrowthSection } from "./sections/growthSection"
import { HiringSection } from "./sections/hiringSection"

interface Props {
  companyId: string
}

export function CompanyReport({ companyId }: Props) {
  const { data, isLoading, isError, refetch } = useCompanyReport(companyId)

  if (isLoading) return <ReportLoading />
  if (isError || !data) return <ReportError onRetry={() => refetch()} />

  // AppShell이 이미 <main> + 폰 프레임 폭을 제공하므로, 여기서는 <div>로 채웁니다.
  return (
    <div className="px-4 py-6">
      <header className="mb-5">
        <h1 className="text-ink text-xl font-bold">{data.company.name}</h1>
        <p className="text-muted mt-1 text-sm">기업 분석 보고서</p>
      </header>

      <div className="space-y-4">
        <OverviewSection data={data.overview} />
        <FinancialSection data={data.financial} />
        <EmployeeSection data={data.employees} />
        <GrowthSection data={data.growth} />
        <HiringSection data={data.hiring} />
      </div>
    </div>
  )
}

function ReportLoading() {
  return (
    <div className="px-4 py-6">
      <div className="bg-warm-border/40 mb-5 h-7 w-40 animate-pulse rounded-lg" />
      <div className="space-y-4">
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
