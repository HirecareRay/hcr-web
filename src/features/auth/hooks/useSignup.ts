import { useState } from "react"
import { useRouter } from "next/navigation"
import { signupUser } from "../services/authService"
import { saveToken } from "../store/authStore"
import type { SignupFormValues } from "../types/auth"

export function useSignup() {
  const [error, setError] = useState("")
  const [isLoading, setIsLoading] = useState(false)
  const router = useRouter()

  async function handleSignup(data: SignupFormValues) {
    setError("")
    setIsLoading(true)
    try {
      const result = await signupUser(data.name, data.email, data.password)
      saveToken(result.token)
      router.push("/")
    } catch {
      setError("회원가입에 실패했습니다")
    } finally {
      setIsLoading(false)
    }
  }

  return { handleSignup, error, isLoading }
}
