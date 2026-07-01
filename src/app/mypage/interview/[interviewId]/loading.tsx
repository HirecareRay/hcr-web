// app/mypage/interview/[interviewId]/loading.tsx
//
// 목록 → 상세로 처음 이동하는 순간의 라우트 전환 로딩입니다.
// 이 파일이 없으면 전역 app/loading.tsx(중앙 스피너)가 잠깐 뜨는데,
// 상세는 저장된 기록을 꺼내오는 것뿐이라 스피너 대신 상세 스켈레톤을 그대로 보여줘
// 전환 → fetch 대기 → 내용이 같은 골격으로 매끄럽게 이어지게 한다.

import { PageTopBar } from "@/components/ui/pageTopBar"
import { InterviewDetailSkeleton } from "@/features/mypage/components/interviewDetailSkeleton"

export default function Loading() {
  return (
    <section className="bg-background min-h-full pb-10">
      <PageTopBar title="면접 상세" backTo="/mypage/interview" />
      <InterviewDetailSkeleton />
    </section>
  )
}
