export type InputMode = "text" | "voice"

export interface InterviewSession {
  id: string
  companyId: string
  messages: InterviewMessage[]
  status: "idle" | "answering" | "evaluating" | "finished"
}

export interface InterviewMessage {
  id: string
  role: "interviewer" | "candidate"
  content: string
  evaluation?: Evaluation
  createdAt: string
}

export interface Evaluation {
  score: number
  feedback: string
  improvement: string
}
