"use client"

import Link from "next/link"
import { ChevronRight, Sparkles, Mic, Type } from "lucide-react"
import { PageTopBar } from "@/components/ui/pageTopBar"
import { useInterviewHistory } from "@/features/interview/hooks/useInterviewHistory"
import type { InterviewHistoryItem } from "@/features/interview/types/interviewHistory"

// ISO(2026-06-10T…) → "2026.06.10". 잘못된 값이면 원본을 그대로 둔다.
function formatConductedAt(iso: string): string {
  const date = new Date(iso)
  if (Number.isNaN(date.getTime())) return iso
  const yyyy = date.getFullYear()
  const mm = String(date.getMonth() + 1).padStart(2, "0")
  const dd = String(date.getDate()).padStart(2, "0")
  return `${yyyy}.${mm}.${dd}`
}

export function InterviewListPage() {
  const { data, isLoading, isError, refetch } = useInterviewHistory()

  return (
    <section className="bg-background min-h-full pb-10">
      <PageTopBar title="AI 면접 기록" backTo="/mypage" />

      {isLoading ? (
        <InterviewListSkeleton />
      ) : isError ? (
        <div className="flex flex-col items-center justify-center px-5 pt-24 text-center">
          <p className="text-ink text-base font-bold">면접 기록을 불러오지 못했어요</p>
          <p className="text-muted mt-2 text-sm">잠시 후 다시 시도해 주세요</p>
          <button
            onClick={() => refetch()}
            className="bg-primary mt-5 rounded-full px-5 py-2 text-sm font-semibold text-white"
          >
            다시 시도
          </button>
        </div>
      ) : !data || data.items.length === 0 ? (
        <div className="flex flex-col items-center justify-center px-5 pt-24 text-center">
          <div className="bg-warm-bg flex size-20 items-center justify-center rounded-full">
            <Sparkles className="text-disabled size-9" />
          </div>
          <p className="text-ink mt-5 text-base font-bold">아직 면접 기록이 없어요</p>
          <p className="text-muted mt-2 text-sm">AI 면접을 진행하면 결과가 여기에 쌓여요</p>
        </div>
      ) : (
        <div className="flex flex-col gap-3 px-5 pt-5">
          {data.items.map((item) => (
            <InterviewHistoryCard key={item.resultId} item={item} />
          ))}
        </div>
      )}
    </section>
  )
}

function InterviewHistoryCard({ item }: { item: InterviewHistoryItem }) {
  const ModeIcon = item.mode === "voice" ? Mic : Type
  const modeLabel = item.mode === "voice" ? "음성" : "텍스트"

  return (
    <div className="border-warm-border rounded-2xl border bg-white p-4">
      <div className="flex items-start justify-between">
        <div>
          <div className="text-muted flex items-center gap-1.5 text-xs">
            <span>{formatConductedAt(item.conductedAt)}</span>
            <span className="text-warm-border">·</span>
            <span className="flex items-center gap-0.5">
              <ModeIcon className="size-3" />
              {modeLabel}
            </span>
          </div>
          <p className="text-ink mt-1 text-sm font-bold">{item.companyName}</p>
          <p className="text-muted text-xs">{item.jobTitle}</p>
        </div>
        <div className="flex items-baseline gap-1">
          <span className="text-primary text-2xl font-extrabold">{item.score}</span>
          <span className="text-muted text-sm font-bold">점</span>
        </div>
      </div>
      <p className="text-muted border-warm-border mt-3 border-t pt-3 text-xs leading-relaxed">
        {item.headline}
      </p>
      <Link
        href={`/mypage/interview/${item.resultId}`}
        className="text-primary mt-2 flex items-center gap-1 text-xs font-semibold"
      >
        상세 보기 <ChevronRight className="size-3" />
      </Link>
    </div>
  )
}

// 로딩 중 카드 자리를 잡아주는 스켈레톤 — 목록 레이아웃과 동일한 골격.
function InterviewListSkeleton() {
  return (
    <div className="flex flex-col gap-3 px-5 pt-5">
      {[0, 1].map((i) => (
        <div key={i} className="border-warm-border rounded-2xl border bg-white p-4">
          <div className="flex items-start justify-between">
            <div className="space-y-2">
              <div className="bg-skeleton h-3 w-24 animate-pulse rounded" />
              <div className="bg-skeleton h-4 w-20 animate-pulse rounded" />
              <div className="bg-skeleton h-3 w-28 animate-pulse rounded" />
            </div>
            <div className="bg-skeleton h-7 w-10 animate-pulse rounded" />
          </div>
          <div className="border-warm-border mt-3 border-t pt-3">
            <div className="bg-skeleton h-3 w-full animate-pulse rounded" />
          </div>
        </div>
      ))}
    </div>
  )
}
