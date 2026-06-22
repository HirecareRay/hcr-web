"use client"

import { useState, type FormEvent } from "react"
import { ArrowLeft, Camera, CheckCircle2, UserRound } from "lucide-react"
import { userProfileFixture } from "../services/myPageService"

export function ProfileEditForm() {
  const [name, setName] = useState(userProfileFixture.name)
  const [email, setEmail] = useState(userProfileFixture.email)
  const [statusMessage, setStatusMessage] = useState(userProfileFixture.statusMessage)
  const [isSaved, setIsSaved] = useState(false)

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

          <label className="block">
            <span className="text-ink mb-2 block text-sm font-semibold">한 줄 소개</span>
            <textarea
              value={statusMessage}
              onChange={(event) => {
                setStatusMessage(event.target.value)
                setIsSaved(false)
              }}
              maxLength={80}
              rows={4}
              className="border-warm-border text-ink placeholder:text-disabled w-full resize-none rounded-2xl border bg-white px-4 py-3 text-sm leading-6"
              placeholder="나를 소개하는 문장을 입력하세요"
            />
            <span className="text-disabled mt-1 block text-right text-[0.6875rem]">
              {statusMessage.length}/80
            </span>
          </label>
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
