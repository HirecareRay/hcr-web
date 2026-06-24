import { InterviewResultPage } from "@/features/interview/components/interviewResultPage"

/**
 * AI 모의 면접 결과 리포트 페이지.
 * 결과는 세션 단위지만, 현재는 companyId로 최신 결과를 조회합니다.
 * (예: /interview/00265324/result)
 */
export default async function InterviewResultRoute({
  params,
}: {
  params: Promise<{ companyId: string }>
}) {
  const { companyId } = await params
  return <InterviewResultPage companyId={companyId} />
}
