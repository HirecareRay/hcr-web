/**
 * micLevelMeter.tsx
 *
 * 음성 모드 "말하는 중" 단계의 실시간 마이크 음량 미터(이퀄라이저형 막대)입니다.
 * 마이크 입력의 실제 음량을 Web Audio(AnalyserNode)로 읽어 막대 높이로 그립니다 —
 * "내 목소리가 잡히고 있다"는 presence 피드백을 STT 없이 비용 0으로 주기 위함.
 * 실시간 자막(LiveTranscriptView)이 비싸고(누적 재전사) 배포에선 꺼지는 것과 달리,
 * 이 미터는 항상 동작하고 STT 지연·오인식에도 안 깨집니다.
 *
 * 정직성: 가짜 애니메이션이 아니라 실제 주파수 스펙트럼을 막대에 반영합니다.
 * 성능: 막대 높이는 프레임마다 setState 하지 않고 ref 로 DOM transform 만 직접 바꿉니다
 * (60fps 리렌더 폭주 방지). 부모 리렌더에도 안 흔들리게 memo 로 감쌉니다.
 * 미지원/마이크 없음/권한 거부/오류 시 조용히 no-op 합니다(면접 흐름을 막지 않음).
 */

"use client"

import { memo, useEffect, useRef } from "react"
import { Mic } from "lucide-react"

interface Props {
  stream: MediaStream | null
  active: boolean // 음성 모드 & "말하는 중" 단계에서만 true
}

const barCount = 5
const fftSize = 1024 // 막대 몇 개엔 충분한 주파수 분해능
const minScaleY = 0.12 // 무음일 때 막대 최소 높이(완전히 사라지지 않게)
const smoothing = 0.35 // 0~1, 클수록 음량 변화에 빠르게 반응

// 브라우저 prefix 폴백 포함 AudioContext 생성자 조회.
function getAudioContextCtor(): typeof AudioContext | undefined {
  if (typeof window === "undefined") return undefined
  return (
    window.AudioContext ??
    (window as unknown as { webkitAudioContext?: typeof AudioContext }).webkitAudioContext
  )
}

function MicLevelMeterBase({ stream, active }: Props) {
  // 각 막대 DOM 을 ref 로 들고 rAF 안에서 transform 만 직접 바꾼다(프레임마다 setState 금지).
  const barRefs = useRef<(HTMLSpanElement | null)[]>([])

  useEffect(() => {
    if (!active || !stream || stream.getAudioTracks().length === 0) return

    const AudioCtor = getAudioContextCtor()
    if (!AudioCtor) return // 미지원 브라우저 — 조용히 비활성

    let audioContext: AudioContext
    let source: MediaStreamAudioSourceNode
    let analyser: AnalyserNode
    try {
      audioContext = new AudioCtor()
      // 오디오 트랙만 뽑아 별도 스트림으로 분석한다(영상 트랙 무관).
      const audioStream = new MediaStream(stream.getAudioTracks())
      source = audioContext.createMediaStreamSource(audioStream)
      analyser = audioContext.createAnalyser()
      analyser.fftSize = fftSize
      source.connect(analyser)
      // 자동재생 정책으로 suspended 상태면 재개 시도(실패해도 면접 흐름은 막지 않음).
      void audioContext.resume().catch(() => {})
    } catch (error) {
      console.error("마이크 레벨 미터 시작 실패:", error)
      return
    }

    const bins = analyser.frequencyBinCount
    const freq = new Uint8Array(bins)
    // 막대별 현재 높이(스무딩 상태) — rAF 프레임 사이에 유지한다.
    const levels = new Array<number>(barCount).fill(minScaleY)
    let rafId = 0

    const tick = () => {
      analyser.getByteFrequencyData(freq)
      // 사람 음성이 몰린 저~중역만 본다(고역 잡음 제외) — 앞 60% 빈을 barCount 개 밴드로 등분.
      const usable = Math.floor(bins * 0.6)
      const bandSize = Math.max(1, Math.floor(usable / barCount))

      for (let b = 0; b < barCount; b++) {
        const start = b * bandSize
        let sum = 0
        for (let i = start; i < start + bandSize; i++) sum += freq[i]
        const avg = sum / bandSize / 255 // 0~1 정규화
        const target = minScaleY + avg * (1 - minScaleY)
        // attack/decay 스무딩 — 급격한 점프 없이 출렁이게.
        levels[b] += (target - levels[b]) * smoothing
        const el = barRefs.current[b]
        if (el) el.style.transform = `scaleY(${levels[b].toFixed(3)})`
      }
      rafId = requestAnimationFrame(tick)
    }
    rafId = requestAnimationFrame(tick)

    return () => {
      cancelAnimationFrame(rafId)
      try {
        source.disconnect()
        void audioContext.close().catch(() => {})
      } catch (error) {
        console.error("마이크 레벨 미터 정리 실패:", error)
      }
    }
  }, [active, stream])

  return (
    <div className="space-y-2">
      {/* presence 라벨 — STT 여부와 무관하게 정직한 문구(인식 단정 X) */}
      <div className="text-primary flex items-center gap-1.5 text-xs font-medium">
        <Mic className="h-4 w-4 animate-pulse" />
        <span>녹음 중 · 잘 들리고 있어요</span>
      </div>

      {/* 실시간 음량 막대 — 높이는 rAF 가 transform 으로 직접 갱신(여기 style 은 무음 기본값) */}
      <div className="border-warm-border bg-background flex h-16 items-center justify-center gap-1.5 rounded-xl border">
        {Array.from({ length: barCount }).map((_, i) => (
          <span
            key={i}
            ref={(el) => {
              barRefs.current[i] = el
            }}
            className="bg-primary h-8 w-1.5 origin-center rounded-full"
            style={{ transform: `scaleY(${minScaleY})` }}
            aria-hidden
          />
        ))}
      </div>
    </div>
  )
}

export const MicLevelMeter = memo(MicLevelMeterBase)
