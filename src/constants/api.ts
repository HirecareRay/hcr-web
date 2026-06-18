export const apiBaseUrl = process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:3000"

export const apiEndpoints = {
  auth: {
    login: "/api/auth/login",
    signup: "/api/auth/signup",
  },
  companies: {
    search: "/api/companies",
    report: (id: string) => `/api/companies/${id}/report`,
  },
  interview: {
    sessions: "/api/interview/sessions",
    answer: (id: string) => `/api/interview/sessions/${id}/answer`,
    stt: (id: string) => `/api/interview/sessions/${id}/stt`,
  },
}
