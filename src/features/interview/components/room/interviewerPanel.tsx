/**
 * interviewerPanel.tsx
 *
 * AI 면접관 패널 — 현재 질문 텍스트, 질문 번호(러닝), 담당자 배지(페르소나),
 * 꼬리질문 여부, TTS 발화 상태("읽는 중"), "질문 다시 듣기" 버튼을 보여줍니다.
 * 질문은 백엔드 WS 이벤트에서 오며, 실제 발화는 부모(useTts)가 담당합니다.
 *
 * roleLabel/personaId 는 백엔드가 질문마다 실어 주는 면접관 정보입니다. 비어 있으면
 * 담당자 배지를 숨기고 기본 "AI 면접관" 표기로 폴백합니다(면접 흐름 무영향).
 */

import { Bot, RefreshCw, Volume2 } from "lucide-react"
import { cn } from "@/lib/utils"
import { getPersona } from "../../lib/personas"

interface Props {
  questionText: string
  questionNo: number // 도착한 질문 러닝 번호(꼬리질문 포함, 분모 없음)
  isFollowUp: boolean // 직전 답변 기반 꼬리질문이면 true
  isSpeaking: boolean
  ttsSupported: boolean
  onReplay: () => void
  roleLabel?: string // 담당자 표시 이름(백엔드) — 비면 배지 숨김
  personaId?: string // 담당자 식별자(배지 색 결정) — 미매칭이면 기본 색
  className?: string // 부모 배치용(예: flex-1 로 질문·답변 사이 남는 높이 채우기)
}

export function InterviewerPanel({
  questionText,
  questionNo,
  isFollowUp,
  isSpeaking,
  ttsSupported,
  onReplay,
  roleLabel,
  personaId,
  className,
}: Props) {
  const persona = getPersona(personaId)
  // 배지는 roleLabel(백엔드) 이 있을 때만. 색은 페르소나 매칭 시 그 색, 아니면 중립 primary.
  const showRoleBadge = !!roleLabel
  const badgeClass = persona?.badgeClass ?? "bg-primary/15 text-primary"

  return (
    // 질문 카드는 내용 크기(자연 높이). 남는 높이는 아래 답변 카드가 채운다.
    <section className={cn("border-warm-border bg-warm-bg rounded-2xl border p-3", className)}>
      <div className="flex items-center gap-2">
        <span className="bg-primary/15 text-primary flex h-9 w-9 items-center justify-center rounded-full">
          <Bot className="h-5 w-5" />
        </span>
        <div className="flex-1">
          <div className="flex items-center gap-1.5">
            <p className="text-muted text-xs font-semibold">AI 면접관</p>
            {showRoleBadge && (
              <span className={`${badgeClass} rounded-full px-1.5 py-0.5 text-xs font-medium`}>
                {roleLabel}
              </span>
            )}
          </div>
          <p className="text-disabled text-xs">
            질문 {questionNo}
            {isFollowUp && (
              <span className="bg-primary/15 text-primary ml-1.5 rounded-full px-1.5 py-0.5 text-xs font-medium">
                꼬리질문
              </span>
            )}
          </p>
        </div>
        {isSpeaking && (
          <span className="text-primary flex items-center gap-1 text-xs font-medium">
            <Volume2 className="h-4 w-4 animate-pulse" />
            읽는 중
          </span>
        )}
      </div>

      <p className="text-ink mt-2 text-base leading-snug font-semibold">{questionText}</p>

      {ttsSupported && (
        <button
          type="button"
          onClick={onReplay}
          className="text-muted hover:text-ink mt-2 inline-flex items-center gap-1 text-xs font-medium"
        >
          <RefreshCw className="h-3.5 w-3.5" />
          질문 다시 듣기
        </button>
      )}
    </section>
  )
}
