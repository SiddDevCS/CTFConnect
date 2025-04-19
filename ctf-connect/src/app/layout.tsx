import './globals.css'
import { Inter } from 'next/font/google'
import Navbar from '@/components/layout/Navbar'

const inter = Inter({ subsets: ['latin'] })

export const metadata = {
  title: 'CTF Connect',
  description: 'Connect with CTF enthusiasts and find your next team',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <Navbar />
        <div className="min-h-screen pt-16 bg-white">
          {children}
        </div>
      </body>
    </html>
  )
}