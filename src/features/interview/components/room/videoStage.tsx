/**
 * videoStage.tsx
 *
 * 화상 면접용 내 웹캠 미리보기입니다. MediaStream을 <video>에 연결해 보여줍니다.
 * 셀카처럼 보이도록 좌우 반전(scaleX(-1))하며, 스트림이 없으면 안내 플레이스홀더를 표시합니다.
 */

"use client"

import { useCallback, useEffect, useRef } from "react"
import { VideoOff } from "lucide-react"
import { cn } from "@/lib/utils"

interface Props {
  stream: MediaStream | null
  label?: string
  // 비언어 분석(MediaPipe)이 같은 <video> 픽셀을 읽도록 외부에서 ref 를 주입할 수 있습니다.
  // 미전달 시 기존 동작 그대로(setup 미리보기 등) — 영상 디코드는 한 번만 일어납니다.
  videoRef?: React.RefObject<HTMLVideoElement | null>
  // compact: 면접방(라이브)용 작은 자기화면 카드. 높이만 고정하고 폭은 16:9 로 자동 →
  //   화면을 잡아먹지 않아 질문·답변·버튼이 한 화면에 들어온다.
  // 기본(false): setup 미리보기 등에서 쓰던 풀폭 16:9.
  compact?: boolean
}

export function VideoStage({ stream, label = "나", videoRef, compact = false }: Props) {
  const internalRef = useRef<HTMLVideoElement | null>(null)

  // 내부 ref + (있으면) 외부 ref 를 동일 element 로 동기화합니다.
  // 메모이즈하지 않으면 ref 콜백 신원이 매 렌더 바뀌어 element 가 null→재부착되며,
  // 그 순간 MediaPipe tick 이 videoRef.current 를 null 로 읽을 수 있습니다.
  const setVideoEl = useCallback(
    (el: HTMLVideoElement | null) => {
      internalRef.current = el
      if (videoRef) videoRef.current = el
    },
    [videoRef]
  )

  useEffect(() => {
    if (internalRef.current && stream) {
      internalRef.current.srcObject = stream
    }
  }, [stream])

  return (
    <div
      className={cn(
        "bg-ink relative aspect-video overflow-hidden rounded-2xl",
        // 모바일: 폭을 꽉 채워 크게 / 웹(sm+): 높이 기준(카메라 옆 면접관 세로 배치)
        compact ? "w-full sm:h-72 sm:w-auto" : "w-full"
      )}
    >
      {stream ? (
        <video
          ref={setVideoEl}
          autoPlay
          playsInline
          muted
          className="h-full w-full [transform:scaleX(-1)] object-cover"
        />
      ) : (
        <div className="flex h-full w-full flex-col items-center justify-center gap-2 text-white/60">
          <VideoOff className="h-8 w-8" />
          <span className="text-xs">카메라가 꺼져 있습니다</span>
        </div>
      )}
      <span className="absolute bottom-2 left-2 rounded-md bg-black/50 px-2 py-0.5 text-xs font-medium text-white">
        {label}
      </span>
    </div>
  )
}
