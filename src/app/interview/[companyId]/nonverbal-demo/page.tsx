import { NonverbalDemo } from "@/features/interview/components/nonverbalDemo"

/**
 * 비언어 분석 검증 라우트 (Phase 4).
 * NonverbalDemo 는 client 컴포넌트이며, MediaPipe/웹캠은 effect 안에서만(브라우저) 로드되므로
 * 셸의 SSR 에는 영향이 없습니다.
 */
export default async function NonverbalDemoPage({
  params,
}: {
  params: Promise<{ companyId: string }>
}) {
  const { companyId } = await params
  return <NonverbalDemo companyId={companyId} />
}
