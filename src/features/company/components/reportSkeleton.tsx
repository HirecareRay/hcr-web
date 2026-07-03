/**
 * reportSkeleton.tsx
 *
 * 기업 분석 리포트 로딩 스켈레톤.
 *
 * 리포트는 (LLM 실시간 생성이 아니라) 백엔드 DB에 저장된 분석을 GET 으로 읽어온다.
 * 따라서 "AI가 분석하고 있어요" 극장형 로더 대신, 실제 리포트 레이아웃
 * (상단바·프로필·지원준비카드·탭·콘텐츠 카드)을 그대로 흉내낸 담백한 스켈레톤을
 * 짧은 fetch 순간에만 보여준다.
 */

import { PageTopBar } from "@/components/ui/pageTopBar"

function Block({ className }: { className: string }) {
  return <div className={`bg-skeleton animate-pulse ${className}`} />
}

export function ReportSkeleton() {
  return (
    <div className="bg-background min-h-full pb-10" aria-hidden>
      {/* 상단 바 — 로딩 중에도 뒤로가기가 동작하도록 실제 컴포넌트를 그대로 노출 */}
      <PageTopBar title="기업 분석" />

      {/* 기업 프로필 헤더 */}
      <div className="bg-white px-5 pt-5 pb-5">
        <div className="flex items-start gap-3">
          <Block className="size-12 shrink-0 rounded-full" />
          <div className="flex-1 space-y-2">
            <Block className="h-5 w-40 rounded-md" />
            <div className="flex gap-1.5">
              <Block className="h-5 w-16 rounded-full" />
              <Block className="h-5 w-16 rounded-full" />
            </div>
          </div>
        </div>
      </div>

      {/* 지원 준비 카드 */}
      <div className="px-4 pt-4">
        <Block className="h-24 w-full rounded-2xl" />
      </div>

      {/* 탭 바 */}
      <div className="border-warm-border mt-4 flex border-b px-2">
        {Array.from({ length: 5 }).map((_, index) => (
          <div key={index} className="flex flex-1 justify-center py-3">
            <Block className="h-4 w-10 rounded-md" />
          </div>
        ))}
      </div>

      {/* 콘텐츠 카드 */}
      <div className="space-y-4 px-4 pt-5">
        <Block className="h-40 w-full rounded-2xl" />
        <Block className="h-40 w-full rounded-2xl" />
        <Block className="h-32 w-full rounded-2xl" />
      </div>
    </div>
  )
}
