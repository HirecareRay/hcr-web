/**
 * dummyEvaluation.ts
 *
 * 답변 1건에 대한 더미 평가를 생성합니다.
 * 질문 번호(no)로 dummyQuestions.ts의 고정 시드를 조회해 그대로 반환합니다 —
 * 같은 질문에는 항상 같은 평가가 매핑됩니다(answerText 내용은 채점에 영향을 주지 않음).
 *
 * TODO: 실연결 시
 *   - answerScore  ← 답변 텍스트 → LLM 평가
 *   - expression   ← 면접 영상 → 비전 모델
 *   - voice        ← 오디오 → 음성 감성 분석
 * 으로 교체하세요. 프론트 계약(LiveEvaluation)은 그대로 둡니다.
 */

import type {
  AnswerSubmission,
  LiveEvaluation,
  ModalScore,
} from "@/features/interview/types/interviewSession"
import { getDummyQuestionSeed } from "@/features/interview/lib/mockQuestionSeeds"

function expressionFor(hasVideo: boolean, score: number, label: string): ModalScore {
  if (!hasVideo) return { score: 0, label: "영상을 사용하지 않은 답변입니다" }
  return { score, label }
}

function voiceFor(hasAudio: boolean, score: number, label: string): ModalScore {
  if (!hasAudio) return { score: 0, label: "음성을 사용하지 않은 답변입니다" }
  return { score, label }
}

export function buildDummyEvaluation(submission: AnswerSubmission): LiveEvaluation {
  // 질문 번호 범위를 벗어나면(더미 세션 밖 요청 등) 안전한 기본값으로 대체.
  const evaluation = getDummyQuestionSeed(submission.no)?.evaluation ?? {
    answerScore: 75,
    good: "핵심을 잘 짚어 답변했습니다.",
    improve: "조금 더 구체적인 사례를 덧붙이면 좋습니다.",
    expressionScore: 75,
    expressionLabel: "표정이 안정적이고 시선 처리가 좋습니다",
    voiceScore: 75,
    voiceLabel: "목소리에 자신감이 느껴집니다",
  }

  return {
    no: submission.no,
    answerScore: evaluation.answerScore,
    expression: expressionFor(
      submission.hasVideo,
      evaluation.expressionScore,
      evaluation.expressionLabel
    ),
    voice: voiceFor(submission.hasAudio, evaluation.voiceScore, evaluation.voiceLabel),
    good: evaluation.good,
    improve: evaluation.improve,
  }
}
