import { forwardRef, type ComponentPropsWithoutRef } from "react"

interface AuthFieldProps extends ComponentPropsWithoutRef<"input"> {
  label: string
  errorMessage?: string
}

// 로그인·회원가입 폼이 공유하는 입력 필드 — 라벨 + 코랄 포커스 + 에러 메시지.
// react-hook-form 의 register() ref 를 받기 위해 forwardRef 로 감싼다.
export const AuthField = forwardRef<HTMLInputElement, AuthFieldProps>(function AuthField(
  { label, id, errorMessage, ...inputProps },
  ref
) {
  return (
    <div>
      <label htmlFor={id} className="text-ink mb-1.5 block text-sm font-semibold">
        {label}
      </label>
      <div className="border-warm-border focus-within:border-primary focus-within:ring-coral-light flex items-center rounded-xl border bg-white px-3.5 py-2.5 transition-all focus-within:ring-2">
        <input
          id={id}
          ref={ref}
          {...inputProps}
          className="text-ink placeholder-disabled w-full bg-transparent text-sm"
        />
      </div>
      {errorMessage && <p className="text-error mt-1 text-xs">{errorMessage}</p>}
    </div>
  )
})
