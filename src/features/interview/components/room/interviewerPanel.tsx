/**
 * interviewerPanel.tsx
 *
 * AI 면접관 패널 — 현재 질문 텍스트, 질문 번호(러닝), 꼬리질문 여부,
 * TTS 발화 상태("읽는 중"), "질문 다시 듣기" 버튼을 보여줍니다.
 * 질문은 백엔드 WS 이벤트에서 오며, 실제 발화는 부모(useTts)가 담당합니다.
 */

import { Bot, RefreshCw, Volume2 } from "lucide-react"

interface Props {
  questionText: string
  questionNo: number // 도착한 질문 러닝 번호(꼬리질문 포함, 분모 없음)
  isFollowUp: boolean // 직전 답변 기반 꼬리질문이면 true
  isSpeaking: boolean
  ttsSupported: boolean
  onReplay: () => void
}

export function InterviewerPanel({
  questionText,
  questionNo,
  isFollowUp,
  isSpeaking,
  ttsSupported,
  onReplay,
}: Props) {
  return (
    <section className="border-warm-border bg-warm-bg rounded-2xl border p-4">
      <div className="flex items-center gap-2">
        <span className="bg-primary/15 text-primary flex h-9 w-9 items-center justify-center rounded-full">
          <Bot className="h-5 w-5" />
        </span>
        <div className="flex-1">
          <p className="text-muted text-xs font-semibold">AI 면접관</p>
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

      <p className="text-ink mt-3 text-base leading-relaxed font-semibold">{questionText}</p>

      {ttsSupported && (
        <button
          type="button"
          onClick={onReplay}
          className="text-muted hover:text-ink mt-3 inline-flex items-center gap-1 text-xs font-medium"
        >
          <RefreshCw className="h-3.5 w-3.5" />
          질문 다시 듣기
        </button>
      )}
    </section>
  )
}
