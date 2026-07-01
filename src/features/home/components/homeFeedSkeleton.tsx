/**
 * homeFeedSkeleton.tsx
 *
 * 홈 피드(트렌딩·직군별 채용공고·이슈) 로딩 중 스켈레톤.
 * 정적 영역(히어로·검색바)은 즉시 보이므로 피드 영역만 가립니다.
 */

function Block({ className }: { className: string }) {
  return <div className={`bg-skeleton animate-pulse rounded-2xl ${className}`} />
}

export function HomeFeedSkeleton() {
  return (
    <div className="space-y-6" aria-hidden>
      {/* 트렌딩 카드 줄 */}
      <div className="flex gap-3 overflow-hidden">
        <Block className="h-52 w-44 shrink-0" />
        <Block className="h-52 w-44 shrink-0" />
        <Block className="h-52 w-44 shrink-0" />
      </div>

      {/* 직군별 채용공고 카드 */}
      <Block className="h-56 w-full" />

      {/* 이슈 브리핑 */}
      <Block className="h-32 w-full" />
    </div>
  )
}
