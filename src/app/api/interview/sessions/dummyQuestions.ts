/**
 * dummyQuestions.ts
 *
 * 세션 시작 시 내려줄 더미 질문 세트를 생성합니다.
 * 프론트가 아니라 BFF에 더미를 격리하는 수직 슬라이스 패턴(company 리포트와 동일).
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

type QuestionSeed = Pick<LiveQuestion, "category" | "question">

// 공통(자기소개 등) — 항상 첫 질문으로 사용
const commonSeed: QuestionSeed = {
  category: "common",
  question: "먼저 1분 동안 자기소개를 부탁드립니다.",
}

// 회사 관련 — 실연결 시 기업 리포트(인재상·이슈·재무)에서 생성
const companySeeds: QuestionSeed[] = [
  { category: "company", question: "저희 회사에 지원하신 동기가 무엇인가요?" },
  {
    category: "company",
    question: "최근 저희 회사의 사업이나 이슈 중 인상 깊었던 것을 말씀해 주세요.",
  },
  { category: "company", question: "입사 후 이루고 싶은 목표가 있다면 무엇인가요?" },
]

// 공통 인성/역량 — 직무 무관
const behavioralSeeds: QuestionSeed[] = [
  { category: "common", question: "팀에서 갈등을 겪고 해결했던 경험을 들려주세요." },
  { category: "common", question: "본인의 강점과 약점을 각각 한 가지씩 말씀해 주세요." },
]

// 직무 관련 — jobTitle을 끼워 컨텍스트가 있는 것처럼 보이게
function jobSeeds(jobTitle: string): QuestionSeed[] {
  return [
    {
      category: "job",
      question: `${jobTitle} 직무를 수행하는 데 본인의 어떤 경험이 강점이 될까요?`,
    },
    {
      category: "job",
      question: `${jobTitle} 업무에서 가장 중요하다고 생각하는 역량은 무엇인가요?`,
    },
    { category: "job", question: `${jobTitle}와 관련해 최근 학습하거나 시도해 본 것이 있나요?` },
  ]
}

/**
 * 설정(config)으로부터 더미 세션을 조립합니다.
 * - 질문 수는 전체 시간에서 환산(deriveQuestionCount)
 * - 첫 질문은 자기소개(공통), 이후 회사/직무/공통을 번갈아 채움
 */
export function buildDummySession(config: InterviewConfig): InterviewSessionStart {
  const questionCount = deriveQuestionCount(config.totalDurationSec)
  const recommended = recommendedAnswerSec(config.totalDurationSec, questionCount)

  // 자기소개 → (회사·직무·인성) 라운드로빈으로 풀을 섞어 채움
  const rotation: QuestionSeed[] = []
  const jobPool = jobSeeds(config.jobTitle)
  const maxLen = Math.max(companySeeds.length, jobPool.length, behavioralSeeds.length)
  for (let i = 0; i < maxLen; i++) {
    if (companySeeds[i]) rotation.push(companySeeds[i])
    if (jobPool[i]) rotation.push(jobPool[i])
    if (behavioralSeeds[i]) rotation.push(behavioralSeeds[i])
  }

  const seeds = [commonSeed, ...rotation].slice(0, questionCount)

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
