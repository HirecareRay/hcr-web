"use client"

import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import Link from "next/link"
import { signupSchema, type SignupFormValues } from "../types/auth"
import { useSignup } from "../hooks/useSignup"
import { AuthField } from "./authField"
import { SocialLoginButtons } from "./socialLoginButtons"

export function SignupForm() {
  const { handleSignup, error, isLoading } = useSignup()

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<SignupFormValues>({
    resolver: zodResolver(signupSchema),
  })

  return (
    <div className="bg-warm-bg flex h-full items-center justify-center px-4 py-3">
      <div className="w-full max-w-sm">
        <div className="mb-4 text-center">
          <div className="bg-primary mb-3 inline-flex h-10 w-10 items-center justify-center rounded-2xl shadow-sm">
            <span className="text-base font-extrabold text-white">H</span>
          </div>
          <h1 className="text-ink text-2xl font-extrabold">회원가입</h1>
          <p className="text-muted mt-1 text-sm">취업 준비를 시작해보세요</p>
        </div>

        <div className="border-warm-border rounded-2xl border bg-white p-4 shadow-sm">
          <form onSubmit={handleSubmit(handleSignup)} className="space-y-3">
            <AuthField
              label="이름"
              id="name"
              type="text"
              placeholder="이름을 입력하세요"
              errorMessage={errors.name?.message}
              {...register("name")}
            />

            <AuthField
              label="이메일"
              id="email"
              type="email"
              placeholder="이메일을 입력하세요"
              errorMessage={errors.email?.message}
              {...register("email")}
            />

            <AuthField
              label="비밀번호"
              id="password"
              type="password"
              placeholder="8자 이상 입력하세요"
              errorMessage={errors.password?.message}
              {...register("password")}
            />

            <AuthField
              label="비밀번호 확인"
              id="confirmPassword"
              type="password"
              placeholder="비밀번호를 다시 입력하세요"
              errorMessage={errors.confirmPassword?.message}
              {...register("confirmPassword")}
            />

            {error && (
              <div className="border-warm-border bg-coral-light rounded-xl border px-3.5 py-2.5">
                <p className="text-error text-xs font-medium">{error}</p>
              </div>
            )}

            <button
              type="submit"
              disabled={isLoading}
              className="bg-primary hover:bg-coral-deep mt-2 w-full rounded-xl py-3 text-sm font-bold text-white transition-colors disabled:opacity-60"
            >
              {isLoading ? "가입 중..." : "회원가입"}
            </button>
          </form>

          <div className="mt-3">
            <SocialLoginButtons />
          </div>
        </div>

        <p className="text-muted mt-4 text-center text-sm">
          이미 계정이 있으신가요?{" "}
          <Link href="/login" className="text-primary hover:text-coral-deep font-bold">
            로그인
          </Link>
        </p>
      </div>
    </div>
  )
}
