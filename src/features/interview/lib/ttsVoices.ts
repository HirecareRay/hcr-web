/**
 * ttsVoices.ts
 *
 * 면접관 페르소나별 TTS 톤 매핑. 백엔드가 질문마다 실어 주는 voice 힌트를
 * Web SpeechSynthesisUtterance 의 pitch/rate 로 환산한다.
 *
 * 브라우저 한국어(ko-KR) voice 가 하나뿐인 환경이 흔하므로 pitch/rate 차등이 1차 수단이다.
 * (ko-KR voice 가 여러 개면 useTts 가 힌트별로 다른 voice 를 best-effort 로 배정한다.)
 *
 * voice 힌트가 "" 이거나 미매칭이면 기본값 {pitch:1, rate:1} 로 폴백한다(기본 utterance).
 */

export interface VoiceProfile {
  pitch: number // 0(낮음) ~ 2(높음), 기본 1
  rate: number // 0.1 ~ 10, 기본 1
}

const defaultProfile: VoiceProfile = { pitch: 1, rate: 1 }

// voice 힌트 → 톤. (soft_high 부드럽고 높게 / low_firm 낮고 단단하게 / calm_mid 중간·차분)
const voiceProfiles: Readonly<Record<string, VoiceProfile>> = {
  soft_high: { pitch: 1.25, rate: 1.0 },
  low_firm: { pitch: 0.8, rate: 1.05 },
  calm_mid: { pitch: 1.0, rate: 0.95 },
}

/**
 * voice 힌트로 pitch/rate 프로파일을 얻는다. 빈값·미매칭이면 기본 톤.
 */
export function getVoiceProfile(voiceHint?: string | null): VoiceProfile {
  if (!voiceHint) return defaultProfile
  return voiceProfiles[voiceHint] ?? defaultProfile
}
