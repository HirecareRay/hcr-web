/**
 * answerPanel.tsx
 *
 * 답변 입력부 — 단계와 모드에 따라 분기합니다(WS 주도).
 *   asking    : "답변 시작" 버튼
 *   answering : 텍스트 모드 → 직접 입력 + "답변 종료"
 *               음성 모드는 2단계로 나뉜다(voiceStep):
 *                 listening : 읽기 전용 실시간 자막(LiveTranscriptView) + "답변 입력 완료"
 *                 review    : 인식된 최종 자막을 편집 가능한 칸에 올려 교정 + "제출"
 *
 * 음성은 답변 구간 동안 자동으로 WS 스트리밍되므로(useAudioStreamer) 수동 녹음 버튼이 없습니다.
 * 인식이 진행되는 동안(listening)에는 자막을 고칠 수 없고, "답변 입력 완료"로 인식을 멈춘 뒤
 * review 단계에서만 교정합니다(교정 텍스트를 text_answer 로 보내면 백엔드가 자기 전사 대신
 * 그 텍스트를 답변으로 채택함). 로직(송신/전이)은 부모가 핸들러로 내려주고, 이 컴포넌트는
 * 표시·이벤트 전달만 합니다.
 */

import { Send } from "lucide-react"
import { cn } from "@/lib/utils"
import { LiveTranscriptView } from "./liveTranscriptView"
import type { InterviewMode, InterviewPhase } from "../../types/interviewSession"

// 음성 모드 answering 하위 단계 — 말하는 중(인식) vs 검토·수정
export type VoiceStep = "listening" | "review"

interface Props {
  mode: InterviewMode
  phase: InterviewPhase
  voiceStep: VoiceStep // 음성 모드일 때만 의미 있음
  answerText: string // 텍스트 모드 입력값
  liveTranscript: string // 음성 모드 실시간 자막(읽기 전용, listening 단계 표시용)
  voiceAnswer: string // 음성 모드 교정 텍스트(review 단계 편집값)
  onAnswerTextChange: (value: string) => void
  onVoiceAnswerChange: (value: string) => void
  onBeginAnswering: () => void
  onFinishSpeaking: () => void // 음성: 인식 멈추고 review 단계로
  onEndAnswer: () => void // 제출(텍스트 종료 / 음성 review 제출)
}

const primaryButton =
  "inline-flex items-center justify-center gap-1.5 rounded-xl bg-primary px-4 py-2.5 text-sm font-semibold text-white transition-opacity disabled:opacity-50"

export function AnswerPanel({
  mode,
  phase,
  voiceStep,
  answerText,
  liveTranscript,
  voiceAnswer,
  onAnswerTextChange,
  onVoiceAnswerChange,
  onBeginAnswering,
  onFinishSpeaking,
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

  // ── 음성 · 말하는 중(listening) ── 읽기 전용 자막 + "답변 입력 완료"
  if (mode === "voice" && voiceStep === "listening") {
    return (
      <section className="border-warm-border bg-background space-y-3 rounded-2xl border p-4 shadow-sm">
        <LiveTranscriptView transcript={liveTranscript} />
        <p className="text-muted text-xs">
          말씀이 끝나면 “답변 입력 완료”를 눌러 인식을 멈추고 내용을 확인·수정하세요.
        </p>
        <button type="button" onClick={onFinishSpeaking} className={cn(primaryButton, "w-full")}>
          답변 입력 완료
        </button>
      </section>
    )
  }

  // ── 음성 · 검토(review) ── 인식된 최종 자막을 편집 가능한 칸에서 교정 + "제출"
  if (mode === "voice") {
    return (
      <section className="border-warm-border bg-background space-y-3 rounded-2xl border p-4 shadow-sm">
        <textarea
          value={voiceAnswer}
          onChange={(event) => onVoiceAnswerChange(event.target.value)}
          placeholder="인식된 답변을 확인하고, 잘못된 부분을 직접 고치세요."
          rows={5}
          className="border-warm-border text-ink placeholder:text-disabled focus:border-primary w-full resize-none rounded-xl border p-3 text-sm leading-relaxed outline-none"
        />
        <p className="text-muted text-xs">고친 내용 그대로 평가돼요.</p>
        <button type="button" onClick={onEndAnswer} className={cn(primaryButton, "w-full")}>
          <Send className="h-4 w-4" />
          제출
        </button>
      </section>
    )
  }

  // ── 텍스트 모드 ── 직접 입력 + "답변 종료"
  // 입력값이 있어야 제출 가능.
  const canEnd = answerText.trim().length > 0

  return (
    <section className="border-warm-border bg-background space-y-3 rounded-2xl border p-4 shadow-sm">
      <textarea
        value={answerText}
        onChange={(event) => onAnswerTextChange(event.target.value)}
        placeholder="여기에 답변을 입력하세요."
        rows={5}
        className="border-warm-border text-ink placeholder:text-disabled focus:border-primary w-full resize-none rounded-xl border p-3 text-sm leading-relaxed outline-none"
      />
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
