/**
 * dummyMetrics.ts
 *
 * MediaPipe 없이 송신 파이프(구간 게이팅·throttle·이벤트·스냅샷)를 먼저 관통하기 위한
 * 가짜 지표 산출원입니다(2단계). 사인파로 gaze 가 주기적으로 |0.3| 을 넘게 만들어
 * gaze_away 이벤트가 실제로 발화되는지까지 확인할 수 있습니다.
 * 실연결(3단계) 시 useFaceLandmarker 기반 산출원으로 교체합니다.
 */

import type { MetricsProducer } from "../hooks/useNonverbalCapture"

export function createDummyMetricsProducer(): MetricsProducer {
  const start = performance.now()
  return (_video, now) => {
    const t = (now - start) / 1000
    return {
      gazeX: 0.45 * Math.sin(t / 3), // 주기적으로 0.3 초과 → 시선이탈 이벤트 트리거
      gazeY: 0.2 * Math.sin(t / 5),
      headYaw: 15 * Math.sin(t / 4),
      headPitch: 8 * Math.sin(t / 6),
      headRoll: 5 * Math.sin(t / 7),
      expression: Math.sin(t / 8) > 0 ? "neutral" : "smile",
    }
  }
}
