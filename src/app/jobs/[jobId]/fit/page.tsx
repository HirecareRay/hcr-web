import { FitAnalysisPage } from "@/features/analysis/components/fitAnalysisPage"
import { getJobDetail } from "@/features/jobs/services/jobService"

export default async function Page({ params }: { params: Promise<{ jobId: string }> }) {
  const { jobId } = await params
  const job = getJobDetail(jobId)

  return <FitAnalysisPage jobId={jobId} companyId={job?.companyId ?? ""} jobTitle={job?.title} />
}
