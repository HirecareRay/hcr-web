import { useState } from "react"
import { useRouter } from "next/navigation"
import { logoutUser } from "../services/authService"
import { useAuthStore } from "../store/authStore"

export function useLogout() {
  const [isLoading, setIsLoading] = useState(false)
  const router = useRouter()
  const clearUser = useAuthStore((s) => s.clearUser)

  async function handleLogout() {
    setIsLoading(true)
    try {
      await logoutUser() // 쿠키 삭제
    } catch {
      // 쿠키 삭제가 실패해도 클라이언트 상태는 비워 로그아웃을 보장한다.
    } finally {
      clearUser()
      setIsLoading(false)
      router.push("/")
      router.refresh()
    }
  }

  return { handleLogout, isLoading }
}
