"use client"

import Link from "next/link"
import { ChevronRight, Sparkles } from "lucide-react"
import { PageTopBar } from "@/components/ui/pageTopBar"

const interviews = [
  {
    id: "1",
    companyName: "CJ ENM",
    jobName: "Data Scientist",
    date: "2026.06.10",
    score: 82,
    feedback: "논리적 답변 구성이 우수하나 구체적 수치 활용이 부족합니다.",
  },
  {
    id: "2",
    companyName: "CJ ENM",
    jobName: "Web/App Lead",
    date: "2026.06.03",
    score: 76,
    feedback: "기술 역량은 충분하나 리더십 경험 어필이 아쉽습니다.",
  },
]

export function InterviewListPage() {
  return (
    <section className="bg-background min-h-full pb-10">
      <PageTopBar title="AI 면접 기록" backTo="/mypage" />

      {interviews.length === 0 ? (
        <div className="flex flex-col items-center justify-center px-5 pt-24 text-center">
          <div className="bg-warm-bg flex size-20 items-center justify-center rounded-full">
            <Sparkles className="text-disabled size-9" />
          </div>
          <p className="text-ink mt-5 text-base font-bold">아직 면접 기록이 없어요</p>
          <p className="text-muted mt-2 text-sm">AI 면접을 진행하면 결과가 여기에 쌓여요</p>
        </div>
      ) : (
        <div className="flex flex-col gap-3 px-5 pt-5">
          {interviews.map((item) => (
            <div key={item.id} className="border-warm-border rounded-2xl border bg-white p-4">
              <div className="flex items-start justify-between">
                <div>
                  <p className="text-muted text-xs">{item.date}</p>
                  <p className="text-ink mt-1 text-sm font-bold">{item.companyName}</p>
                  <p className="text-muted text-xs">{item.jobName}</p>
                </div>
                <div className="flex items-center gap-1">
                  <span className="text-primary text-2xl font-extrabold">{item.score}</span>
                  <span className="text-muted text-sm font-bold">점</span>
                </div>
              </div>
              <p className="text-muted border-warm-border mt-3 border-t pt-3 text-xs leading-relaxed">
                {item.feedback}
              </p>
              <Link
                href={`/mypage/interview/${item.id}`}
                className="text-primary mt-2 flex items-center gap-1 text-xs font-semibold"
              >
                상세 보기 <ChevronRight className="size-3" />
              </Link>
            </div>
          ))}
        </div>
      )}
    </section>
  )
}
