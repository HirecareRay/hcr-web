"use client"

import { useRef, useState } from "react"
import Link from "next/link"
import {
  Building2,
  ExternalLink,
  Sparkles,
  ThumbsUp,
  Lightbulb,
  Wrench,
  type LucideIcon,
} from "lucide-react"
import { PageTopBar } from "@/components/ui/pageTopBar"
import { cn } from "@/lib/utils"
import { useFitAnalysis } from "../hooks/useFitAnalysis"
import { useFitAnalysisById } from "../hooks/useFitAnalysisById"
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

// ── 탭: 리포트  ─────────────────────────

function ReportSection({
  title,
  items,
  icon: Icon,
  color,
}: {
  title: string
  items: string[] | null
  icon: LucideIcon
  color: string
}) {
  if (!items?.length) return null
  return (
    <div className="border-warm-border rounded-2xl border bg-white p-5 shadow-sm">
      <div className="mb-3 flex items-center gap-2">
        <Icon className={cn("h-4 w-4", color)} />
        <h3 className={cn("text-sm font-bold", color)}>{title}</h3>
        <span className="bg-coral-light text-primary ml-auto inline-flex items-center gap-1 rounded-full px-2 py-0.5 text-xs font-semibold">
          <Sparkles className="h-3 w-3" />
          AI 분석
        </span>
      </div>
      <ul className="space-y-2">
        {items.map((item, i) => (
          <li
            key={i}
            className="bg-warm-bg text-ink rounded-xl px-3 py-2.5 text-sm leading-relaxed"
          >
            {item}
          </li>
        ))}
      </ul>
    </div>
  )
}

// improvements[i]와 recommendations[i]는 백엔드에서 1:1로 대응(같은 갭을
// "왜 부족한지" → "어떻게 보완하는지"로 짝지어 생성)하므로 인덱스로 묶어 보여준다.
function ImprovementPairSection({
  improvements,
  recommendations,
}: {
  improvements: string[] | null
  recommendations: string[] | null
}) {
  const problems = improvements ?? []
  if (problems.length === 0) return null
  const methods = recommendations ?? []
  const items = problems.map((problem, i) => ({ problem, method: methods[i] ?? null }))

  return (
    <div className="border-warm-border rounded-2xl border bg-white p-5 shadow-sm">
      <div className="mb-3 flex items-center gap-2">
        <h3 className="text-ink text-sm font-bold">보완점 · 보완 방향</h3>
        <span className="bg-coral-light text-primary ml-auto inline-flex items-center gap-1 rounded-full px-2 py-0.5 text-xs font-semibold">
          <Sparkles className="h-3 w-3" />
          AI 분석
        </span>
      </div>
      <ul className="space-y-3">
        {items.map((item, i) => (
          <li key={i} className="border-warm-border rounded-xl border p-4">
            <div className="text-muted flex items-start gap-2 text-xs leading-relaxed">
              <Lightbulb className="text-info mt-0.5 h-3.5 w-3.5 shrink-0" />
              <span>{item.problem}</span>
            </div>
            {item.method && (
              <div className="text-ink bg-warm-bg mt-2 flex items-start gap-2 rounded-lg px-3 py-2.5 text-sm leading-relaxed">
                <Wrench className="text-primary mt-0.5 h-3.5 w-3.5 shrink-0" />
                <span>{item.method}</span>
              </div>
            )}
          </li>
        ))}
      </ul>
    </div>
  )
}

// ── 방사 차트 ─────────────────────────────────────────────────────────

const RADAR_ORDER = ["자격요건", "주요업무", "우대사항", "산업 및 사업 분야", "인재상 및 조직문화"]
const RADAR_SHORT: Record<string, string> = {
  "산업 및 사업 분야": "사업분야",
  "인재상 및 조직문화": "인재상·문화",
}
// 레이더 각 축이 합산하는 category_summary 원본 카테고리명.
// 자격요건 = JobTab의 자격요건 카드(QUALIFICATION_TYPES)와 동일하게 자격요건·기술·도구·경력사항 합산.
// 조직문화/인재상 = culture·talent_values를 "인재상 및 조직문화"로 합치기 전(구버전) 캐시된 분석 결과 호환용.
const RADAR_SOURCE_CATEGORIES: Record<string, string[]> = {
  자격요건: ["자격요건", "기술·도구", "경력사항"],
  "인재상 및 조직문화": ["인재상 및 조직문화", "조직문화", "인재상"],
}

function radarData(summary: CategorySummary[]) {
  return RADAR_ORDER.map((cat) => {
    const sourceCats = RADAR_SOURCE_CATEGORIES[cat] ?? [cat]
    const sources = summary.filter((s) => sourceCats.includes(s.category))
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

  // 0%인 축도 중심점에 완전히 붙어버리면 모양이 찌그러져 보이므로,
  // 가장 안쪽 그리드 링(0.25)을 바닥값으로 잡고 그 위로 스케일링한다.
  const MIN_RATIO = 0.25
  const dataPoints = data.map((d, i) => pt(i, r * (MIN_RATIO + d.value * (1 - MIN_RATIO))))
  const dataPoly = dataPoints.map((p) => `${p.x.toFixed(1)},${p.y.toFixed(1)}`).join(" ")

  // viewBox 좌우로 40씩 여유를 둔다 — 가장 긴 라벨("인재상·문화")이 왼쪽 축 위치에서
  // 텍스트 폭만큼 0 밖으로 밀려나가 잘리는 걸 막기 위함(도형 좌표는 그대로, 캔버스만 확장).
  return (
    <svg viewBox="-40 0 410 240" className="w-full">
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
      <ReportSection title="강점" items={analysis.strengths} icon={ThumbsUp} color="text-success" />
      <ImprovementPairSection
        improvements={analysis.improvements}
        recommendations={analysis.recommendations}
      />
    </div>
  )
}

// ── 세그먼트 탭 (인터뷰 결과 리포트와 동일한 스타일: 고정 탭 + 본문 즉시 전환) ───

type TabKey = "job" | "company" | "report"

function SegmentTabs({
  tabs,
  active,
  onChange,
}: {
  tabs: { key: TabKey; label: string; badge: string }[]
  active: TabKey
  onChange: (key: TabKey) => void
}) {
  return (
    <div className="bg-warm-bg flex gap-1 rounded-xl p-1">
      {tabs.map((tab) => {
        const isActive = tab.key === active
        return (
          <button
            key={tab.key}
            type="button"
            onClick={() => onChange(tab.key)}
            aria-pressed={isActive}
            className={cn(
              "flex flex-1 flex-col items-center rounded-lg py-2 text-sm font-medium transition-colors",
              isActive ? "text-ink bg-white shadow-sm" : "text-muted"
            )}
          >
            {tab.label}
            {tab.badge && <span className="text-xs">{tab.badge}</span>}
          </button>
        )
      })}
    </div>
  )
}

// ── 결과 ──────────────────────────────────────────────────────────────

function Result({
  analysis,
  jobId,
  companyId,
  isHistorical,
}: {
  analysis: FitAnalysis
  jobId: string
  companyId: string
  isHistorical?: boolean
}) {
  const [activeTab, setActiveTab] = useState<TabKey>("job")
  const tabBarRef = useRef<HTMLDivElement>(null)
  const contentRef = useRef<HTMLDivElement>(null)

  // 탭을 누르면 그 내용이 sticky 탭바 바로 아래 오도록 스크롤한다. 클릭 핸들러에서
  // 직접 호출해야 이미 활성화된 탭을 다시 눌러도(activeTab 값이 안 바뀌어도) 매번
  // 스크롤이 동작한다 — activeTab을 의존성으로 둔 useEffect는 값이 그대로면 실행되지 않음.
  // 이 앱은 window가 아니라 appShell의 <main overflow-y-auto>가 스크롤 컨테이너라
  // scrollIntoView를 써야 한다(중첩 스크롤 컨테이너를 알아서 찾아줌).
  function handleTabChange(key: TabKey) {
    setActiveTab(key)
    if (!contentRef.current) return
    contentRef.current.style.scrollMarginTop = `${tabBarRef.current?.offsetHeight ?? 0}px`
    contentRef.current.scrollIntoView({ behavior: "smooth", block: "start" })
  }

  const jobTotal = analysis.jobMatches.length
  const jobMatched = analysis.jobMatches.filter((m) => m.matched).length
  const compTotal = analysis.companyMatches.length
  const compMatched = analysis.companyMatches.filter((m) => m.matched).length
  const overallTotal = analysis.categorySummary.reduce((sum, s) => sum + s.total, 0)
  const overallMatched = analysis.categorySummary.reduce((sum, s) => sum + s.matched, 0)
  const overallPct = overallTotal > 0 ? Math.round((overallMatched / overallTotal) * 100) : 0

  const tabs = [
    {
      key: "job" as TabKey,
      label: "직무",
      badge: jobTotal > 0 ? `${jobMatched}/${jobTotal} 충족` : "",
    },
    {
      key: "company" as TabKey,
      label: "기업",
      badge: compTotal > 0 ? `${compMatched}/${compTotal} 충족` : "",
    },
    { key: "report" as TabKey, label: "리포트", badge: "" },
  ]

  return (
    <div className="px-4 py-6">
      {isHistorical && (
        <div className="border-warm-border mb-3 flex items-center justify-between rounded-2xl border bg-white px-4 py-3">
          <p className="text-muted text-xs">지난 분석 결과입니다</p>
          <Link
            href={`/jobs/${jobId}/fit?companyId=${companyId}`}
            className="text-primary text-xs font-semibold"
          >
            다시 분석하기
          </Link>
        </div>
      )}
      <div className="border-warm-border mb-3 rounded-2xl border bg-white px-4 py-3.5 sm:flex sm:items-center sm:gap-2 sm:py-3">
        <div className="flex min-w-0 items-center gap-1.5 sm:max-w-[45%] sm:shrink-0">
          <Building2 className="text-primary size-4 shrink-0" />
          <p className="text-ink min-w-0 truncate text-sm font-bold">
            {analysis.companyName ?? "내 서류 적합도 분석"}
          </p>
        </div>
        {analysis.jobTitle && (
          <>
            <span className="text-disabled hidden shrink-0 sm:inline">·</span>
            <p className="text-muted mt-1 min-w-0 pl-5.5 text-xs leading-relaxed break-keep sm:mt-0 sm:flex-1 sm:truncate sm:pl-0 sm:text-sm">
              {analysis.jobTitle}
            </p>
          </>
        )}
        {analysis.jobNames.length > 0 && (
          <div className="mt-1.5 flex flex-wrap gap-1 pl-5.5 sm:mt-0 sm:shrink-0 sm:flex-nowrap sm:pl-0">
            {analysis.jobNames.map((name) => (
              <span
                key={name}
                className="bg-warm-bg text-muted shrink-0 rounded-md px-1.5 py-0.5 text-[0.6875rem] font-medium"
              >
                {name}
              </span>
            ))}
          </div>
        )}
      </div>

      {/* 히어로: 종합 매칭률 + AI 총평 + 직무/기업 미니 스코어 */}
      <section className="from-coral-deep to-coral-beam overflow-hidden rounded-2xl bg-gradient-to-br p-5 text-white shadow-sm">
        <div className="flex items-center gap-1.5 text-xs font-semibold text-white/90">
          <Sparkles className="h-3.5 w-3.5" />
          AI 서류 적합도 분석
        </div>
        <div className="mt-3 flex items-end gap-2">
          <span className="text-4xl leading-none font-extrabold">{overallPct}%</span>
          <span className="text-lg font-semibold text-white/80">일치</span>
        </div>
        <p className="mt-3 text-sm leading-relaxed text-white/95">{analysis.overallSummary}</p>
        <div className="mt-4 grid grid-cols-2 gap-2">
          <div className="rounded-xl bg-white/15 px-3 py-2.5 text-center">
            <p className="text-xs font-medium text-white/80">직무 적합도</p>
            <p className="mt-0.5 text-lg font-bold">
              {jobTotal > 0 ? `${jobMatched}/${jobTotal}` : "-"}
            </p>
          </div>
          <div className="rounded-xl bg-white/15 px-3 py-2.5 text-center">
            <p className="text-xs font-medium text-white/80">기업 적합도</p>
            <p className="mt-0.5 text-lg font-bold">
              {compTotal > 0 ? `${compMatched}/${compTotal}` : "-"}
            </p>
          </div>
        </div>
      </section>

      {/* 영역별 레이더 */}
      <div className="border-warm-border mt-4 rounded-3xl border bg-white p-4 sm:p-6">
        <div className="mx-auto w-full max-w-80 sm:max-w-xl md:max-w-2xl">
          <RadarChart summary={analysis.categorySummary} />
        </div>
      </div>

      {/* 스크롤해도 탭이 상단에 고정 */}
      <div
        ref={tabBarRef}
        className="bg-background sticky top-0 z-10 -mx-4 mt-4 mb-4 px-4 pt-1 pb-3"
      >
        <SegmentTabs tabs={tabs} active={activeTab} onChange={handleTabChange} />
      </div>

      <div ref={contentRef} className="space-y-4">
        {activeTab === "job" && <JobTab jobMatches={analysis.jobMatches} />}
        {activeTab === "company" && <CompanyTab companyMatches={analysis.companyMatches} />}
        {activeTab === "report" && <ReportTab analysis={analysis} />}
      </div>

      {/* 후속 행동 — 채용공고(원본 링크) / 기업리포트로 */}
      <div className="mt-6 grid grid-cols-2 gap-2">
        {analysis.jobUrl ? (
          <a
            href={analysis.jobUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="from-coral-deep to-coral-beam flex items-center justify-center gap-2 rounded-2xl bg-gradient-to-br px-4 py-3.5 text-sm font-bold text-white shadow-sm transition-opacity hover:opacity-90"
          >
            <ExternalLink className="h-4 w-4" />
            채용공고 보기
          </a>
        ) : (
          <Link
            href={`/jobs/${jobId}`}
            className="from-coral-deep to-coral-beam flex items-center justify-center gap-2 rounded-2xl bg-gradient-to-br px-4 py-3.5 text-sm font-bold text-white shadow-sm transition-opacity hover:opacity-90"
          >
            <ExternalLink className="h-4 w-4" />
            채용공고 보기
          </Link>
        )}
        <Link
          href={`/company/${companyId}`}
          className="border-warm-border text-ink flex items-center justify-center gap-2 rounded-2xl border bg-white px-4 py-3.5 text-sm font-bold shadow-sm transition-opacity hover:opacity-90"
        >
          <Building2 className="h-4 w-4" />
          기업리포트 보기
        </Link>
      </div>
    </div>
  )
}

// ── 페이지 진입점 ─────────────────────────────────────────────────────

export function FitAnalysisPage({
  jobId,
  companyId,
  analysisId,
}: {
  jobId: string
  companyId: string
  analysisId?: string
}) {
  const byId = useFitAnalysisById(analysisId ?? "")
  const fresh = useFitAnalysis(companyId, jobId, !analysisId)
  const { data, isLoading, isError } = analysisId ? byId : fresh

  return (
    <section className="bg-background min-h-full">
      <PageTopBar title="서류 적합도 분석" />

      {isLoading &&
        (analysisId ? (
          <div className="flex flex-col items-center justify-center gap-3 px-4 pt-24 text-center">
            <div className="border-primary size-8 animate-spin rounded-full border-2 border-t-transparent" />
            <p className="text-muted text-sm">불러오는 중...</p>
          </div>
        ) : (
          <div className="flex flex-col items-center justify-center gap-3 px-4 pt-24 text-center">
            <div className="border-primary size-8 animate-spin rounded-full border-2 border-t-transparent" />
            <p className="text-muted text-sm">서류를 분석 중입니다</p>
            <p className="text-muted text-xs">1~2분 소요됩니다</p>
          </div>
        ))}

      {isError &&
        (analysisId ? (
          <div className="flex flex-col items-center justify-center px-4 pt-24 text-center">
            <p className="text-ink text-sm font-bold">분석 기록을 찾을 수 없습니다</p>
            <Link
              href={`/jobs/${jobId}/fit?companyId=${companyId}`}
              className="text-primary mt-4 text-sm font-semibold"
            >
              새로 분석하기
            </Link>
          </div>
        ) : (
          <div className="flex flex-col items-center justify-center px-4 pt-24 text-center">
            <p className="text-ink text-sm font-bold">분석에 실패했습니다</p>
            <p className="text-muted mt-1 text-xs">이력서가 등록되어 있는지 확인해 주세요</p>
            <Link href="/mypage/documents" className="text-primary mt-4 text-sm font-semibold">
              서류 등록하러 가기
            </Link>
          </div>
        ))}

      {data && (
        <Result analysis={data} jobId={jobId} companyId={companyId} isHistorical={!!analysisId} />
      )}
    </section>
  )
}
