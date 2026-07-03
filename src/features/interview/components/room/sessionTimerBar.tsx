/**
 * sessionTimerBar.tsx
 *
 * 면접 상단 바 — 전체 남은 시간(카운트다운) + 진행도(질문 N/M)를 보여줍니다.
 * "전체 시간만 실제 제한" 정책의 표시부입니다. 1분 이하로 남으면 빨강으로 경고합니다.
 */

import { Clock } from "lucide-react"
import { cn } from "@/lib/utils"
import { formatClock } from "../../lib/formatters"

interface Props {
  remainingSec: number
  totalSec: number
  questionNo: number
  // WS 주도에선 꼬리질문으로 총 개수가 동적이라 분모를 생략한다(러닝 카운터).
  questionCount?: number
}

export function SessionTimerBar({ remainingSec, totalSec, questionNo, questionCount }: Props) {
  const ratio = totalSec > 0 ? Math.max(0, Math.min(1, remainingSec / totalSec)) : 0
  const low = remainingSec <= 60

  return (
    <div className="border-warm-border bg-background rounded-2xl border p-3 shadow-sm">
      <div className="flex items-center justify-between text-sm">
        <span className="text-muted font-medium">
          질문 {questionNo}
          {questionCount ? ` / ${questionCount}` : ""}
        </span>
        <span
          className={cn(
            "flex items-center gap-1 font-semibold tabular-nums",
            low ? "text-error" : "text-ink"
          )}
        >
          <Clock className="h-4 w-4" />
          {formatClock(remainingSec)}
        </span>
      </div>
      <div className="bg-warm-border/40 mt-2 h-2 w-full overflow-hidden rounded-full">
        <div
          className={cn("h-full rounded-full transition-all", low ? "bg-error" : "bg-primary")}
          style={{ width: `${ratio * 100}%` }}
        />
      </div>
    </div>
  )
}
