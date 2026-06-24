/**
 * useStt.ts
 *
 * (음성 모드) MediaRecorder로 답변을 녹음하고, 멈추면 BFF로 보내 전사 텍스트를 받는 훅입니다.
 * 녹음 자체는 브라우저 네이티브이고, 전사(STT)는 서비스 계층(transcribeAudio)을 통해 BFF가 처리합니다.
 */

"use client"

import { useCallback, useRef, useState } from "react"
import { transcribeAudio } from "../services/interviewService"

export function useStt(sessionId: string | null) {
  const recorderRef = useRef<MediaRecorder | null>(null)
  const chunksRef = useRef<Blob[]>([])
  const [isRecording, setIsRecording] = useState(false)
  const [isTranscribing, setIsTranscribing] = useState(false)

  // 주어진 스트림(마이크 포함)으로 녹음을 시작합니다.
  const start = useCallback((stream: MediaStream) => {
    if (typeof MediaRecorder === "undefined") return
    chunksRef.current = []
    const recorder = new MediaRecorder(stream)
    recorder.ondataavailable = (event) => {
      if (event.data.size > 0) chunksRef.current.push(event.data)
    }
    recorder.start()
    recorderRef.current = recorder
    setIsRecording(true)
  }, [])

  // 녹음을 멈추고 전사 결과를 반환합니다(실패/미지원 시 빈 문자열).
  const stopAndTranscribe = useCallback(
    () =>
      new Promise<string>((resolve) => {
        const recorder = recorderRef.current
        if (!recorder) {
          resolve("")
          return
        }

        recorder.onstop = async () => {
          setIsRecording(false)
          const blob = new Blob(chunksRef.current, { type: "audio/webm" })

          if (!sessionId) {
            resolve("")
            return
          }

          try {
            setIsTranscribing(true)
            const { transcript } = await transcribeAudio(sessionId, blob)
            resolve(transcript)
          } catch (error) {
            console.error("전사 실패:", error)
            resolve("")
          } finally {
            setIsTranscribing(false)
          }
        }

        recorder.stop()
      }),
    [sessionId]
  )

  return { start, stopAndTranscribe, isRecording, isTranscribing }
}
