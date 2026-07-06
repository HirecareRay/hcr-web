/**
 * jobDetailSkeleton.tsx
 *
 * 채용공고 상세 로딩 스켈레톤. 실제 페이지(아이콘+뱃지+제목 → 메타 정보 → 태그 →
 * 액션 버튼 → 섹션 카드들)와 같은 골격을 잡아, 데이터가 들어와도 레이아웃이 밀리지 않게 한다.
 */

import { PageTopBar } from "@/components/ui/pageTopBar"

export function JobDetailSkeleton() {
  return (
    <section className="bg-background min-h-full pb-10">
      <PageTopBar title="채용공고" />

      <div className="bg-white px-5 pt-5 pb-6">
        <div className="flex items-start gap-3">
          <div className="bg-skeleton size-12 shrink-0 animate-pulse rounded-xl" />
          <div className="min-w-0 flex-1 space-y-2">
            <div className="bg-skeleton h-4 w-16 animate-pulse rounded-full" />
            <div className="bg-skeleton h-5 w-3/4 animate-pulse rounded" />
          </div>
        </div>

        <div className="mt-4 flex gap-4">
          <div className="bg-skeleton h-3 w-14 animate-pulse rounded" />
          <div className="bg-skeleton h-3 w-14 animate-pulse rounded" />
          <div className="bg-skeleton h-3 w-20 animate-pulse rounded" />
        </div>

        <div className="mt-3 flex gap-2">
          <div className="bg-skeleton h-5 w-14 animate-pulse rounded-full" />
          <div className="bg-skeleton h-5 w-14 animate-pulse rounded-full" />
        </div>

        <div className="mt-4 space-y-2">
          <div className="bg-skeleton h-11 w-full animate-pulse rounded-2xl" />
          <div className="bg-skeleton h-11 w-full animate-pulse rounded-2xl" />
        </div>
      </div>

      <div className="px-5">
        {[0, 1, 2].map((i) => (
          <div key={i} className="border-warm-border space-y-2 border-b py-5">
            <div className="bg-skeleton h-4 w-20 animate-pulse rounded" />
            <div className="bg-skeleton h-3 w-full animate-pulse rounded" />
            <div className="bg-skeleton h-3 w-5/6 animate-pulse rounded" />
          </div>
        ))}
      </div>
    </section>
  )
}
