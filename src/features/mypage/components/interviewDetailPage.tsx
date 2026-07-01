"use client"

/**
 * interviewDetailPage.tsx
 *
 * 마이페이지 "AI 면접 기록" 상세 화면입니다.
 * 목록에서 고른 세션의 resultId 로 전체 리포트(InterviewResult)를 조회해,
 * 면접 결과 리포트 본문(InterviewResultReport)을 그대로 재사용해 렌더합니다.
 */

import { PageTopBar } from "@/components/ui/pageTopBar"
import { useInterviewSessionResult } from "@/features/interview/hooks/useInterviewSessionResult"
import { InterviewResultReport } from "@/features/interview/components/interviewResultReport"
import { InterviewDetailSkeleton } from "./interviewDetailSkeleton"

export function InterviewDetailPage({ interviewId }: { interviewId: string }) {
  const { data, isLoading, isError, refetch } = useInterviewSessionResult(interviewId)

  return (
    <section className="bg-background min-h-full pb-10">
      <PageTopBar title="면접 상세" backTo="/mypage/interview" />

      {isLoading ? (
        <InterviewDetailSkeleton />
      ) : isError || !data ? (
        <DetailError onRetry={() => refetch()} />
      ) : (
        <InterviewResultReport data={data} companyId={data.meta.companyId} />
      )}
    </section>
  )
}

function DetailError({ onRetry }: { onRetry: () => void }) {
  return (
    <div className="flex flex-col items-center justify-center px-5 pt-24 text-center">
      <p className="text-ink text-base font-bold">면접 기록을 불러오지 못했어요</p>
      <p className="text-muted mt-2 text-sm">기록이 없거나 잠시 문제가 생겼어요</p>
      <button
        type="button"
        onClick={onRetry}
        className="bg-primary mt-5 rounded-full px-5 py-2 text-sm font-semibold text-white"
      >
        다시 시도
      </button>
    </div>
  )
}
