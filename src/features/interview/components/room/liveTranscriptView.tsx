/**
 * liveTranscriptView.tsx
 *
 * 음성 모드 "말하는 중" 단계의 읽기 전용 실시간 자막 뷰입니다.
 * STT 자막(transcript_delta 누적)이 글자 단위로 흘러들어오는 모습을 그대로 보여줍니다
 * (편집 불가 — 인식이 끝난 뒤 review 단계에서 수정). 끝에 깜빡이는 커서를 붙여
 * "지금 인식 중"이라는 스트리밍 느낌을 줍니다.
 *
 * 자막이 길어지면 패널 높이를 캡하고(max-h) 넘치는 만큼만 스크롤한다 — 긴 답변에서
 * 무한히 늘어나 화면을 밀어내지 않게. 새 자막이 들어오면 항상 하단으로 자동 스크롤해
 * 최신 인식 결과(+커서)가 보이게 유지한다.
 */

"use client"

import { useEffect, useRef } from "react"
import { Mic } from "lucide-react"

interface Props {
  transcript: string // 누적 자막(읽기 전용)
}

export function LiveTranscriptView({ transcript }: Props) {
  const hasText = transcript.trim().length > 0

  // 새 자막이 누적될 때마다 스크롤 컨테이너를 맨 아래로 — 최신 토큰·커서를 항상 노출.
  const scrollRef = useRef<HTMLDivElement>(null)
  useEffect(() => {
    const el = scrollRef.current
    if (el) el.scrollTop = el.scrollHeight
  }, [transcript])

  return (
    <div className="space-y-2">
      {/* 인식 중 표시 — 점 3개가 차례로 깜빡여 진행 중임을 알린다 */}
      <div className="text-primary flex items-center gap-1.5 text-xs font-medium">
        <Mic className="h-4 w-4 animate-pulse" />
        <span>인식 중</span>
        <span className="inline-flex gap-0.5" aria-hidden>
          <span className="animate-bounce [animation-delay:-0.3s]">.</span>
          <span className="animate-bounce [animation-delay:-0.15s]">.</span>
          <span className="animate-bounce">.</span>
        </span>
      </div>

      {/* 읽기 전용 자막 — 끝에 깜빡이는 커서로 스트리밍 느낌 */}
      <div
        ref={scrollRef}
        aria-live="polite"
        className="border-warm-border bg-background text-ink max-h-60 min-h-[7.5rem] w-full overflow-y-auto rounded-xl border p-3 text-sm leading-relaxed"
      >
        {hasText ? (
          <span>
            {transcript}
            <span className="bg-primary ml-0.5 inline-block h-4 w-0.5 animate-pulse align-middle" />
          </span>
        ) : (
          <span className="text-disabled">말씀하시면 실시간으로 자막이 나타나요…</span>
        )}
      </div>
    </div>
  )
}
