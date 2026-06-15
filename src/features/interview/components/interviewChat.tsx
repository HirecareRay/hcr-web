import { InterviewSession } from "@/features/interview/types/interview"

interface Props {
  session: InterviewSession
  onAnswer: (text: string) => void
  isLoading: boolean
}

export function InterviewChat({ session, onAnswer, isLoading }: Props) {
  return (
    <div>
      {session.messages.map((message) => (
        <div key={message.id}>
          <span>{message.role === "interviewer" ? "면접관" : "나"}</span>
          <p>{message.content}</p>
        </div>
      ))}
    </div>
  )
}
