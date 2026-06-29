/**
 * dummyResult.ts
 *
 * AI 모의 면접 결과 더미 데이터입니다.
 * 비전(표정)·STT(음성)·녹화·세션 영속화 인프라가 미완성이라,
 * 라우트 핸들러가 실제 분석 대신 이 더미를 응답합니다.
 *
 * ⚠️ 추후 진짜 분석 파이프라인 연결 시, 이 파일(더미 생성 부분)만 교체하세요.
 *    응답 타입(InterviewResult)과 프론트 코드는 그대로 유지됩니다.
 *
 * 회사/직무 맥락은 company 리포트 더미와 동일하게 CJ ENM을 사용합니다.
 */

import type { InterviewResult } from "@/features/interview/types/interviewResult"

/**
 * 요청된 companyId로 더미 면접 결과를 생성합니다.
 * 지금은 어떤 id가 와도 CJ ENM 샘플을 반환하되, 요청 id를 meta.companyId에 반영합니다.
 */
export function buildDummyResult(companyId: string): InterviewResult {
  return {
    meta: {
      resultId: "result-cjenm-0002",
      companyId,
      companyName: "CJ ENM",
      jobTitle: "콘텐츠 마케팅",
      conductedAt: "2026-06-23T14:10:00+09:00",
      durationSec: 752,
      mode: "voice",
      questionCount: 5,
    },
    overall: {
      score: 78,
      grade: "B+",
      headline:
        "직무 이해도와 답변 논리는 안정적입니다. 시선 처리와 답변의 구체성을 보완하면 한 단계 더 올라갈 수 있어요.",
    },
    feedback: {
      // 표정 — 면접 영상 비전 분석 (현재 더미·추론)
      expression: {
        score: 71,
        summary:
          "전반적으로 안정적이나, 답변을 떠올릴 때 시선이 자주 위로 향하고 표정 변화가 적었습니다.",
        metrics: [
          {
            label: "시선 처리",
            score: 64,
            value: "이탈 잦음",
            comment: "생각할 때 시선이 위로 향하는 빈도가 높았어요.",
          },
          {
            label: "미소·표정",
            score: 70,
            value: "보통",
            comment: "도입부는 좋았으나 중반부터 표정이 굳었습니다.",
          },
          {
            label: "자세 안정성",
            score: 82,
            value: "안정",
            comment: "상체 흔들림이 적어 신뢰감을 줬어요.",
          },
          {
            label: "끄덕임·반응",
            score: 68,
            value: "보통",
            comment: "경청 반응을 조금 더 보여주면 좋습니다.",
          },
        ],
      },
      // 음성 — 오디오 분석 (현재 더미·추론)
      voice: {
        score: 76,
        summary: "전달력은 좋은 편이나 말 속도가 다소 빠르고 군더더기 표현이 반복됐습니다.",
        metrics: [
          {
            label: "말 속도",
            score: 70,
            value: "118 WPM",
            comment: "권장(90~110)보다 약간 빨라요. 핵심에서 천천히.",
          },
          {
            label: "발음·명료도",
            score: 84,
            value: "명료",
            comment: "전반적으로 또렷하게 전달됐습니다.",
          },
          {
            label: "필러 표현",
            score: 62,
            value: "14회",
            comment: "‘음…’, ‘그…’ 같은 표현이 반복됐어요.",
          },
          {
            label: "휴지·끊김",
            score: 80,
            value: "양호",
            comment: "문장 사이 호흡이 자연스러웠습니다.",
          },
          { label: "톤·억양", score: 78, value: "안정", comment: "단조롭지 않게 강약이 있었어요." },
        ],
      },
      // 답변 — 답변 텍스트 LLM 평가
      answer: {
        score: 82,
        summary:
          "질문 의도 파악과 직무 연결이 좋았습니다. 구체적 수치·사례를 더하면 설득력이 커집니다.",
        metrics: [
          { label: "논리 구조", score: 85, value: "우수", comment: "결론-근거 순서가 명확했어요." },
          {
            label: "구체성(STAR)",
            score: 72,
            value: "보통",
            comment: "상황·행동은 좋았으나 결과(수치)가 약했습니다.",
          },
          {
            label: "직무 적합성",
            score: 88,
            value: "우수",
            comment: "콘텐츠 마케팅 역량과 잘 연결했어요.",
          },
          {
            label: "질문 이해도",
            score: 84,
            value: "우수",
            comment: "질문 핵심을 정확히 짚었습니다.",
          },
        ],
      },
    },
    strengths: [
      "결론을 먼저 말하고 근거로 뒷받침하는 두괄식 답변 구조가 안정적입니다.",
      "지원 직무(콘텐츠 마케팅)와 본인 경험을 자연스럽게 연결했습니다.",
      "발음이 또렷하고 목소리 톤에 강약이 있어 전달력이 좋습니다.",
    ],
    weaknesses: [
      "답변을 떠올릴 때 시선이 화면 위로 자주 이탈했습니다.",
      "‘음…’, ‘그…’ 등 군더더기 표현이 14회 반복됐습니다.",
      "경험을 설명할 때 구체적 수치·성과가 부족했습니다.",
    ],
    improvements: [
      {
        area: "시선 처리",
        problem:
          "답을 생각할 때 카메라(면접관)에서 시선이 위로 벗어나, 자신감이 낮아 보일 수 있습니다.",
        method:
          "카메라 렌즈 옆에 작은 포스트잇을 붙여 시선 기준점을 만들고, 생각이 필요할 땐 ‘잠시 생각해보겠습니다’로 자연스럽게 텀을 두는 연습을 해보세요.",
      },
      {
        area: "답변 구체성(STAR)",
        problem:
          "상황·행동까지는 좋았으나 결과(Result)를 수치로 제시하지 못해 설득력이 약했습니다.",
        method:
          "경험마다 ‘전환율 12% 상승’, ‘참여자 300명’처럼 숫자 결과를 1개씩 미리 정리해 두고 답변 끝에 붙이세요.",
      },
      {
        area: "군더더기 표현",
        problem: "‘음…’, ‘그…’ 같은 필러가 반복돼 답변이 정돈되지 않게 들립니다.",
        method:
          "필러가 나오려는 순간 짧게 침묵으로 대체하는 훈련이 효과적입니다. 답변을 녹음해 필러 횟수를 직접 세어보세요.",
      },
    ],
    script: [
      {
        no: 1,
        category: "common",
        question: "간단히 자기소개 부탁드립니다.",
        answer:
          "안녕하세요. 콘텐츠 마케팅 직무에 지원한 OOO입니다. 대학에서 미디어커뮤니케이션을 전공하며 교내 SNS 채널을 운영했고, 6개월간 팔로워를 두 배로 늘린 경험이 있습니다.",
        evaluation: {
          score: 80,
          good: "지원 직무와 경험을 한 문장에 압축해 첫인상이 명확했습니다.",
          improve:
            "마지막에 ‘그래서 CJ ENM에서 무엇을 하고 싶은지’ 한 줄을 더하면 마무리가 강해집니다.",
        },
      },
      {
        no: 2,
        category: "company",
        question: "CJ ENM의 콘텐츠 중 인상 깊었던 것과 그 이유는 무엇인가요?",
        answer:
          "tvN 드라마의 IP를 활용한 2차 콘텐츠 확장이 인상 깊었습니다. 하나의 IP를 숏폼, 굿즈, 글로벌 유통까지 연결하는 전략이 콘텐츠 마케팅 관점에서 인상적이었습니다.",
        evaluation: {
          score: 86,
          good: "회사의 IP 확장 전략을 직무 관점으로 해석해 깊이가 느껴졌습니다.",
          improve: "구체적인 작품명과 성과 수치를 들면 설득력이 더 커집니다.",
        },
      },
      {
        no: 3,
        category: "job",
        question: "신규 콘텐츠의 초기 타깃 도달을 높이기 위해 어떤 전략을 쓰겠습니까?",
        answer:
          "먼저 타깃 페르소나를 정의하고, 숏폼 플랫폼에서 티저를 테스트한 뒤 반응이 좋은 소재를 본 캠페인에 확장하는 방식을 쓰겠습니다.",
        evaluation: {
          score: 78,
          good: "테스트 후 확장이라는 실무적 접근이 좋았습니다.",
          improve: "어떤 지표로 ‘반응이 좋다’를 판단할지(KPI) 기준을 제시하면 완성도가 올라갑니다.",
        },
      },
      {
        no: 4,
        category: "job",
        question: "협업 중 의견 충돌이 있었던 경험과 해결 방법을 말해주세요.",
        answer:
          "교내 채널 운영 때 콘텐츠 방향을 두고 팀원과 의견이 갈렸는데, 각자 안을 작게 테스트해 데이터로 결정하자고 제안해 합의했습니다.",
        evaluation: {
          score: 82,
          good: "감정이 아닌 데이터로 합의를 끌어낸 점이 인상적입니다.",
          improve: "테스트 결과가 어땠는지(수치)까지 말하면 결과 중심 답변이 됩니다.",
        },
      },
      {
        no: 5,
        category: "company",
        question: "입사 후 1년 안에 이루고 싶은 목표가 있다면?",
        answer:
          "담당 콘텐츠의 SNS 채널 지표를 분석해 개선 포인트를 찾고, 작은 캠페인이라도 직접 기획해 성과를 내보고 싶습니다.",
        evaluation: {
          score: 76,
          good: "현실적이고 실행 가능한 목표를 제시했습니다.",
          improve: "회사의 구체적 채널·브랜드를 언급하면 입사 의지가 더 드러납니다.",
        },
      },
    ],
    recommendedQuestions: {
      company: [
        "CJ ENM의 글로벌 콘텐츠 전략에서 마케팅의 역할은 무엇이라고 생각하나요?",
        "최근 본 CJ ENM 콘텐츠 중 마케팅이 아쉬웠던 사례와 개선안은?",
        "OTT 경쟁 심화 속에서 CJ ENM이 차별화할 포인트는 무엇일까요?",
        "CJ ENM의 인재상(공감력·독창성·사명감) 중 본인과 맞는 것은?",
      ],
      job: [
        "콘텐츠 마케팅 성과를 측정하는 핵심 지표(KPI)를 무엇으로 보나요?",
        "한정된 예산으로 신규 콘텐츠를 알릴 때 우선순위를 어떻게 정하겠습니까?",
        "숏폼과 롱폼 콘텐츠의 마케팅 접근은 어떻게 달라야 한다고 보나요?",
        "데이터 분석 결과와 본인의 직관이 충돌하면 어떻게 결정하겠습니까?",
      ],
    },
    // 이전 연습과의 차이 — 직전 세션(result-cjenm-0001) 대비. 첫 면접이면 null로 둡니다.
    comparison: {
      previousResultId: "result-cjenm-0001",
      previousDate: "2026-06-18T20:30:00+09:00",
      attemptCount: 2,
      deltas: [
        { label: "종합", previous: 71, current: 78, delta: 7, direction: "up" },
        { label: "표정", previous: 69, current: 71, delta: 2, direction: "up" },
        { label: "음성", previous: 80, current: 76, delta: -4, direction: "down" },
        { label: "답변", previous: 74, current: 82, delta: 8, direction: "up" },
      ],
      summary:
        "지난 연습보다 답변 논리와 직무 연결이 뚜렷이 좋아졌습니다. 다만 말 속도가 빨라지며 음성 점수가 소폭 하락했으니, 속도 조절에 집중해보세요.",
    },
  }
}
