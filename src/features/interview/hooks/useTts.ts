/**
 * useTts.ts
 *
 * AI 면접관이 질문을 "소리로 읽어주는" TTS 훅입니다.
 *
 * 재생 순서: ① 백엔드 TTS(ElevenLabs, mp3) 우선 → ② 실패 시 브라우저 SpeechSynthesis 폴백.
 *   - 백엔드: BFF(app/api/interview/tts)에 personaId 만 넘기면 담당 면접관(인사/기술/실무)
 *     목소리로 합성한 mp3 를 준다. 프론트는 voice id 를 모른다(백엔드가 고름).
 *   - 폴백: 백엔드 TTS 비활성(404)·인증 실패(401)·합성 실패(502)·네트워크 오류·자동재생 차단 시
 *     기존 SpeechSynthesis 로 조용히 읽는다. voiceHint(soft_high/low_firm/calm_mid)로 톤 차등.
 *
 * 엣지 케이스:
 *   - 중복 재생 방지: 새 질문(speak 재호출)마다 직전 오디오를 멈추고 blob URL 을 revoke 한 뒤
 *     새로 재생한다. 재생 핸들·URL·요청은 모두 ref 로 관리한다.
 *   - stale 응답 무시: seq 카운터로 "가장 최근 speak" 만 상태를 소유한다. 늦게 도착한 이전
 *     합성 응답은 버린다(AbortController 로 진행 중 요청도 취소).
 *   - 정리: 언마운트·cancel 시 재생 중지 + blob URL revoke(메모리 누수 방지).
 *
 * 🔭 확장 포인트(CLAUDE.md): 질문을 소리로 읽는 단일 지점이 이 훅의 speak() 이다.
 *    컴포넌트는 speak()/cancel()/isSpeaking 인터페이스만 알면 되므로 백엔드 교체에 영향받지 않는다.
 */

"use client"

import { useCallback, useEffect, useRef, useState } from "react"
import { apiEndpoints } from "@/constants/api"
import { getVoiceProfile } from "../lib/ttsVoices"

// ko-KR voice 목록에서 힌트별로 다른 voice 를 배정한다(있으면 우선). voice 가 하나뿐이면
// 모두 같은 voice → pitch/rate 차등만으로 구분한다. 힌트가 없으면 첫 ko-KR voice.
const voiceHintOrder = ["soft_high", "low_firm", "calm_mid"]

// 자연스러운 한국어 voice 이름(부분 일치). 브라우저·OS 대표 고품질 음성만 화이트리스트로 둔다.
// ⚠️ macOS 는 기본 음성 '유나'만 자연스럽고, 나머지 ko voice(Eddy·Grandma·Flo 등)는
//    노벨티(캐릭터) 음성이라 목소리가 이상하게 들린다. 예전엔 koVoices[idx] 로 앞에서부터
//    골라 면접관 2·3인이 이 노벨티 음성에 걸렸다 → 화이트리스트+default 로만 걸러 배제한다.
const preferredKoVoiceNames = [
  "유나",
  "Yuna",
  "Google",
  "Microsoft",
  "Heami",
  "SunHi",
  "InJoon",
  "Nari",
]

// 노벨티 음성을 배제한 "쓸 만한" 한국어 voice 를 우선순위로 모은다.
// 기본(default) 음성을 최우선(대개 OS 대표 음성 = 자연스러움)으로, 이어서 이름
// 화이트리스트에 걸리는 음성을 덧붙인다. 아무것도 못 고르면(정보가 부족한 브라우저)
// 전체 ko 목록으로 폴백한다(최후의 보루).
function usableKoVoices(voices: SpeechSynthesisVoice[]): SpeechSynthesisVoice[] {
  const koVoices = voices.filter((v) => v.lang?.toLowerCase().startsWith("ko"))
  const good: SpeechSynthesisVoice[] = []
  const add = (v?: SpeechSynthesisVoice) => {
    if (v && !good.includes(v)) good.push(v)
  }
  add(koVoices.find((v) => v.default))
  for (const name of preferredKoVoiceNames) {
    add(koVoices.find((v) => v.name.includes(name)))
  }
  return good.length > 0 ? good : koVoices
}

function pickKoVoice(
  voices: SpeechSynthesisVoice[],
  voiceHint?: string | null
): SpeechSynthesisVoice | undefined {
  const koVoices = usableKoVoices(voices)
  if (koVoices.length === 0) return undefined
  const idx = voiceHint ? voiceHintOrder.indexOf(voiceHint) : -1
  if (idx < 0) return koVoices[0]
  return koVoices[idx % koVoices.length]
}

// speak 옵션 — personaId 는 백엔드 목소리 선택용, voiceHint 는 폴백(SpeechSynthesis) 톤 차등용.
export interface SpeakOptions {
  personaId?: string | null
  voiceHint?: string | null
}

export function useTts() {
  const [isSpeaking, setIsSpeaking] = useState(false)
  const [supported, setSupported] = useState(true)
  // 사용 가능한 voice 목록 — 비동기 로드(onvoiceschanged)라 ref 에 캐시한다.
  const voicesRef = useRef<SpeechSynthesisVoice[]>([])

  // 현재 재생 자원 — 새 speak/cancel 시 정리 대상.
  const audioRef = useRef<HTMLAudioElement | null>(null)
  const urlRef = useRef<string | null>(null)
  const abortRef = useRef<AbortController | null>(null)
  // "가장 최근 speak" 식별자. 늦게 도착한 이전 합성 응답을 버리는 데 쓴다.
  const seqRef = useRef(0)

  // 진행 중인 재생·요청을 모두 멈추고 자원을 정리한다(다음 speak/cancel/언마운트 공용).
  const stopCurrent = useCallback(() => {
    abortRef.current?.abort()
    abortRef.current = null
    if (audioRef.current) {
      audioRef.current.pause()
      audioRef.current.src = ""
      audioRef.current = null
    }
    if (urlRef.current) {
      URL.revokeObjectURL(urlRef.current)
      urlRef.current = null
    }
    if (typeof window !== "undefined" && "speechSynthesis" in window) {
      window.speechSynthesis.cancel()
    }
  }, [])

  useEffect(() => {
    const hasTts = typeof window !== "undefined" && "speechSynthesis" in window
    setSupported(hasTts)
    if (!hasTts) return

    const loadVoices = () => {
      voicesRef.current = window.speechSynthesis.getVoices()
    }
    loadVoices() // 이미 로드돼 있으면 즉시 채움
    window.speechSynthesis.addEventListener("voiceschanged", loadVoices)

    // 언마운트 시 진행 중인 발화·재생 중단 + 자원 정리
    return () => {
      window.speechSynthesis.removeEventListener("voiceschanged", loadVoices)
      stopCurrent()
    }
  }, [stopCurrent])

  // SpeechSynthesis 폴백 — 백엔드 TTS 가 불가할 때 브라우저 내장 음성으로 읽는다.
  // mySeq 가 최신일 때만 상태를 만지고 resolve 한다(stale 방어).
  const speakWithSynthesis = useCallback(
    (text: string, voiceHint: string | null | undefined, mySeq: number, resolve: () => void) => {
      if (typeof window === "undefined" || !("speechSynthesis" in window)) {
        if (mySeq === seqRef.current) setIsSpeaking(false)
        resolve()
        return
      }

      window.speechSynthesis.cancel()
      const utterance = new SpeechSynthesisUtterance(text)
      utterance.lang = "ko-KR"

      const profile = getVoiceProfile(voiceHint)
      utterance.rate = profile.rate
      utterance.pitch = profile.pitch

      const voice = pickKoVoice(voicesRef.current, voiceHint)
      if (voice) utterance.voice = voice

      utterance.onstart = () => {
        if (mySeq === seqRef.current) setIsSpeaking(true)
      }
      const done = () => {
        if (mySeq === seqRef.current) setIsSpeaking(false)
        resolve()
      }
      utterance.onend = done
      utterance.onerror = done

      window.speechSynthesis.speak(utterance)
    },
    []
  )

  // 백엔드 TTS 응답(mp3)을 재생한다. 오디오가 아니거나 재생 실패면 fallback 으로 넘긴다.
  // mySeq 가 최신일 때만 상태·자원을 소유한다(늦게 도착한 이전 응답은 버림).
  const playFromResponse = useCallback(
    async (res: Response, mySeq: number, resolve: () => void, fallback: () => void) => {
      // 이 응답이 도착하기 전에 새 speak 가 시작됐다면 이번 결과는 버린다(그쪽이 상태 소유).
      if (mySeq !== seqRef.current) return
      const contentType = res.headers.get("content-type") ?? ""
      // 404(비활성)/401/502 등 → 오디오가 아님 → 폴백.
      if (!res.ok || !contentType.includes("audio")) {
        fallback()
        return
      }

      const blob = await res.blob()
      if (mySeq !== seqRef.current) return // blob 읽는 사이 새 speak → 버림

      const url = URL.createObjectURL(blob)
      urlRef.current = url
      const audio = new Audio(url)
      audioRef.current = audio

      // 이 재생분의 자원만 정리(더 최근 speak 의 자원은 건드리지 않는다).
      const cleanup = () => {
        if (urlRef.current === url) {
          URL.revokeObjectURL(url)
          urlRef.current = null
        }
        if (audioRef.current === audio) audioRef.current = null
      }

      audio.onended = () => {
        if (mySeq === seqRef.current) setIsSpeaking(false)
        cleanup()
        resolve()
      }
      audio.onerror = () => {
        cleanup()
        fallback() // 디코드·재생 오류 → SpeechSynthesis 폴백
      }
      // 자동재생 차단(사용자 제스처 부족) 등 → 조용히 폴백.
      audio.play().catch(() => {
        cleanup()
        fallback()
      })
    },
    []
  )

  // 질문을 읽고, 다 읽으면 resolve 되는 Promise 를 반환합니다(미지원/오류 시 즉시 resolve).
  //   1) 백엔드 TTS(mp3) 우선 재생 — options.personaId 로 담당 면접관 목소리.
  //   2) 실패(404/401/502·네트워크·자동재생 차단) 시 SpeechSynthesis 폴백(options.voiceHint 로 톤).
  const speak = useCallback(
    (text: string, options?: SpeakOptions) =>
      new Promise<void>((resolve) => {
        if (typeof window === "undefined") {
          resolve()
          return
        }

        // 직전 재생·요청 정리 후 이번 speak 를 최신으로 등록.
        stopCurrent()
        const mySeq = ++seqRef.current
        const voiceHint = options?.voiceHint ?? null
        // 이번 speak 가 여전히 최신일 때만 SpeechSynthesis 폴백으로 넘어간다.
        const fallback = () => {
          if (mySeq !== seqRef.current) {
            resolve()
            return
          }
          speakWithSynthesis(text, voiceHint, mySeq, resolve)
        }

        // 담당 면접관 배지·하이라이트가 곧바로 켜지도록 낙관적으로 speaking 표시.
        setIsSpeaking(true)

        const controller = new AbortController()
        abortRef.current = controller

        fetch(apiEndpoints.interview.tts, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ text, personaId: options?.personaId ?? "" }),
          signal: controller.signal,
        })
          .then((res) => playFromResponse(res, mySeq, resolve, fallback))
          .catch(() => {
            // abort(새 speak·cancel 로 취소) → 그쪽이 상태를 소유하므로 조용히 종료.
            if (controller.signal.aborted) {
              resolve()
              return
            }
            fallback() // 네트워크 오류 → 폴백
          })
      }),
    [stopCurrent, speakWithSynthesis, playFromResponse]
  )

  const cancel = useCallback(() => {
    // seq 를 올려 진행 중이던 speak 의 콜백들이 상태를 못 만지게 한 뒤 자원 정리.
    seqRef.current += 1
    stopCurrent()
    setIsSpeaking(false)
  }, [stopCurrent])

  return { speak, cancel, isSpeaking, supported }
}
