/**
 * jobListSkeleton.tsx
 *
 * 채용공고 목록 로딩 중 스켈레톤. 실제 JobCard와 같은 골격(아이콘 사각 + 상태뱃지·회사명
 * + 제목 2줄 + 메타 정보 줄 + 태그 줄)을 잡아, 데이터가 들어와도 레이아웃이 밀리지 않게 한다.
 */

function Block({ className }: { className: string }) {
  return <div className={`bg-skeleton animate-pulse rounded-2xl ${className}`} />
}

function JobCardSkeleton() {
  return (
    <div className="border-warm-border rounded-2xl border bg-white p-4">
      <div className="flex items-start gap-3">
        <Block className="size-11 shrink-0 rounded-xl" />
        <div className="min-w-0 flex-1 space-y-2">
          <Block className="h-4 w-16 rounded-full" />
          <Block className="h-4 w-3/4" />
        </div>
      </div>
      <div className="mt-4 flex gap-4">
        <Block className="h-3 w-16" />
        <Block className="h-3 w-12" />
        <Block className="h-3 w-20" />
      </div>
      <div className="mt-3 flex gap-2">
        <Block className="h-5 w-14 rounded-full" />
        <Block className="h-5 w-14 rounded-full" />
      </div>
    </div>
  )
}

export function JobListSkeleton() {
  return (
    <div className="space-y-3" aria-hidden>
      {Array.from({ length: 3 }).map((_, i) => (
        <JobCardSkeleton key={i} />
      ))}
    </div>
  )
}
