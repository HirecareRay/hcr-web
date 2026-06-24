// 인증 API 호출 — 프론트는 BFF(/api/auth/*)만 부르고 백엔드를 직접 보지 않는다.
// 토큰은 BFF 가 httpOnly 쿠키로 관리하므로, 여기선 토큰을 손대지 않고 유저 정보만 다룬다.
import axiosInstance from "@/lib/axiosInstance"
import type { AuthUser, LoginResponse, SignupResponse } from "../types/auth"

export async function loginUser(email: string, password: string): Promise<LoginResponse> {
  const { data } = await axiosInstance.post("/api/auth/login", { email, password })
  return data.data as LoginResponse
}

export async function signupUser(
  name: string,
  email: string,
  password: string
): Promise<SignupResponse> {
  const { data } = await axiosInstance.post("/api/auth/signup", { name, email, password })
  return data.data as SignupResponse
}

// 현재 로그인 사용자 조회 — 쿠키의 토큰을 검증해 유저 정보를 돌려준다(비로그인 시 401).
export async function fetchMe(): Promise<AuthUser> {
  const { data } = await axiosInstance.get("/api/auth/me")
  return data.data as AuthUser
}

// 로그아웃 — 토큰 쿠키를 지운다.
export async function logoutUser(): Promise<void> {
  await axiosInstance.post("/api/auth/logout")
}
