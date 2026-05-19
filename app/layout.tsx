import type { Metadata, Viewport } from 'next'
import './globals.css'
import { AuthProvider } from '@/context/AuthContext'
import { WatchlistProvider } from '@/context/WatchlistContext'
import QueryProvider from '@/context/QueryProvider'
import SWRegister from '@/components/SWRegister'

export const metadata: Metadata = {
  title:       'SoarTV — Tonight, tuned for you',
  description: 'Mood-based streaming, tuned to your Resonance.',
  applicationName: 'SoarTV',
  appleWebApp: {
    capable:        true,
    statusBarStyle: 'black-translucent',
    title:          'SoarTV',
  },
  icons: {
    icon:      [{ url: '/icons/favicon-32.png', sizes: '32x32', type: 'image/png' },
                { url: '/icons/favicon-16.png', sizes: '16x16', type: 'image/png' }],
    apple:     '/icons/apple-touch-icon.png',
    shortcut:  '/icons/favicon-32.png',
  },
  formatDetection: { telephone: false },
}

export const viewport: Viewport = {
  themeColor:     '#07070a',
  width:          'device-width',
  initialScale:   1,
  maximumScale:   1,
  viewportFit:    'cover',
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body suppressHydrationWarning>
        <SWRegister />
        <QueryProvider>
          <AuthProvider>
            <WatchlistProvider>
              {children}
            </WatchlistProvider>
          </AuthProvider>
        </QueryProvider>
      </body>
    </html>
  )
}
