import { RequireAuth } from "@/features/auth/components/requireAuth"
import { InterviewEntryPage } from "@/features/interview/components/interviewEntryPage"

export default function InterviewEntryRoute() {
  return (
    <RequireAuth>
      <InterviewEntryPage />
    </RequireAuth>
  )
}
