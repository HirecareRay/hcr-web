export const routes = {
  home: "/",
  login: "/login",
  signup: "/signup",
  company: (companyId: string) => `/company/${companyId}`,
  interview: (companyId: string) => `/interview/${companyId}`,
}
