"use client"

// 앱이 켜질 때(또는 새로고침 시) 한 번 /auth/me 를 호출해 로그인 상태를 복원한다.
// 쿠키의 토큰이 유효하면 유저 정보를 스토어에 채우고(authenticated),
// 없거나 만료면 비로그인으로 표시한다(unauthenticated). 화면을 막지는 않는다.

import { useEffect } from "react"
import { fetchMe } from "../services/authService"
import { useAuthStore } from "../store/authStore"
import { documentService } from "@/features/documents/services/documentService"
import { logger } from "@/lib/logger"

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const setUser = useAuthStore((s) => s.setUser)
  const clearUser = useAuthStore((s) => s.clearUser)
  const setDocExists = useAuthStore((s) => s.setDocExists)

  useEffect(() => {
    let active = true
    fetchMe()
      .then((user) => {
        if (!active) return
        setUser(user)
        documentService
          .exists()
          .then(setDocExists)
          .catch((e) => logger.error("문서 존재 여부 조회 실패", e))
      })
      .catch(() => {
        if (active) clearUser()
      })
    return () => {
      active = false
    }
  }, [setUser, clearUser, setDocExists])

  return <>{children}</>
}
