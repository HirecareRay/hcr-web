// 전역 인증 상태 — 로그인한 사용자 정보를 앱 전체가 공유한다.
//
// 토큰은 httpOnly 쿠키에 있어 JS 가 못 읽으므로, 이 스토어는 토큰이 아니라
// "지금 누가 로그인했는지"(user)만 들고 있는다. 새로고침하면 user 는 비지만,
// AuthProvider 가 /auth/me 로 쿠키를 검증해 다시 채운다(쿠키가 진실의 원천).

import { create } from "zustand"
import type { AuthUser } from "../types/auth"
import type { DocExists } from "@/features/documents/services/documentService"

// loading: 아직 /auth/me 확인 중 / authenticated: 로그인됨 / unauthenticated: 비로그인
type AuthStatus = "loading" | "authenticated" | "unauthenticated"

interface AuthState {
  user: AuthUser | null
  status: AuthStatus
  docExists: DocExists | null
  setUser: (user: AuthUser) => void
  clearUser: () => void
  setDocExists: (d: DocExists) => void
}

export const useAuthStore = create<AuthState>((set) => ({
  user: null,
  status: "loading",
  docExists: null,
  setUser: (user) => set({ user, status: "authenticated" }),
  clearUser: () => set({ user: null, status: "unauthenticated", docExists: null }),
  setDocExists: (docExists) => set({ docExists }),
}))
