import { z } from "zod"

export const loginSchema = z.object({
  email: z.string().email("올바른 이메일 형식을 입력해주세요"),
  password: z.string().min(8, "비밀번호는 8자 이상이어야 합니다"),
  // 로그인 상태 유지 — 체크 시 지속 쿠키(껐다 켜도 유지), 미체크 시 세션 쿠키
  remember: z.boolean().optional(),
})

export const signupSchema = z
  .object({
    name: z.string().min(1, "이름을 입력해주세요"),
    email: z.string().email("올바른 이메일 형식을 입력해주세요"),
    password: z.string().min(8, "비밀번호는 8자 이상이어야 합니다"),
    confirmPassword: z.string(),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "비밀번호가 일치하지 않습니다",
    path: ["confirmPassword"],
  })

export type LoginFormValues = z.infer<typeof loginSchema>
export type SignupFormValues = z.infer<typeof signupSchema>

export interface AuthUser {
  id: string
  name: string
  email: string
}

export interface LoginResponse {
  token: string
  user: AuthUser
}

export interface SignupResponse {
  token: string
  user: AuthUser
}
