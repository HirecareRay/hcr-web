/**
 * formatters.ts
 *
 * 홈 화면 표시용 포맷 함수입니다.
 */

/** ISO 날짜("2026-06-18")를 "06.18" 형태로 변환합니다. 파싱 실패 시 원본 반환. */
export function formatShortDate(iso: string): string {
  const date = new Date(iso)
  if (Number.isNaN(date.getTime())) return iso

  const month = String(date.getMonth() + 1).padStart(2, "0")
  const day = String(date.getDate()).padStart(2, "0")
  return `${month}.${day}`
}
