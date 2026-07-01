"use client"

import Link from "next/link"
import { ChevronLeft, Sparkles } from "lucide-react"

const interviewDetails: Record<
  string,
  {
    companyName: string
    jobName: string
    date: string
    score: number
    questions: { question: string; answer: string; feedback: string; score: number }[]
    overallFeedback: string
  }
> = {
  "1": {
    companyName: "CJ ENM",
    jobName: "Data Scientist",
    date: "2026.06.10",
    score: 82,
    overallFeedback:
      "논리적 답변 구성이 우수하나 구체적 수치 활용이 부족합니다. 실무 프로젝트 경험을 수치와 함께 제시하면 설득력이 높아집니다.",
    questions: [
      {
        question: "데이터 사이언티스트로서 가장 자신 있는 역량은 무엇인가요?",
        answer:
          "저는 머신러닝 모델 설계와 데이터 전처리에 강점이 있습니다. 이전 프로젝트에서 추천 알고리즘을 구축해 사용자 체류 시간을 개선한 경험이 있습니다.",
        feedback: "강점을 잘 어필했으나 구체적인 수치(몇 % 개선)가 빠져 있어 임팩트가 약합니다.",
        score: 78,
      },
      {
        question: "대용량 데이터를 처리할 때 어떤 방식으로 접근하나요?",
        answer:
          "Spark와 Pandas를 상황에 따라 선택하며, 메모리 효율을 위해 청크 단위 처리와 인덱싱을 활용합니다.",
        feedback: "기술 스택 선택 근거가 명확하고 논리적인 답변입니다.",
        score: 88,
      },
      {
        question: "협업 과정에서 데이터 분석 결과를 비전문가에게 어떻게 설명하나요?",
        answer:
          "시각화 도구(Tableau, Matplotlib)를 활용해 핵심 인사이트 위주로 요약하고, 전문 용어 대신 비즈니스 언어로 풀어 설명합니다.",
        feedback: "커뮤니케이션 역량이 잘 드러납니다. 실제 사례를 추가하면 더욱 좋습니다.",
        score: 80,
      },
    ],
  },
  "2": {
    companyName: "CJ ENM",
    jobName: "Web/App Lead",
    date: "2026.06.03",
    score: 76,
    overallFeedback:
      "기술 역량은 충분하나 리더십 경험 어필이 아쉽습니다. 팀을 이끈 구체적인 사례와 성과를 준비하면 리드 포지션에 더 적합한 인상을 줄 수 있습니다.",
    questions: [
      {
        question: "리드 개발자로서 팀을 이끌었던 경험을 말씀해 주세요.",
        answer:
          "소규모 스타트업에서 프론트엔드 팀을 리드하며 코드 리뷰 문화를 도입하고 배포 자동화를 구축했습니다.",
        feedback: "경험은 있으나 팀 규모와 구체적 성과 수치가 부족합니다.",
        score: 70,
      },
      {
        question: "Web과 App 개발을 동시에 진행할 때 기술적 고려사항은?",
        answer:
          "React Native와 Next.js를 함께 사용하며 공통 컴포넌트 라이브러리를 구축해 재사용성을 높였습니다.",
        feedback: "실용적인 접근 방식으로 기술 이해도가 높습니다.",
        score: 84,
      },
    ],
  },
}

export function InterviewDetailPage({ interviewId }: { interviewId: string }) {
  const detail = interviewDetails[interviewId]

  if (!detail) {
    return (
      <section className="bg-background min-h-full pb-10">
        <header className="border-warm-border border-b bg-white px-5 pt-5 pb-4">
          <div className="flex items-center gap-2">
            <Link href="/mypage/interview" aria-label="뒤로가기">
              <ChevronLeft className="text-muted size-5" />
            </Link>
            <h1 className="text-ink text-base font-bold">면접 상세</h1>
          </div>
        </header>
        <div className="flex flex-col items-center justify-center px-5 pt-24 text-center">
          <p className="text-muted text-sm">면접 기록을 찾을 수 없어요.</p>
        </div>
      </section>
    )
  }

  return (
    <section className="bg-background min-h-full pb-10">
      <header className="border-warm-border border-b bg-white px-5 pt-5 pb-4">
        <div className="flex items-center gap-2">
          <Link href="/mypage/interview" aria-label="뒤로가기">
            <ChevronLeft className="text-muted size-5" />
          </Link>
          <h1 className="text-ink text-base font-bold">면접 상세</h1>
        </div>
      </header>

      <div className="space-y-4 px-5 pt-5 pb-8">
        {/* 요약 카드 */}
        <div className="rounded-2xl bg-white p-5">
          <div className="flex items-start justify-between">
            <div>
              <p className="text-muted text-xs">{detail.date}</p>
              <p className="text-ink mt-1 text-base font-bold">{detail.companyName}</p>
              <p className="text-muted text-xs">{detail.jobName}</p>
            </div>
            <div className="flex items-baseline gap-1">
              <span className="text-primary text-3xl font-extrabold">{detail.score}</span>
              <span className="text-muted text-sm font-bold">점</span>
            </div>
          </div>
          <div className="border-warm-border mt-4 rounded-xl border bg-[#fff8f6] p-3">
            <div className="mb-1.5 flex items-center gap-1">
              <Sparkles className="text-primary size-3.5" />
              <span className="text-primary text-xs font-bold">AI 종합 피드백</span>
            </div>
            <p className="text-ink text-xs leading-relaxed">{detail.overallFeedback}</p>
          </div>
        </div>

        {/* 질문별 상세 */}
        <p className="text-ink px-1 text-sm font-bold">질문별 답변 분석</p>
        {detail.questions.map((q, i) => (
          <div key={i} className="space-y-3 rounded-2xl bg-white p-4">
            <div className="flex items-start justify-between gap-3">
              <p className="text-ink flex-1 text-sm leading-snug font-bold">
                Q{i + 1}. {q.question}
              </p>
              <div className="flex shrink-0 items-baseline gap-0.5">
                <span className="text-primary text-lg font-extrabold">{q.score}</span>
                <span className="text-muted text-xs font-bold">점</span>
              </div>
            </div>
            <div className="border-warm-border rounded-xl border bg-[#fafafa] p-3">
              <p className="text-muted mb-1 text-[0.625rem] font-bold tracking-wide uppercase">
                내 답변
              </p>
              <p className="text-ink text-xs leading-relaxed">{q.answer}</p>
            </div>
            <div className="flex items-start gap-2 rounded-xl bg-[#fff8f6] p-3">
              <Sparkles className="text-primary mt-0.5 size-3 shrink-0" />
              <p className="text-ink text-xs leading-relaxed">{q.feedback}</p>
            </div>
          </div>
        ))}
      </div>
    </section>
  )
}
