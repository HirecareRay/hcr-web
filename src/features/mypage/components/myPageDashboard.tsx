import {
  Bookmark,
  BriefcaseBusiness,
  ChevronRight,
  Clock3,
  FileText,
  FolderKanban,
  IdCard,
  Mic2,
  Pencil,
  UserRound,
} from "lucide-react"
import Link from "next/link"
import {
  careerDocumentFixtures,
  myPageActivityFixture,
  userProfileFixture,
} from "../services/myPageService"
import type { CareerDocumentFixture } from "../types/mypage"

const documentIcons: Record<CareerDocumentFixture["type"], typeof FileText> = {
  resume: IdCard,
  coverLetter: FileText,
  portfolio: BriefcaseBusiness,
  project: FolderKanban,
}

function MenuRow({
  icon: Icon,
  label,
  count,
}: {
  icon: typeof FileText
  label: string
  count: number
}) {
  return (
    <button
      type="button"
      className="border-coral-light flex w-full items-center gap-3 border-t px-4 py-3.5 text-left first:border-t-0"
    >
      <span className="bg-coral-light flex size-9 shrink-0 items-center justify-center rounded-xl">
        <Icon className="text-primary size-4" />
      </span>
      <span className="text-ink flex-1 text-sm font-semibold">{label}</span>
      <span className="text-primary text-sm font-bold">{count}</span>
      <ChevronRight className="text-disabled size-4" />
    </button>
  )
}

export function MyPageDashboard() {
  return (
    <section className="bg-background min-h-full pb-8">
      <header className="border-warm-border border-b bg-white px-5 py-4">
        <h1 className="text-ink text-lg font-bold">마이페이지</h1>
      </header>

      <div className="space-y-6 px-5 py-5">
        <section className="border-warm-border rounded-2xl border bg-white p-5">
          <div className="flex items-start gap-4">
            <span className="bg-coral-light flex size-14 shrink-0 items-center justify-center rounded-full">
              <UserRound className="text-primary size-7" />
            </span>
            <div className="min-w-0 flex-1">
              <div className="flex items-center justify-between gap-3">
                <div>
                  <h2 className="text-ink text-lg font-bold">{userProfileFixture.name}님</h2>
                  <p className="text-disabled mt-0.5 text-xs">{userProfileFixture.email}</p>
                </div>
                <Link
                  href="/mypage/profile"
                  aria-label="회원 정보 수정"
                  className="border-warm-border text-muted rounded-xl border p-2"
                >
                  <Pencil className="size-4" />
                </Link>
              </div>
              <p className="text-muted mt-3 text-sm">{userProfileFixture.statusMessage}</p>
            </div>
          </div>

          <div className="mt-5">
            <div className="flex items-center justify-between text-xs">
              <span className="text-muted font-semibold">프로필 완성도</span>
              <span className="text-primary font-bold">{userProfileFixture.completionRate}%</span>
            </div>
            <div className="bg-coral-light mt-2 h-2 overflow-hidden rounded-full">
              <div
                className="bg-primary h-full rounded-full"
                style={{ width: `${userProfileFixture.completionRate}%` }}
              />
            </div>
          </div>
        </section>

        <section>
          <h2 className="text-ink mb-3 text-base font-bold">취업 준비 자료</h2>
          <div className="grid grid-cols-2 gap-3">
            {careerDocumentFixtures.map((document) => {
              const Icon = documentIcons[document.type]

              return (
                <button
                  key={document.id}
                  type="button"
                  className="border-warm-border rounded-2xl border bg-white p-4 text-left"
                >
                  <span className="bg-coral-light flex size-9 items-center justify-center rounded-xl">
                    <Icon className="text-primary size-4" />
                  </span>
                  <div className="mt-4 flex items-end justify-between">
                    <span className="text-ink font-bold">{document.label}</span>
                    <span className="text-primary text-sm font-bold">{document.count}개</span>
                  </div>
                  <p className="text-disabled mt-1 text-[0.6875rem] leading-4">
                    {document.description}
                  </p>
                </button>
              )
            })}
          </div>
        </section>

        <section>
          <h2 className="text-ink mb-3 text-base font-bold">최근 활동</h2>
          <div className="border-warm-border overflow-hidden rounded-2xl border bg-white">
            <MenuRow
              icon={Clock3}
              label="최근 본 기업"
              count={myPageActivityFixture.recentlyViewedCompanies}
            />
            <MenuRow
              icon={Clock3}
              label="최근 본 공고"
              count={myPageActivityFixture.recentlyViewedJobs}
            />
          </div>
        </section>

        <section>
          <h2 className="text-ink mb-3 text-base font-bold">찜한 항목</h2>
          <div className="border-warm-border overflow-hidden rounded-2xl border bg-white">
            <MenuRow
              icon={Bookmark}
              label="찜한 기업"
              count={myPageActivityFixture.bookmarkedCompanies}
            />
            <MenuRow
              icon={Bookmark}
              label="찜한 공고"
              count={myPageActivityFixture.bookmarkedJobs}
            />
          </div>
        </section>

        <section>
          <h2 className="text-ink mb-3 text-base font-bold">AI 면접</h2>
          <div className="border-warm-border overflow-hidden rounded-2xl border bg-white">
            <MenuRow
              icon={Mic2}
              label="AI 면접 결과"
              count={myPageActivityFixture.interviewResults}
            />
          </div>
        </section>
      </div>
    </section>
  )
}
