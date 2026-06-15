import axiosInstance from "@/lib/axiosInstance"
import { LoginInput, LoginResponse } from "@/features/auth/types/auth"
import { ApiResponse } from "@/types/api"

export async function login(data: LoginInput): Promise<ApiResponse<LoginResponse>> {
  const res = await axiosInstance.post<ApiResponse<LoginResponse>>("/api/auth/login", data)
  return res.data
}

export async function logout(): Promise<void> {
  await axiosInstance.post("/api/auth/logout")
}
