import { CompanyReport } from "@/features/company/components/companyReport"

/**
 * 회사 분석 보고서 페이지.
 * 검색 기능은 다음 슬라이스에서 추가하며, 현재는 URL의 companyId로 직접 접근합니다.
 * (예: /company/00265324)
 */
export default async function CompanyReportPage({
  params,
}: {
  params: Promise<{ companyId: string }>
}) {
  const { companyId } = await params
  return <CompanyReport companyId={companyId} />
}
