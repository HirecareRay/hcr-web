import { useCallback, useState } from "react"
import { createSession, submitAnswer } from "@/features/interview/services/interviewService"
import { InterviewSession } from "@/features/interview/types/interview"

export function useInterview(companyId: string) {
  const [session, setSession] = useState<InterviewSession | null>(null)
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const startSession = useCallback(async () => {
    setIsLoading(true)
    setError(null)
    try {
      const res = await createSession(companyId)
      if (res.success && res.data) {
        setSession(res.data)
      } else {
        setError(res.error ?? "면접 시작 중 오류가 발생했습니다")
      }
    } catch {
      setError("면접 시작 중 오류가 발생했습니다")
    } finally {
      setIsLoading(false)
    }
  }, [companyId])

  const answer = useCallback(
    async (text: string) => {
      if (!session) return
      setIsLoading(true)
      try {
        const res = await submitAnswer(session.id, text)
        if (res.success && res.data) {
          setSession((prev) =>
            prev
              ? {
                  ...prev,
                  messages: [
                    ...prev.messages,
                    {
                      id: Date.now().toString(),
                      role: "candidate",
                      content: text,
                      evaluation: res.data,
                      createdAt: new Date().toISOString(),
                    },
                  ],
                }
              : prev
          )
        }
      } catch {
        setError("답변 제출 중 오류가 발생했습니다")
      } finally {
        setIsLoading(false)
      }
    },
    [session]
  )

  return { session, isLoading, error, startSession, answer }
}
