/**
 * scriptSection.tsx
 *
 * 질답 스크립트(면접 다시 보기 - 텍스트) — 질문/내 답변/답변 피드백을
 * 질문별 펼침 카드로 보여줍니다. 네이티브 <details>로 상태 없이 펼침/접힘 처리합니다.
 */

import { ChevronDown } from "lucide-react"
import { cn } from "@/lib/utils"
import { ResultSection } from "../resultSection"
import { categoryLabel } from "../../lib/formatters"
import type { ScriptItem } from "../../types/interviewResult"

interface Props {
  script: ScriptItem[]
}

function categoryTone(category: ScriptItem["category"]): string {
  if (category === "company") return "bg-coral-light text-primary"
  if (category === "job") return "bg-warm-bg text-muted"
  return "bg-warm-bg text-disabled"
}

export function ScriptSection({ script }: Props) {
  return (
    <ResultSection title="질답 스크립트" meta={`${script.length}문항`}>
      <ul className="space-y-2">
        {script.map((item) => (
          <li key={item.no} className="border-warm-border overflow-hidden rounded-xl border">
            <details className="group">
              <summary className="flex cursor-pointer list-none items-center gap-2 px-4 py-3">
                <span
                  className={cn(
                    "shrink-0 rounded-full px-2 py-0.5 text-xs font-semibold",
                    categoryTone(item.category)
                  )}
                >
                  {categoryLabel(item.category)}
                </span>
                <span
                  className="text-ink line-clamp-1 flex-1 text-sm font-medium"
                  title={item.question}
                >
                  Q{item.no}. {item.question}
                </span>
                <span className="text-muted shrink-0 text-xs font-semibold">
                  {item.evaluation.score}점
                </span>
                <ChevronDown className="text-disabled h-4 w-4 shrink-0 transition-transform group-open:rotate-180" />
              </summary>

              <div className="border-warm-border space-y-3 border-t px-4 py-3">
                {/* 질문 전문 */}
                <p className="text-ink text-sm leading-relaxed font-medium">{item.question}</p>

                {/* 내 답변 */}
                <div>
                  <p className="text-disabled text-xs font-semibold">내 답변</p>
                  <p className="text-ink mt-1 text-sm leading-relaxed">{item.answer}</p>
                </div>

                {/* 답변 피드백 */}
                <div className="bg-warm-bg space-y-2 rounded-lg p-3">
                  <p className="text-success text-xs leading-relaxed">
                    <span className="font-bold">잘한 점</span> · {item.evaluation.good}
                  </p>
                  <p className="text-info text-xs leading-relaxed">
                    <span className="font-bold">개선점</span> · {item.evaluation.improve}
                  </p>
                </div>
              </div>
            </details>
          </li>
        ))}
      </ul>
    </ResultSection>
  )
}
