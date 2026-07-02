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
}

export function InterviewerRoster({ activePersonaId, isSpeaking }: Props) {
  return (
    <section
      className="border-warm-border bg-warm-bg grid grid-cols-3 gap-2 rounded-2xl border p-3"
      aria-label="면접관"
    >
      {interviewPersonas.map((persona) => {
        const isActive = persona.id === activePersonaId
        const Icon = persona.icon
        return (
          <div
            key={persona.id}
            className={cn(
              "flex flex-col items-center gap-1.5 rounded-xl py-2 transition",
              isActive ? "bg-background/60" : "opacity-55"
            )}
          >
            <span
              className={cn(
                "flex h-11 w-11 items-center justify-center rounded-full ring-2 transition",
                persona.avatarClass,
                isActive ? persona.ringClass : "ring-transparent"
              )}
            >
              <Icon className="h-5 w-5" aria-hidden="true" />
            </span>
            <p className="text-ink text-xs font-semibold">{persona.roleLabel}</p>
            {/* "말하는 중" 유무와 무관하게 높이를 고정해 카드가 튀지 않게 한다. */}
            <span
              className="text-primary h-4 text-xs font-medium"
              aria-hidden={!(isActive && isSpeaking)}
            >
              {isActive && isSpeaking ? "말하는 중" : ""}
            </span>
          </div>
        )
      })}
    </section>
  )
}
