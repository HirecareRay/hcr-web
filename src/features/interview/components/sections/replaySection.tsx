/**
 * replaySection.tsx
 *
 * 면접 다시 보기 — 녹화본 재생 영역과 질문별 타임라인 마커입니다.
 * 녹화 인프라가 아직 없어(available=false) 지금은 플레이스홀더를 보여주되,
 * 질문별 마커 타임라인은 미리 노출해 추후 미디어만 연결하면 되도록 합니다.
 */

import { PlayCircle, Video } from "lucide-react"
import { ResultSection } from "../resultSection"
import { formatClock } from "../../lib/formatters"
import type { InterviewReplay } from "../../types/interviewResult"

interface Props {
  replay: InterviewReplay
}

export function ReplaySection({ replay }: Props) {
  return (
    <ResultSection title="면접 다시 보기">
      {/* 재생 영역 (현재 플레이스홀더) */}
      <div className="bg-warm-bg flex aspect-video w-full flex-col items-center justify-center gap-2 rounded-xl">
        {replay.available && replay.mediaUrl ? (
          // TODO: 녹화 인프라 연결 시 실제 <video> 플레이어로 교체.
          <video src={replay.mediaUrl} controls className="h-full w-full rounded-xl" />
        ) : (
          <>
            <Video className="text-disabled h-8 w-8" />
            <p className="text-muted text-sm font-medium">녹화 다시 보기 준비 중</p>
            <p className="text-disabled text-xs">면접 녹화 기능은 곧 제공될 예정이에요</p>
          </>
        )}
      </div>

      {/* 질문별 타임라인 마커 */}
      <ul className="mt-4 space-y-1">
        {replay.markers.map((marker) => (
          <li
            key={`${marker.no}-${marker.atSec}`}
            className="flex items-center gap-3 rounded-lg px-2 py-2"
          >
            <PlayCircle className="text-disabled h-4 w-4 shrink-0" />
            <span className="text-muted w-12 shrink-0 text-xs font-semibold tabular-nums">
              {formatClock(marker.atSec)}
            </span>
            <span className="text-ink flex-1 text-sm">{marker.label}</span>
          </li>
        ))}
      </ul>
    </ResultSection>
  )
}
