import { WsSkeletonDemo } from "@/features/interview/components/wsSkeletonDemo"

/**
 * 실시간 면접 WS 왕복 데모 라우트 (Phase 1 walking skeleton).
 * 기존 배치 라이브룸(`/interview/[companyId]`)과 별개의 확인용 화면입니다.
 */
export default async function WsDemoPage({ params }: { params: Promise<{ companyId: string }> }) {
  const { companyId } = await params
  return <WsSkeletonDemo companyId={companyId} />
}
