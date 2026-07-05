/**
 * homeFeedSkeleton.tsx
 *
 * 홈 피드(트렌딩·직군별 채용공고·이슈) 로딩 중 스켈레톤.
 * 정적 영역(히어로·검색바)은 즉시 보이므로 피드 영역만 가립니다.
 *
 * 실제 피드와 같은 골격(섹션 간격 space-y-8, 각 섹션의 헤더 = 아이콘+제목)을 그대로 잡아,
 * 데이터가 들어와도 레이아웃이 밀리지 않게 합니다.
 */

function Block({ className }: { className: string }) {
  return <div className={`bg-skeleton animate-pulse rounded-2xl ${className}`} />
}

// 각 섹션 상단의 헤더 자리(아이콘 사각 + 제목 바) — SectionHeader와 같은 여백(mb-3 px-1).
function SectionHeaderSkeleton({ titleWidth }: { titleWidth: string }) {
  return (
    <div className="mb-3 flex items-center gap-1.5 px-1">
      <Block className="size-5 rounded-md" />
      <Block className={`h-5 rounded-md ${titleWidth}`} />
    </div>
  )
}

export function HomeFeedSkeleton() {
  return (
    <div className="space-y-8" aria-hidden>
      {/* 트렌딩 TOP 5 — 헤더 + 카드 줄. 실제 TrendingSection과 동일한 반응형:
          모바일은 가로 스크롤(w-44), 데스크탑(md+)은 5칸 그리드로 꽉 채운다. */}
      <section>
        <SectionHeaderSkeleton titleWidth="w-56" />
        <div className="-mx-5 flex gap-3 overflow-hidden px-5 pb-2 md:mx-0 md:grid md:grid-cols-5 md:overflow-visible md:px-0">
          {Array.from({ length: 5 }).map((_, i) => (
            <Block key={i} className="h-52 w-44 shrink-0 md:w-auto" />
          ))}
        </div>
      </section>

      {/* 직군별 채용공고 — 헤더 + 흰 카드 블록 */}
      <section>
        <SectionHeaderSkeleton titleWidth="w-32" />
        <Block className="h-56 w-full" />
      </section>

      {/* 기업 이슈 브리핑 — 헤더 + 목록 블록 */}
      <section>
        <SectionHeaderSkeleton titleWidth="w-36" />
        <Block className="h-32 w-full" />
      </section>
    </div>
  )
}
