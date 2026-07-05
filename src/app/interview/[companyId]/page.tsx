import { RequireAuth } from "@/features/auth/components/requireAuth"
import { InterviewRoomPage } from "@/features/interview/components/interviewRoomPage"

export default async function InterviewPage({
  params,
}: {
  params: Promise<{ companyId: string }>
}) {
  const { companyId } = await params
  return (
    <RequireAuth>
      <InterviewRoomPage companyId={companyId} />
    </RequireAuth>
  )
}
