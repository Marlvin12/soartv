import type { Metadata } from 'next'
import './globals.css'

export const metadata: Metadata = {
  title: 'SoarTV — Tonight, tuned for you',
  description: 'Mood-based streaming recommendations',
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  )
}
