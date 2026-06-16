// TODO: 백엔드 미구현 — 연동 시 실제 엔드포인트로 교체
import axiosInstance from "@/lib/axiosInstance"

export async function loginUser(email: string, password: string) {
  const { data } = await axiosInstance.post("/api/auth/login", { email, password })
  return data.data as { token: string; user: { id: string; name: string; email: string } }
}

export async function signupUser(name: string, email: string, password: string) {
  const { data } = await axiosInstance.post("/api/auth/signup", { name, email, password })
  return data.data as { token: string; user: { id: string; name: string; email: string } }
}
