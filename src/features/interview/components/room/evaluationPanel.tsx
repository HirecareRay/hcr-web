/**
 * evaluationPanel.tsx
 *
 * 답변 종료(answer_end) 직후 evaluating 단계에서 보여주는 패널입니다.
 * 내 답변(최종 자막)과 AI 평가(eval_delta 토큰 스트림)를 가볍게 표시한 뒤,
 * "다음 질문" 버튼으로 다음 질문(꼬리/메인) 또는 요약으로 넘어갑니다.
 *
 * 질문별 점수 카드로 흐름을 끊지 않는다는 방침에 맞춰, 무거운 리포트가 아니라
 * 답변 직후 실시간 피드백만 가볍게 노출합니다.
 */

import { ChevronRight, Loader2, Sparkles } from "lucide-react"
import { cn } from "@/lib/utils"

interface Props {
  transcript: string // 최종 답변 자막
  evaluation: string // 스트리밍 평가 토큰(누적)
  nextRequested: boolean // "다음 질문"을 눌러 다음 질문 대기 중
  onNext: () => void
}

const primaryButton =
  "inline-flex items-center justify-center gap-1.5 rounded-xl bg-primary px-4 py-2.5 text-sm font-semibold text-white transition-opacity disabled:opacity-50"

export function EvaluationPanel({ transcript, evaluation, nextRequested, onNext }: Props) {
  return (
    <section className="border-warm-border bg-background space-y-4 rounded-2xl border p-4 shadow-sm">
      <div className="space-y-1.5">
        <p className="text-muted text-xs font-semibold">내 답변</p>
        <p className="text-ink text-sm leading-relaxed">
          {transcript || <span className="text-disabled">답변이 인식되지 않았어요.</span>}
        </p>
      </div>

      <div className="border-warm-border/60 space-y-1.5 border-t pt-3">
        <p className="text-primary flex items-center gap-1 text-xs font-semibold">
          <Sparkles className="h-3.5 w-3.5" />
          AI 평가
        </p>
        {evaluation ? (
          <p className="text-ink text-sm leading-relaxed">{evaluation}</p>
        ) : (
          <p className="text-muted flex items-center gap-1.5 text-sm">
            <Loader2 className="h-4 w-4 animate-spin" />
            평가를 작성하고 있어요…
          </p>
        )}
      </div>

      <button
        type="button"
        onClick={onNext}
        disabled={nextRequested}
        className={cn(primaryButton, "w-full")}
      >
        {nextRequested ? (
          <>
            <Loader2 className="h-4 w-4 animate-spin" />
            다음 질문 준비 중…
          </>
        ) : (
          <>
            다음 질문
            <ChevronRight className="h-4 w-4" />
          </>
        )}
      </button>
    </section>
  )
}
