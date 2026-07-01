/**
 * useMediaStream.ts
 *
 * 화상 면접용 카메라/마이크 스트림(getUserMedia)을 관리하는 훅입니다.
 * 권한 상태와 MediaStream을 제공하고, 언마운트 시 트랙을 안전하게 정리합니다.
 */

"use client"

import { useCallback, useEffect, useRef, useState } from "react"

export type MediaPermission = "idle" | "requesting" | "granted" | "denied"

export interface RequestOptions {
  video: boolean
  audio: boolean
}

export function useMediaStream() {
  const streamRef = useRef<MediaStream | null>(null)
  const [stream, setStream] = useState<MediaStream | null>(null)
  const [permission, setPermission] = useState<MediaPermission>("idle")
  const [error, setError] = useState<string | null>(null)

  const stop = useCallback(() => {
    streamRef.current?.getTracks().forEach((track) => track.stop())
    streamRef.current = null
    setStream(null)
  }, [])

  // 카메라/마이크 권한을 요청하고 스트림을 확보합니다. 실패 시 null을 반환합니다.
  const request = useCallback(async (options: RequestOptions): Promise<MediaStream | null> => {
    if (typeof navigator === "undefined" || !navigator.mediaDevices?.getUserMedia) {
      setPermission("denied")
      setError("이 브라우저는 카메라/마이크를 지원하지 않습니다")
      return null
    }

    setPermission("requesting")
    setError(null)

    try {
      const media = await navigator.mediaDevices.getUserMedia(options)
      streamRef.current = media
      setStream(media)
      setPermission("granted")
      return media
    } catch (err) {
      console.error("미디어 장치 접근 실패:", err)
      setPermission("denied")
      setError("카메라/마이크 권한이 필요합니다. 권한을 허용하거나 텍스트 모드로 진행하세요")
      return null
    }
  }, [])

  // 언마운트 시 트랙 정리 (카메라 표시등이 계속 켜져 있는 것 방지)
  useEffect(() => {
    return () => {
      streamRef.current?.getTracks().forEach((track) => track.stop())
    }
  }, [])

  return { stream, permission, error, request, stop }
}
