/**
 * nonverbal.ts
 *
 * 비언어 분석(Phase 4)의 "브라우저 내부" 도메인 타입입니다.
 * 백엔드로 나가는 계약(interviewProtocol.ts 의 LandmarkFrameMessage·EventSnapshotMessage)은
 * raw snake_case 지만, 브라우저 안에서 계산할 때는 코드 컨벤션대로 camelCase 로 다룹니다.
 * 계약 경계(= 송신 직전)에서만 metricsToFrame 으로 snake 변환합니다(매핑 1회).
 */

// MediaPipe FaceLandmarker 결과 → 계산한 비언어 지표 (전부 null 허용: 얼굴 미검출 프레임)
export interface FaceMetrics {
  gazeX: number | null // 0 = 정면, |값|>0.3 이면 백엔드가 "이탈"로 봄
  gazeY: number | null
  headYaw: number | null // 좌우 회전(도)
  headPitch: number | null // 상하 끄덕임(도)
  headRoll: number | null // 갸웃(도)
  expression: string | null // 우세 표정 라벨 (예: "neutral", "smile")
}

// 빈(얼굴 미검출) 지표 — 계산 함수들의 기본 반환값
export const emptyFaceMetrics: FaceMetrics = {
  gazeX: null,
  gazeY: null,
  headYaw: null,
  headPitch: null,
  headRoll: null,
  expression: null,
}

// 얼굴이 실제로 검출됐는지 — 신호가 하나라도 있으면 true.
// 카메라 가림·미검출 프레임은 모든 필드가 null 이라 false. 이런 프레임을 백엔드로 보내면
// "데이터 있음"으로 오판해 표정 점수가 가짜로(시선이탈 0% → 만점) 채워지므로, 송신 게이팅에 쓴다.
export function hasFaceSignal(m: FaceMetrics): boolean {
  return (
    m.gazeX !== null ||
    m.gazeY !== null ||
    m.headYaw !== null ||
    m.headPitch !== null ||
    m.headRoll !== null ||
    m.expression !== null
  )
}

// 감지하는 비언어 이벤트 종류
export type NonverbalEventKind = "gaze_away" | "flat_expression"

// 감지된 이벤트 1건 (스냅샷 송신의 트리거)
export interface NonverbalEvent {
  kind: NonverbalEventKind
  meta: Record<string, unknown>
}
