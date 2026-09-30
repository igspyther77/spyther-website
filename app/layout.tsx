import React from "react"
import type { Metadata } from 'next'
import { Geist, Geist_Mono, IBM_Plex_Sans } from 'next/font/google'
import { Courier_Prime } from 'next/font/google'
import { Analytics } from '@vercel/analytics/next'
import { ThemeProvider } from '@/components/theme-provider'
import './globals.css'

const geist = Geist({ subsets: ["latin"], variable: "--font-geist-sans" });
const geistMono = Geist_Mono({ subsets: ["latin"], variable: "--font-geist-mono" });
const courierPrime = Courier_Prime({ weight: ["400", "700"], subsets: ["latin"], variable: "--font-courier-prime" });
const ibmPlexSans = IBM_Plex_Sans({ weight: ["300", "400", "500", "600"], subsets: ["latin"], variable: "--font-ibm-plex" });

export const metadata: Metadata = {
  metadataBase: new URL('https://spyther.cyou'),
  title: 'Spyther — Backend, API, Database & Web Scraping Developer',
  description: 'I design and ship reliable backends, fast APIs, web scraping solutions, and well-modeled databases. Scalable systems, clean architecture, and production-grade reliability.',
  keywords: ['backend developer', 'API developer', 'web scraping', 'web scraper', 'database engineer', 'Node.js', 'PostgreSQL', 'Python', 'system design', 'REST API', 'Spyther'],
  authors: [{ name: 'Spyther' }],
  alternates: {
    canonical: 'https://spyther.cyou',
  },
  openGraph: {
    title: 'Spyther — Backend, API, Database & Web Scraping Developer',
    description: 'I design and ship reliable backends, fast APIs, web scraping solutions, and well-modeled databases.',
    type: 'website',
    url: 'https://spyther.cyou',
    siteName: 'Spyther',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Spyther — Backend, API, Database & Web Scraping Developer',
    description: 'I design and ship reliable backends, fast APIs, web scraping solutions, and well-modeled databases.',
  },
  icons: {
    icon: [
      {
        url: '/favicon.ico',
        sizes: 'any',
      },
      {
        url: '/icon-light-32x32.png',
        sizes: '32x32',
        media: '(prefers-color-scheme: light)',
      },
      {
        url: '/icon-dark-32x32.png',
        sizes: '32x32',
        media: '(prefers-color-scheme: dark)',
      },
      {
        url: '/icon.svg',
        type: 'image/svg+xml',
      },
    ],
    apple: [
      {
        url: '/apple-icon.png',
        sizes: '180x180',
        type: 'image/png',
      },
    ],
  },
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en" suppressHydrationWarning className={`${geist.variable} ${geistMono.variable} ${courierPrime.variable} ${ibmPlexSans.variable}`}>
      <body className={`font-sans antialiased bg-[#F5F4F0] dark:bg-[#0C0D10] text-[#111] dark:text-[#EDECE6] transition-colors duration-300`}>
        <ThemeProvider
          attribute="class"
          defaultTheme="system"
          enableSystem
          storageKey="spyther-theme"
          disableTransitionOnChange
        >
          {children}
          <Analytics />
        </ThemeProvider>
      </body>
    </html>
  )
}
