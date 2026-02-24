import type { Metadata } from 'next'
import './globals.css'

export const metadata: Metadata = {
  title: 'Login App — Find a Doctor',
  description: 'Book appointments with top doctors',
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  )
}
