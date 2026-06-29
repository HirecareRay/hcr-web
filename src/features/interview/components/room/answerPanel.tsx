/**
 * answerPanel.tsx
 *
 * 답변 입력부 — 단계와 모드에 따라 분기합니다(WS 주도).
 *   asking    : "답변 시작" 버튼
 *   answering : 음성 모드 → 실시간 자막(WS transcript)을 편집 가능한 입력칸에 표시 /
 *               텍스트 모드 → 직접 입력 + "답변 종료" 버튼
 *
 * 음성은 답변 구간 동안 자동으로 WS 스트리밍되므로(useAudioStreamer) 수동 녹음 버튼이 없습니다.
 * STT 가 오인식할 수 있으므로 음성 자막도 제출 전 직접 고칠 수 있습니다(교정 텍스트를
 * text_answer 로 보내면 백엔드가 자기 전사 대신 그 텍스트를 답변으로 채택함).
 * 로직(송신/전이)은 부모가 핸들러로 내려주고, 이 컴포넌트는 표시·이벤트 전달만 합니다.
 */

import { Mic, Send } from "lucide-react"
import { cn } from "@/lib/utils"
import type { InterviewMode, InterviewPhase } from "../../types/interviewSession"

interface Props {
  mode: InterviewMode
  phase: InterviewPhase
  answerText: string // 텍스트 모드 입력값
  voiceAnswer: string // 음성 모드 자막(편집 가능) — STT 자막을 사용자가 교정한 값
  onAnswerTextChange: (value: string) => void
  onVoiceAnswerChange: (value: string) => void
  onBeginAnswering: () => void
  onEndAnswer: () => void
}

const primaryButton =
  "inline-flex items-center justify-center gap-1.5 rounded-xl bg-primary px-4 py-2.5 text-sm font-semibold text-white transition-opacity disabled:opacity-50"

export function AnswerPanel({
  mode,
  phase,
  answerText,
  voiceAnswer,
  onAnswerTextChange,
  onVoiceAnswerChange,
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
  // 텍스트 모드는 입력값이 있어야 제출. 음성 모드는 빈 자막도 허용한다 — 부분 자막이 꺼진
  // 백엔드에선 답변 중 자막이 안 흐를 수 있고, 이때는 백엔드가 누적 오디오를 전사한다(폴백).
  const canEnd = mode === "voice" || answerText.trim().length > 0

  return (
    <section className="border-warm-border bg-background space-y-3 rounded-2xl border p-4 shadow-sm">
      {mode === "voice" ? (
        <>
          <div className="text-error flex items-center gap-1.5 text-xs font-medium">
            <Mic className="h-4 w-4 animate-pulse" />
            답변 받는 중
          </div>
          <textarea
            value={voiceAnswer}
            onChange={(event) => onVoiceAnswerChange(event.target.value)}
            placeholder="말씀하시면 실시간으로 자막이 표시돼요. 잘못 인식된 부분은 직접 고칠 수 있어요."
            rows={5}
            className="border-warm-border text-ink placeholder:text-disabled focus:border-primary w-full resize-none rounded-xl border p-3 text-sm leading-relaxed outline-none"
          />
          <p className="text-muted text-xs">
            음성이 자막으로 표시돼요. 제출 전 잘못 인식된 부분을 고치면 고친 내용으로 평가돼요.
          </p>
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
