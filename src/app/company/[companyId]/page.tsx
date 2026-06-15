export default function CompanyReportPage({
  params,
}: {
  params: { companyId: string }
}) {
  return <div>{params.companyId}</div>
}
