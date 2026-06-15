/**
 * queryClient.ts
 *
 * React Query의 전역 설정 파일입니다.
 * React Query는 서버에서 가져온 데이터를 캐싱(저장)하고,
 * 자동으로 다시 불러오거나 새로고침하는 기능을 제공하는 라이브러리입니다.
 *
 * 여기서 만든 queryClient는 src/app/providers.tsx에서 앱 전체에 주입됩니다.
 * 개별 컴포넌트에서는 useQuery, useMutation 훅으로 사용합니다.
 */

import { QueryClient } from "@tanstack/react-query"

export const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      // 데이터를 가져온 후 5분(300,000ms) 동안은 "신선한 데이터"로 간주합니다.
      // 이 시간 안에 같은 데이터를 요청하면 서버 호출 없이 캐시에서 즉시 반환합니다.
      staleTime: 1000 * 60 * 5,
      // 요청 실패 시 자동으로 1번만 재시도합니다. (기본값은 3번)
      retry: 1,
    },
  },
})
