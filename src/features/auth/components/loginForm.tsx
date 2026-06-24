"use client"

import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import Link from "next/link"
import { loginSchema, type LoginFormValues } from "../types/auth"
import { useLogin } from "../hooks/useLogin"
import { AuthField } from "./authField"

export function LoginForm() {
  const { handleLogin, error, isLoading } = useLogin()

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<LoginFormValues>({
    resolver: zodResolver(loginSchema),
  })

  return (
    <div className="bg-warm-bg flex min-h-screen items-center justify-center px-4">
      <div className="w-full max-w-sm">
        <div className="mb-8 text-center">
          <div className="bg-primary mb-4 inline-flex h-12 w-12 items-center justify-center rounded-2xl shadow-sm">
            <span className="text-lg font-extrabold text-white">H</span>
          </div>
          <h1 className="text-ink text-2xl font-extrabold">로그인</h1>
          <p className="text-muted mt-1 text-sm">HireCareRay에 오신 걸 환영합니다</p>
        </div>

        <div className="border-warm-border rounded-2xl border bg-white p-6 shadow-sm">
          <form onSubmit={handleSubmit(handleLogin)} className="space-y-4">
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
              placeholder="비밀번호를 입력하세요"
              errorMessage={errors.password?.message}
              {...register("password")}
            />

            <label htmlFor="remember" className="text-muted flex cursor-pointer items-center gap-2">
              <input
                id="remember"
                type="checkbox"
                {...register("remember")}
                className="accent-primary size-4 cursor-pointer rounded"
              />
              <span className="text-sm">로그인 상태 유지</span>
            </label>

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
              {isLoading ? "로그인 중..." : "로그인"}
            </button>
          </form>
        </div>

        <p className="text-muted mt-5 text-center text-sm">
          계정이 없으신가요?{" "}
          <Link href="/signup" className="text-primary hover:text-coral-deep font-bold">
            회원가입
          </Link>
        </p>
      </div>
    </div>
  )
}
