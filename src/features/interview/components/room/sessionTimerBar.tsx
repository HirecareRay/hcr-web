/**
 * sessionTimerBar.tsx
 *
 * 면접 상단 바 — 경과 시간 + 예상 소요 시간 + 진행도(질문 N)를 보여줍니다.
 *
 * 면접 길이는 시간이 아니라 질문 수가 정하므로, 이 바는 "마감 시계"가 아니라 "예상/경과"를 보여준다.
 * 예상 시간을 넘겨도 강제로 끊지 않고 부드러운 안내만 띄운다 — 면접은 질문을 다 풀면 자연 종료된다.
 */

import { Clock } from "lucide-react"
import { formatClock } from "../../lib/formatters"
import { durationLabel } from "../../lib/sessionPlan"

interface Props {
  elapsedSec: number
  estimatedSec: number // 예상 소요 시간(참고용 — 마감 아님)
  questionNo: number
  // WS 주도에선 꼬리질문으로 총 개수가 동적이라 분모를 생략한다(러닝 카운터).
  questionCount?: number
}

export function SessionTimerBar({ elapsedSec, estimatedSec, questionNo, questionCount }: Props) {
  const ratio = estimatedSec > 0 ? Math.max(0, Math.min(1, elapsedSec / estimatedSec)) : 0
  const overEstimate = estimatedSec > 0 && elapsedSec >= estimatedSec

  return (
    <div className="border-warm-border bg-background rounded-2xl border p-3 shadow-sm">
      <div className="flex items-center justify-between text-sm">
        <span className="text-muted font-medium">
          질문 {questionNo}
          {questionCount ? ` / ${questionCount}` : ""}
        </span>
        <span className="text-ink flex items-center gap-1 font-semibold tabular-nums">
          <Clock className="h-4 w-4" />
          경과 {formatClock(elapsedSec)}
          {estimatedSec > 0 && (
            <span className="text-muted font-normal"> · 예상 {durationLabel(estimatedSec)}</span>
          )}
        </span>
      </div>
      <div className="bg-warm-border/40 mt-2 h-2 w-full overflow-hidden rounded-full">
        <div
          className="bg-primary h-full rounded-full transition-all"
          style={{ width: `${ratio * 100}%` }}
        />
      </div>
      {overEstimate && (
        <p className="text-muted mt-1.5 text-xs">
          슬슬 마무리할 시간이에요 🙂 남은 질문을 마치면 면접이 끝나요.
        </p>
      )}
    </div>
  )
}
