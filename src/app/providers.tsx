"use client"

import { useEffect } from "react"
import { QueryClientProvider } from "@tanstack/react-query"
import { queryClient } from "@/lib/queryClient"
import { AuthProvider } from "@/features/auth/components/authProvider"

export function Providers({ children }: { children: React.ReactNode }) {
  // PWA 설치 가능 신호용 — Chrome은 fetch 핸들러 있는 서비스워커 등록을 설치 조건으로 봄
  useEffect(() => {
    if ("serviceWorker" in navigator) {
      navigator.serviceWorker.register("/sw.js")
    }
  }, [])

  return (
    <QueryClientProvider client={queryClient}>
      <AuthProvider>{children}</AuthProvider>
    </QueryClientProvider>
  )
}
