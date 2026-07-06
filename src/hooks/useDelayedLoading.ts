import { useEffect, useState } from "react"

/**
 * isLoading이 delayMs보다 오래 지속될 때만 true를 반환한다.
 *
 * 응답이 delayMs 안에 끝나면 로딩 표시(스켈레톤 등)를 아예 띄우지 않는다 — 짧게
 * 떴다 사라지는 깜빡임이 실제 대기시간보다 더 느리게 느껴지게 만들기 때문(닐슨 반응속도
 * 기준상 ~0.2~0.3초 이내는 "즉각 반응" 구간이라 별도 표시가 오히려 역효과).
 * isLoading이 false가 되면 지연 없이 즉시 꺼진다.
 */
export function useDelayedLoading(isLoading: boolean, delayMs = 250): boolean {
  const [showLoading, setShowLoading] = useState(false)

  useEffect(() => {
    if (!isLoading) {
      setShowLoading(false)
      return
    }
    const timer = setTimeout(() => setShowLoading(true), delayMs)
    return () => clearTimeout(timer)
  }, [isLoading, delayMs])

  return showLoading
}
