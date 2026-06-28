/**
 * evaluationPanel.tsx
 *
 * 답변 종료(answer_end) 직후 evaluating 단계에서 보여주는 패널입니다.
 * 내 답변(최종 자막)만 확인용으로 가볍게 보여준 뒤, "다음 질문" 버튼으로
 * 다음 질문(꼬리/메인) 또는 요약으로 넘어갑니다.
 *
 * 방침(면접방 UX): 질문별 AI 피드백으로 흐름을 끊지 않는다 — 평가는 면접을 끝까지
 * 본 뒤 "결과 페이지에서만" 보여준다. 백엔드는 답변마다 평가를 생성하지만(최종 요약의
 * 재료), 면접 중에는 화면에 노출하지 않는다.
 */

import { ChevronRight, Loader2 } from "lucide-react"
import { cn } from "@/lib/utils"

interface Props {
  transcript: string // 최종 답변 자막(인식 확인용)
  nextRequested: boolean // "다음 질문"을 눌러 다음 질문 대기 중
  onNext: () => void
}

const primaryButton =
  "inline-flex items-center justify-center gap-1.5 rounded-xl bg-primary px-4 py-2.5 text-sm font-semibold text-white transition-opacity disabled:opacity-50"

export function EvaluationPanel({ transcript, nextRequested, onNext }: Props) {
  return (
    <section className="border-warm-border bg-background space-y-4 rounded-2xl border p-4 shadow-sm">
      <div className="space-y-1.5">
        <p className="text-muted text-xs font-semibold">내 답변</p>
        <p className="text-ink text-sm leading-relaxed">
          {transcript || <span className="text-disabled">답변이 인식되지 않았어요.</span>}
        </p>
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
