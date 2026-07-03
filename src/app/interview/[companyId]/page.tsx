import { InterviewRoomPage } from "@/features/interview/components/interviewRoomPage"

export default async function InterviewPage({
  params,
}: {
  params: Promise<{ companyId: string }>
}) {
  const { companyId } = await params
  return <InterviewRoomPage companyId={companyId} />
}
