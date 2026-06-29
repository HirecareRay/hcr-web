/**
 * interviewSummaryStore.ts
 *
 * 라이브 면접방(WS) → 결과 페이지로 "최종 요약"을 넘기기 위한 핸드오프 스토어입니다.
 * 면접방 진행 상태(interviewSessionStore)는 방을 떠날 때 reset 되므로, WS 로 받은
 * summary 를 그대로 결과 페이지에서 읽으려면 라우트 이동 사이에도 살아남는 별도 보관소가
 * 필요합니다(zustand 모듈 싱글톤이라 네비게이션을 넘어 유지됨).
 *
 * 백엔드는 결과를 저장하지 않으므로(확인됨) 이 값은 "방금 끝난 한 세션"의 전달 통로일 뿐입니다.
 * 결과 페이지가 소비한 뒤 언마운트 시 clearSummary 로 비워, 다음 방문에 옛 요약이 남지 않게 합니다.
 *
 * 모든 갱신은 불변 패턴(새 객체 생성)으로만 합니다.
 */

import { create } from "zustand"
import type { SummaryEvent } from "../types/interviewProtocol"

interface InterviewSummaryState {
  summary: SummaryEvent | null
  setSummary: (summary: SummaryEvent) => void
  clearSummary: () => void
}

export const useInterviewSummaryStore = create<InterviewSummaryState>((set) => ({
  summary: null,
  setSummary: (summary) => set(() => ({ summary })),
  clearSummary: () => set(() => ({ summary: null })),
}))
