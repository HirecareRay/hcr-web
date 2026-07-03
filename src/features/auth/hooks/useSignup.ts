import { useState } from "react"
import { useRouter } from "next/navigation"
import { signupUser } from "../services/authService"
import { useAuthStore } from "../store/authStore"
import { logger } from "@/lib/logger"
import type { SignupFormValues } from "../types/auth"

export function useSignup() {
  const [error, setError] = useState("")
  const [isLoading, setIsLoading] = useState(false)
  const router = useRouter()
  const setUser = useAuthStore((s) => s.setUser)

  async function handleSignup(data: SignupFormValues) {
    setError("")
    setIsLoading(true)
    try {
      const result = await signupUser(data.name, data.email, data.password)
      // 가입 즉시 로그인 상태로 — 토큰은 쿠키에, 유저 정보는 스토어에.
      setUser(result.user)
      router.push("/")
      router.refresh()
    } catch (e) {
      logger.error("회원가입 실패", e)
      setError("회원가입에 실패했습니다")
    } finally {
      setIsLoading(false)
    }
  }

  return { handleSignup, error, isLoading }
}
