"use client"

import { useEffect, useState } from "react"
import Link from "next/link"
import { ChevronLeft, Building2, ExternalLink, X } from "lucide-react"
import { cn } from "@/lib/utils"
import { useFitAnalysis } from "../hooks/useFitAnalysis"
import type { FitAnalysis, JobMatch, CompanyMatch, CategorySummary } from "../types/analysis"

// ── 자격요건 카드: required·career·tech_tool을 하위 구분 없이 병합 ───

const QUALIFICATION_TYPES = ["required", "tech_tool", "career"]

const COMPANY_GROUPS = [
  { label: "산업 및 사업 분야", dims: ["industry_domain"], emptyMsg: undefined },
  {
    label: "인재상 및 조직문화",
    dims: ["culture", "talent_values"],
    emptyMsg: "기업의 인재상·조직문화에 대한 공개 정보가 충분하지 않아 평가가 어렵습니다.",
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
          {`${sourceLabel}: "${sourceText}"`}
        </p>
      )}
      {matched && excerpt && (
        <p className="text-muted mt-1.5 text-xs leading-relaxed italic">{`"${excerpt}"`}</p>
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
  return (
    <div className="flex flex-col gap-3">
      {COMPANY_GROUPS.map((group) => {
        const dims: readonly string[] = group.dims
        const items = companyMatches
          .filter((m) => dims.includes(m.dimension))
          .map(companyToItemData)
          .filter((item) => !!item.text?.trim())
        return (
          <MatchGroup
            key={group.label}
            label={group.label}
            items={items}
            emptyMessage={group.emptyMsg}
          />
        )
      })}
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

// 자격요건 포인트 = JobTab의 자격요건 카드(QUALIFICATION_TYPES)와 동일하게
// 자격요건·기술·도구·경력사항 3개 카테고리를 합산
const QUALIFICATION_CATEGORIES = ["자격요건", "기술·도구", "경력사항"]
const RADAR_ORDER = ["자격요건", "주요업무", "우대사항", "산업 및 사업 분야", "인재상 및 조직문화"]
const RADAR_SHORT: Record<string, string> = {
  "산업 및 사업 분야": "사업분야",
  "인재상 및 조직문화": "인재상·문화",
}

function radarData(summary: CategorySummary[]) {
  return RADAR_ORDER.map((cat) => {
    const sources =
      cat === "자격요건"
        ? summary.filter((s) => QUALIFICATION_CATEGORIES.includes(s.category))
        : summary.filter((s) => s.category === cat)
    const total = sources.reduce((sum, s) => sum + s.total, 0)
    const matched = sources.reduce((sum, s) => sum + s.matched, 0)
    return total > 0 ? { label: RADAR_SHORT[cat] ?? cat, value: matched / total } : null
  }).filter((d): d is { label: string; value: number } => !!d)
}

function RadarChart({ summary }: { summary: CategorySummary[] }) {
  const data = radarData(summary)

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

// ── 상세 모달 ─────────────────────────────────────────────────────────

function DetailModal({
  title,
  onClose,
  children,
}: {
  title: string
  onClose: () => void
  children: React.ReactNode
}) {
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && onClose()
    document.addEventListener("keydown", onKey)
    document.body.style.overflow = "hidden"
    return () => {
      document.removeEventListener("keydown", onKey)
      document.body.style.overflow = ""
    }
  }, [onClose])

  return (
    <div className="fixed inset-0 z-50 flex items-end justify-center sm:items-center">
      <div className="absolute inset-0 bg-black/40" onClick={onClose} aria-hidden />
      <div
        role="dialog"
        aria-modal="true"
        aria-label={title}
        className="border-warm-border relative flex max-h-[85svh] w-full flex-col rounded-t-3xl border bg-white sm:max-h-[90svh] sm:min-h-[60svh] sm:w-full sm:max-w-2xl sm:rounded-3xl"
      >
        <div className="border-warm-border flex shrink-0 items-center justify-between border-b px-4 py-3">
          <h2 className="text-ink text-sm font-bold">{title}</h2>
          <button
            type="button"
            onClick={onClose}
            aria-label="닫기"
            className="text-muted hover:text-ink"
          >
            <X className="size-5" />
          </button>
        </div>
        <div className="overflow-y-auto px-4 py-4">{children}</div>
      </div>
    </div>
  )
}

// ── 탭 바 (클릭 시 모달로 상세 표시) ──────────────────────────────────
// 모바일: 라벨 + 배지만(공간 협소). sm 이상: 미리보기 한 줄 추가(남는 폭 활용).

function TabBar({
  tabs,
  onSelect,
}: {
  tabs: { key: TabKey; label: string; badge: string; preview: string }[]
  onSelect: (key: TabKey) => void
}) {
  return (
    <div className="border-warm-border flex overflow-hidden rounded-3xl border bg-white">
      {tabs.map((tab, i) => (
        <button
          key={tab.key}
          type="button"
          onClick={() => onSelect(tab.key)}
          className={cn(
            "hover:bg-warm-bg flex flex-1 flex-col items-center gap-1 px-2 py-4 text-center transition-colors sm:py-5",
            i > 0 && "border-warm-border border-l"
          )}
        >
          <span className="text-ink text-sm font-bold sm:text-base">{tab.label}</span>
          {tab.badge && <span className="text-muted text-xs">{tab.badge}</span>}
          {tab.preview && (
            <span className="text-disabled mt-1 hidden max-w-full truncate text-xs sm:block">
              {tab.preview}
            </span>
          )}
        </button>
      ))}
    </div>
  )
}

// ── 결과 ──────────────────────────────────────────────────────────────

type TabKey = "job" | "company" | "report"

const MODAL_TITLE: Record<TabKey, string> = {
  job: "직무 적합도",
  company: "기업 적합도",
  report: "리포트",
}

function Result({ analysis }: { analysis: FitAnalysis }) {
  const [openTab, setOpenTab] = useState<TabKey | null>(null)

  const jobTotal = analysis.jobMatches.length
  const jobMatched = analysis.jobMatches.filter((m) => m.matched).length
  const compTotal = analysis.companyMatches.length
  const compMatched = analysis.companyMatches.filter((m) => m.matched).length

  const tabs = [
    {
      key: "job" as TabKey,
      label: "직무",
      badge: jobTotal > 0 ? `${jobMatched}/${jobTotal} 충족` : "",
      preview: "자격요건 · 주요업무 · 우대사항",
    },
    {
      key: "company" as TabKey,
      label: "기업",
      badge: compTotal > 0 ? `${compMatched}/${compTotal} 충족` : "",
      preview: "산업 및 사업 분야 · 인재상 및 조직문화",
    },
    {
      key: "report" as TabKey,
      label: "리포트",
      badge: "",
      preview: `강점 ${analysis.strengths?.length ?? 0} · 보완 ${analysis.improvements?.length ?? 0} · 개선 방향 ${analysis.recommendations?.length ?? 0}`,
    },
  ]

  return (
    <div className="flex flex-col gap-3 px-4 pt-4 pb-10 sm:px-6">
      <div className="border-warm-border rounded-3xl border bg-white p-4 sm:p-6">
        <div className="flex flex-col items-center gap-4 sm:gap-6">
          <div className="mx-auto w-full max-w-80 sm:max-w-xl md:max-w-2xl">
            <RadarChart summary={analysis.categorySummary} />
          </div>
          <p className="text-ink w-full text-sm leading-relaxed font-semibold sm:text-base">
            {analysis.overallSummary}
          </p>
        </div>
      </div>

      <TabBar tabs={tabs} onSelect={setOpenTab} />

      {openTab && (
        <DetailModal title={MODAL_TITLE[openTab]} onClose={() => setOpenTab(null)}>
          {openTab === "job" && <JobTab jobMatches={analysis.jobMatches} />}
          {openTab === "company" && <CompanyTab companyMatches={analysis.companyMatches} />}
          {openTab === "report" && <ReportTab analysis={analysis} />}
        </DetailModal>
      )}
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
