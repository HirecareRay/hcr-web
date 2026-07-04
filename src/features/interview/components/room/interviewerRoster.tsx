/**
 * interviewerRoster.tsx
 *
 * 면접관 3인(인사·기술·실무) 패널. 아바타+이름을 나란히 보여주고, 현재 질문의
 * personaId 에 해당하는 면접관을 하이라이트(링 + "말하는 중")한다 — "누가 지금 묻는지"를
 * 체감시키는 UI. 매핑 테이블은 lib/personas 의 고정 상수(interviewPersonas)를 쓴다.
 *
 * activePersonaId 가 비었거나 미매칭이면 하이라이트 없이 3인만 담담히 렌더한다(폴백).
 */

import { cn } from "@/lib/utils"
import { interviewPersonas } from "../../lib/personas"

interface Props {
  activePersonaId?: string // 현재 질문을 던진 면접관 — 일치하는 카드 하이라이트
  isSpeaking: boolean // TTS 발화 중이면 활성 면접관에 "말하는 중" 표시
  // vertical: 웹(sm+)에서 카메라 오른쪽에 세로로 배치. 모바일은 항상 가로 3열.
  vertical?: boolean
  className?: string // 부모 배치용(예: flex-1 로 카메라 옆 남은 폭 채우기)
}

export function InterviewerRoster({
  activePersonaId,
  isSpeaking,
  vertical = false,
  className,
}: Props) {
  return (
    <section
      className={cn(
        "border-warm-border bg-warm-bg grid gap-1.5 rounded-2xl border p-1.5",
        // 세로 모드: 모바일 가로 3열 → 웹에서 1열(세로)로. 기본: 항상 가로 3열.
        vertical ? "grid-cols-3 sm:grid-cols-1 sm:content-between sm:gap-1" : "grid-cols-3",
        className
      )}
      aria-label="면접관"
    >
      {interviewPersonas.map((persona) => {
        const isActive = persona.id === activePersonaId
        const Icon = persona.icon
        const speaking = isActive && isSpeaking
        return (
          <div
            key={persona.id}
            className={cn(
              "flex items-center justify-center gap-1 rounded-xl px-1 py-1 transition",
              // 세로 모드에선 웹에서 왼쪽 정렬(리스트처럼)
              vertical && "sm:justify-start sm:gap-2 sm:px-2",
              isActive ? "bg-background/60" : "opacity-55"
            )}
          >
            <span
              className={cn(
                "flex h-6 w-6 shrink-0 items-center justify-center rounded-full ring-2 transition",
                persona.avatarClass,
                isActive ? persona.ringClass : "ring-transparent"
              )}
            >
              <Icon className="h-3.5 w-3.5" aria-hidden="true" />
            </span>
            {/* 이름은 항상 그대로 두고, 발화 중이면 색만 강조한다(이름이 사라지지 않게).
                "누가 말하는지"는 링 하이라이트 + 질문 카드의 "읽는 중" 배지로도 드러난다. */}
            <p
              className={cn(
                "truncate text-[0.6875rem] font-semibold sm:text-xs",
                speaking ? "text-primary" : "text-ink"
              )}
            >
              {persona.roleLabel}
            </p>
          </div>
        )
      })}
    </section>
  )
}
