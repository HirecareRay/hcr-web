import { useCompanyReport } from "@/features/company/hooks/useCompanyReport"

interface Props {
  companyId: string
}

export function CompanyReport({ companyId }: Props) {
  const { report, isLoading, error } = useCompanyReport(companyId)

  if (isLoading) return <div>로딩 중...</div>
  if (error) return <div>{error}</div>
  if (!report) return null

  return (
    <div>
      <h1>{report.company.name}</h1>
    </div>
  )
}
