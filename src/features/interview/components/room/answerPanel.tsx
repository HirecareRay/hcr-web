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

import { CheckCircle2, Send } from "lucide-react"
import { cn } from "@/lib/utils"
import { LiveTranscriptView } from "./liveTranscriptView"
import { MicLevelMeter } from "./micLevelMeter"
import type { InterviewMode, InterviewPhase } from "../../types/interviewSession"

// 음성 모드 answering 하위 단계 — 말하는 중(인식) vs 검토·수정
export type VoiceStep = "listening" | "review"

interface Props {
  mode: InterviewMode
  phase: InterviewPhase
  voiceStep: VoiceStep // 음성 모드일 때만 의미 있음
  stream: MediaStream | null // 마이크 음량 미터용(음성 listening 단계)
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

// 공통 패널 카드 — 부모(하단 flex-1 영역)의 높이를 꽉 채운다(h-full). 질문 카드는 작고
// 답변 카드가 남는 높이를 다 가져 커진다. 입력칸이 카드 안 남는 높이를 채우고(flex-1)
// 버튼은 항상 맨 아래 → 단계(asking/answering/review/평가)가 바뀌어도 크기·버튼 위치 동일.
const answerSection =
  "border-warm-border bg-background flex h-full flex-col gap-2.5 rounded-2xl border p-3 shadow-sm"

// 공통 내용 박스 — 모든 단계의 내용 영역을 같은 테두리 박스로 통일한다(입력칸/자막/미리보기).
// 카드 안 남는 높이를 채우고(flex-1) 넘치면 안에서만 스크롤한다.
const answerBox = "border-warm-border min-h-0 w-full flex-1 overflow-y-auto rounded-xl border p-3"

// listening ↔ review 공통 배지 — 두 단계의 배지 높이를 h-9 로 못 박아 전환 시 안 튀게 한다.
const stepBadge =
  "bg-primary/10 text-primary inline-flex h-9 shrink-0 items-center gap-2 rounded-full px-3 text-sm font-semibold"

// listening 자막칸·review 텍스트칸 모두 카드 안 남는 높이를 채운다(flex-1) → 두 단계 높이가
// 같아 안 튀고, 답변이 길어져도 칸 안에서만 스크롤한다.
const voiceInputHeight = "min-h-0 flex-1"

// listening·review 안내 문구 — 두 문구 모두 한 줄 분량으로 짧게 유지한다. 한 줄 높이만
// 예약해(min-h-[1.25rem]) 단계 전환 시 안 튀되 불필요한 여백은 남기지 않는다.
const voiceHelperText = "text-muted min-h-[1.25rem] shrink-0 text-xs"

export function AnswerPanel({
  mode,
  phase,
  voiceStep,
  stream,
  answerText,
  liveTranscript,
  voiceAnswer,
  onAnswerTextChange,
  onVoiceAnswerChange,
  onBeginAnswering,
  onFinishSpeaking,
  onEndAnswer,
}: Props) {
  // asking 단계 — 답변 시작 전. 다른 단계(입력칸)와 같은 테두리 박스로 통일한다.
  if (phase === "asking") {
    return (
      <section className={answerSection}>
        <div className={cn(answerBox, "text-disabled text-sm")}>
          {mode === "voice"
            ? "답변을 시작하면 음성이 실시간으로 면접관에게 전달돼요."
            : "답변을 시작하고 아래에 직접 입력하세요."}
        </div>
        <button type="button" onClick={onBeginAnswering} className={cn(primaryButton, "w-full")}>
          답변 시작
        </button>
      </section>
    )
  }

  // ── 음성 · 말하는 중(listening) ── 읽기 전용 자막 + "답변 입력 완료"
  if (mode === "voice" && voiceStep === "listening") {
    return (
      <section className={answerSection}>
        {/* "잡히고 있다" presence 피드백 — 항상 동작(비용 0). 실시간 자막은 백엔드 ON 일 때만 채워짐. */}
        <div className="shrink-0">
          <MicLevelMeter stream={stream} active />
        </div>
        <LiveTranscriptView transcript={liveTranscript} />
        <p className={voiceHelperText}>말씀이 끝나면 ‘답변 입력 완료’를 누르세요.</p>
        <button type="button" onClick={onFinishSpeaking} className={cn(primaryButton, "w-full")}>
          답변 입력 완료
        </button>
      </section>
    )
  }

  // ── 음성 · 검토(review) ── 인식된 최종 자막을 편집 가능한 칸에서 교정 + "제출"
  if (mode === "voice") {
    return (
      <section className={answerSection}>
        {/* listening 의 "듣는 중" 배지와 같은 높이(h-9)의 배지 — 단계 전환 시 안 튀게 */}
        <div className={stepBadge}>
          <CheckCircle2 className="h-4 w-4" />
          <span>인식 완료</span>
        </div>
        <textarea
          value={voiceAnswer}
          onChange={(event) => onVoiceAnswerChange(event.target.value)}
          placeholder="인식된 답변을 확인하고, 잘못된 부분을 직접 고치세요."
          className={cn(
            "border-warm-border text-ink placeholder:text-disabled focus:border-primary w-full resize-none rounded-xl border p-3 text-sm leading-relaxed outline-none",
            voiceInputHeight
          )}
        />
        <p className={voiceHelperText}>고친 내용 그대로 평가돼요.</p>
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
    <section className={answerSection}>
      <textarea
        value={answerText}
        onChange={(event) => onAnswerTextChange(event.target.value)}
        placeholder="여기에 답변을 입력하세요."
        className="border-warm-border text-ink placeholder:text-disabled focus:border-primary min-h-0 w-full flex-1 resize-none rounded-xl border p-3 text-sm leading-relaxed outline-none"
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
