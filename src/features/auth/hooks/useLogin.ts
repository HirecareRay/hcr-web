import { useState } from "react"
import { useRouter } from "next/navigation"
import { loginUser } from "../services/authService"
import { useAuthStore } from "../store/authStore"
import { documentService } from "@/features/documents/services/documentService"
import { logger } from "@/lib/logger"
import type { LoginFormValues } from "../types/auth"

export function useLogin() {
  const [error, setError] = useState("")
  const [isLoading, setIsLoading] = useState(false)
  const router = useRouter()
  const setUser = useAuthStore((s) => s.setUser)
  const setDocExists = useAuthStore((s) => s.setDocExists)

  async function handleLogin(data: LoginFormValues) {
    setError("")
    setIsLoading(true)
    try {
      const result = await loginUser(data.email, data.password)
      // 토큰은 BFF 가 쿠키로 심었으니, 여기선 유저 정보만 전역 스토어에 채운다.
      setUser(result.user)
      documentService
        .exists()
        .then(setDocExists)
        .catch((e) => logger.error("문서 존재 여부 조회 실패", e))
      // 보호 페이지에서 튕겨와 로그인했다면 원래 가려던 곳으로, 아니면 홈으로.
      const redirect = new URLSearchParams(window.location.search).get("redirect")
      router.push(redirect ?? "/")
      router.refresh() // 미들웨어·서버 컴포넌트가 새 로그인 상태를 다시 읽도록
    } catch (e) {
      logger.error("로그인 실패", e)
      setError("이메일 또는 비밀번호가 올바르지 않습니다")
    } finally {
      setIsLoading(false)
    }
  }

  return { handleLogin, error, isLoading }
}
