/**
 * voiceMetrics.ts
 *
 * 마이크 오디오 표본(Float32 PCM)에서 발화 "안정도" 물리지표를 뽑는 순수 함수 모음입니다.
 * Web Audio(AnalyserNode)에 의존하지 않게 표본 배열만 받아 계산하므로 단위 테스트가 쉽습니다.
 *
 * 정직성 원칙: 신뢰성 있게 못 뽑는 값은 만들지 않습니다.
 *   - decibel : RMS → dBFS (항상 산출 가능)
 *   - pitch   : autocorrelation. 무음/비주기/사람 음역 밖이면 null(→ 호출 측이 키 생략)
 *   - speech_rate / tremor : v1 미산출(이 파일에 없음). 신뢰도 확보 후 후속.
 *
 * "감정" 라벨이 아니라 물리 측정값입니다.
 */

// 사람 음성 기본주파수의 타당 범위(Hz). 이 밖이면 잡음·하모닉 오검출로 보고 버린다.
const minHumanPitchHz = 70
const maxHumanPitchHz = 400

// pitch 추정을 시도할 최소 음량(RMS). 이보다 조용하면 무음으로 보고 null.
const pitchRmsGate = 0.01

// dBFS 바닥값 — 사실상 무음일 때 -Infinity 대신 돌려줄 하한.
// 호출 측(useVoiceMetric)이 "완전 무음" 판별에 재사용한다.
export const silenceFloorDb = -100

/**
 * RMS → dBFS 음량. 0 dBFS 가 최대(클리핑), 조용할수록 음수로 작아진다.
 * 표본은 [-1, 1] 범위의 PCM(Float32) 으로 가정한다.
 */
export function computeDecibelDbfs(buffer: Float32Array): number {
  if (buffer.length === 0) return silenceFloorDb
  let sumSquares = 0
  for (let i = 0; i < buffer.length; i++) {
    sumSquares += buffer[i] * buffer[i]
  }
  const rms = Math.sqrt(sumSquares / buffer.length)
  if (rms <= 1e-8) return silenceFloorDb
  return 20 * Math.log10(rms)
}

/**
 * autocorrelation 기반 기본주파수(Hz) 추정.
 * 무음(음량 게이트 미달)·비주기 신호·사람 음역 밖이면 null 을 돌려 "모름"을 정직하게 표현한다
 * (호출 측은 null 이면 voice_metric 에서 pitch 키를 생략한다).
 */
export function estimatePitchHz(buffer: Float32Array, sampleRate: number): number | null {
  const size = buffer.length
  if (size < 2 || sampleRate <= 0) return null

  // 음량 게이트 — 너무 조용하면 추정하지 않는다.
  let sumSquares = 0
  for (let i = 0; i < size; i++) sumSquares += buffer[i] * buffer[i]
  const rms = Math.sqrt(sumSquares / size)
  if (rms < pitchRmsGate) return null

  // 사람 음역(70~400Hz)에 해당하는 lag 범위만 자기상관(ACF)을 계산한다.
  // freq = sampleRate / lag 이므로 lag 가 작을수록 고음 → maxHumanPitchHz 가 minLag 를 정한다.
  // 음역 밖 lag 는 어차피 마지막 게이트로 버려지므로 계산하지 않아 O(n²) 비용을 크게 줄인다.
  const minLag = Math.max(1, Math.floor(sampleRate / maxHumanPitchHz))
  const maxLag = Math.min(size - 1, Math.ceil(sampleRate / minHumanPitchHz))
  if (minLag >= maxLag) return null

  // corr[k] = lag (minLag+k) 의 상관값. 이웃 인덱스로 포물선 보간까지 재계산 없이 처리한다.
  const corr = new Array<number>(maxLag - minLag + 1)
  for (let lag = minLag; lag <= maxLag; lag++) {
    let sum = 0
    for (let i = 0; i < size - lag; i++) {
      sum += buffer[i] * buffer[i + lag]
    }
    corr[lag - minLag] = sum
  }

  // 음역 내 최대 상관 위치 = 추정 기본주기.
  let peakIdx = 0
  for (let k = 1; k < corr.length; k++) {
    if (corr[k] > corr[peakIdx]) peakIdx = k
  }
  if (corr[peakIdx] <= 0) return null // 양의 주기성 없음 → 모름
  const peakLag = peakIdx + minLag

  // 포물선 보간으로 피크 위치를 소수점까지 다듬는다(경계 인덱스는 보간 생략).
  let refinedLag = peakLag
  if (peakIdx > 0 && peakIdx < corr.length - 1) {
    const left = corr[peakIdx - 1]
    const center = corr[peakIdx]
    const right = corr[peakIdx + 1]
    const denom = left + right - 2 * center
    if (denom !== 0) {
      refinedLag = peakLag - (right - left) / (2 * denom)
    }
  }
  if (refinedLag <= 0) return null

  const freq = sampleRate / refinedLag
  if (freq < minHumanPitchHz || freq > maxHumanPitchHz) return null
  return freq
}
