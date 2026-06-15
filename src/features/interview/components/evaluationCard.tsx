import { Evaluation } from "@/features/interview/types/interview"

interface Props {
  evaluation: Evaluation
}

export function EvaluationCard({ evaluation }: Props) {
  return (
    <div>
      <p>점수: {evaluation.score}점</p>
      <p>{evaluation.feedback}</p>
      <p>{evaluation.improvement}</p>
    </div>
  )
}
