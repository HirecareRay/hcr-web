/**
 * throttle.ts
 *
 * 송신 간격 판정용 순수 함수입니다. 타이머가 아니라 "마지막 송신 시각 vs 지금"을 비교만 하므로
 * 결정적이고 테스트 가능합니다(가짜 now 를 넣어 검증).
 */

// 마지막 송신 이후 intervalMs 가 지났으면(또는 한 번도 안 보냈으면) true.
export function shouldEmit(lastEmitAt: number | null, now: number, intervalMs: number): boolean {
  if (lastEmitAt === null) return true
  return now - lastEmitAt >= intervalMs
}
