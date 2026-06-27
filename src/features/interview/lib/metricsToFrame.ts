/**
 * metricsToFrame.ts
 *
 * 브라우저 내부 지표(FaceMetrics, camelCase)를 백엔드 계약(LandmarkFrameMessage, snake_case)으로
 * 변환하는 순수 함수입니다. camel↔snake 매핑은 오직 이 경계 한 곳에서만 일어납니다.
 * (백엔드는 alias 변환 없이 raw snake_case 키를 그대로 받습니다 — interviewProtocol.ts 주석 참고)
 */

import type { LandmarkFrameMessage } from "../types/interviewProtocol"
import type { FaceMetrics } from "../types/nonverbal"

// null 지표는 그대로 null 로 보냄(계약상 전부 optional/nullable).
export function metricsToFrame(metrics: FaceMetrics): LandmarkFrameMessage {
  return {
    type: "landmark_frame",
    gaze_x: metrics.gazeX,
    gaze_y: metrics.gazeY,
    head_yaw: metrics.headYaw,
    head_pitch: metrics.headPitch,
    head_roll: metrics.headRoll,
    expression: metrics.expression,
  }
}
