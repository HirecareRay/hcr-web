/**
 * dummyEvaluation.ts
 *
 * 답변 1건에 대한 더미 평가를 생성합니다.
 * 답변 길이에 따라 점수가 조금씩 달라지게 해, 더미라도 "반응하는" 느낌을 줍니다.
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

const clamp = (v: number, min: number, max: number) => Math.max(min, Math.min(max, v))

// 답변 길이를 기준 점수로 환산(더미). 너무 짧으면 낮게, 충분하면 높게.
function answerScoreFor(answerText: string): number {
  const len = answerText.trim().length
  return clamp(58 + Math.round(len / 10), 50, 94)
}

function expressionFor(hasVideo: boolean, base: number): ModalScore {
  if (!hasVideo) return { score: 0, label: "영상을 사용하지 않은 답변입니다" }
  const score = clamp(base - 6, 50, 92)
  return {
    score,
    label:
      score >= 80
        ? "표정이 안정적이고 시선 처리가 좋습니다"
        : "시선이 자주 흔들립니다. 카메라를 응시해 보세요",
  }
}

function voiceFor(hasAudio: boolean, base: number): ModalScore {
  if (!hasAudio) return { score: 0, label: "음성을 사용하지 않은 답변입니다" }
  const score = clamp(base - 2, 52, 93)
  return {
    score,
    label:
      score >= 80 ? "목소리에 자신감이 느껴집니다" : "말 끝이 흐려집니다. 또박또박 마무리해 보세요",
  }
}

export function buildDummyEvaluation(submission: AnswerSubmission): LiveEvaluation {
  const answerScore = answerScoreFor(submission.answerText)

  return {
    no: submission.no,
    answerScore,
    expression: expressionFor(submission.hasVideo, answerScore),
    voice: voiceFor(submission.hasAudio, answerScore),
    good:
      answerScore >= 78
        ? "질문 의도를 정확히 짚고 구체적인 사례로 답했습니다."
        : "핵심은 짚었으나 답변이 다소 짧습니다.",
    improve:
      answerScore >= 78
        ? "결론을 먼저 말하면 전달력이 더 높아집니다."
        : "STAR(상황-과제-행동-결과) 구조로 사례를 덧붙여 보세요.",
  }
}
