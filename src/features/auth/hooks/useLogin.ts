import { useRouter } from "next/navigation"
import { useMutation } from "@tanstack/react-query"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { login } from "@/features/auth/services/authService"
import { useAuthStore } from "@/features/auth/store/authStore"
import { loginSchema, LoginInput } from "@/features/auth/types/auth"

export function useLogin() {
  const router = useRouter()
  const setUser = useAuthStore((s) => s.setUser)

  const form = useForm<LoginInput>({
    resolver: zodResolver(loginSchema),
    defaultValues: { email: "", password: "" },
  })

  const mutation = useMutation({
    mutationFn: login,
    onSuccess: (res) => {
      if (res.success && res.data) {
        setUser(res.data.user, res.data.token)
        router.push("/")
      }
    },
  })

  const onSubmit = form.handleSubmit((data) => mutation.mutate(data))

  return {
    form,
    onSubmit,
    isLoading: mutation.isPending,
    error: mutation.error?.message ?? null,
  }
}
