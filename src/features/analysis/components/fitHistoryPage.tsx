"use client"

import Link from "next/link"
import { ChevronRight, ClipboardCheck } from "lucide-react"
import { PageTopBar } from "@/components/ui/pageTopBar"
import { HomeSearchBar } from "@/features/home/components/homeSearchBar"
import { useFitHistory } from "../hooks/useFitHistory"
import type { FitHistoryItem } from "../types/analysis"

// "2026-07-01 14:23:05" → "2026.07.01". 형식이 다르면 원본을 그대로 둔다.
function formatAnalyzedAt(raw: string | null): string {
  if (!raw) return ""
  const datePart = raw.split(" ")[0]
  return /^\d{4}-\d{2}-\d{2}$/.test(datePart) ? datePart.replaceAll("-", ".") : raw
}

function FitHistoryCard({ item }: { item: FitHistoryItem }) {
  const href =
    item.jobPostingId && item.companyId
      ? `/jobs/${item.jobPostingId}/fit?companyId=${item.companyId}&analysisId=${item.analysisId}`
      : null

  const content = (
    <>
      <div className="text-muted flex items-center gap-1.5 text-xs">
        <span>{formatAnalyzedAt(item.analyzedAt)}</span>
      </div>
      <p className="text-ink mt-1 text-sm font-bold">{item.companyName ?? "기업 미상"}</p>
      <p className="text-muted text-xs">{item.jobTitle ?? "직무 미상"}</p>
      {item.jobNames.length > 0 && (
        <div className="mt-2 flex flex-wrap gap-1">
          {item.jobNames.map((name) => (
            <span
              key={name}
              className="bg-coral-light text-primary rounded-full px-2 py-0.5 text-[0.625rem] font-medium"
            >
              {name}
            </span>
          ))}
        </div>
      )}
      {href && (
        <span className="text-primary mt-2 flex items-center gap-1 text-xs font-semibold">
          결과 보기 <ChevronRight className="size-3" />
        </span>
      )}
    </>
  )

  if (!href) {
    return <div className="border-warm-border rounded-2xl border bg-white p-4">{content}</div>
  }

  return (
    <Link href={href} className="border-warm-border block rounded-2xl border bg-white p-4">
      {content}
    </Link>
  )
}

function FitHistorySkeleton() {
  return (
    <div className="flex flex-col gap-3">
      {[0, 1].map((i) => (
        <div key={i} className="border-warm-border rounded-2xl border bg-white p-4">
          <div className="space-y-2">
            <div className="bg-skeleton h-3 w-24 animate-pulse rounded" />
            <div className="bg-skeleton h-4 w-20 animate-pulse rounded" />
            <div className="bg-skeleton h-3 w-28 animate-pulse rounded" />
          </div>
        </div>
      ))}
    </div>
  )
}

export function FitHistoryPage() {
  const { data, isLoading, isError, refetch } = useFitHistory()

  return (
    <section className="bg-background min-h-full pb-8">
      <PageTopBar title="적합도 보고서" backTo="/mypage" />

      <header className="px-6 pt-5">
        <p className="text-primary text-sm font-semibold">내 지원 결과 한눈에</p>
        <div className="mt-3">
          <HomeSearchBar resultTab="job" placeholder="직무명 또는 기업명 검색" />
        </div>
      </header>

      <div className="mt-6 px-6">
        {isLoading ? (
          <FitHistorySkeleton />
        ) : isError ? (
          <div className="flex flex-col items-center justify-center px-5 pt-16 text-center">
            <p className="text-ink text-base font-bold">보고서를 불러오지 못했어요</p>
            <p className="text-muted mt-2 text-sm">잠시 후 다시 시도해 주세요</p>
            <button
              onClick={() => refetch()}
              className="bg-primary mt-5 rounded-full px-5 py-2 text-sm font-semibold text-white"
            >
              다시 시도
            </button>
          </div>
        ) : !data || data.length === 0 ? (
          <div className="flex flex-col items-center justify-center px-5 pt-16 text-center">
            <div className="bg-warm-bg flex size-20 items-center justify-center rounded-full">
              <ClipboardCheck className="text-disabled size-9" />
            </div>
            <p className="text-ink mt-5 text-base font-bold">아직 적합도 보고서가 없어요</p>
            <p className="text-muted mt-2 text-sm">
              채용공고에서 적합도 분석을 진행하면 여기에 쌓여요
            </p>
          </div>
        ) : (
          <div className="flex flex-col gap-3">
            {data.map((item) => (
              <FitHistoryCard key={item.analysisId} item={item} />
            ))}
          </div>
        )}
      </div>
    </section>
  )
}
