/**
 * interviewDetailSkeleton.tsx
 *
 * 마이페이지 "AI 면접 기록" 상세의 로딩 스켈레톤입니다.
 * 결과 화면(/interview/[id]/result)은 방금 끝난 면접을 실제로 AI가 분석하므로
 * "분석 중" 로더(AiAnalyzingLoader)가 맞지만, 여기 상세는 이미 저장된 기록을
 * 꺼내오는 것뿐이라 "분석 중"은 틀린 안내다. 그래서 리포트 골격만 조용히 깔아준다.
 *
 * 서버(route loading.tsx)·클라이언트(상세 페이지 fetch 대기) 양쪽에서 쓰므로
 * 훅 없는 순수 프레젠테이션 컴포넌트로 둔다.
 */

export function InterviewDetailSkeleton() {
  return (
    <div className="px-4 py-6">
      {/* 히어로(요약) 카드 */}
      <div className="border-warm-border rounded-2xl border bg-white p-5">
        <div className="flex items-start justify-between">
          <div className="space-y-2">
            <div className="bg-skeleton h-3 w-28 animate-pulse rounded" />
            <div className="bg-skeleton h-5 w-24 animate-pulse rounded" />
            <div className="bg-skeleton h-3 w-20 animate-pulse rounded" />
          </div>
          <div className="bg-skeleton h-10 w-14 animate-pulse rounded" />
        </div>
        <div className="bg-skeleton mt-4 h-14 w-full animate-pulse rounded-xl" />
      </div>

      {/* 탭 바 */}
      <div className="mt-4 flex gap-2">
        {[0, 1, 2].map((i) => (
          <div key={i} className="bg-skeleton h-9 flex-1 animate-pulse rounded-full" />
        ))}
      </div>

      {/* 섹션 카드 */}
      <div className="mt-4 space-y-4">
        {[0, 1].map((i) => (
          <div key={i} className="border-warm-border space-y-3 rounded-2xl border bg-white p-4">
            <div className="bg-skeleton h-4 w-32 animate-pulse rounded" />
            <div className="bg-skeleton h-3 w-full animate-pulse rounded" />
            <div className="bg-skeleton h-3 w-5/6 animate-pulse rounded" />
          </div>
        ))}
      </div>
    </div>
  )
}
