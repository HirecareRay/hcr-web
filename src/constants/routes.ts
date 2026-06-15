export const routes = {
  home: "/",
  company: (companyId: string) => `/company/${companyId}`,
  interview: (companyId: string) => `/interview/${companyId}`,
}
