/**
 * listeningIndicator.tsx
 *
 * "답변 듣는 중" 알림 표시등입니다. 답변 단계(answering)에서 활성화되어,
 * AI가 사용자의 답변을 인식/캡처하고 있음을 빨간 점의 펄스로 알립니다.
 */

import { cn } from "@/lib/utils"

interface Props {
  active: boolean
}

export function ListeningIndicator({ active }: Props) {
  return (
    <div
      className={cn(
        "inline-flex items-center gap-2 rounded-full px-3 py-1.5 text-xs font-semibold backdrop-blur-sm",
        active ? "bg-error/15 text-error" : "bg-black/40 text-white/70"
      )}
    >
      <span className="relative flex h-2.5 w-2.5">
        {active && (
          <span className="bg-error/60 absolute inline-flex h-full w-full animate-ping rounded-full" />
        )}
        <span
          className={cn(
            "relative inline-flex h-2.5 w-2.5 rounded-full",
            active ? "bg-error" : "bg-white/70"
          )}
        />
      </span>
      {active ? "답변 인식 중" : "대기 중"}
    </div>
  )
}
