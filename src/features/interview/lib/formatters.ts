/**
 * formatters.ts
 *
 * 면접 결과 화면에서 쓰는 표시용 포맷 함수 모음입니다.
 */

import type { DeltaDirection } from "../types/interviewResult"

/** 초를 "12분 32초" 형태로 변환합니다. */
export function formatDuration(totalSec: number): string {
  const minutes = Math.floor(totalSec / 60)
  const seconds = totalSec % 60
  if (minutes === 0) return `${seconds}초`
  return `${minutes}분 ${seconds}초`
}

/** 초를 "mm:ss" 형태(타임라인 마커용)로 변환합니다. */
export function formatClock(totalSec: number): string {
  const minutes = Math.floor(totalSec / 60)
  const seconds = totalSec % 60
  return `${String(minutes).padStart(2, "0")}:${String(seconds).padStart(2, "0")}`
}

/** ISO 날짜 문자열을 "2026.06.23" 형태로 변환합니다. */
export function formatResultDate(iso: string): string {
  const date = new Date(iso)
  if (Number.isNaN(date.getTime())) return iso

  const year = date.getFullYear()
  const month = String(date.getMonth() + 1).padStart(2, "0")
  const day = String(date.getDate()).padStart(2, "0")
  return `${year}.${month}.${day}`
}

/** 점수 변화량을 "+7" / "-4" / "±0" 부호 표기로 변환합니다. */
export function formatDelta(delta: number): string {
  if (delta > 0) return `+${delta}`
  if (delta < 0) return `${delta}`
  return "±0"
}

/** 0~100 점수를 등급 라벨로 변환합니다(히어로 외 보조 표기용). */
export function scoreToTone(score: number): "good" | "warn" | "bad" {
  if (score >= 80) return "good"
  if (score >= 65) return "warn"
  return "bad"
}

/** 질문 분류 코드를 한글 라벨로 변환합니다. */
export function categoryLabel(category: "company" | "job" | "common"): string {
  if (category === "company") return "회사"
  if (category === "job") return "직무"
  return "공통"
}

/** 변화 방향에 대응하는 색 토큰 클래스를 반환합니다. */
export function directionColorClass(direction: DeltaDirection): string {
  if (direction === "up") return "text-success"
  if (direction === "down") return "text-info"
  return "text-disabled"
}
