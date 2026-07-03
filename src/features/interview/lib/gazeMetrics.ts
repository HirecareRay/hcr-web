/**
 * gazeMetrics.ts
 *
 * MediaPipe FaceLandmarker 결과(좌표·blendshape·변환행렬)에서 비언어 지표(FaceMetrics)를
 * 계산하는 순수 함수 모음입니다. MediaPipe 패키지에 의존하지 않도록 입력은 자체 최소 타입으로
 * 받습니다 — 덕분에 단위 테스트 시 가짜 입력만 넣으면 됩니다(러너 도입 시 바로 테스트 가능).
 *
 * 좌표 규약(백엔드 계약과 동일): gaze 는 0=정면 기준, |값|>0.3 이면 백엔드가 "이탈"로 봅니다.
 */

import { emptyFaceMetrics, type FaceMetrics } from "../types/nonverbal"

// ─── 입력 최소 타입 (MediaPipe 결과를 느슨하게 미러) ──────────────────────────
export interface Point3 {
  x: number // 정규화 0~1 (영상 너비 기준)
  y: number // 정규화 0~1 (영상 높이 기준)
  z: number
}

export interface BlendshapeCategory {
  categoryName: string
  score: number
}

// 한 프레임에서 추출한 원천 데이터 (얼굴 미검출 시 각 필드 null)
export interface FaceFrame {
  landmarks: Point3[] | null // refineLandmarks=on 이면 478점(홍채 468~477 포함)
  blendshapes: BlendshapeCategory[] | null // 52 blendshape
  transformMatrix: number[] | null // 4x4 column-major (length 16)
}

// FaceLandmarker 표준 인덱스 (refineLandmarks 기준)
const idx = {
  leftEyeOuter: 33,
  leftEyeInner: 133,
  leftEyeTop: 159,
  leftEyeBottom: 145,
  leftIris: 468,
  rightEyeInner: 362,
  rightEyeOuter: 263,
  rightEyeTop: 386,
  rightEyeBottom: 374,
  rightIris: 473,
} as const

function clamp(value: number, min: number, max: number): number {
  return Math.max(min, Math.min(max, value))
}

// [0,1] 구간에서의 위치비를 중앙=0 기준 [-1,1]로: ratio 0.5 → 0
function centered(ratio: number): number {
  return clamp((ratio - 0.5) * 2, -1, 1)
}

/**
 * 시선(gaze) 추정 — 홍채 중심이 눈 모서리/눈꺼풀 사이 어디에 있는지로 근사.
 * 양쪽 눈 평균. 정면이면 0 근방, 옆을 보면 |gazeX|↑, 위아래는 |gazeY|↑.
 */
export function computeGaze(landmarks: Point3[]): Pick<FaceMetrics, "gazeX" | "gazeY"> {
  const p = (i: number): Point3 | undefined => landmarks[i]
  const need = [
    idx.leftEyeOuter,
    idx.leftEyeInner,
    idx.leftEyeTop,
    idx.leftEyeBottom,
    idx.leftIris,
    idx.rightEyeInner,
    idx.rightEyeOuter,
    idx.rightEyeTop,
    idx.rightEyeBottom,
    idx.rightIris,
  ]
  if (need.some((i) => p(i) === undefined)) return { gazeX: null, gazeY: null }

  const span = (a: number, b: number) => b - a || 1e-6 // 0 분모 방어

  // 수평: 홍채 x 가 눈 양 끝 사이 어디인지 (눈마다 안/밖 순서가 달라 절대폭으로 정규화)
  const lx =
    (p(idx.leftIris)!.x - p(idx.leftEyeOuter)!.x) /
    span(p(idx.leftEyeOuter)!.x, p(idx.leftEyeInner)!.x)
  const rx =
    (p(idx.rightIris)!.x - p(idx.rightEyeInner)!.x) /
    span(p(idx.rightEyeInner)!.x, p(idx.rightEyeOuter)!.x)
  const gazeX = centered((lx + rx) / 2)

  // 수직: 홍채 y 가 위/아래 눈꺼풀 사이 어디인지
  const ly =
    (p(idx.leftIris)!.y - p(idx.leftEyeTop)!.y) /
    span(p(idx.leftEyeTop)!.y, p(idx.leftEyeBottom)!.y)
  const ry =
    (p(idx.rightIris)!.y - p(idx.rightEyeTop)!.y) /
    span(p(idx.rightEyeTop)!.y, p(idx.rightEyeBottom)!.y)
  const gazeY = centered((ly + ry) / 2)

  return { gazeX, gazeY }
}

/**
 * 고개각(yaw/pitch/roll, 도 단위) — 4x4 변환행렬(column-major)의 회전부를 오일러각으로 분해.
 * 표준 XYZ 분해: pitch=X, yaw=Y, roll=Z. 정확한 절대각보다 "움직임 감지" 용도라 충분합니다.
 */
export function computeHeadPose(
  matrix: number[]
): Pick<FaceMetrics, "headYaw" | "headPitch" | "headRoll"> {
  if (matrix.length < 16) return { headYaw: null, headPitch: null, headRoll: null }

  // column-major: r[row][col] = matrix[col*4 + row]
  const r = (row: number, col: number) => matrix[col * 4 + row]
  const r00 = r(0, 0)
  const r10 = r(1, 0)
  const r20 = r(2, 0)
  const r21 = r(2, 1)
  const r22 = r(2, 2)

  const sy = Math.hypot(r00, r10)
  const toDeg = (rad: number) => (rad * 180) / Math.PI

  let pitch: number
  let yaw: number
  let roll: number
  if (sy > 1e-6) {
    pitch = Math.atan2(r21, r22)
    yaw = Math.atan2(-r20, sy)
    roll = Math.atan2(r10, r00)
  } else {
    // 짐벌락 근방 폴백
    pitch = Math.atan2(-r(1, 2), r(1, 1))
    yaw = Math.atan2(-r20, sy)
    roll = 0
  }

  return {
    headPitch: toDeg(pitch),
    headYaw: toDeg(yaw),
    headRoll: toDeg(roll),
  }
}

// blendshape 묶음 → 코칭에 쓸 만한 거친 표정 라벨로 압축
const expressionGroups: Record<string, string[]> = {
  smile: ["mouthSmileLeft", "mouthSmileRight"],
  frown: ["mouthFrownLeft", "mouthFrownRight"],
  surprise: ["browInnerUp", "browOuterUpLeft", "browOuterUpRight", "jawOpen"],
  tense: ["browDownLeft", "browDownRight", "mouthPressLeft", "mouthPressRight"],
}

/**
 * 우세 표정 — blendshape 점수를 그룹별로 합산해 가장 강한 그룹을 고릅니다.
 * 가장 강한 그룹이 임계값 미만이면 "neutral".
 */
export function pickExpression(blendshapes: BlendshapeCategory[], threshold = 0.3): string {
  const scoreOf = (name: string) => blendshapes.find((b) => b.categoryName === name)?.score ?? 0

  let best = "neutral"
  let bestScore = threshold
  for (const [label, names] of Object.entries(expressionGroups)) {
    const sum = names.reduce((acc, n) => acc + scoreOf(n), 0) / names.length
    if (sum > bestScore) {
      best = label
      bestScore = sum
    }
  }
  return best
}

/**
 * 한 프레임의 원천 데이터 → 최종 FaceMetrics.
 * 얼굴 미검출(landmarks null)이면 빈 지표를 반환합니다.
 */
export function computeFaceMetrics(frame: FaceFrame): FaceMetrics {
  if (!frame.landmarks || frame.landmarks.length === 0) return emptyFaceMetrics

  const gaze = computeGaze(frame.landmarks)
  const pose = frame.transformMatrix
    ? computeHeadPose(frame.transformMatrix)
    : { headYaw: null, headPitch: null, headRoll: null }
  const expression = frame.blendshapes ? pickExpression(frame.blendshapes) : null

  return { ...gaze, ...pose, expression }
}
