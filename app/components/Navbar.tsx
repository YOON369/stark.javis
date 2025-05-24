'use client'
import Link from 'next/link'
import { usePathname } from 'next/navigation'

export default function Navbar() {
  const pathname = usePathname()

  const linkStyle = (href: string) =>
    `px-4 py-2 rounded ${
      pathname === href ? 'bg-[#333] text-white' : 'text-gray-400 hover:text-white'
    }`

  return (
    <nav className="bg-[#0e0e0e] border-b border-[#444] px-6 py-3 flex gap-4 text-sm">
      <Link href="/" className={linkStyle('/')}>🧠 루프 생성</Link>
      <Link href="/history" className={linkStyle('/history')}>📜 히스토리</Link>
    </nav>
  )
}
