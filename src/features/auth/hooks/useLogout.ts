import { useState } from "react"
import { useRouter } from "next/navigation"
import { logoutUser } from "../services/authService"
import { useAuthStore } from "../store/authStore"
import { logger } from "@/lib/logger"

export function useLogout() {
  const [isLoading, setIsLoading] = useState(false)
  const router = useRouter()
  const clearUser = useAuthStore((s) => s.clearUser)

  async function handleLogout() {
    setIsLoading(true)
    try {
      await logoutUser() // 쿠키 삭제
    } catch (e) {
      logger.error("로그아웃 API 실패 (클라이언트 상태는 초기화)", e)
    } finally {
      clearUser()
      setIsLoading(false)
      router.push("/")
      router.refresh()
    }
  }

  return { handleLogout, isLoading }
}
