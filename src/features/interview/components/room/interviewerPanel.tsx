/**
 * interviewerPanel.tsx
 *
 * AI 면접관 패널 — 현재 질문 텍스트, 질문 분류, TTS 발화 상태("읽는 중"),
 * "질문 다시 듣기" 버튼을 보여줍니다. 실제 발화는 부모(useTts)가 담당합니다.
 */

import { Bot, RefreshCw, Volume2 } from "lucide-react"
import { categoryLabel } from "../../lib/formatters"
import type { LiveQuestion } from "../../types/interviewSession"

interface Props {
  question: LiveQuestion
  isSpeaking: boolean
  ttsSupported: boolean
  onReplay: () => void
}

export function InterviewerPanel({ question, isSpeaking, ttsSupported, onReplay }: Props) {
  return (
    <section className="border-warm-border bg-warm-bg rounded-2xl border p-4">
      <div className="flex items-center gap-2">
        <span className="bg-primary/15 text-primary flex h-9 w-9 items-center justify-center rounded-full">
          <Bot className="h-5 w-5" />
        </span>
        <div className="flex-1">
          <p className="text-muted text-xs font-semibold">AI 면접관</p>
          <p className="text-disabled text-xs">
            질문 {question.no} · {categoryLabel(question.category)}
          </p>
        </div>
        {isSpeaking && (
          <span className="text-primary flex items-center gap-1 text-xs font-medium">
            <Volume2 className="h-4 w-4 animate-pulse" />
            읽는 중
          </span>
        )}
      </div>

      <p className="text-ink mt-3 text-base leading-relaxed font-semibold">{question.question}</p>

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
