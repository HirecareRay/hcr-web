import { useState } from "react"
import { useRouter } from "next/navigation"
import { loginUser } from "../services/authService"
import { saveToken } from "../store/authStore"
import type { LoginFormValues } from "../types/auth"

export function useLogin() {
  const [error, setError] = useState("")
  const [isLoading, setIsLoading] = useState(false)
  const router = useRouter()

  async function handleLogin(data: LoginFormValues) {
    setError("")
    setIsLoading(true)
    try {
      const result = await loginUser(data.email, data.password)
      saveToken(result.token)
      router.push("/")
    } catch {
      setError("이메일 또는 비밀번호가 올바르지 않습니다")
    } finally {
      setIsLoading(false)
    }
  }

  return { handleLogin, error, isLoading }
}
