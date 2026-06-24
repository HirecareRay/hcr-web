/**
 * useTts.ts
 *
 * AI 면접관이 질문을 "소리로 읽어주는" TTS 훅입니다.
 * 현재는 브라우저 내장 Web Speech API(SpeechSynthesis)를 사용합니다 — 의존성 0, 무료.
 *
 * 🔭 확장 포인트(CLAUDE.md): 음질을 높이려면 이 훅의 speak() 내부만
 *    서버 경유 TTS(예: app/api/interview/tts → 오디오 반환 → <audio> 재생)로 교체하세요.
 *    컴포넌트는 speak()/cancel()/isSpeaking 인터페이스만 알면 되므로 영향받지 않습니다.
 */

"use client"

import { useCallback, useEffect, useState } from "react"

export function useTts() {
  const [isSpeaking, setIsSpeaking] = useState(false)
  const [supported, setSupported] = useState(true)

  useEffect(() => {
    setSupported(typeof window !== "undefined" && "speechSynthesis" in window)
    // 언마운트 시 진행 중인 발화 중단
    return () => {
      if (typeof window !== "undefined") window.speechSynthesis?.cancel()
    }
  }, [])

  // 질문을 읽고, 다 읽으면 resolve되는 Promise를 반환합니다(미지원/오류 시 즉시 resolve).
  const speak = useCallback(
    (text: string) =>
      new Promise<void>((resolve) => {
        if (typeof window === "undefined" || !("speechSynthesis" in window)) {
          resolve()
          return
        }

        window.speechSynthesis.cancel()
        const utterance = new SpeechSynthesisUtterance(text)
        utterance.lang = "ko-KR"
        utterance.rate = 1 // 말 속도 (서버 TTS 전환 시에도 조절 가능)
        utterance.pitch = 1

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
