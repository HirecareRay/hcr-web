/**
 * resultSkeleton.tsx
 *
 * 면접 결과 분석 중 로딩 상태입니다.
 * 단순 스켈레톤보다 "분석 과정"을 노출해, 멀티모달 분석 대기 UX를 자연스럽게 만듭니다.
 * 실제 UI는 공용 AiAnalyzingLoader로 통일합니다.
 *
 * 룸(interviewRoomPage)의 "면접 결과를 정리하고 있어요" 로더와 title·steps·center 를 동일하게
 * 맞춰, 면접 종료 → 결과 페이지 이동 시 레이아웃 점프 없이 하나의 중앙 로더로 이어지게 한다.
 * 보통은 룸에서 결과를 미리 prefetch 해 이 로더가 안 보이지만, prefetch 실패·만료 시 fallback 으로 뜬다.
 */

import { AiAnalyzingLoader } from "@/components/ui/aiAnalyzingLoader"
import { resultLoaderCopy } from "../lib/loaderCopy"

export function ResultSkeleton() {
  return <AiAnalyzingLoader center {...resultLoaderCopy} />
}
