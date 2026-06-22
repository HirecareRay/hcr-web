"use client"

import { useState, type FormEvent } from "react"
import { ArrowLeft, Camera, CheckCircle2, Plus, Search, UserRound, X } from "lucide-react"
import { defaultInterestJobs, jobCategories, userProfileFixture } from "../services/myPageService"

export function ProfileEditForm() {
  const [name, setName] = useState(userProfileFixture.name)
  const [email, setEmail] = useState(userProfileFixture.email)
  const [statusMessage, setStatusMessage] = useState(userProfileFixture.statusMessage)
  const [interestJobs, setInterestJobs] = useState<string[]>(defaultInterestJobs)
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null)
  const [searchQuery, setSearchQuery] = useState("")
  const [companySize, setCompanySize] = useState<string[]>(["스타트업"])
  const [careerLevel, setCareerLevel] = useState<string[]>(["신입"])
  const [isSaved, setIsSaved] = useState(false)

  function toggleItem(list: string[], setList: (v: string[]) => void, item: string) {
    setList(list.includes(item) ? list.filter((i) => i !== item) : [...list, item])
    setIsSaved(false)
  }

  const filteredSubJobs = (() => {
    if (searchQuery.trim()) {
      return jobCategories.flatMap((c) => c.jobs.filter((j) => j.includes(searchQuery.trim())))
    }
    if (selectedCategory) {
      return jobCategories.find((c) => c.label === selectedCategory)?.jobs ?? []
    }
    return []
  })()

  function toggleJob(job: string) {
    setInterestJobs((prev) => (prev.includes(job) ? prev.filter((j) => j !== job) : [...prev, job]))
    setIsSaved(false)
  }

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()
    setIsSaved(true)
  }

  return (
    <section className="bg-background min-h-full pb-8">
      <header className="border-warm-border flex h-14 items-center border-b bg-white px-5">
        <button type="button" aria-label="뒤로 가기" onClick={() => history.back()} className="p-1">
          <ArrowLeft className="text-ink size-6" />
        </button>
        <h1 className="text-ink flex-1 pr-7 text-center text-base font-bold">회원 정보 수정</h1>
      </header>

      <form onSubmit={handleSubmit} className="px-5 py-6">
        <div className="flex flex-col items-center">
          <div className="relative">
            <span className="bg-coral-light flex size-20 items-center justify-center rounded-full">
              <UserRound className="text-primary size-10" />
            </span>
            <button
              type="button"
              aria-label="프로필 사진 변경"
              className="bg-primary absolute right-0 bottom-0 flex size-8 items-center justify-center rounded-full border-2 border-white text-white"
            >
              <Camera className="size-4" />
            </button>
          </div>
          <p className="text-disabled mt-3 text-xs">프로필 사진 변경</p>
        </div>

        <div className="mt-7 space-y-5">
          <label className="block">
            <span className="text-ink mb-2 block text-sm font-semibold">이름</span>
            <input
              type="text"
              value={name}
              onChange={(event) => {
                setName(event.target.value)
                setIsSaved(false)
              }}
              required
              className="border-warm-border text-ink placeholder:text-disabled w-full rounded-2xl border bg-white px-4 py-3 text-sm"
              placeholder="이름을 입력하세요"
            />
          </label>

          <label className="block">
            <span className="text-ink mb-2 block text-sm font-semibold">이메일</span>
            <input
              type="email"
              value={email}
              onChange={(event) => {
                setEmail(event.target.value)
                setIsSaved(false)
              }}
              required
              className="border-warm-border text-ink placeholder:text-disabled w-full rounded-2xl border bg-white px-4 py-3 text-sm"
              placeholder="이메일을 입력하세요"
            />
          </label>

          <div>
            <span className="text-ink mb-2 block text-sm font-semibold">기업 규모</span>
            <div className="flex flex-wrap gap-2">
              {["스타트업", "중소기업", "중견기업", "대기업"].map((size) => (
                <button
                  key={size}
                  type="button"
                  onClick={() => toggleItem(companySize, setCompanySize, size)}
                  className={`rounded-full border px-3 py-1.5 text-xs font-semibold ${
                    companySize.includes(size)
                      ? "border-primary bg-primary text-white"
                      : "border-warm-border text-muted bg-white"
                  }`}
                >
                  {size}
                </button>
              ))}
            </div>
          </div>

          <div>
            <span className="text-ink mb-2 block text-sm font-semibold">경력 구분</span>
            <div className="flex gap-2">
              {["신입", "경력", "인턴"].map((level) => (
                <button
                  key={level}
                  type="button"
                  onClick={() => toggleItem(careerLevel, setCareerLevel, level)}
                  className={`rounded-full border px-4 py-1.5 text-xs font-semibold ${
                    careerLevel.includes(level)
                      ? "border-primary bg-primary text-white"
                      : "border-warm-border text-muted bg-white"
                  }`}
                >
                  {level}
                </button>
              ))}
            </div>
          </div>

          <div>
            <span className="text-ink mb-2 block text-sm font-semibold">관심 직무</span>
            <p className="text-muted mb-3 text-xs">대분류를 선택하거나 검색해보세요</p>

            {/* 검색 */}
            <label className="border-warm-border bg-warm-bg mb-3 flex items-center gap-2 rounded-2xl border px-4 py-2.5">
              <Search className="text-disabled size-4 shrink-0" />
              <input
                type="search"
                value={searchQuery}
                onChange={(e) => {
                  setSearchQuery(e.target.value)
                  setSelectedCategory(null)
                }}
                placeholder="직무를 검색하세요"
                className="text-ink placeholder:text-disabled min-w-0 flex-1 bg-transparent text-sm"
              />
            </label>

            {/* 대분류 탭 */}
            <div className="mb-3 flex gap-2 overflow-x-auto pb-1">
              {jobCategories.map((cat) => (
                <button
                  key={cat.label}
                  type="button"
                  onClick={() => {
                    setSelectedCategory(selectedCategory === cat.label ? null : cat.label)
                    setSearchQuery("")
                  }}
                  className={`shrink-0 rounded-full border px-3 py-1.5 text-xs font-semibold ${
                    selectedCategory === cat.label
                      ? "border-primary bg-primary text-white"
                      : "border-warm-border text-muted bg-white"
                  }`}
                >
                  {cat.label}
                </button>
              ))}
            </div>

            {/* 소분류 */}
            {filteredSubJobs.length > 0 && (
              <div className="border-warm-border mb-3 rounded-2xl border bg-white p-3">
                <div className="flex flex-wrap gap-2">
                  {filteredSubJobs.map((job) => {
                    const selected = interestJobs.includes(job)
                    return (
                      <button
                        key={job}
                        type="button"
                        onClick={() => toggleJob(job)}
                        className={`flex items-center gap-1 rounded-full border px-3 py-1.5 text-xs font-semibold ${
                          selected
                            ? "border-primary bg-primary text-white"
                            : "border-warm-border text-muted bg-white"
                        }`}
                      >
                        {selected ? <X className="size-3" /> : <Plus className="size-3" />}
                        {job}
                      </button>
                    )
                  })}
                </div>
              </div>
            )}

            {/* 선택된 태그 */}
            {interestJobs.length > 0 && (
              <div className="flex flex-wrap gap-1.5">
                {interestJobs.map((job) => (
                  <button
                    key={job}
                    type="button"
                    onClick={() => toggleJob(job)}
                    className="bg-coral-light text-primary flex items-center gap-1 rounded-full px-2.5 py-1 text-xs font-semibold"
                  >
                    #{job} <X className="size-3" />
                  </button>
                ))}
              </div>
            )}
          </div>
        </div>

        {isSaved && (
          <div className="text-success mt-5 flex items-center gap-2 rounded-2xl bg-[#eefaf3] px-4 py-3 text-sm font-semibold">
            <CheckCircle2 className="size-4" />
            회원 정보가 저장되었어요.
          </div>
        )}

        <button
          type="submit"
          className="bg-primary mt-7 w-full rounded-2xl py-4 text-sm font-bold text-white"
        >
          변경사항 저장
        </button>
      </form>
    </section>
  )
}
