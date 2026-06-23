/**
 * comparisonSection.tsx
 *
 * 이전 면접 연습과의 차이 — 직전 세션 대비 지표별 점수 변화(상승/하락)를 보여줍니다.
 * 첫 면접이라 비교 대상이 없으면(comparison === null) 안내 빈 상태를 표시합니다.
 */

import { ArrowDownRight, ArrowUpRight, Minus } from "lucide-react"
import { ResultSection } from "../resultSection"
import { directionColorClass, formatDelta, formatResultDate } from "../../lib/formatters"
import type { InterviewComparison, MetricDelta } from "../../types/interviewResult"

interface Props {
  comparison: InterviewComparison | null
}

function DeltaIcon({ direction }: { direction: MetricDelta["direction"] }) {
  if (direction === "up") return <ArrowUpRight className="h-4 w-4" />
  if (direction === "down") return <ArrowDownRight className="h-4 w-4" />
  return <Minus className="h-4 w-4" />
}

export function ComparisonSection({ comparison }: Props) {
  if (!comparison) {
    return (
      <ResultSection title="이전 연습과의 차이">
        <p className="text-muted text-sm leading-relaxed">
          이번이 이 회사의 첫 모의 면접이에요. 다음 연습부터 지난 결과와 점수 변화를 비교해
          드릴게요.
        </p>
      </ResultSection>
    )
  }

  return (
    <ResultSection
      title="이전 연습과의 차이"
      meta={`${comparison.attemptCount}회차 · 직전 ${formatResultDate(comparison.previousDate)}`}
    >
      <ul className="space-y-2">
        {comparison.deltas.map((item) => (
          <li
            key={item.label}
            className="border-warm-border flex items-center gap-3 rounded-xl border px-4 py-3"
          >
            <span className="text-ink w-12 shrink-0 text-sm font-medium">{item.label}</span>

            {/* 이전 → 현재 */}
            <span className="text-muted flex-1 text-sm tabular-nums">
              {item.previous}
              <span className="text-disabled mx-1.5">→</span>
              <span className="text-ink font-semibold">{item.current}</span>
            </span>

            {/* 변화량 */}
            <span
              className={`flex shrink-0 items-center gap-1 text-sm font-bold tabular-nums ${directionColorClass(
                item.direction
              )}`}
            >
              <DeltaIcon direction={item.direction} />
              {formatDelta(item.delta)}
            </span>
          </li>
        ))}
      </ul>

      <p className="text-ink bg-warm-bg mt-3 rounded-xl px-3 py-2.5 text-sm leading-relaxed">
        {comparison.summary}
      </p>
    </ResultSection>
  )
}
