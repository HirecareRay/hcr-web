import type { Metadata, Viewport } from "next"
import { Providers } from "./providers"
import { AppShell } from "@/components/layout/appShell"
import "./globals.css"

export const metadata: Metadata = {
  title: "HCR — HireCareRay",
  description: "기업 분석부터 AI 모의 면접까지, 원스톱 취업 준비 서비스",
}

// viewport-fit=cover — 노치 영역까지 화면을 채워 env(safe-area-inset-*)가 실제 인셋값을 갖게 한다.
// (appShell이 상단 인셋만큼 pt를 줘서 상태바·노치가 콘텐츠를 가리지 않게 함)
export const viewport: Viewport = {
  viewportFit: "cover",
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="ko">
      <body className="antialiased">
        <Providers>
          <AppShell>{children}</AppShell>
        </Providers>
      </body>
    </html>
  )
}
