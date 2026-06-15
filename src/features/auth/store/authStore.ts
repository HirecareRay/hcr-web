// TODO: 백엔드 연동 시 zustand 스토어로 전환 예정
export function saveToken(token: string) {
  localStorage.setItem("token", token)
}

export function removeToken() {
  localStorage.removeItem("token")
}
