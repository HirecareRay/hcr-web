"use client"

import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import Link from "next/link"
import { signupSchema, type SignupFormValues } from "../types/auth"
import { useSignup } from "../hooks/useSignup"

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
    <div className="flex min-h-screen items-center justify-center bg-blue-50 px-4 py-8">
      <div className="w-full max-w-sm">
        <div className="mb-8 text-center">
          <div className="mb-4 inline-flex h-12 w-12 items-center justify-center rounded-xl bg-blue-600">
            <span className="text-lg font-bold text-white">H</span>
          </div>
          <h1 className="text-2xl font-bold text-gray-900">회원가입</h1>
          <p className="mt-1 text-sm text-gray-500">취업 준비를 시작해보세요</p>
        </div>

        <div className="rounded-2xl border border-gray-100 bg-white p-6 shadow-sm">
          <form onSubmit={handleSubmit(handleSignup)} className="space-y-4">
            <div>
              <label htmlFor="name" className="mb-1.5 block text-sm font-medium text-gray-700">
                이름
              </label>
              <div className="flex items-center rounded-lg border border-gray-200 bg-white px-3.5 py-2.5 transition-all focus-within:border-blue-500 focus-within:ring-2 focus-within:ring-blue-100">
                <input
                  id="name"
                  type="text"
                  {...register("name")}
                  placeholder="이름을 입력하세요"
                  className="w-full bg-transparent text-sm text-gray-800 placeholder-gray-400"
                />
              </div>
              {errors.name && <p className="mt-1 text-xs text-red-500">{errors.name.message}</p>}
            </div>

            <div>
              <label htmlFor="email" className="mb-1.5 block text-sm font-medium text-gray-700">
                이메일
              </label>
              <div className="flex items-center rounded-lg border border-gray-200 bg-white px-3.5 py-2.5 transition-all focus-within:border-blue-500 focus-within:ring-2 focus-within:ring-blue-100">
                <input
                  id="email"
                  type="email"
                  {...register("email")}
                  placeholder="이메일을 입력하세요"
                  className="w-full bg-transparent text-sm text-gray-800 placeholder-gray-400"
                />
              </div>
              {errors.email && <p className="mt-1 text-xs text-red-500">{errors.email.message}</p>}
            </div>

            <div>
              <label htmlFor="password" className="mb-1.5 block text-sm font-medium text-gray-700">
                비밀번호
              </label>
              <div className="flex items-center rounded-lg border border-gray-200 bg-white px-3.5 py-2.5 transition-all focus-within:border-blue-500 focus-within:ring-2 focus-within:ring-blue-100">
                <input
                  id="password"
                  type="password"
                  {...register("password")}
                  placeholder="8자 이상 입력하세요"
                  className="w-full bg-transparent text-sm text-gray-800 placeholder-gray-400"
                />
              </div>
              {errors.password && (
                <p className="mt-1 text-xs text-red-500">{errors.password.message}</p>
              )}
            </div>

            <div>
              <label
                htmlFor="confirmPassword"
                className="mb-1.5 block text-sm font-medium text-gray-700"
              >
                비밀번호 확인
              </label>
              <div className="flex items-center rounded-lg border border-gray-200 bg-white px-3.5 py-2.5 transition-all focus-within:border-blue-500 focus-within:ring-2 focus-within:ring-blue-100">
                <input
                  id="confirmPassword"
                  type="password"
                  {...register("confirmPassword")}
                  placeholder="비밀번호를 다시 입력하세요"
                  className="w-full bg-transparent text-sm text-gray-800 placeholder-gray-400"
                />
              </div>
              {errors.confirmPassword && (
                <p className="mt-1 text-xs text-red-500">{errors.confirmPassword.message}</p>
              )}
            </div>

            {error && (
              <div className="rounded-lg border border-red-100 bg-red-50 px-3.5 py-2.5">
                <p className="text-xs text-red-600">{error}</p>
              </div>
            )}

            <button
              type="submit"
              disabled={isLoading}
              className="mt-2 w-full rounded-lg bg-blue-600 py-3 text-sm font-medium text-white transition-colors hover:bg-blue-700 disabled:bg-blue-300"
            >
              {isLoading ? "가입 중..." : "회원가입"}
            </button>
          </form>
        </div>

        <p className="mt-5 text-center text-sm text-gray-500">
          이미 계정이 있으신가요?{" "}
          <Link href="/login" className="font-medium text-blue-600 hover:text-blue-700">
            로그인
          </Link>
        </p>
      </div>
    </div>
  )
}
