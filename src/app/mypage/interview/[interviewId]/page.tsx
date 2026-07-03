import { InterviewDetailPage } from "@/features/mypage/components/interviewDetailPage"

export default async function Page({ params }: { params: Promise<{ interviewId: string }> }) {
  const { interviewId } = await params
  return <InterviewDetailPage interviewId={interviewId} />
}
