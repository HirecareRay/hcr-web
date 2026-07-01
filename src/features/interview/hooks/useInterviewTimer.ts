/**
 * useInterviewTimer.ts
 *
 * 면접 "경과 시간" 카운트업 훅입니다.
 *
 * 면접 길이는 시간이 아니라 메인 질문 수가 정한다(백엔드에 시간 제한 로직 없음 — 질문을 다 풀면
 * 종료). 그래서 이 타이머는 "마감 시계"가 아니라 진행 참고용 경과 시간만 잰다. 0초 만료·강제 종료
 * 개념이 없다 — 시간이 지나도 답변을 끊거나 요약으로 점프시키지 않는다.
 *
 * running 인 동안 1초씩 올라가고, resetKey 가 바뀌면(새 세션 시작·재시도) 0 으로 리셋한다.
 */

"use client"

import { useEffect, useState } from "react"

export function useInterviewTimer(running: boolean, resetKey: unknown): number {
  const [elapsedSec, setElapsedSec] = useState(0)

  // 세션이 바뀌면(새 면접·재시도) 경과를 0으로 리셋한다.
  useEffect(() => {
    setElapsedSec(0)
  }, [resetKey])

  useEffect(() => {
    if (!running) return

    const id = setInterval(() => {
      setElapsedSec((prev) => prev + 1)
    }, 1000)

    return () => clearInterval(id)
  }, [running])

  return elapsedSec
}
