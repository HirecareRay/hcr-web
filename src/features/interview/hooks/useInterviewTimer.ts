/**
 * useInterviewTimer.ts
 *
 * 전체 면접 시간 카운트다운 훅입니다. "전체 시간만 실제 제한" 정책을 구현합니다.
 * running이 true인 동안 1초씩 줄며, 0에 도달하면 onExpire를 1회 호출합니다.
 */

"use client"

import { useEffect, useRef, useState } from "react"

export function useInterviewTimer(totalSec: number, running: boolean, onExpire: () => void) {
  const [remainingSec, setRemainingSec] = useState(totalSec)
  const onExpireRef = useRef(onExpire)
  onExpireRef.current = onExpire

  // 전체 시간이 바뀌면(세션 시작 시) 카운트다운을 리셋합니다.
  useEffect(() => {
    setRemainingSec(totalSec)
  }, [totalSec])

  useEffect(() => {
    if (!running) return

    const id = setInterval(() => {
      setRemainingSec((prev) => {
        if (prev <= 1) {
          clearInterval(id)
          onExpireRef.current()
          return 0
        }
        return prev - 1
      })
    }, 1000)

    return () => clearInterval(id)
  }, [running])

  return remainingSec
}
