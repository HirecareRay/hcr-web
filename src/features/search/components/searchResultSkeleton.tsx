/**
 * searchResultSkeleton.tsx
 *
 * 검색 결과 로딩 중 스켈레톤. 실제 CompanyCard/JobCard와 같은 골격(원형 로고 +
 * 텍스트 줄 / 텍스트 줄 + 버튼 2개)을 잡아, 데이터가 들어와도 레이아웃이 밀리지 않게 한다.
 */

function Block({ className }: { className: string }) {
  return <div className={`bg-skeleton animate-pulse rounded-2xl ${className}`} />
}

// CompanyCard와 같은 골격: 원형 로고 + 텍스트 3줄
function CompanyCardSkeleton() {
  return (
    <div className="border-warm-border flex items-center gap-3 rounded-2xl border p-4">
      <Block className="size-11 shrink-0 rounded-full" />
      <div className="min-w-0 flex-1 space-y-2">
        <Block className="h-4 w-2/3" />
        <Block className="h-3 w-1/2" />
        <Block className="h-3 w-1/3" />
      </div>
    </div>
  )
}

// JobCard/JobSearchCard와 같은 골격: 텍스트 2줄 + 버튼 2개
function JobCardSkeleton() {
  return (
    <div className="border-warm-border rounded-2xl border bg-white px-5 py-3">
      <div className="space-y-2">
        <Block className="h-4 w-3/4" />
        <Block className="h-3 w-1/2" />
      </div>
      <div className="mt-3 flex gap-2">
        <Block className="h-7 flex-1 rounded-lg" />
        <Block className="h-7 flex-1 rounded-lg" />
      </div>
    </div>
  )
}

export function SearchResultListSkeleton({ variant }: { variant: "company" | "job" }) {
  const Item = variant === "company" ? CompanyCardSkeleton : JobCardSkeleton
  return (
    <div className="mt-3 space-y-3" aria-hidden>
      {Array.from({ length: 3 }).map((_, i) => (
        <Item key={i} />
      ))}
    </div>
  )
}
