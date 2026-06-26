/**
 * nonverbalEvents.ts
 *
 * 비언어 지표 시퀀스에서 "지속성" 이벤트(시선이탈·무표정)를 감지하는 순수 로직입니다.
 * 한 프레임만으로 단정하지 않고, 일정 시간 지속될 때만 이벤트로 승격합니다(노이즈 방어).
 * 타이머/상태(useRef)는 호출 측이 들고, 이 모듈은 (이전상태 + 지금) → (새상태 + 이벤트)만 계산합니다.
 */

import type { FaceMetrics, NonverbalEvent } from "../types/nonverbal"

export interface EventDetectorConfig {
  gazeThreshold: number // |gaze|>이 값이면 이탈로 간주 (백엔드 계약: 0.3)
  gazeHoldMs: number // 이탈이 이만큼 지속돼야 이벤트
  flatHoldMs: number // 무표정이 이만큼 지속돼야 이벤트
  // 같은 종류 이벤트 재발화 최소 간격. 이탈/무표정이 "계속 지속"되면 이 간격마다 의도적으로
  // 재발화한다 — 1회성 알림이 아니라 지속 시간을 증거로 누적하기 위함이다(meta.durationMs 가
  // 매번 늘어나 백엔드가 지속 길이를 알 수 있다). 상태가 정상으로 돌아오면 since 가 리셋된다.
  cooldownMs: number
}

export const defaultEventConfig: EventDetectorConfig = {
  gazeThreshold: 0.3,
  gazeHoldMs: 2000,
  flatHoldMs: 5000,
  cooldownMs: 6000,
}

export interface EventDetectorState {
  gazeAwaySince: number | null // 이탈이 연속 시작된 시각(아니면 null)
  flatSince: number | null // 무표정이 연속 시작된 시각(아니면 null)
  lastGazeEventAt: number | null
  lastFlatEventAt: number | null
}

export const initialDetectorState: EventDetectorState = {
  gazeAwaySince: null,
  flatSince: null,
  lastGazeEventAt: null,
  lastFlatEventAt: null,
}

function isGazeAway(metrics: FaceMetrics, threshold: number): boolean {
  const x = metrics.gazeX
  const y = metrics.gazeY
  return (x !== null && Math.abs(x) > threshold) || (y !== null && Math.abs(y) > threshold)
}

function cooldownPassed(lastAt: number | null, now: number, cooldownMs: number): boolean {
  return lastAt === null || now - lastAt >= cooldownMs
}

/**
 * 한 프레임 전진 — 이전 상태와 현재 지표를 받아 새 상태와 (있다면) 발화된 이벤트를 반환.
 * 불변: 입력 state 를 변경하지 않고 새 객체를 만듭니다.
 */
export function stepEventDetector(
  state: EventDetectorState,
  metrics: FaceMetrics,
  now: number,
  config: EventDetectorConfig = defaultEventConfig
): { state: EventDetectorState; events: NonverbalEvent[] } {
  const events: NonverbalEvent[] = []
  let next: EventDetectorState = { ...state }

  // ── 시선이탈 ───────────────────────────────────────────────
  if (isGazeAway(metrics, config.gazeThreshold)) {
    const since = next.gazeAwaySince ?? now
    next = { ...next, gazeAwaySince: since }
    if (
      now - since >= config.gazeHoldMs &&
      cooldownPassed(next.lastGazeEventAt, now, config.cooldownMs)
    ) {
      events.push({
        kind: "gaze_away",
        meta: { gazeX: metrics.gazeX, gazeY: metrics.gazeY, durationMs: now - since },
      })
      next = { ...next, lastGazeEventAt: now }
    }
  } else {
    next = { ...next, gazeAwaySince: null }
  }

  // ── 무표정 지속 ────────────────────────────────────────────
  // 얼굴 미검출(expression === null)은 "무표정"이 아니라 "데이터 없음"으로 보고
  // flatSince 를 리셋한다(아래 else). neutral 일 때만 지속을 누적한다.
  if (metrics.expression === "neutral") {
    const since = next.flatSince ?? now
    next = { ...next, flatSince: since }
    if (
      now - since >= config.flatHoldMs &&
      cooldownPassed(next.lastFlatEventAt, now, config.cooldownMs)
    ) {
      events.push({
        kind: "flat_expression",
        meta: { durationMs: now - since },
      })
      next = { ...next, lastFlatEventAt: now }
    }
  } else {
    next = { ...next, flatSince: null }
  }

  return { state: next, events }
}
