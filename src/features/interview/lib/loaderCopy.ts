/**
 * loaderCopy.ts
 *
 * "면접 결과를 정리하고 있어요" 로더의 문구 단일 출처.
 * 면접 종료 → 결과 페이지 전환이 하나의 로더로 이어지려면 룸(interviewRoomPage)과
 * 결과 페이지(resultSkeleton)가 완전히 같은 title/subtitle/steps 를 써야 한다.
 * 두 곳에서 이 상수를 공유해, 한쪽만 고쳐 통일이 조용히 깨지는 일을 막는다.
 */

// as const 를 쓰지 않는다 — AiAnalyzingLoader 의 steps prop 이 mutable string[] 이라
// readonly 튜플이면 타입이 어긋난다. steps 는 string[] 로 추론되게 둔다.
export const resultLoaderCopy = {
  title: "면접 결과를 정리하고 있어요",
  subtitle: "답변과 표정·음성을 종합해 리포트를 만들고 있어요",
  steps: ["답변 내용 종합", "표정·시선 분석", "음성 안정도 분석", "강점·보완점 도출"],
}
