/**
 * strengthWeaknessSection.tsx
 *
 * 강점 / 약점을 2단으로 보여주는 섹션입니다(LLM 종합 추론).
 */

import { ThumbsDown, ThumbsUp } from "lucide-react"
import { ResultSection } from "../resultSection"

interface Props {
  strengths: string[]
  weaknesses: string[]
}

export function StrengthWeaknessSection({ strengths, weaknesses }: Props) {
  return (
    <ResultSection title="강점 · 약점" aiBadge>
      <div className="space-y-5">
        {/* 강점 */}
        <div>
          <div className="text-success flex items-center gap-1.5 text-sm font-bold">
            <ThumbsUp className="h-4 w-4" />
            강점
          </div>
          <ul className="mt-2 space-y-2">
            {strengths.map((item) => (
              <li
                key={item}
                className="bg-warm-bg text-ink rounded-xl px-3 py-2.5 text-sm leading-relaxed"
              >
                {item}
              </li>
            ))}
          </ul>
        </div>

        {/* 약점 */}
        <div>
          <div className="text-info flex items-center gap-1.5 text-sm font-bold">
            <ThumbsDown className="h-4 w-4" />
            약점
          </div>
          <ul className="mt-2 space-y-2">
            {weaknesses.map((item) => (
              <li
                key={item}
                className="bg-warm-bg text-ink rounded-xl px-3 py-2.5 text-sm leading-relaxed"
              >
                {item}
              </li>
            ))}
          </ul>
        </div>
      </div>
    </ResultSection>
  )
}
