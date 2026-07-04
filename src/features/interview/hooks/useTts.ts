/**
 * useTts.ts
 *
 * AI 면접관이 질문을 "소리로 읽어주는" TTS 훅입니다.
 * 현재는 브라우저 내장 Web Speech API(SpeechSynthesis)를 사용합니다 — 의존성 0, 무료.
 *
 * 면접관 페르소나별 톤: speak(text, voiceHint) 로 voice 힌트를 넘기면 pitch/rate 를 바꿔
 * 담당자별로 목소리 느낌을 다르게 냅니다(soft_high/low_firm/calm_mid → lib/ttsVoices).
 * ko-KR voice 가 여러 개면 힌트별로 다른 voice 를 best-effort 로 배정하고, 하나뿐이면
 * pitch/rate 차등만 적용합니다. 힌트가 ""·미매칭이면 기본 톤으로 폴백합니다.
 *
 * 🔭 확장 포인트(CLAUDE.md): 음질을 높이려면 이 훅의 speak() 내부만
 *    서버 경유 TTS(예: app/api/interview/tts → 오디오 반환 → <audio> 재생)로 교체하세요.
 *    컴포넌트는 speak()/cancel()/isSpeaking 인터페이스만 알면 되므로 영향받지 않습니다.
 */

"use client"

import { useCallback, useEffect, useRef, useState } from "react"
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

export function useTts() {
  const [isSpeaking, setIsSpeaking] = useState(false)
  const [supported, setSupported] = useState(true)
  // 사용 가능한 voice 목록 — 비동기 로드(onvoiceschanged)라 ref 에 캐시한다.
  const voicesRef = useRef<SpeechSynthesisVoice[]>([])

  useEffect(() => {
    const hasTts = typeof window !== "undefined" && "speechSynthesis" in window
    setSupported(hasTts)
    if (!hasTts) return

    const loadVoices = () => {
      voicesRef.current = window.speechSynthesis.getVoices()
    }
    loadVoices() // 이미 로드돼 있으면 즉시 채움
    window.speechSynthesis.addEventListener("voiceschanged", loadVoices)

    // 언마운트 시 진행 중인 발화 중단
    return () => {
      window.speechSynthesis.removeEventListener("voiceschanged", loadVoices)
      window.speechSynthesis.cancel()
    }
  }, [])

  // 질문을 읽고, 다 읽으면 resolve되는 Promise를 반환합니다(미지원/오류 시 즉시 resolve).
  // voiceHint 로 면접관 페르소나별 톤(pitch/rate)과 voice 를 결정합니다(없으면 기본 톤).
  const speak = useCallback(
    (text: string, voiceHint?: string | null) =>
      new Promise<void>((resolve) => {
        if (typeof window === "undefined" || !("speechSynthesis" in window)) {
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

        utterance.onstart = () => setIsSpeaking(true)
        utterance.onend = () => {
          setIsSpeaking(false)
          resolve()
        }
        utterance.onerror = () => {
          setIsSpeaking(false)
          resolve()
        }

        window.speechSynthesis.speak(utterance)
      }),
    []
  )

  const cancel = useCallback(() => {
    if (typeof window !== "undefined") window.speechSynthesis?.cancel()
    setIsSpeaking(false)
  }, [])

  return { speak, cancel, isSpeaking, supported }
}
