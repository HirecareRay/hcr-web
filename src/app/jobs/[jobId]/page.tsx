import { JobDetailPage } from "@/features/jobs/components/jobDetailPage"

export default async function Page({ params }: { params: Promise<{ jobId: string }> }) {
  const { jobId } = await params
  return <JobDetailPage jobId={jobId} />
}
