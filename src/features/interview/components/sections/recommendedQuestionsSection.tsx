/**
 * recommendedQuestionsSection.tsx
 *
 * 회사 관련 / 직무 관련 추천(예상) 질문 리스트입니다(기업·직무 컨텍스트 기반 LLM 생성).
 * 다음 연습 때 대비할 질문을 두 그룹으로 나눠 보여줍니다.
 */

import { Building2, Briefcase } from "lucide-react"
import { ResultSection } from "../resultSection"
import type { RecommendedQuestions } from "../../types/interviewResult"

interface Props {
  questions: RecommendedQuestions
}

function QuestionGroup({
  icon,
  title,
  items,
}: {
  icon: React.ReactNode
  title: string
  items: string[]
}) {
  return (
    <div>
      <div className="text-ink flex items-center gap-1.5 text-sm font-bold">
        {icon}
        {title}
      </div>
      <ul className="mt-2 space-y-2">
        {items.map((question) => (
          <li
            key={question}
            className="bg-warm-bg text-ink rounded-xl px-3 py-2.5 text-sm leading-relaxed"
          >
            {question}
          </li>
        ))}
      </ul>
    </div>
  )
}

export function RecommendedQuestionsSection({ questions }: Props) {
  return (
    <ResultSection title="예상 질문" aiBadge>
      <div className="space-y-5">
        <QuestionGroup
          icon={<Building2 className="text-primary h-4 w-4" />}
          title="회사 관련"
          items={questions.company}
        />
        <QuestionGroup
          icon={<Briefcase className="text-primary h-4 w-4" />}
          title="직무 관련"
          items={questions.job}
        />
      </div>
    </ResultSection>
  )
}
