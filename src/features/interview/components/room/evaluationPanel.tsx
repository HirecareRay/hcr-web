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

import { BarChart2, ChevronRight } from "lucide-react"
import { cn } from "@/lib/utils"

interface Props {
  transcript: string // 최종 답변 자막(인식 확인용)
  isLast: boolean // 마지막 질문이면 버튼을 "결과 보기"로, 아니면 "다음 질문"
  onNext: () => void
}

const primaryButton =
  "inline-flex items-center justify-center gap-1.5 rounded-xl bg-primary px-4 py-2.5 text-sm font-semibold text-white transition-opacity disabled:opacity-50"

// 대기 중 UI(다음 질문 생성 / 결과 정리)는 상위(interviewRoomPage)가 로더로 처리한다.
export function EvaluationPanel({ transcript, isLast, onNext }: Props) {
  return (
    // 답변 단계와 같이 하단 영역 높이를 꽉 채운다(h-full) — 평가 단계로 넘어가도 크기 동일
    <section className="border-warm-border bg-background flex h-full flex-col gap-2.5 rounded-2xl border p-3 shadow-sm">
      {/* 라벨은 박스 밖 위에(음성 검토의 배지 위치와 통일), 박스 안엔 답변 내용만 */}
      <p className="text-muted shrink-0 text-xs font-semibold">내 답변</p>
      <div className="border-warm-border min-h-0 w-full flex-1 overflow-y-auto rounded-xl border p-3">
        <p className="text-ink text-sm leading-relaxed">
          {transcript || <span className="text-disabled">답변이 인식되지 않았어요.</span>}
        </p>
      </div>

      <button type="button" onClick={onNext} className={cn(primaryButton, "w-full")}>
        {isLast ? (
          <>
            <BarChart2 className="h-4 w-4" />
            결과 보기
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
