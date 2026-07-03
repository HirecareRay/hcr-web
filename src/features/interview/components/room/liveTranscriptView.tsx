/**
 * liveTranscriptView.tsx
 *
 * 음성 모드 "말하는 중" 단계의 읽기 전용 자막 뷰입니다.
 * STT 자막(transcript_delta 누적)이 들어오는 대로 보여줍니다(편집 불가 — 인식이 끝난 뒤
 * review 단계에서 수정). 배포 기본값은 실시간 부분 자막 OFF 라 답변을 끝내야 인식 결과가
 * 채워지므로, 아직 자막이 없을 때 "실시간"을 약속하지 않고 정직한 안내만 보여준다.
 * 자막이 들어오면 끝에 깜빡이는 커서를 붙여 스트리밍 느낌을 준다.
 *
 * 자막칸은 카드 안 남는 높이를 채운다(flex-1). 답변이 길어져도 패널이 늘어나지 않고 안에서만
 * 스크롤한다 — review 단계 텍스트칸과 같은 높이라 단계 전환 시 레이아웃이 안 튄다. 새 자막이
 * 들어오면 항상 하단으로 자동 스크롤해 최신 인식 결과(+커서)가 보이게 유지한다.
 */

"use client"

import { useEffect, useRef } from "react"

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
    // 읽기 전용 자막 — 자막이 들어오면 끝에 깜빡이는 커서로 스트리밍 느낌
    <div
      ref={scrollRef}
      aria-live="polite"
      className="border-warm-border bg-background text-ink min-h-0 w-full flex-1 overflow-y-auto rounded-xl border p-3 text-sm leading-relaxed"
    >
      {hasText ? (
        <span>
          {transcript}
          <span className="bg-primary ml-0.5 inline-block h-4 w-0.5 animate-pulse align-middle" />
        </span>
      ) : (
        <span className="text-disabled">
          편하게 답변하세요. 답변을 마치면 인식된 내용이 여기에 표시돼요
        </span>
      )}
    </div>
  )
}
