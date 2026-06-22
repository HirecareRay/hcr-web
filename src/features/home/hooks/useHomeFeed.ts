/**
 * useHomeFeed.ts
 *
 * 홈 피드 데이터를 가져오는 React Query 훅입니다.
 * data / isLoading / isError 상태를 컴포넌트에 그대로 전달합니다.
 */

import { useQuery } from "@tanstack/react-query"
import { getHomeFeed } from "../services/homeService"

export function useHomeFeed() {
  return useQuery({
    queryKey: ["homeFeed"],
    queryFn: getHomeFeed,
  })
}
