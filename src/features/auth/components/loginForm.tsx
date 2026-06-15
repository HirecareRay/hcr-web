"use client"

import { useLogin } from "@/features/auth/hooks/useLogin"

export function LoginForm() {
  const { form, onSubmit, isLoading, error } = useLogin()
  const { register, formState: { errors } } = form

  return (
    <form onSubmit={onSubmit} className="flex flex-col gap-4 w-full max-w-sm">
      <div className="flex flex-col gap-1">
        <label className="text-sm font-medium">이메일</label>
        <input
          {...register("email")}
          type="email"
          placeholder="example@email.com"
          className="border rounded-md px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-black"
        />
        {errors.email && <p className="text-xs text-red-500">{errors.email.message}</p>}
      </div>

      <div className="flex flex-col gap-1">
        <label className="text-sm font-medium">비밀번호</label>
        <input
          {...register("password")}
          type="password"
          placeholder="8자 이상"
          className="border rounded-md px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-black"
        />
        {errors.password && <p className="text-xs text-red-500">{errors.password.message}</p>}
      </div>

      {error && <p className="text-xs text-red-500">{error}</p>}

      <button
        type="submit"
        disabled={isLoading}
        className="bg-black text-white rounded-md py-2 text-sm font-medium disabled:opacity-50"
      >
        {isLoading ? "로그인 중..." : "로그인"}
      </button>
    </form>
  )
}
