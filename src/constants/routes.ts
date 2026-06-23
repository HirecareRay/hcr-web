export const routes = {
  home: "/",
  search: "/search",
  login: "/login",
  signup: "/signup",
  company: (companyId: string) => `/company/${companyId}`,
  interview: (companyId: string) => `/interview/${companyId}`,
}
