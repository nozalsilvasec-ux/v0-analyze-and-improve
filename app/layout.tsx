import type React from "react"
import type { Metadata } from "next"

import { Analytics } from "@vercel/analytics/next"
import "./globals.css"

import { Inter, Geist_Mono as V0_Font_Geist_Mono } from 'next/font/google'

// Initialize fonts
const _geistMono = V0_Font_Geist_Mono({ subsets: ['latin'], weight: ["100","200","300","400","500","600","700","800","900"] })

const inter = Inter({ subsets: ["latin"] })

export const metadata: Metadata = {
  title: "LightNote AI - AI Proposal Studio",
  description: "Analyze and improve your proposals with AI",
    generator: 'v0.app'
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en">
      <body className={`${inter.className} antialiased`}>
        {children}
        <Analytics />
      </body>
    </html>
  )
}
