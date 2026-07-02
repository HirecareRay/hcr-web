/**
 * timeBadge.tsx
 *
 * 면접 남은 시간을 작게 보여주는 배지입니다. 기존의 큰 타이머 카드를 대체하며,
 * 화면 공간을 아끼려고 웹캠 위에 오버레이(onVideo)로 얹거나, 카메라가 없을 땐 밝은
 * 칩으로 상단에 작게 띄웁니다. 1분 이하로 남으면 빨강으로 경고합니다.
 */

import { Clock } from "lucide-react"
import { cn } from "@/lib/utils"
import { formatClock } from "../../lib/formatters"

interface Props {
  remainingSec: number
  // true: 어두운 영상 위 오버레이 스타일 / false: 밝은 배경 칩(카메라 없을 때)
  onVideo?: boolean
}

export function TimeBadge({ remainingSec, onVideo = false }: Props) {
  const low = remainingSec <= 60

  return (
    <span
      className={cn(
        "inline-flex items-center gap-1 rounded-full px-2 py-1 text-xs font-semibold tabular-nums",
        onVideo
          ? cn("backdrop-blur-sm", low ? "bg-error/80 text-white" : "bg-black/50 text-white")
          : cn(
              "border",
              low
                ? "border-error/30 bg-error/10 text-error"
                : "border-warm-border bg-background text-ink"
            )
      )}
    >
      <Clock className="h-3.5 w-3.5" />
      {formatClock(remainingSec)}
    </span>
  )
}
