/**
 * snapshot.ts
 *
 * <video> 의 현재 프레임을 캔버스에 그려 jpeg base64 data URL 로 캡처합니다.
 * 이벤트(시선이탈·무표정) 발생 시 증거 이미지로 event_snapshot 에 실어 보냅니다.
 * 영상 "원본 스트림"은 절대 전송하지 않고, 이벤트 순간의 한 장면만 캡처합니다(대역폭·프라이버시).
 */

// 캡처 가로 상한(px) — 원본이 더 크면 비율 유지해 축소(스냅샷은 증거용이라 작아도 됨)
const maxWidth = 320

/**
 * 비디오 한 프레임 → jpeg data URL. 캡처 불가(영상 미준비 등) 시 null.
 * quality: 0~1 (낮을수록 가벼움).
 */
export function captureSnapshot(video: HTMLVideoElement, quality = 0.6): string | null {
  const vw = video.videoWidth
  const vh = video.videoHeight
  if (!vw || !vh) return null

  const scale = Math.min(1, maxWidth / vw)
  const width = Math.round(vw * scale)
  const height = Math.round(vh * scale)

  const canvas = document.createElement("canvas")
  canvas.width = width
  canvas.height = height
  const ctx = canvas.getContext("2d")
  if (!ctx) return null

  try {
    ctx.drawImage(video, 0, 0, width, height)
    return canvas.toDataURL("image/jpeg", quality)
  } catch (error) {
    console.error("스냅샷 캡처 실패:", error)
    return null
  }
}
