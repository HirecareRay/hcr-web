/**
 * fitHistoryPicks.tsx
 *
 * 적합도 분석 진입 화면의 "내 분석 기록" 섹션입니다.
 * 마이페이지 "적합도 보고서"와 같은 데이터(useFitHistory)를 재사용해, 최근 본 분석 몇 건을
 * 진입 화면에서도 바로 다시 볼 수 있게 합니다. 각 카드는 분석 결과 페이지로 이동합니다.
 *   → /jobs/[jobPostingId]/fit?companyId=[companyId]&analysisId=[analysisId]
 *
 * 기록이 없거나 에러면 섹션을 숨겨 진입 흐름(주 경로: 채용공고 검색)을 막지 않는다.
 */

"use client"

import Link from "next/link"
import { ChevronRight, ArrowRight } from "lucide-react"
import { useFitHistory } from "../hooks/useFitHistory"
import type { FitHistoryItem } from "../types/analysis"

// 진입 화면에서는 최근 몇 건만 미리 보여주고, 전체는 마이페이지 목록으로 넘긴다.
const previewCount = 3

// "2026-07-01 14:23:05" → "2026.07.01". 형식이 다르면 원본을 그대로 둔다.
function formatAnalyzedAt(raw: string | null): string {
  if (!raw) return ""
  const datePart = raw.split(" ")[0]
  return /^\d{4}-\d{2}-\d{2}$/.test(datePart) ? datePart.replaceAll("-", ".") : raw
}

export function FitHistoryPicks() {
  const { data, isLoading, isError } = useFitHistory()

  // 로딩 중엔 자리만 잡아 레이아웃이 흔들리지 않게(스켈레톤 카드).
  if (isLoading) {
    return (
      <section className="space-y-2.5">
        <SectionTitle />
        <div className="flex flex-col gap-2.5">
          {[0, 1].map((i) => (
            <div
              key={i}
              className="border-warm-border h-[4.5rem] animate-pulse rounded-2xl border bg-white"
            />
          ))}
        </div>
      </section>
    )
  }

  // 에러/빈 목록이면 섹션을 숨긴다(기록이 없는 첫 사용자는 이 섹션을 볼 이유가 없다).
  if (isError || !data || data.length === 0) return null

  const items = data.slice(0, previewCount)

  return (
    <section className="space-y-2.5">
      <SectionTitle />
      <div className="flex flex-col gap-2.5">
        {items.map((item) => (
          <HistoryPickCard key={item.analysisId} item={item} />
        ))}
      </div>
    </section>
  )
}

function SectionTitle() {
  return (
    <div className="flex items-baseline justify-between">
      <h2 className="text-ink text-sm font-bold">내 분석 기록</h2>
      <Link
        href="/mypage/analysis"
        className="text-muted hover:text-ink inline-flex items-center gap-0.5 text-xs font-semibold transition-colors"
      >
        전체 보기
        <ArrowRight className="size-3" />
      </Link>
    </div>
  )
}

function HistoryPickCard({ item }: { item: FitHistoryItem }) {
  const href =
    item.jobPostingId && item.companyId
      ? `/jobs/${item.jobPostingId}/fit?companyId=${item.companyId}&analysisId=${item.analysisId}`
      : "/mypage/analysis"

  return (
    <Link
      href={href}
      className="border-warm-border hover:border-primary group flex items-center gap-3 rounded-2xl border bg-white p-3.5 transition-colors"
    >
      <div className="min-w-0 flex-1">
        <div className="text-muted text-xs">{formatAnalyzedAt(item.analyzedAt)}</div>
        <p className="text-ink mt-1 truncate text-sm font-bold">
          {item.companyName ?? "기업 미상"}
        </p>
        <p className="text-muted truncate text-xs">{item.jobTitle ?? "직무 미상"}</p>
      </div>
      {item.overallPct !== null && (
        <div className="flex shrink-0 items-baseline gap-0.5">
          <span className="text-success text-xl font-extrabold">{item.overallPct}</span>
          <span className="text-muted text-xs font-bold">%</span>
        </div>
      )}
      <ChevronRight className="text-disabled size-4 shrink-0" />
    </Link>
  )
}
