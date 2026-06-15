import { create } from "zustand"
import { AuthUser } from "@/features/auth/types/auth"

interface AuthState {
  user: AuthUser | null
  isAuthenticated: boolean
  setUser: (user: AuthUser, token: string) => void
  logout: () => void
}

export const useAuthStore = create<AuthState>((set) => ({
  user: null,
  isAuthenticated: false,
  setUser: (user, token) => {
    localStorage.setItem("token", token)
    set({ user, isAuthenticated: true })
  },
  logout: () => {
    localStorage.removeItem("token")
    set({ user: null, isAuthenticated: false })
  },
}))
