import type { Metadata } from 'next'
import { Inter, Orbitron } from 'next/font/google'
import { Analytics } from '@vercel/analytics/next'
import { AuthProvider } from '@/lib/auth-context'
import { I18nProvider } from '@/components/I18nProvider'
import MooniqBot from '@/components/MooniqBot'
import './globals.css'

const inter = Inter({ 
  subsets: ["latin"],
  variable: '--font-inter'
});

const orbitron = Orbitron({ 
  subsets: ["latin"],
  variable: '--font-orbitron'
});

export const metadata: Metadata = {
  title: 'MOONIQ - AI-Powered Crypto Analytics',
  description: 'Premium crypto intelligence terminal with AI-powered analytics, trend detection, and pump signals',
  generator: 'v0.app',
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en" className="dark">
      <body className={`${inter.variable} ${orbitron.variable} font-sans antialiased`}>
        <AuthProvider>
          <I18nProvider>
            {children}
          </I18nProvider>
        </AuthProvider>
        <MooniqBot />
        <Analytics />
      </body>
    </html>
  )
}
