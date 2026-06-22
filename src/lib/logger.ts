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
    // error는 개발/프로덕션 모두 출력
    console.error(`[ERROR] ${label}`, data ?? "")
  },
  api: (method: string, path: string, body?: unknown) => {
    if (!isDev) return
    console.log(`[API] ${method.toUpperCase()} ${path}`, body ?? "")
  },
}
