"use client"

/**
 * interviewResultPage.tsx
 *
 * AI 모의 면접 결과 리포트의 최상위 컴포넌트입니다.
 * useInterviewResult 훅으로 회사 최신 결과를 받아 로딩/에러/정상 상태를 분기하고,
 * 정상일 때 본문 렌더는 InterviewResultReport 에 위임합니다.
 * (같은 본문을 마이페이지 면접 기록 상세도 resultId 기반으로 재사용합니다.)
 */

import { useInterviewResult } from "../hooks/useInterviewResult"
import { InterviewResultReport } from "./interviewResultReport"
import { ResultSkeleton } from "./resultSkeleton"

interface Props {
  companyId: string
}

export function InterviewResultPage({ companyId }: Props) {
  const { data, isLoading, isError, refetch } = useInterviewResult(companyId)

  if (isLoading) return <ResultSkeleton />
  if (isError || !data) return <ResultError onRetry={() => refetch()} />

  return <InterviewResultReport data={data} companyId={companyId} />
}

function ResultError({ onRetry }: { onRetry: () => void }) {
  return (
    <div className="flex min-h-[60vh] flex-col items-center justify-center px-4 text-center">
      <p className="text-muted text-sm">면접 결과를 불러오지 못했습니다.</p>
      <button
        type="button"
        onClick={onRetry}
        className="bg-primary mt-4 rounded-lg px-4 py-2 text-sm font-medium text-white transition-opacity hover:opacity-90"
      >
        다시 시도
      </button>
    </div>
  )
}
