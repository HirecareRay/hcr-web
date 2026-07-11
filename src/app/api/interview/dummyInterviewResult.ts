/**
 * dummyInterviewResult.ts
 *
 * AI 모의 면접 "결과 리포트"·"기록 목록" mock 데이터. hcr-backend 서버·DB 폐쇄로
 * 실제 세션 채점/저장 대신 이 더미를 응답한다. CJ ENM Data Scientist 채용공고
 * (jobs/analysis mock과 동일 companyId)를 기준으로 채웠다.
 *
 * ⚠️ 추후 진짜 백엔드 연결 시, 이 파일만 실제 조회 로직으로 교체하세요.
 *    응답 타입(InterviewResult/InterviewHistory)과 프론트 코드는 그대로 유지됩니다.
 */

import type { InterviewResult } from "@/features/interview/types/interviewResult"
import type { InterviewHistory } from "@/features/interview/types/interviewHistory"

const MOCK_COMPANY_ID = "6a3ca079d7da326c0781963c"
const MOCK_COMPANY_NAME = "CJ ENM"
const MOCK_JOB_TITLE = "Data Scientist 채용"
export const MOCK_RESULT_ID = "interview-mock-cjenm-1"

/** 요청된 resultId로 더미 면접 결과 리포트를 생성한다(어떤 id가 와도 동일 샘플, id만 반영). */
export function buildDummyInterviewResult(
  resultId: string,
  companyId: string = MOCK_COMPANY_ID
): InterviewResult {
  return {
    meta: {
      resultId,
      companyId,
      companyName: MOCK_COMPANY_NAME,
      jobTitle: MOCK_JOB_TITLE,
      conductedAt: "2026-07-08T10:15:00.000Z",
      durationSec: 900,
      mode: "voice",
      questionCount: 5,
    },
    overall: {
      score: 78,
      grade: "B+",
      headline: "핵심 역량은 잘 전달했지만 답변 구조화가 더 필요합니다",
    },
    feedback: {
      expression: {
        score: 74,
        summary: "전반적으로 안정적이지만 긴장하면 시선이 자주 흔들립니다.",
        metrics: [
          {
            label: "시선 처리",
            score: 70,
            value: "72%",
            comment: "카메라 응시 비율이 다소 낮습니다",
          },
          {
            label: "표정 안정성",
            score: 80,
            value: "안정",
            comment: "미소와 함께 편안한 인상을 줍니다",
          },
        ],
      },
      voice: {
        score: 76,
        summary: "목소리 톤은 안정적이나 말 끝을 흐리는 습관이 있습니다.",
        metrics: [
          { label: "말속도", score: 78, value: "적정", comment: "듣기 편한 속도를 유지했습니다" },
          {
            label: "발화 명료도",
            score: 74,
            value: "74%",
            comment: "문장 끝맺음을 또렷하게 해보세요",
          },
        ],
      },
      answer: {
        score: 82,
        summary: "질문 의도를 정확히 파악하고 구체적 사례로 답변했습니다.",
        metrics: [
          { label: "논리성", score: 84, value: "우수", comment: "결론-근거 순서가 명확합니다" },
          {
            label: "구체성",
            score: 80,
            value: "양호",
            comment: "수치·사례를 곁들이면 더 좋습니다",
          },
        ],
      },
    },
    strengths: [
      "데이터 분석 프로젝트 경험을 구체적인 수치와 함께 설명했습니다.",
      "질문의 핵심을 빠르게 파악하고 논리적으로 답변을 구성했습니다.",
    ],
    weaknesses: [
      "긴장 시 시선이 카메라를 벗어나는 경우가 있었습니다.",
      "일부 답변에서 결론을 마지막에 말해 전달력이 떨어졌습니다.",
    ],
    improvements: [
      {
        area: "시선 처리",
        problem: "답변 중 시선이 화면 아래로 향하는 빈도가 높습니다.",
        method: "카메라 렌즈 높이에 메모를 붙여두고 답변 중 그 지점을 보는 연습을 해보세요.",
      },
      {
        area: "답변 구조",
        problem: "결론을 마지막에 말해 면접관이 요지를 파악하기 어렵습니다.",
        method: "PREP(결론-이유-사례-재결론) 구조로 첫 문장에 결론부터 말해보세요.",
      },
    ],
    script: [
      {
        no: 1,
        category: "company",
        question: "CJ ENM에 지원한 이유가 무엇인가요?",
        answer:
          "데이터로 콘텐츠 소비자의 니즈를 이해하고 새로운 시청 경험을 설계하고 싶어 지원했습니다.",
        evaluation: {
          score: 80,
          good: "지원 동기가 직무와 자연스럽게 연결됩니다.",
          improve: "CJ ENM의 구체적인 서비스·프로젝트를 언급하면 더 설득력이 높아집니다.",
        },
      },
      {
        no: 2,
        category: "job",
        question: "데이터 분석 프로젝트 중 가장 어려웠던 경험을 말씀해주세요.",
        answer:
          "커머스 데이터 마트를 설계하면서 쿼리 성능 문제를 겪었고, 인덱스 설계를 개선해 조회 시간을 60% 단축했습니다.",
        evaluation: {
          score: 88,
          good: "문제-해결-결과가 수치로 명확하게 제시됐습니다.",
          improve: "팀 내 협업 과정도 함께 언급하면 좋습니다.",
        },
      },
      {
        no: 3,
        category: "common",
        question: "본인의 강점과 약점은 무엇인가요?",
        answer: "강점은 꼼꼼함이고, 약점은 완벽을 추구하다 일정이 지연되는 경우가 있다는 점입니다.",
        evaluation: {
          score: 70,
          good: "솔직하게 답변했습니다.",
          improve: "약점을 보완하기 위한 구체적인 노력을 함께 제시하면 더 좋습니다.",
        },
      },
    ],
    recommendedQuestions: {
      company: [
        "CJ ENM의 최근 OTT 전략에 대해 어떻게 생각하시나요?",
        "미디어 산업의 데이터 활용 트렌드를 말씀해주세요.",
      ],
      job: ["결측치가 많은 데이터를 다룬 경험이 있나요?", "A/B 테스트 설계 경험을 설명해주세요."],
    },
    comparison: null,
  }
}

/** 마이페이지 "AI 면접 기록" 목록 더미. */
export function buildDummyInterviewHistory(): InterviewHistory {
  return {
    items: [
      {
        resultId: MOCK_RESULT_ID,
        companyId: MOCK_COMPANY_ID,
        companyName: MOCK_COMPANY_NAME,
        jobTitle: MOCK_JOB_TITLE,
        conductedAt: "2026-07-08T10:15:00.000Z",
        mode: "voice",
        score: 78,
        grade: "B+",
        headline: "핵심 역량은 잘 전달했지만 답변 구조화가 더 필요합니다",
        questionCount: 5,
      },
    ],
    total: 1,
  }
}
