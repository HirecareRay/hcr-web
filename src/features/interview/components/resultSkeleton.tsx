/**
 * resultSkeleton.tsx
 *
 * 면접 결과 분석 중 로딩 상태입니다.
 * 단순 스켈레톤보다 "분석 과정"을 노출해, 멀티모달 분석 대기 UX를 자연스럽게 만듭니다.
 *
 * 라이브룸의 "결과 정리 중" 로더(interviewRoomPage)와 title·subtitle·steps·center 를 정확히
 * 맞춘다. 마지막 답변 후 라이브룸(WS summary 대기) → 결과 페이지(REST 결과 조회 대기)로 넘어갈 때
 * 로더가 두 번 뜨는데, 둘을 동일하게 두어야 페이지 전환에도 하나의 로딩이 매끄럽게 이어져 보인다.
 * (한쪽에 center 가 빠지면 위치·크기가 튀어 "옛날 디자인"처럼 보였던 문제를 방지.)
 */

import { AiAnalyzingLoader } from "@/components/ui/aiAnalyzingLoader"

export function ResultSkeleton() {
  return (
    <AiAnalyzingLoader
      center
      title="면접 결과를 정리하고 있어요"
      subtitle="답변과 표정·음성을 종합해 리포트를 만들고 있어요"
      steps={["답변 내용 종합", "표정·시선 분석", "음성 안정도 분석", "강점·보완점 도출"]}
    />
  )
}
