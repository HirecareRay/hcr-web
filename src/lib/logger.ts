const isDev = process.env.NODE_ENV === "development"

export const logger = {
  log: (label: string, data?: unknown) => {
    if (!isDev) return
    console.log(`[LOG] ${label}`, data ?? "")
  },
  info: (label: string, data?: unknown) => {
    if (!isDev) return
    console.info(`[INFO] ${label}`, data ?? "")
  },
  warn: (label: string, data?: unknown) => {
    if (!isDev) return
    console.warn(`[WARN] ${label}`, data ?? "")
  },
  error: (label: string, data?: unknown) => {
    // 개발환경에서 fallback 처리되는 요청은 Next dev overlay가 뜨지 않도록 error 로그 제외
    const isDevFallbackReport =
      isDev && label.includes("/api/companies/") && label.includes("/report")

    const isDevAuthCheck = isDev && label.includes("/api/auth/me")

    if (isDevFallbackReport || isDevAuthCheck) {
      console.info(`[INFO] ${label}`, data ?? "")
      return
    }

    // error는 개발/프로덕션 모두 출력
    console.error(`[ERROR] ${label}`, data ?? "")
  },
  api: (method: string, path: string, body?: unknown) => {
    if (!isDev) return
    console.log(`[API] ${method.toUpperCase()} ${path}`, body ?? "")
  },
}
