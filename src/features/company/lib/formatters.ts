/**
 * formatters.ts
 *
 * 보고서 화면에서 쓰는 표시용 포맷 함수 모음입니다.
 */

/** 금액(원)을 "8,900만원" / "1.2억원" 형태로 변환합니다. null이면 "—". */
export function formatKrwShort(amount: number | null): string {
  if (amount === null) return "—"

  const eok = 100_000_000
  const man = 10_000

  if (Math.abs(amount) >= eok) {
    return `${(amount / eok).toFixed(1)}억원`
  }
  if (Math.abs(amount) >= man) {
    return `${Math.round(amount / man).toLocaleString()}만원`
  }
  return `${amount.toLocaleString()}원`
}

/** ISO 날짜 문자열을 "2026.05.28" 형태로 변환합니다. */
export function formatDate(iso: string): string {
  const date = new Date(iso)
  if (Number.isNaN(date.getTime())) return iso

  const year = date.getFullYear()
  const month = String(date.getMonth() + 1).padStart(2, "0")
  const day = String(date.getDate()).padStart(2, "0")
  return `${year}.${month}.${day}`
}

/** 지표 값을 "-11.1%" 형태로 변환합니다. null이면 "—". */
export function formatIndicator(value: number | null, unit: string): string {
  if (value === null) return "—"
  return `${value}${unit}`
}
