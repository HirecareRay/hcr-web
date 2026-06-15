import Link from "next/link"
import { routes } from "@/constants/routes"

export function Header() {
  return (
    <header className="border-b px-6 py-4">
      <Link href={routes.home} className="text-xl font-bold">
        HCR
      </Link>
    </header>
  )
}
