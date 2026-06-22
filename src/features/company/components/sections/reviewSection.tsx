import { ThumbsDown, ThumbsUp } from "lucide-react"
import { ReportSection } from "../reportSection"
import { AiSummary } from "../aiSummary"
import type { ReviewSection as ReviewData } from "../../types/company"

interface Props {
  data: ReviewData
}

const maxScore = 5

export function ReviewSection({ data }: Props) {
  return (
    <ReportSection
      title="평판"
      meta={`${data.source} · 리뷰 ${data.reviewCount.toLocaleString()}건`}
    >
      {/* 종합 평점 */}
      <div className="flex items-end gap-2">
        <span className="text-ink text-3xl font-bold">{data.overallRating.toFixed(1)}</span>
        <span className="text-disabled mb-1 text-sm">/ {maxScore}</span>
      </div>

      {/* 항목별 세부 평점 */}
      <ul className="mt-4 space-y-2">
        {data.ratings.map((rating) => (
          <li key={rating.label} className="flex items-center gap-3">
            <span className="text-muted w-16 shrink-0 text-xs">{rating.label}</span>
            <div className="bg-warm-border/40 h-2 flex-1 overflow-hidden rounded-full">
              <div
                className="bg-primary h-full rounded-full"
                style={{ width: `${(rating.score / maxScore) * 100}%` }}
              />
            </div>
            <span className="text-ink w-8 shrink-0 text-right text-xs font-semibold">
              {rating.score.toFixed(1)}
            </span>
          </li>
        ))}
      </ul>

      {/* 장점 / 단점 */}
      <div className="mt-5 grid grid-cols-1 gap-3 sm:grid-cols-2">
        <ProsCons icon={ThumbsUp} title="장점" items={data.pros} tone="pro" />
        <ProsCons icon={ThumbsDown} title="단점" items={data.cons} tone="con" />
      </div>

      <div className="mt-4">
        <AiSummary>{data.summary}</AiSummary>
      </div>

      {/* 개별 리뷰 (대표 리뷰) */}
      {data.reviews.length > 0 && (
        <div className="mt-6">
          <p className="text-ink mb-3 text-sm font-bold">재직자 리뷰</p>
          <ul className="space-y-3">
            {data.reviews.map((review) => (
              <ReviewCard key={review.id} review={review} />
            ))}
          </ul>
        </div>
      )}
    </ReportSection>
  )
}

function ReviewCard({ review }: { review: ReviewData["reviews"][number] }) {
  return (
    <li className="border-warm-border rounded-xl border p-4">
      <div className="flex items-start justify-between gap-2">
        <p className="text-ink flex-1 text-sm font-semibold">{review.title}</p>
        <span className="text-primary shrink-0 text-sm font-bold">{review.rating.toFixed(1)}</span>
      </div>
      <p className="text-disabled mt-1 text-xs">
        {review.occupation} · {review.employStatus} · {review.date}
      </p>

      <div className="mt-3 space-y-1.5">
        <div className="flex gap-2">
          <ThumbsUp className="text-primary mt-0.5 h-3.5 w-3.5 shrink-0" />
          <p className="text-ink text-sm leading-relaxed whitespace-pre-line">{review.pros}</p>
        </div>
        <div className="flex gap-2">
          <ThumbsDown className="text-muted mt-0.5 h-3.5 w-3.5 shrink-0" />
          <p className="text-ink text-sm leading-relaxed whitespace-pre-line">{review.cons}</p>
        </div>
      </div>

      {review.helpfulCount > 0 && (
        <p className="text-disabled mt-2 text-xs">도움돼요 {review.helpfulCount}</p>
      )}
    </li>
  )
}

interface ProsConsProps {
  icon: typeof ThumbsUp
  title: string
  items: string[]
  tone: "pro" | "con"
}

function ProsCons({ icon: Icon, title, items, tone }: ProsConsProps) {
  if (items.length === 0) return null
  const color = tone === "pro" ? "text-primary" : "text-muted"

  return (
    <div>
      <div className={`flex items-center gap-1.5 text-xs font-semibold ${color}`}>
        <Icon className="h-3.5 w-3.5" />
        <span>{title}</span>
      </div>
      <ul className="mt-2 space-y-1">
        {items.map((item) => (
          <li key={item} className="text-ink text-sm leading-relaxed">
            · {item}
          </li>
        ))}
      </ul>
    </div>
  )
}
