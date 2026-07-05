/**
 * interviewHistoryPicks.tsx
 *
 * 면접 진입 화면의 "내 면접 기록" 섹션입니다.
 * 마이페이지 "AI 면접 기록"과 같은 데이터(useInterviewHistory)를 재사용해, 최근 본 면접 몇 건을
 * 진입 화면에서도 바로 이어볼 수 있게 합니다. 각 카드는 상세(전체 리포트)로 이동합니다.
 *   → /mypage/interview/[resultId]
 *
 * 데이터 출처: BFF(`/api/interview/sessions/history`) — 마이페이지 목록과 동일(현재 더미).
 * 기록이 없거나 에러면 섹션을 숨겨 진입 흐름(주 경로: 기업 없이 시작)을 막지 않는다.
 */

"use client"

import Link from "next/link"
import { ChevronRight, Mic, Type, ArrowRight } from "lucide-react"
import { useInterviewHistory } from "@/features/interview/hooks/useInterviewHistory"
import type { InterviewHistoryItem } from "@/features/interview/types/interviewHistory"

// 진입 화면에서는 최근 몇 건만 미리 보여주고, 전체는 마이페이지 목록으로 넘긴다.
const previewCount = 3

// ISO(2026-06-10T…) → "2026.06.10". 잘못된 값이면 원본을 그대로 둔다.
function formatConductedAt(iso: string): string {
  const date = new Date(iso)
  if (Number.isNaN(date.getTime())) return iso
  const yyyy = date.getFullYear()
  const mm = String(date.getMonth() + 1).padStart(2, "0")
  const dd = String(date.getDate()).padStart(2, "0")
  return `${yyyy}.${mm}.${dd}`
}

export function InterviewHistoryPicks() {
  const { data, isLoading, isError } = useInterviewHistory()

  // 로딩 중엔 자리만 잡아 레이아웃이 흔들리지 않게(스켈레톤 카드).
  if (isLoading) {
    return (
      <section className="space-y-2.5">
        <SectionTitle total={0} />
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
  if (isError || !data || data.items.length === 0) return null

  const items = data.items.slice(0, previewCount)

  return (
    <section className="space-y-2.5">
      <SectionTitle total={data.total} />
      <div className="flex flex-col gap-2.5">
        {items.map((item) => (
          <HistoryPickCard key={item.resultId} item={item} />
        ))}
      </div>
    </section>
  )
}

function SectionTitle({ total }: { total: number }) {
  return (
    <div className="flex items-baseline justify-between">
      <h2 className="text-ink text-sm font-bold">내 면접 기록</h2>
      <Link
        href="/mypage/interview"
        className="text-muted hover:text-ink inline-flex items-center gap-0.5 text-xs font-semibold transition-colors"
      >
        전체 보기
        <ArrowRight className="size-3" />
      </Link>
    </div>
  )
}

function HistoryPickCard({ item }: { item: InterviewHistoryItem }) {
  const ModeIcon = item.mode === "voice" ? Mic : Type
  const modeLabel = item.mode === "voice" ? "음성" : "텍스트"

  return (
    <Link
      href={`/mypage/interview/${item.resultId}`}
      className="border-warm-border hover:border-primary group flex items-center gap-3 rounded-2xl border bg-white p-3.5 transition-colors"
    >
      <div className="min-w-0 flex-1">
        <div className="text-muted flex items-center gap-1.5 text-xs">
          <span>{formatConductedAt(item.conductedAt)}</span>
          <span className="text-warm-border">·</span>
          <span className="flex items-center gap-0.5">
            <ModeIcon className="size-3" />
            {modeLabel}
          </span>
        </div>
        <p className="text-ink mt-1 truncate text-sm font-bold">{item.companyName}</p>
        <p className="text-muted truncate text-xs">{item.jobTitle}</p>
      </div>
      <div className="flex shrink-0 items-baseline gap-0.5">
        <span className="text-primary text-xl font-extrabold">{item.score}</span>
        <span className="text-muted text-xs font-bold">점</span>
      </div>
      <ChevronRight className="text-disabled size-4 shrink-0" />
    </Link>
  )
}
