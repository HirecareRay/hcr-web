"use client"

import Link from "next/link"
import { ChevronLeft } from "lucide-react"
import { cn } from "@/lib/utils"
import { useFitAnalysis } from "../hooks/useFitAnalysis"
import type { FitAnalysis } from "../types/analysis"

function FitGauge({ strengths, gaps }: { strengths: string[]; gaps: string[] }) {
  const total = strengths.length + gaps.length
  const ratio = total === 0 ? 0.5 : strengths.length / total
  const pct = Math.round(ratio * 100)

  const color =
    ratio >= 0.7
      ? "from-emerald-400 to-emerald-500"
      : ratio >= 0.4
        ? "from-amber-400 to-orange-400"
        : "from-rose-400 to-rose-500"

  return (
    <div className="flex flex-col items-center gap-2 py-4">
      <div className="text-ink text-4xl font-extrabold">{pct}%</div>
      <p className="text-muted text-xs">
        강점 {strengths.length}개 · 약점 {gaps.length}개 기준
      </p>
      <div className="bg-warm-bg h-2.5 w-full max-w-xs overflow-hidden rounded-full">
        <div
          className={cn("h-full rounded-full bg-gradient-to-r transition-all", color)}
          style={{ width: `${pct}%` }}
        />
      </div>
    </div>
  )
}

function DimensionList({ analysis }: { analysis: FitAnalysis }) {
  return (
    <div className="flex flex-col gap-2">
      {analysis.dimensions.map((d) => (
        <div
          key={d.label}
          className="border-warm-border flex items-start gap-3 rounded-2xl border bg-white p-3"
        >
          <span
            className={cn(
              "mt-0.5 size-2.5 shrink-0 rounded-full",
              d.isStrength ? "bg-emerald-400" : "bg-rose-400"
            )}
          />
          <div>
            <p className="text-ink text-sm font-bold">{d.label}</p>
            <p className="text-muted mt-0.5 text-xs leading-relaxed">{d.summary}</p>
          </div>
        </div>
      ))}
    </div>
  )
}

function BulletSection({ title, items, color }: { title: string; items: string[]; color: string }) {
  if (items.length === 0) return null
  return (
    <div>
      <h3 className="text-ink mb-2 text-sm font-bold">{title}</h3>
      <ul className="flex flex-col gap-1.5">
        {items.map((item, i) => (
          <li key={i} className="text-muted flex items-start gap-2 text-sm">
            <span className={cn("mt-1.5 size-1.5 shrink-0 rounded-full", color)} />
            {item}
          </li>
        ))}
      </ul>
    </div>
  )
}

function Result({ analysis }: { analysis: FitAnalysis }) {
  return (
    <div className="flex flex-col gap-5 px-5 pb-10">
      <div className="border-warm-border rounded-3xl border bg-white p-5">
        <p className="text-ink mb-4 text-sm leading-relaxed font-semibold">
          {analysis.overallSummary}
        </p>
        <FitGauge strengths={analysis.strengths} gaps={analysis.gaps} />
      </div>

      <div className="border-warm-border rounded-3xl border bg-white p-5">
        <h2 className="text-ink mb-3 text-sm font-bold">차원별 평가</h2>
        <DimensionList analysis={analysis} />
      </div>

      <div className="border-warm-border flex flex-col gap-4 rounded-3xl border bg-white p-5">
        <BulletSection title="강점" items={analysis.strengths} color="bg-emerald-400" />
        <BulletSection title="보완 사항" items={analysis.gaps} color="bg-rose-400" />
        <BulletSection title="개선 제안" items={analysis.recommendations} color="bg-primary" />
      </div>
    </div>
  )
}

export function FitAnalysisPage({
  jobId,
  companyId,
  jobTitle,
}: {
  jobId: string
  companyId: string
  jobTitle?: string
}) {
  const { data, isLoading, isError } = useFitAnalysis(companyId, jobId)

  return (
    <section className="bg-background min-h-full">
      <header className="border-warm-border border-b bg-white px-5 py-4">
        <div className="flex items-center gap-2">
          <Link href={`/jobs/${jobId}`} aria-label="뒤로가기">
            <ChevronLeft className="text-muted size-5" />
          </Link>
          <div>
            <h1 className="text-ink text-base font-bold">내 서류 적합도 분석</h1>
            {jobTitle && <p className="text-muted text-xs">{jobTitle}</p>}
          </div>
        </div>
      </header>

      {isLoading && (
        <div className="flex flex-col items-center justify-center gap-3 px-5 pt-24 text-center">
          <div className="border-primary size-8 animate-spin rounded-full border-2 border-t-transparent" />
          <p className="text-muted text-sm">AI가 서류를 분석 중입니다...</p>
        </div>
      )}

      {isError && (
        <div className="flex flex-col items-center justify-center px-5 pt-24 text-center">
          <p className="text-ink text-sm font-bold">분석에 실패했습니다</p>
          <p className="text-muted mt-1 text-xs">이력서가 등록되어 있는지 확인해 주세요</p>
          <Link href="/mypage/resume" className="text-primary mt-4 text-sm font-semibold">
            서류 등록하러 가기
          </Link>
        </div>
      )}

      {data && <Result analysis={data} />}
    </section>
  )
}
