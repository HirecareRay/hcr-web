/**
 * improvementSection.tsx
 *
 * 보완점 및 보완 방법 — 영역별로 "무엇이 부족했나(problem) → 어떻게 보완하나(method)"를
 * 카드로 보여줍니다(LLM 종합 추론).
 */

import { Lightbulb, Wrench } from "lucide-react"
import { ResultSection } from "../resultSection"
import type { ImprovementItem } from "../../types/interviewResult"

interface Props {
  improvements: ImprovementItem[]
}

export function ImprovementSection({ improvements }: Props) {
  return (
    <ResultSection title="보완점 · 보완 방법" aiBadge>
      <ul className="space-y-3">
        {improvements.map((item) => (
          <li key={item.area} className="border-warm-border rounded-xl border p-4">
            <p className="text-ink text-sm font-bold">{item.area}</p>

            <div className="text-muted mt-2 flex items-start gap-2 text-xs leading-relaxed">
              <Lightbulb className="text-info mt-0.5 h-3.5 w-3.5 shrink-0" />
              <span>{item.problem}</span>
            </div>

            <div className="text-ink bg-warm-bg mt-2 flex items-start gap-2 rounded-lg px-3 py-2.5 text-sm leading-relaxed">
              <Wrench className="text-primary mt-0.5 h-3.5 w-3.5 shrink-0" />
              <span>{item.method}</span>
            </div>
          </li>
        ))}
      </ul>
    </ResultSection>
  )
}
