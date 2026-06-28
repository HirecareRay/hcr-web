/**
 * interviewSessionStore.ts
 *
 * 라이브 면접방의 진행 상태(상태머신)를 보관하는 zustand 스토어입니다(WS 주도).
 * 단계 전환(setup → connecting → asking → answering → evaluating → finished)과
 * 질문 러닝 카운터·"듣는 중"·동의 상태를 한곳에서 관리합니다.
 * 질문·자막·평가·요약 같은 WS 데이터 자체는 useInterviewSocket(뷰)이 들고 있습니다.
 *
 * 모든 갱신은 불변 패턴(새 객체 생성)으로만 합니다.
 * 초당 갱신되는 "남은 시간"은 리렌더 폭주를 막기 위해 스토어가 아니라 타이머 훅에서 다룹니다.
 */

import { create } from "zustand"
import type {
  InterviewConfig,
  InterviewPhase,
  InterviewSessionStart,
} from "../types/interviewSession"

interface InterviewSessionState {
  phase: InterviewPhase
  config: InterviewConfig | null
  session: InterviewSessionStart | null
  listening: boolean // 답변 인식 중(🔴) 여부
  cameraConsented: boolean // 카메라 비언어 분석·스냅샷 전송 동의 여부
  liveQuestionNo: number // WS 주도: 도착한 질문 러닝 카운터(꼬리질문 포함, 분모 없음)

  // ─── 액션 ───
  configure: (config: InterviewConfig) => void
  beginSession: (session: InterviewSessionStart) => void
  beginAnswering: () => void
  setListening: (listening: boolean) => void
  setCameraConsent: (consented: boolean) => void
  finishNow: () => void
  reset: () => void

  // ─── WS 주도 ───
  presentQuestion: () => void // 새 WS 질문 도착 → asking + 러닝 카운터 증가
  beginEvaluating: () => void // 답변 종료 → evaluating(평가 스트림 표시)
}

const initialState = {
  phase: "setup" as InterviewPhase,
  config: null,
  session: null,
  listening: false,
  cameraConsented: false,
  liveQuestionNo: 0,
}

export const useInterviewSessionStore = create<InterviewSessionState>((set) => ({
  ...initialState,

  configure: (config) => set(() => ({ config })),

  // WS 주도: REST 로 세션(식별자·전체시간)만 확보하고, 첫 질문은 WS 에서 받으므로
  // asking 이 아니라 connecting(첫 질문 대기)으로 진입한다.
  beginSession: (session) => set(() => ({ session, liveQuestionNo: 0, phase: "connecting" })),

  beginAnswering: () => set(() => ({ phase: "answering", listening: true })),

  setListening: (listening) => set(() => ({ listening })),

  setCameraConsent: (cameraConsented) => set(() => ({ cameraConsented })),

  // 시간 만료 등으로 즉시 종료합니다.
  finishNow: () => set(() => ({ phase: "finished", listening: false })),

  reset: () => set(() => ({ ...initialState })),

  // 백엔드가 보낸 새 질문(메인/꼬리) 도착 시: asking 진입 + 러닝 카운터 증가.
  presentQuestion: () =>
    set((state) => ({
      phase: "asking",
      listening: false,
      liveQuestionNo: state.liveQuestionNo + 1,
    })),

  // 답변 종료(answer_end) 직후: 평가(eval_delta) 스트림을 표시하는 단계로.
  beginEvaluating: () => set(() => ({ phase: "evaluating", listening: false })),
}))
