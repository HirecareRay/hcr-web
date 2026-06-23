/**
 * answerPanel.tsx
 *
 * 답변 입력부 — 단계와 모드에 따라 분기합니다.
 *   asking    : "답변 시작" 버튼(+권장 답변 시간 안내)
 *   answering : 텍스트 입력(textarea) + (음성 모드면) 녹음 시작/종료 + "답변 제출"
 *
 * 로직(녹음/제출/STT)은 부모가 핸들러로 내려주고, 이 컴포넌트는 표시·이벤트 전달만 합니다.
 */

import { Mic, Send, Square } from "lucide-react"
import { cn } from "@/lib/utils"
import { formatClock } from "../../lib/formatters"
import type { InterviewMode, InterviewPhase } from "../../types/interviewSession"

interface Props {
  mode: InterviewMode
  phase: InterviewPhase
  answerText: string
  recommendedAnswerSec: number
  isRecording: boolean
  isTranscribing: boolean
  onAnswerTextChange: (value: string) => void
  onBeginAnswering: () => void
  onStartRecording: () => void
  onStopRecording: () => void
  onSubmit: () => void
}

const primaryButton =
  "inline-flex items-center justify-center gap-1.5 rounded-xl bg-primary px-4 py-2.5 text-sm font-semibold text-white transition-opacity disabled:opacity-50"

export function AnswerPanel({
  mode,
  phase,
  answerText,
  recommendedAnswerSec,
  isRecording,
  isTranscribing,
  onAnswerTextChange,
  onBeginAnswering,
  onStartRecording,
  onStopRecording,
  onSubmit,
}: Props) {
  // asking 단계 — 답변 시작 전
  if (phase === "asking") {
    return (
      <section className="border-warm-border bg-background space-y-3 rounded-2xl border p-4 shadow-sm">
        <p className="text-muted text-xs">
          권장 답변 시간 {formatClock(recommendedAnswerSec)} · 강제로 종료되지 않아요
        </p>
        <button type="button" onClick={onBeginAnswering} className={cn(primaryButton, "w-full")}>
          답변 시작
        </button>
      </section>
    )
  }

  // answering 단계 — 입력 + 제출
  const canSubmit = answerText.trim().length > 0 && !isRecording && !isTranscribing

  return (
    <section className="border-warm-border bg-background space-y-3 rounded-2xl border p-4 shadow-sm">
      {mode === "voice" && (
        <div className="flex items-center gap-2">
          {isRecording ? (
            <button
              type="button"
              onClick={onStopRecording}
              className="bg-error inline-flex items-center gap-1.5 rounded-xl px-4 py-2.5 text-sm font-semibold text-white"
            >
              <Square className="h-4 w-4" />
              녹음 종료
            </button>
          ) : (
            <button
              type="button"
              onClick={onStartRecording}
              className="border-warm-border text-ink inline-flex items-center gap-1.5 rounded-xl border px-4 py-2.5 text-sm font-semibold"
            >
              <Mic className="h-4 w-4" />
              녹음 시작
            </button>
          )}
          {isTranscribing && <span className="text-muted text-xs">전사 중…</span>}
        </div>
      )}

      <textarea
        value={answerText}
        onChange={(event) => onAnswerTextChange(event.target.value)}
        placeholder={
          mode === "voice"
            ? "녹음하면 전사된 답변이 채워집니다. 직접 수정도 가능해요."
            : "여기에 답변을 입력하세요."
        }
        rows={5}
        className="border-warm-border text-ink placeholder:text-disabled focus:border-primary w-full resize-none rounded-xl border p-3 text-sm leading-relaxed outline-none"
      />

      <button
        type="button"
        onClick={onSubmit}
        disabled={!canSubmit}
        className={cn(primaryButton, "w-full")}
      >
        <Send className="h-4 w-4" />
        답변 제출
      </button>
    </section>
  )
}
