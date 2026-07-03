/**
 * resultSkeleton.tsx
 *
 * 면접 결과 분석 중 로딩 상태입니다.
 * 단순 스켈레톤보다 "분석 과정"을 노출해, 멀티모달 분석 대기 UX를 자연스럽게 만듭니다.
 * 실제 UI는 공용 AiAnalyzingLoader로 통일합니다.
 */

import { AiAnalyzingLoader } from "@/components/ui/aiAnalyzingLoader"

export function ResultSkeleton() {
  return (
    <AiAnalyzingLoader
      title="AI가 면접을 분석하고 있어요"
      steps={["표정 분석", "음성 분석", "답변 평가", "강점·보완점 도출"]}
    />
  )
}
