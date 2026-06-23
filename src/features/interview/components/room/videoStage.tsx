/**
 * videoStage.tsx
 *
 * 화상 면접용 내 웹캠 미리보기입니다. MediaStream을 <video>에 연결해 보여줍니다.
 * 셀카처럼 보이도록 좌우 반전(scaleX(-1))하며, 스트림이 없으면 안내 플레이스홀더를 표시합니다.
 */

"use client"

import { useEffect, useRef } from "react"
import { VideoOff } from "lucide-react"

interface Props {
  stream: MediaStream | null
  label?: string
}

export function VideoStage({ stream, label = "나" }: Props) {
  const videoRef = useRef<HTMLVideoElement>(null)

  useEffect(() => {
    if (videoRef.current && stream) {
      videoRef.current.srcObject = stream
    }
  }, [stream])

  return (
    <div className="bg-ink relative aspect-video w-full overflow-hidden rounded-2xl">
      {stream ? (
        <video
          ref={videoRef}
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
