/**
 * dummyQuestions.ts
 *
 * 세션 시작 시 내려줄 더미 질문 세트를 생성합니다.
 * 질문·답변·평가 시드 자체는 features/interview/lib/mockQuestionSeeds.ts에 있고(클라이언트
 * mock인 useInterviewSocket.ts와 공유), 이 파일은 그 시드를 세션 응답 형태로 조립만 합니다.
 *
 * TODO: 실연결 시 이 생성 로직을 "기업 리포트 컨텍스트 → LLM 질문 생성"으로 교체하세요.
 *       (companyId로 회사 분석 리포트를 조회해 면접관 컨텍스트로 주입)
 */

import type {
  InterviewConfig,
  InterviewSessionStart,
  LiveQuestion,
} from "@/features/interview/types/interviewSession"
import { deriveQuestionCount, recommendedAnswerSec } from "@/features/interview/lib/sessionPlan"
import { buildSeedRotation } from "@/features/interview/lib/mockQuestionSeeds"

/**
 * 설정(config)으로부터 더미 세션을 조립합니다.
 * - 질문 수는 전체 시간에서 환산(deriveQuestionCount)
 * - 첫 질문은 자기소개(공통), 이후 회사/직무/공통을 번갈아 채움
 */
export function buildDummySession(config: InterviewConfig): InterviewSessionStart {
  const questionCount = deriveQuestionCount(config.totalDurationSec)
  const recommended = recommendedAnswerSec(config.totalDurationSec, questionCount)

  const seeds = buildSeedRotation(config.jobTitle).slice(0, questionCount)

  const questions: LiveQuestion[] = seeds.map((seed, idx) => ({
    no: idx + 1,
    category: seed.category,
    question: seed.question,
    recommendedAnswerSec: recommended,
  }))

  return {
    sessionId: crypto.randomUUID(),
    companyId: config.companyId,
    jobTitle: config.jobTitle,
    mode: config.mode,
    totalDurationSec: config.totalDurationSec,
    questionCount: questions.length,
    questions,
  }
}
