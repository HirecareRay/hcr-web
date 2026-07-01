"use client"

import { useState } from "react"
import Link from "next/link"
import {
  BadgeCheck,
  BarChart2,
  Bot,
  ChevronRight,
  FileText,
  Info,
  Lock,
  Sparkles,
  Star,
} from "lucide-react"
import { cn } from "@/lib/utils"
import { routes } from "@/constants/routes"
import { useCompanyReport } from "../hooks/useCompanyReport"
import { formatKrwShort } from "../lib/formatters"
import type { CompanyReport as CompanyReportData, JobPosting } from "../types/company"
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

const RESUME_UPLOAD_PATH = "/mypage/documents"

const reportTabs = [
  { key: "summary", label: "요약" },
  { key: "financial", label: "재무" },
  { key: "hiring", label: "채용" },
  { key: "news", label: "뉴스" },
  { key: "company", label: "기업정보" },
] as const

type TabKey = (typeof reportTabs)[number]["key"]

export function CompanyReport({ companyId }: Props) {
  const { data, isLoading, isError, refetch } = useCompanyReport(companyId)
  const [activeTab, setActiveTab] = useState<TabKey>("summary")

  if (isLoading) return <ReportLoading />
  if (isError || !data) return <ReportError onRetry={() => refetch()} />

  return (
    <div className="bg-background min-h-full pb-10">
      <CompanyHeader data={data} />

      <div className="px-4">
        <PassReadinessCard />
      </div>

      <div className="bg-background border-warm-border sticky top-0 z-10 mt-4 border-b">
        <nav className="flex px-2" aria-label="기업 분석 탭">
          {reportTabs.map((tab) => {
            const isActive = tab.key === activeTab
            return (
              <button
                key={tab.key}
                type="button"
                onClick={() => setActiveTab(tab.key)}
                aria-current={isActive ? "page" : undefined}
                className={cn(
                  "relative flex-1 py-3 text-sm transition-colors",
                  isActive ? "text-primary font-bold" : "text-muted font-medium"
                )}
              >
                {tab.label}
                {isActive && (
                  <span className="bg-primary absolute inset-x-3 bottom-0 h-0.5 rounded-full" />
                )}
              </button>
            )
          })}
        </nav>
      </div>

      <div className="space-y-4 px-4 pt-5">
        {activeTab === "summary" && (
          <SummaryTab
            data={data}
            companyId={companyId}
            onSeeAllJobs={() => setActiveTab("hiring")}
          />
        )}
        {activeTab === "financial" && <FinancialSection data={data.financial} />}
        {activeTab === "hiring" && <HiringSection data={data.hiring} />}
        {activeTab === "news" && <GrowthSection data={data.growth} />}
        {activeTab === "company" && (
          <>
            <OverviewSection data={data.overview} />
            <EmployeeSection data={data.employees} />
            <ReviewSection data={data.review} />
          </>
        )}
      </div>
    </div>
  )
}

function CompanyHeader({ data }: { data: CompanyReportData }) {
  const { company, overview } = data
  const profile = overview.profile
  const tags = [company.industry, profile.companyType, profile.companySize]
    .map((tag) => tag?.trim())
    .filter((tag): tag is string => Boolean(tag))
  const logoText = company.name
    .replace(/\(주\)/g, "")
    .trim()
    .slice(0, 2)

  return (
    <header className="bg-white px-5 pt-10 pb-5">
      <div className="flex items-start gap-3">
        <div className="bg-coral-light text-primary flex size-12 shrink-0 items-center justify-center rounded-full text-sm font-extrabold">
          {logoText}
        </div>
        <div className="min-w-0 flex-1">
          <div className="flex items-center gap-1">
            <h1 className="text-ink truncate text-xl font-extrabold">{company.name}</h1>
            <BadgeCheck className="text-primary size-5 shrink-0" />
          </div>
          {tags.length > 0 && (
            <div className="mt-2 flex flex-wrap gap-1.5">
              {tags.map((tag) => (
                <span
                  key={tag}
                  className="border-warm-border text-muted rounded-full border px-2.5 py-0.5 text-xs"
                >
                  {tag}
                </span>
              ))}
            </div>
          )}
        </div>
        <button type="button" aria-label="관심 기업 추가" className="shrink-0 p-1">
          <Star className="text-disabled size-5" />
        </button>
      </div>
    </header>
  )
}

function PassReadinessCard() {
  return (
    <section className="bg-coral-light rounded-2xl p-5">
      <div className="flex items-start justify-between">
        <div>
          <div className="flex items-center gap-1">
            <span className="text-ink text-sm font-bold">AI 합격 준비도</span>
            <Info className="text-disabled size-3.5" />
          </div>
          <div className="mt-2 flex items-baseline gap-1">
            <span className="text-primary text-4xl font-extrabold blur-[6px] select-none">77</span>
            <span className="text-muted text-sm font-bold">/100점</span>
          </div>
          <span className="text-primary mt-1 inline-block text-xs font-bold blur-[4px] select-none">
            상위 00%
          </span>
        </div>
        <div className="relative flex size-20 shrink-0 items-center justify-center">
          <span className="absolute inset-0 rounded-full border-[6px] border-white/70" />
          <Lock className="text-disabled size-7" />
        </div>
      </div>

      <p className="text-muted mt-4 text-xs leading-relaxed">
        이력서·자기소개서를 등록하면 나의 AI 합격 준비도를 확인할 수 있어요.
      </p>

      <Link
        href={RESUME_UPLOAD_PATH}
        className="bg-primary mt-3 flex items-center justify-center gap-1.5 rounded-2xl py-3 text-sm font-bold text-white transition-opacity hover:opacity-90"
      >
        <FileText className="size-4" />내 이력서 등록하고 합격 준비도 확인하기
      </Link>
    </section>
  )
}
function SummaryTab({
  data,
  companyId,
  onSeeAllJobs,
}: {
  data: CompanyReportData
  companyId: string
  onSeeAllJobs: () => void
}) {
  const { insight, hiring, employees, overview, review } = data
  const summaryTags = review.pros.slice(0, 4)
  const positions = hiring.openings.slice(0, 3)

  const facts = [
    {
      label: "평균 연봉",
      value: formatKrwShort(employees.avgSalary),
      sub: `${employees.year} 기준`,
    },
    { label: "신입 초봉", value: overview.profile.entrySalary || "—", sub: "" },
    {
      label: "사원수",
      value: `${employees.totalCount.toLocaleString()}명`,
      sub: `${employees.year} 기준`,
    },
    { label: "최근 채용공고", value: `${hiring.openings.length}건`, sub: "현재 모집중" },
    {
      label: "평균 근속",
      value: employees.avgTenureYears != null ? `${employees.avgTenureYears}년` : "—",
      sub: "",
    },
    { label: "기업 평점", value: `${review.overallRating.toFixed(1)}점`, sub: review.source },
  ]

  return (
    <>
      {/* AI 한줄 요약 */}
      <section className="bg-warm-bg rounded-2xl p-5">
        <div className="flex items-center gap-1.5">
          <Sparkles className="text-primary size-4" />
          <span className="text-ink text-sm font-bold">AI 한줄 요약</span>
        </div>
        <p className="text-muted mt-2 text-sm leading-relaxed">{insight.headline}</p>
        {summaryTags.length > 0 && (
          <div className="mt-3 flex flex-wrap gap-1.5">
            {summaryTags.map((tag) => (
              <span
                key={tag}
                className="text-primary rounded-full bg-white px-2.5 py-1 text-xs font-semibold"
              >
                {tag}
              </span>
            ))}
          </div>
        )}
      </section>

      {/* 현재 채용 중인 포지션 */}
      {positions.length > 0 && (
        <section>
          <div className="mb-2 flex items-center justify-between">
            <h2 className="text-ink text-sm font-bold">현재 채용 중인 포지션</h2>
            <button
              type="button"
              onClick={onSeeAllJobs}
              className="text-muted flex items-center text-xs"
            >
              전체보기
              <ChevronRight className="size-3.5" />
            </button>
          </div>
          <div className="border-warm-border divide-warm-border divide-y rounded-2xl border bg-white">
            {positions.map((posting) => (
              <PositionRow key={posting.id} posting={posting} />
            ))}
          </div>
        </section>
      )}

      {/* 액션 CTA */}
      <Link
        href={routes.interview(companyId)}
        className="bg-primary flex items-center justify-center gap-1.5 rounded-2xl py-3.5 text-sm font-bold text-white transition-opacity hover:opacity-90"
      >
        <Bot className="size-4" />
        AI 면접 시작하기
      </Link>
      <Link
        href={RESUME_UPLOAD_PATH}
        className="border-warm-border text-ink hover:bg-warm-bg flex items-center justify-center gap-1.5 rounded-2xl border bg-white py-3.5 text-sm font-bold transition-colors"
      >
        <BarChart2 className="text-primary size-4" />내 합격 가능성 분석
      </Link>

      {/* 취업 핵심 정보 */}
      <section>
        <h2 className="text-ink mb-2 text-sm font-bold">취업 핵심 정보</h2>
        <dl className="grid grid-cols-2 gap-2">
          {facts.map((fact) => (
            <div key={fact.label} className="border-warm-border rounded-2xl border bg-white p-4">
              <dt className="text-muted text-xs">{fact.label}</dt>
              <dd className="text-ink mt-1 text-lg font-extrabold">{fact.value}</dd>
              {fact.sub && <p className="text-disabled mt-0.5 text-[0.625rem]">{fact.sub}</p>}
            </div>
          ))}
        </dl>
      </section>

      {/* AI 인사이트 */}
      <InsightSection data={insight} />
    </>
  )
}

function PositionRow({ posting }: { posting: JobPosting }) {
  const { workConditions, job } = posting
  const dday = formatDday(workConditions.deadline, workConditions.deadlineType)
  const location = job.locations[0] ?? ""

  return (
    <div className="flex items-center gap-2 px-4 py-3">
      <div className="min-w-0 flex-1">
        <p className="text-ink truncate text-sm font-bold">{posting.title}</p>
        {location && <p className="text-muted mt-0.5 text-xs">{location}</p>}
      </div>
      <div className="shrink-0 text-right">
        <p className={cn("text-sm font-bold", dday.urgent ? "text-primary" : "text-muted")}>
          {dday.label}
        </p>
        {workConditions.employmentType && (
          <p className="text-disabled text-xs">{workConditions.employmentType}</p>
        )}
      </div>
    </div>
  )
}

function formatDday(
  deadline: string | null,
  deadlineType: string
): { label: string; urgent: boolean } {
  if (deadlineType === "rolling" || !deadline) return { label: "상시채용", urgent: false }
  const end = new Date(deadline)
  if (Number.isNaN(end.getTime())) return { label: "상시채용", urgent: false }
  const days = Math.ceil((end.getTime() - Date.now()) / 86_400_000)
  if (days < 0) return { label: "마감", urgent: false }
  if (days === 0) return { label: "D-day", urgent: true }
  return { label: `D-${days}`, urgent: days <= 7 }
}

const loadingSteps = ["재무 지표 분석", "최근 뉴스 읽는 중", "채용공고 정리", "면접 포인트 도출"]

function ReportLoading() {
  return (
    <div className="px-4 py-6">
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
