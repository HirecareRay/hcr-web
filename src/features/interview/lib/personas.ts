/**
 * personas.ts
 *
 * AI 모의 면접 "면접관 3인" 페르소나 프론트 매핑 테이블(고정).
 * 백엔드가 질문마다 personaId·roleLabel·voice 를 실어 주면, 프론트는 personaId 로
 * 이 테이블을 조회해 배지 색·아바타·아이콘을 결정한다(roleLabel/voice 는 백엔드 값 우선).
 *
 * ⚠️ 백엔드 계약(app/interview/schemas.py)과 personaId 값을 항상 일치시킨다.
 *    미매칭·빈 personaId 는 getPersona 가 null 을 반환 → 호출부가 배지·하이라이트를
 *    생략하고 기본 동작으로 폴백한다(면접 흐름은 절대 안 깨지게).
 *
 * 색은 globals.css @theme 토큰만 사용한다(하드코딩 hex 금지).
 */

import type { LucideIcon } from "lucide-react"
import { Briefcase, Cpu, HeartHandshake } from "lucide-react"

export interface InterviewerPersona {
  id: string
  roleLabel: string // 기본 표시 이름(백엔드 roleLabel 이 비었을 때 폴백)
  voice: string // 기본 목소리 힌트(백엔드 voice 가 비었을 때 폴백)
  icon: LucideIcon
  // 배지(질문 헤더) 색 — 은은한 배경 + 진한 글자
  badgeClass: string
  // 아바타(3인 패널) 색 — 아이콘 원형 배경/글자
  avatarClass: string
  // 활성(말하는 중) 하이라이트 링 색
  ringClass: string
}

/**
 * 면접관 3인 (고정 순서). 3인 패널은 이 배열 순서대로 나란히 렌더한다.
 *   - culture_fit (인사): 따뜻·공감 → 코랄 웜톤
 *   - tech_pressure (기술): 냉정·압박 → 차분한 진한톤(info 블루)
 *   - practical (실무): 현실·시나리오 → 중립 그레이톤
 */
export const interviewPersonas: readonly InterviewerPersona[] = [
  {
    id: "culture_fit",
    roleLabel: "인사담당자",
    voice: "soft_high",
    icon: HeartHandshake,
    badgeClass: "bg-coral-light text-coral-deep",
    avatarClass: "bg-coral-light text-coral-deep",
    ringClass: "ring-coral-deep",
  },
  {
    id: "tech_pressure",
    roleLabel: "기술담당자",
    voice: "low_firm",
    icon: Cpu,
    badgeClass: "bg-info/10 text-info",
    avatarClass: "bg-info/10 text-info",
    ringClass: "ring-info",
  },
  {
    id: "practical",
    roleLabel: "실무담당자",
    voice: "calm_mid",
    icon: Briefcase,
    badgeClass: "bg-skeleton/60 text-muted",
    avatarClass: "bg-skeleton/60 text-muted",
    ringClass: "ring-muted",
  },
] as const

const personaById: ReadonlyMap<string, InterviewerPersona> = new Map(
  interviewPersonas.map((p) => [p.id, p])
)

/**
 * personaId 로 페르소나를 조회한다. 빈 문자열·미매칭이면 null(폴백 신호).
 */
export function getPersona(personaId?: string | null): InterviewerPersona | null {
  if (!personaId) return null
  return personaById.get(personaId) ?? null
}
