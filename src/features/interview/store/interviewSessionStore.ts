/**
 * interviewSessionStore.ts
 *
 * 라이브 면접방의 진행 상태(상태머신)를 보관하는 zustand 스토어입니다.
 * 단계 전환(setup → asking → answering → evaluating → finished)과
 * 현재 질문 인덱스·누적 평가·"듣는 중" 상태를 한곳에서 관리합니다.
 *
 * 모든 갱신은 불변 패턴(새 객체 생성)으로만 합니다.
 * 초당 갱신되는 "남은 시간"은 리렌더 폭주를 막기 위해 스토어가 아니라 타이머 훅에서 다룹니다.
 */

import { create } from "zustand"
import type {
  InterviewConfig,
  InterviewPhase,
  InterviewSessionStart,
  LiveEvaluation,
  LiveQuestion,
} from "../types/interviewSession"

interface InterviewSessionState {
  phase: InterviewPhase
  config: InterviewConfig | null
  session: InterviewSessionStart | null
  currentIndex: number
  evaluations: LiveEvaluation[]
  listening: boolean // 답변 인식 중(🔴) 여부

  // ─── 액션 ───
  configure: (config: InterviewConfig) => void
  beginSession: (session: InterviewSessionStart) => void
  beginAnswering: () => void
  setListening: (listening: boolean) => void
  recordEvaluation: (evaluation: LiveEvaluation) => void
  advanceQuestion: () => void
  finishNow: () => void
  reset: () => void
}

const initialState = {
  phase: "setup" as InterviewPhase,
  config: null,
  session: null,
  currentIndex: 0,
  evaluations: [] as LiveEvaluation[],
  listening: false,
}

export const useInterviewSessionStore = create<InterviewSessionState>((set) => ({
  ...initialState,

  configure: (config) => set(() => ({ config })),

  beginSession: (session) =>
    set(() => ({ session, currentIndex: 0, evaluations: [], phase: "asking" })),

  beginAnswering: () => set(() => ({ phase: "answering", listening: true })),

  setListening: (listening) => set(() => ({ listening })),

  // 백그라운드 채점 결과를 누적만 합니다(단계 전환 없음 — UI를 막지 않음).
  // 누적된 평가는 추후 실백엔드 연결 시 결과 리포트 집계에 사용합니다.
  recordEvaluation: (evaluation) =>
    set((state) => ({ evaluations: [...state.evaluations, evaluation] })),

  // 다음 질문으로 넘어갑니다. 마지막 질문이면 종료합니다.
  advanceQuestion: () =>
    set((state) => {
      const nextIndex = state.currentIndex + 1
      const isLast = !state.session || nextIndex >= state.session.questions.length

      return isLast
        ? { phase: "finished" as InterviewPhase, listening: false }
        : { currentIndex: nextIndex, phase: "asking" as InterviewPhase, listening: false }
    }),

  // 시간 만료 등으로 즉시 종료합니다.
  finishNow: () => set(() => ({ phase: "finished", listening: false })),

  reset: () => set(() => ({ ...initialState })),
}))

/** 현재 질문을 반환하는 셀렉터 (없으면 null). */
export function selectCurrentQuestion(state: InterviewSessionState): LiveQuestion | null {
  if (!state.session) return null
  return state.session.questions[state.currentIndex] ?? null
}
