import { ApiResponse } from "@/types/api"
import { Evaluation, InterviewSession } from "@/features/interview/types/interview"

export async function createSession(companyId: string): Promise<ApiResponse<InterviewSession>> {
  const res = await fetch("/api/interview/sessions", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ companyId }),
  })
  return res.json()
}

export async function submitAnswer(
  sessionId: string,
  answer: string
): Promise<ApiResponse<Evaluation>> {
  const res = await fetch(`/api/interview/sessions/${sessionId}/answer`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ answer }),
  })
  return res.json()
}

export async function uploadAudio(sessionId: string, audio: Blob): Promise<ApiResponse<string>> {
  const formData = new FormData()
  formData.append("audio", audio)
  const res = await fetch(`/api/interview/sessions/${sessionId}/stt`, {
    method: "POST",
    body: formData,
  })
  return res.json()
}
