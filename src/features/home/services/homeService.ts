/**
 * homeService.ts
 *
 * 홈 도메인의 API 호출을 담당하는 서비스 계층입니다.
 * 컴포넌트/훅은 axios를 직접 쓰지 않고 이 함수를 통해 BFF와 통신합니다.
 * 프론트는 데이터 출처(더미/실데이터)를 모른 채 BFF만 호출합니다.
 */

import axiosInstance from "@/lib/axiosInstance"
import { apiEndpoints } from "@/constants/api"
import type { ApiResponse } from "@/types/api"
import type { HomeFeed } from "../types/home"

/**
 * 홈 피드(트렌딩·기술스택·이슈)를 조회합니다.
 */
export async function getHomeFeed(): Promise<HomeFeed> {
  const { data } = await axiosInstance.get<ApiResponse<HomeFeed>>(apiEndpoints.home.feed)

  if (!data.success || !data.data) {
    throw new Error(data.error ?? "홈 정보를 불러오지 못했습니다")
  }

  return data.data
}
