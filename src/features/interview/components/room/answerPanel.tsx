/**
 * answerPanel.tsx
 *
 * 답변 입력부 — 단계와 모드에 따라 분기합니다(WS 주도).
 *   asking    : "답변 시작" 버튼
 *   answering : 음성 모드 → 실시간 자막(WS transcript) 표시 / 텍스트 모드 → 직접 입력
 *               + "답변 종료" 버튼
 *
 * 음성은 답변 구간 동안 자동으로 WS 스트리밍되므로(useAudioStreamer) 수동 녹음 버튼이 없습니다.
 * 로직(송신/전이)은 부모가 핸들러로 내려주고, 이 컴포넌트는 표시·이벤트 전달만 합니다.
 */

import { Mic, Send } from "lucide-react"
import { cn } from "@/lib/utils"
import type { InterviewMode, InterviewPhase } from "../../types/interviewSession"

interface Props {
  mode: InterviewMode
  phase: InterviewPhase
  answerText: string // 텍스트 모드 입력값
  transcript: string // 음성 모드 실시간 자막(WS)
  onAnswerTextChange: (value: string) => void
  onBeginAnswering: () => void
  onEndAnswer: () => void
}

const primaryButton =
  "inline-flex items-center justify-center gap-1.5 rounded-xl bg-primary px-4 py-2.5 text-sm font-semibold text-white transition-opacity disabled:opacity-50"

export function AnswerPanel({
  mode,
  phase,
  answerText,
  transcript,
  onAnswerTextChange,
  onBeginAnswering,
  onEndAnswer,
}: Props) {
  // asking 단계 — 답변 시작 전
  if (phase === "asking") {
    return (
      <section className="border-warm-border bg-background space-y-3 rounded-2xl border p-4 shadow-sm">
        <p className="text-muted text-xs">
          {mode === "voice"
            ? "답변을 시작하면 음성이 실시간으로 면접관에게 전달돼요."
            : "답변을 시작하고 아래에 직접 입력하세요."}
        </p>
        <button type="button" onClick={onBeginAnswering} className={cn(primaryButton, "w-full")}>
          답변 시작
        </button>
      </section>
    )
  }

  // answering 단계 — 입력/자막 + 종료
  const canEnd = mode === "voice" || answerText.trim().length > 0

  return (
    <section className="border-warm-border bg-background space-y-3 rounded-2xl border p-4 shadow-sm">
      {mode === "voice" ? (
        <>
          <div className="text-error flex items-center gap-1.5 text-xs font-medium">
            <Mic className="h-4 w-4 animate-pulse" />
            답변 받는 중
          </div>
          <div className="border-warm-border text-ink min-h-[6rem] rounded-xl border p-3 text-sm leading-relaxed">
            {transcript || (
              <span className="text-disabled">말씀하시면 실시간으로 자막이 표시돼요.</span>
            )}
          </div>
        </>
      ) : (
        <textarea
          value={answerText}
          onChange={(event) => onAnswerTextChange(event.target.value)}
          placeholder="여기에 답변을 입력하세요."
          rows={5}
          className="border-warm-border text-ink placeholder:text-disabled focus:border-primary w-full resize-none rounded-xl border p-3 text-sm leading-relaxed outline-none"
        />
      )}

      <button
        type="button"
        onClick={onEndAnswer}
        disabled={!canEnd}
        className={cn(primaryButton, "w-full")}
      >
        <Send className="h-4 w-4" />
        답변 종료
      </button>
    </section>
  )
}
