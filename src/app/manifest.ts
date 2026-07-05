import type { MetadataRoute } from "next"

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: "HcR — HirecareRay",
    short_name: "HcR",
    description: "기업 분석부터 AI 모의 면접까지, 원스톱 취업 준비 서비스",
    start_url: "/",
    display: "standalone",
    background_color: "#fafafa", // globals.css --color-background
    theme_color: "#ff5a4f", // globals.css --color-coral-deep (헤더 배경)
    icons: [
      {
        src: "/icon-192x192.png",
        sizes: "192x192",
        type: "image/png",
      },
      {
        src: "/icon-512x512.png",
        sizes: "512x512",
        type: "image/png",
      },
    ],
  }
}
