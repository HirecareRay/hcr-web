import { FitAnalysisPage } from "@/features/analysis/components/fitAnalysisPage"

export default async function Page({
  params,
  searchParams,
}: {
  params: Promise<{ jobId: string }>
  searchParams: Promise<{ companyId?: string }>
}) {
  const { jobId } = await params
  const { companyId = "" } = await searchParams

  return <FitAnalysisPage jobId={jobId} companyId={companyId} />
}
