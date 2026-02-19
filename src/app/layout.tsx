import type { Metadata } from 'next'
import './globals.css'

export const metadata: Metadata = {
  title: 'Login — MyApp',
  description: 'Sign in to your account',
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  )
}
