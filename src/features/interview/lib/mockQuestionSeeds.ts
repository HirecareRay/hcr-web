/**
 * mockQuestionSeeds.ts
 *
 * 질문·고정 답변·고정 평가를 한 곳에 묶어둔 더미 데이터 소스입니다.
 * BFF(app/api/interview/sessions/dummyQuestions.ts, .../answer/dummyEvaluation.ts)와
 * 클라이언트 mock(useInterviewSocket.ts)이 같은 시드를 참조해, 같은 질문 번호(no)에는
 * 항상 같은 질문·같은 답변·같은 평가가 매핑됩니다.
 *
 * TODO: 실연결 시 이 파일 전체를 "기업 리포트 컨텍스트 → LLM 질문/평가 생성"으로 교체하세요.
 */

import type { QuestionCategory } from "../types/interviewResult"

// 답변 1건에 대한 고정 더미 평가. 실연결 전까지 answerText 내용과 무관하게 항상 이 값을 반환합니다.
export interface DummyEvaluationSeed {
  answerScore: number
  good: string
  improve: string
  expressionScore: number
  expressionLabel: string
  voiceScore: number
  voiceLabel: string
}

export interface QuestionSeed {
  category: QuestionCategory
  question: string
  answer: string
  evaluation: DummyEvaluationSeed
}

// 공통(자기소개 등) — 항상 첫 질문으로 사용
const commonSeed: QuestionSeed = {
  category: "common",
  question: "먼저 1분 동안 자기소개를 부탁드립니다.",
  answer:
    "저는 문제를 구조적으로 분석하고 끝까지 실행하는 것을 강점으로 하는 지원자입니다. 이전 프로젝트에서 데이터를 기반으로 문제를 정의하고 해결한 경험이 있습니다.",
  evaluation: {
    answerScore: 82,
    good: "자기소개가 간결하고 강점이 명확하게 드러납니다.",
    improve: "지원 직무와 강점을 더 직접적으로 연결하면 좋습니다.",
    expressionScore: 78,
    expressionLabel: "표정이 안정적이고 시선 처리가 좋습니다",
    voiceScore: 80,
    voiceLabel: "목소리에 자신감이 느껴집니다",
  },
}

// 회사 관련 — 실연결 시 기업 리포트(인재상·이슈·재무)에서 생성
const companySeeds: QuestionSeed[] = [
  {
    category: "company",
    question: "저희 회사에 지원하신 동기가 무엇인가요?",
    answer:
      "귀사의 사업 방향과 제 역량이 맞닿아 있다고 생각해 지원했습니다. 특히 최근 추진하신 프로젝트에 큰 관심이 있습니다.",
    evaluation: {
      answerScore: 76,
      good: "지원 동기가 직무와 자연스럽게 연결됩니다.",
      improve: "회사의 구체적인 서비스나 사례를 언급하면 설득력이 높아집니다.",
      expressionScore: 74,
      expressionLabel: "시선이 자주 흔들립니다. 카메라를 응시해 보세요",
      voiceScore: 75,
      voiceLabel: "말 끝이 흐려집니다. 또박또박 마무리해 보세요",
    },
  },
  {
    category: "company",
    question: "최근 저희 회사의 사업이나 이슈 중 인상 깊었던 것을 말씀해 주세요.",
    answer:
      "최근 발표하신 신규 사업 확장 소식을 인상 깊게 봤습니다. 시장 변화에 빠르게 대응하는 모습이 인상적이었습니다.",
    evaluation: {
      answerScore: 80,
      good: "최신 이슈를 정확히 짚고 있습니다.",
      improve: "그 이슈가 본인 직무와 어떻게 연결되는지 덧붙이면 좋습니다.",
      expressionScore: 79,
      expressionLabel: "표정이 안정적이고 시선 처리가 좋습니다",
      voiceScore: 78,
      voiceLabel: "목소리에 자신감이 느껴집니다",
    },
  },
  {
    category: "company",
    question: "입사 후 이루고 싶은 목표가 있다면 무엇인가요?",
    answer:
      "입사 후에는 담당 업무에서 성과를 내는 것은 물론, 팀에 새로운 관점을 제시할 수 있는 사람이 되고 싶습니다.",
    evaluation: {
      answerScore: 74,
      good: "목표가 구체적이고 실현 가능해 보입니다.",
      improve: "단기·장기 목표를 나눠서 제시하면 더 설득력 있습니다.",
      expressionScore: 72,
      expressionLabel: "시선이 자주 흔들립니다. 카메라를 응시해 보세요",
      voiceScore: 73,
      voiceLabel: "말 끝이 흐려집니다. 또박또박 마무리해 보세요",
    },
  },
]

// 공통 인성/역량 — 직무 무관
const behavioralSeeds: QuestionSeed[] = [
  {
    category: "common",
    question: "팀에서 갈등을 겪고 해결했던 경험을 들려주세요.",
    answer:
      "팀 프로젝트에서 의견 차이가 있었을 때, 각자의 근거를 정리해 공유하고 우선순위를 함께 정해 갈등을 해결한 경험이 있습니다.",
    evaluation: {
      answerScore: 81,
      good: "상황-행동-결과가 명확하게 드러납니다.",
      improve: "갈등 이후 팀에 어떤 변화가 있었는지 덧붙이면 좋습니다.",
      expressionScore: 80,
      expressionLabel: "표정이 안정적이고 시선 처리가 좋습니다",
      voiceScore: 79,
      voiceLabel: "목소리에 자신감이 느껴집니다",
    },
  },
  {
    category: "common",
    question: "본인의 강점과 약점을 각각 한 가지씩 말씀해 주세요.",
    answer: "강점은 꼼꼼함이고, 약점은 완벽을 추구하다 일정이 지연되는 경우가 있다는 점입니다.",
    evaluation: {
      answerScore: 70,
      good: "솔직하게 답변했습니다.",
      improve: "약점을 보완하기 위한 구체적인 노력을 함께 제시하면 더 좋습니다.",
      expressionScore: 68,
      expressionLabel: "시선이 자주 흔들립니다. 카메라를 응시해 보세요",
      voiceScore: 69,
      voiceLabel: "말 끝이 흐려집니다. 또박또박 마무리해 보세요",
    },
  },
]

// 직무 관련 — jobTitle을 끼워 컨텍스트가 있는 것처럼 보이게. 답변·평가는 질문 문구와 무관하게 고정.
function jobSeeds(jobTitle: string): QuestionSeed[] {
  return [
    {
      category: "job",
      question: `${jobTitle}를 수행하는 데 본인의 어떤 경험이 강점이 될까요?`,
      answer:
        "이전 프로젝트에서 문제를 정의하고 데이터를 기반으로 해결책을 제시한 경험이 직무 수행에 강점이 될 것이라 생각합니다.",
      evaluation: {
        answerScore: 83,
        good: "경험과 직무 역량이 잘 연결됩니다.",
        improve: "구체적인 수치나 성과를 덧붙이면 더 좋습니다.",
        expressionScore: 81,
        expressionLabel: "표정이 안정적이고 시선 처리가 좋습니다",
        voiceScore: 82,
        voiceLabel: "목소리에 자신감이 느껴집니다",
      },
    },
    {
      category: "job",
      question: `${jobTitle} 업무에서 가장 중요하다고 생각하는 역량은 무엇인가요?`,
      answer:
        "가장 중요한 역량은 문제를 정확히 정의하는 능력이라고 생각합니다. 정의가 명확해야 올바른 해결책을 찾을 수 있습니다.",
      evaluation: {
        answerScore: 77,
        good: "핵심 역량에 대한 본인의 관점이 명확합니다.",
        improve: "그 역량을 발휘했던 사례를 함께 제시하면 좋습니다.",
        expressionScore: 75,
        expressionLabel: "시선이 자주 흔들립니다. 카메라를 응시해 보세요",
        voiceScore: 76,
        voiceLabel: "말 끝이 흐려집니다. 또박또박 마무리해 보세요",
      },
    },
    {
      category: "job",
      question: `${jobTitle}와 관련해 최근 학습하거나 시도해 본 것이 있나요?`,
      answer: "최근 관련 분야의 새로운 도구를 학습해 실제 프로젝트에 적용해 본 경험이 있습니다.",
      evaluation: {
        answerScore: 79,
        good: "최신 학습 내용을 실제로 적용해 본 점이 좋습니다.",
        improve: "학습 계기와 배운 점을 조금 더 구체적으로 설명하면 좋습니다.",
        expressionScore: 77,
        expressionLabel: "표정이 안정적이고 시선 처리가 좋습니다",
        voiceScore: 78,
        voiceLabel: "목소리에 자신감이 느껴집니다",
      },
    },
  ]
}

/**
 * 자기소개 → (회사·직무·인성) 라운드로빈 순서로 시드를 조립합니다.
 * 이 순서가 질문 번호(no)를 정하며, jobTitle은 job 질문의 텍스트만 바꿀 뿐
 * 순서 자체는 항상 같습니다 — 그래서 no만으로 질문·답변·평가를 조회할 수 있습니다.
 */
export function buildSeedRotation(jobTitle: string): QuestionSeed[] {
  const rotation: QuestionSeed[] = []
  const jobPool = jobSeeds(jobTitle)
  const maxLen = Math.max(companySeeds.length, jobPool.length, behavioralSeeds.length)
  for (let i = 0; i < maxLen; i++) {
    if (companySeeds[i]) rotation.push(companySeeds[i])
    if (jobPool[i]) rotation.push(jobPool[i])
    if (behavioralSeeds[i]) rotation.push(behavioralSeeds[i])
  }
  return [commonSeed, ...rotation]
}

/** 질문 번호(no, 1부터)로 해당 질문의 고정 시드(질문·답변·평가)를 조회합니다. */
export function getDummyQuestionSeed(no: number): QuestionSeed | undefined {
  // jobTitle은 job 질문의 문구만 바꿀 뿐 순서에는 영향이 없어, 조회용으로는 아무 값이나 써도 된다.
  return buildSeedRotation("해당 직무")[no - 1]
}
