"use client"

import { useState } from "react"
import Link from "next/link"
import { ChevronLeft, Building2, ExternalLink } from "lucide-react"
import { cn } from "@/lib/utils"
import { useFitAnalysis } from "../hooks/useFitAnalysis"
import type { FitAnalysis, JobMatch, CompanyMatch, CategorySummary } from "../types/analysis"

// ── 자격요건 카드: required·career·tech_tool을 하위 구분 없이 병합 ───

const QUALIFICATION_TYPES = ["required", "tech_tool", "career"]

const COMPANY_SUBS = [
  { key: "industry_domain", label: "산업 및 사업 분야", emptyMsg: undefined },
  {
    key: "culture",
    label: "조직문화",
    emptyMsg: "기업의 조직문화에 대한 공개 정보가 충분하지 않아 평가가 어렵습니다.",
  },
  {
    key: "talent_values",
    label: "인재상",
    emptyMsg: "기업의 인재상 정보가 게시되어 있지 않아 평가가 어렵습니다.",
  },
] as const

// ── 매칭 아이템 ───────────────────────────────────────────────────────

type MatchItemData = {
  text: string
  matched: boolean
  sourceText: string | null
  excerpt: string | null
  sourceLabel: string
  reasoning: string | null
}

function MatchItem({ text, matched, sourceText, sourceLabel, excerpt, reasoning }: MatchItemData) {
  return (
    <div
      className={cn(
        "rounded-xl border-l-[3px] px-3 py-2.5",
        matched ? "border-success" : "border-error"
      )}
    >
      <p className="text-ink text-sm leading-snug">{text}</p>
      {sourceText && (
        <p className="text-muted border-warm-border mt-1.5 border-l pl-2 text-xs leading-relaxed italic">
          {sourceLabel}: "{sourceText}"
        </p>
      )}
      {matched && excerpt && (
        <p className="text-muted mt-1.5 text-xs leading-relaxed italic">"{excerpt}"</p>
      )}
      {reasoning && <p className="text-disabled mt-1 text-xs leading-relaxed">{reasoning}</p>}
    </div>
  )
}

function jobToItemData(m: JobMatch): MatchItemData {
  return {
    text: m.matchTargetText,
    matched: m.matched,
    sourceText: m.matchTargetEvidence ?? null,
    sourceLabel: "공고",
    excerpt: m.candidateEvidence?.excerpt ?? null,
    reasoning: m.reasoning,
  }
}

function companyToItemData(m: CompanyMatch): MatchItemData {
  return {
    text: m.criterionText,
    matched: m.matched,
    sourceText: m.criterionEvidence ?? null,
    sourceLabel: "기업 리포트",
    excerpt: m.candidateEvidence?.excerpt ?? null,
    reasoning: m.reasoning,
  }
}

// ── 자격요건 통합 카드 (required · career · education · tech_tool) ───

function QualificationCard({ jobMatches }: { jobMatches: JobMatch[] }) {
  const items = jobMatches
    .filter((m) => QUALIFICATION_TYPES.includes(m.matchTargetType))
    .map(jobToItemData)
    .filter((item) => !!item.text?.trim())
    .sort((a, b) => Number(b.matched) - Number(a.matched))

  const total = items.length
  const matched = items.filter((i) => i.matched).length

  return (
    <div className="border-warm-border rounded-3xl border bg-white p-4">
      <div className="mb-4 flex items-center gap-2">
        <span className="text-ink text-xs font-bold">자격요건</span>
        <span className="bg-coral-light text-primary rounded-full px-2 py-0.5 text-[0.625rem] font-bold">
          필수
        </span>
        {total > 0 &&
          (matched === total ? (
            <span className="text-success ml-auto text-xs font-semibold">전부 충족 ✓</span>
          ) : (
            <span className="text-muted ml-auto text-xs">
              {matched}/{total} 충족
            </span>
          ))}
      </div>
      {items.length > 0 ? (
        <div className="flex flex-col gap-2">
          {items.map((item, i) => (
            <MatchItem key={i} {...item} />
          ))}
        </div>
      ) : (
        <p className="text-disabled text-xs">채용공고에 별도 자격요건이 명시되지 않았습니다.</p>
      )}
    </div>
  )
}

// ── 일반 카테고리 그룹 카드 ───────────────────────────────────────────

function MatchGroup({
  label,
  items,
  emptyMessage,
}: {
  label: string
  items: MatchItemData[]
  emptyMessage?: string
}) {
  const matchedCount = items.filter((i) => i.matched).length
  const sorted = [...items].sort((a, b) => Number(b.matched) - Number(a.matched))

  return (
    <div className="border-warm-border rounded-3xl border bg-white p-4">
      <div className="mb-3 flex items-center gap-2">
        <span className="text-muted text-xs font-bold">{label}</span>
        {items.length > 0 &&
          (matchedCount === items.length ? (
            <span className="text-success ml-auto text-xs font-semibold">전부 충족 ✓</span>
          ) : (
            <span className="text-muted ml-auto text-xs">
              {matchedCount}/{items.length} 충족
            </span>
          ))}
      </div>
      {items.length === 0 ? (
        emptyMessage && <p className="text-disabled text-xs leading-relaxed">{emptyMessage}</p>
      ) : (
        <div className="flex flex-col gap-2">
          {sorted.map((item, i) => (
            <MatchItem key={i} {...item} />
          ))}
        </div>
      )}
    </div>
  )
}

// ── 탭: 직무 적합도 ───────────────────────────────────────────────────

function JobTab({ jobMatches }: { jobMatches: JobMatch[] }) {
  const responsibility = jobMatches
    .filter((m) => m.matchTargetType === "responsibility")
    .map(jobToItemData)
    .filter((i) => !!i.text?.trim())
  const education = jobMatches
    .filter((m) => m.matchTargetType === "education")
    .map(jobToItemData)
    .filter((i) => !!i.text?.trim())
  const preferred = jobMatches
    .filter((m) => m.matchTargetType === "preferred")
    .map(jobToItemData)
    .filter((i) => !!i.text?.trim())

  return (
    <div className="flex flex-col gap-3">
      <QualificationCard jobMatches={jobMatches} />
      <div className="flex flex-col gap-3">
        <MatchGroup
          label="학력사항"
          items={education}
          emptyMessage="채용공고에 학력 요건이 명시되지 않았습니다."
        />
        <MatchGroup
          label="주요업무"
          items={responsibility}
          emptyMessage="채용공고에 주요업무가 명시되지 않았습니다."
        />
        <MatchGroup
          label="우대사항"
          items={preferred}
          emptyMessage="채용공고에 우대사항이 없습니다."
        />
      </div>
    </div>
  )
}

// ── 탭: 기업 적합도 ───────────────────────────────────────────────────

function CompanyTab({ companyMatches }: { companyMatches: CompanyMatch[] }) {
  const grouped = Object.fromEntries(
    COMPANY_SUBS.map(({ key }) => [
      key,
      companyMatches
        .filter((m) => m.dimension === key)
        .map(companyToItemData)
        .filter((item) => !!item.text?.trim()),
    ])
  )
  return (
    <div className="flex flex-col gap-3">
      <MatchGroup
        label="산업 및 사업 분야"
        items={grouped.industry_domain}
        emptyMessage={COMPANY_SUBS[0].emptyMsg}
      />
      <div className="flex flex-col gap-3">
        <MatchGroup
          label="조직문화"
          items={grouped.culture}
          emptyMessage={COMPANY_SUBS[1].emptyMsg}
        />
        <MatchGroup
          label="인재상"
          items={grouped.talent_values}
          emptyMessage={COMPANY_SUBS[2].emptyMsg}
        />
      </div>
    </div>
  )
}

// ── 탭: 리포트 ────────────────────────────────────────────────────────

function ReportSection({
  title,
  items,
  numBg,
}: {
  title: string
  items: string[] | null
  numBg: string
}) {
  if (!items?.length) return null
  return (
    <div className="border-warm-border rounded-3xl border bg-white p-4">
      <h3 className="text-ink mb-3 text-sm font-bold">{title}</h3>
      <div className="flex flex-col gap-3">
        {items.map((item, i) => (
          <div key={i} className="flex items-start gap-3">
            <span
              className={cn(
                "flex size-5 shrink-0 items-center justify-center rounded-full text-[0.625rem] font-bold text-white",
                numBg
              )}
            >
              {i + 1}
            </span>
            <p className="text-muted text-sm leading-relaxed">{item}</p>
          </div>
        ))}
      </div>
    </div>
  )
}

// ── 방사 차트 ─────────────────────────────────────────────────────────

const RADAR_ORDER = [
  "자격요건",
  "경력사항",
  "학력사항",
  "주요업무",
  "우대사항",
  "산업 및 사업 분야",
  "조직문화",
  "인재상",
]
const RADAR_SHORT: Record<string, string> = { "산업 및 사업 분야": "사업분야" }

function RadarChart({ summary }: { summary: CategorySummary[] }) {
  const data = RADAR_ORDER.map((cat) => summary.find((s) => s.category === cat))
    .filter((s): s is CategorySummary => !!s && s.total > 0)
    .map((s) => ({ label: RADAR_SHORT[s.category] ?? s.category, value: s.matched / s.total }))

  if (data.length < 3) return null

  const n = data.length
  const cx = 165,
    cy = 120,
    r = 80
  const angle = (i: number) => (i / n) * 2 * Math.PI - Math.PI / 2
  const pt = (i: number, dist: number) => ({
    x: cx + dist * Math.cos(angle(i)),
    y: cy + dist * Math.sin(angle(i)),
  })
  const gridPoly = (dist: number) =>
    Array.from({ length: n }, (_, i) => pt(i, dist))
      .map((p) => `${p.x.toFixed(1)},${p.y.toFixed(1)}`)
      .join(" ")

  const dataPoints = data.map((d, i) => pt(i, r * d.value))
  const dataPoly = dataPoints.map((p) => `${p.x.toFixed(1)},${p.y.toFixed(1)}`).join(" ")

  return (
    <svg viewBox="0 0 330 240" className="w-full">
      {[0.25, 0.5, 0.75, 1].map((l) => (
        <polygon key={l} points={gridPoly(r * l)} fill="none" stroke="#f1d8cf" strokeWidth="1" />
      ))}
      {Array.from({ length: n }, (_, i) => {
        const p = pt(i, r)
        return (
          <line
            key={i}
            x1={cx}
            y1={cy}
            x2={p.x.toFixed(1)}
            y2={p.y.toFixed(1)}
            stroke="#f1d8cf"
            strokeWidth="1"
          />
        )
      })}
      <polygon
        points={dataPoly}
        fill="#ff6b57"
        fillOpacity="0.15"
        stroke="#ff6b57"
        strokeWidth="2"
      />
      {dataPoints.map((p, i) => (
        <circle key={i} cx={p.x.toFixed(1)} cy={p.y.toFixed(1)} r="3" fill="#ff6b57" />
      ))}
      {data.map((d, i) => {
        const a = angle(i)
        const cos = Math.cos(a),
          sin = Math.sin(a)
        const lx = cx + (r + 18) * cos
        const ly = cy + (r + 18) * sin
        return (
          <text
            key={i}
            x={lx.toFixed(1)}
            y={ly.toFixed(1)}
            textAnchor={cos > 0.2 ? "start" : cos < -0.2 ? "end" : "middle"}
            dominantBaseline={sin < -0.2 ? "auto" : sin > 0.2 ? "hanging" : "middle"}
            fontSize="15"
            fill="#666666"
          >
            {d.label}
          </text>
        )
      })}
    </svg>
  )
}

function ReportTab({ analysis }: { analysis: FitAnalysis }) {
  return (
    <div className="flex flex-col gap-3">
      <ReportSection title="강점" items={analysis.strengths} numBg="bg-success" />
      <div className="flex flex-col gap-3">
        <ReportSection title="보완점" items={analysis.improvements} numBg="bg-error" />
        <ReportSection title="개선 방향" items={analysis.recommendations} numBg="bg-primary" />
      </div>
    </div>
  )
}

// ── 탭 바 + 결과 ──────────────────────────────────────────────────────

type TabKey = "job" | "company" | "report"

function tabBadge(matched: number, total: number) {
  if (total === 0) return ""
  return matched === total ? " ✓" : ` ${matched}/${total}`
}

function Result({ analysis }: { analysis: FitAnalysis }) {
  const [active, setActive] = useState<TabKey>("job")

  const jobMatched = analysis.jobMatches.filter((m) => m.matched).length
  const compMatched = analysis.companyMatches.filter((m) => m.matched).length

  const TABS = [
    { key: "job" as TabKey, label: `직무${tabBadge(jobMatched, analysis.jobMatches.length)}` },
    {
      key: "company" as TabKey,
      label: `기업${tabBadge(compMatched, analysis.companyMatches.length)}`,
    },
    { key: "report" as TabKey, label: "리포트" },
  ]

  return (
    <div>
      {/* ── 방사 차트 + 종합 요약: 이 블록 전체를 주석 처리하면 차트·요약 제거 ── */}
      <div className="px-4 pt-4 sm:px-6">
        <div className="border-warm-border rounded-3xl border bg-white p-4">
          <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:gap-5">
            <div className="mx-auto w-full max-w-[14rem] shrink-0 sm:mx-0 sm:w-[14rem]">
              <RadarChart summary={analysis.categorySummary} />
            </div>
            <p className="text-ink text-sm leading-relaxed font-semibold">
              {analysis.overallSummary}
            </p>
          </div>
        </div>
      </div>
      {/* ── /방사 차트 + 종합 요약 ── */}

      <div className="bg-background border-warm-border sticky top-0 z-10 mt-4 border-b">
        <div className="flex px-4 sm:px-6">
          {TABS.map((tab) => (
            <button
              key={tab.key}
              type="button"
              onClick={() => setActive(tab.key)}
              className={cn(
                "flex-1 py-3 text-sm font-semibold transition-colors",
                active === tab.key ? "border-primary text-primary border-b-2" : "text-muted"
              )}
            >
              {tab.label}
            </button>
          ))}
        </div>
      </div>

      <div className="px-4 pt-4 pb-10 sm:px-6">
        {active === "job" && <JobTab jobMatches={analysis.jobMatches} />}
        {active === "company" && <CompanyTab companyMatches={analysis.companyMatches} />}
        {active === "report" && <ReportTab analysis={analysis} />}
      </div>
    </div>
  )
}

// ── 페이지 진입점 ─────────────────────────────────────────────────────

export function FitAnalysisPage({ jobId, companyId }: { jobId: string; companyId: string }) {
  const { data, isLoading, isError } = useFitAnalysis(companyId, jobId)

  return (
    <section className="bg-background min-h-full">
      <header className="border-warm-border border-b bg-white">
        <div className="px-4 py-3 sm:px-6">
          <div className="flex items-center gap-2">
            <Link href={`/jobs/${jobId}`} aria-label="뒤로가기" className="shrink-0">
              <ChevronLeft className="text-muted size-5" />
            </Link>
            <div className="min-w-0 flex-1">
              <h1 className="text-ink truncate text-sm font-bold sm:text-base">
                {data?.companyName ?? "내 서류 적합도 분석"}
              </h1>
            </div>
            <div className="flex shrink-0 items-center gap-1">
              <Link
                href={`/jobs/${jobId}`}
                className="text-muted hover:text-ink flex items-center gap-1 rounded-lg px-2 py-1.5 text-xs transition-colors hover:bg-gray-50"
              >
                <ExternalLink className="size-3.5" />
                <span className="hidden sm:inline">채용공고</span>
              </Link>
              <Link
                href={`/company/${companyId}`}
                className="text-muted hover:text-ink flex items-center gap-1 rounded-lg px-2 py-1.5 text-xs transition-colors hover:bg-gray-50"
              >
                <Building2 className="size-3.5" />
                <span className="hidden sm:inline">기업리포트</span>
              </Link>
            </div>
          </div>

          {(data?.jobTitle || (data?.jobNames?.length ?? 0) > 0) && (
            <div className="mt-1.5 pl-7">
              {data?.jobTitle && (
                <p className="text-muted truncate text-xs sm:text-sm">{data.jobTitle}</p>
              )}
              {data?.jobNames && data.jobNames.length > 0 && (
                <div className="mt-1 flex flex-wrap gap-1">
                  {data.jobNames.map((name) => (
                    <span
                      key={name}
                      className="bg-coral-light text-primary rounded-full px-2 py-0.5 text-[0.625rem] font-medium"
                    >
                      {name}
                    </span>
                  ))}
                </div>
              )}
            </div>
          )}
        </div>
      </header>

      {isLoading && (
        <div className="flex flex-col items-center justify-center gap-3 px-4 pt-24 text-center">
          <div className="border-primary size-8 animate-spin rounded-full border-2 border-t-transparent" />
          <p className="text-muted text-sm">서류를 분석 중입니다</p>
          <p className="text-muted text-xs">1~2분 소요됩니다</p>
        </div>
      )}

      {isError && (
        <div className="flex flex-col items-center justify-center px-4 pt-24 text-center">
          <p className="text-ink text-sm font-bold">분석에 실패했습니다</p>
          <p className="text-muted mt-1 text-xs">이력서가 등록되어 있는지 확인해 주세요</p>
          <Link href="/mypage/documents" className="text-primary mt-4 text-sm font-semibold">
            서류 등록하러 가기
          </Link>
        </div>
      )}

      {data && <Result analysis={data} />}
    </section>
  )
}
