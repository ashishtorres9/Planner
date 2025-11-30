import type React from "react"
import type { Metadata } from "next"

import { Analytics } from "@vercel/analytics/next"
import "./globals.css"

import { Barlow as V0_Font_Barlow, Source_Serif_4 as V0_Font_Source_Serif_4 } from 'next/font/google'

// Initialize fonts
const _barlow = V0_Font_Barlow({ subsets: ['latin'], weight: ["100","200","300","400","500","600","700","800","900"] })
const _sourceSerif_4 = V0_Font_Source_Serif_4({ subsets: ['latin'], weight: ["200","300","400","500","600","700","800","900"] })

export const metadata: Metadata = {
  title: "Heritage Hub Nepal - AI-Powered Cultural Trek Planning",
  description:
    "Discover authentic 3-day Nepal cultural treks with Mincha, your AI guide. Personalized itineraries, bookable local services, and WhatsApp booking integration.",
  generator: "v0.app",
  keywords: "Nepal treks, cultural tourism, Sherpa, Sunuwar, travel planning, local guides, sustainable travel",
  authors: [{ name: "Heritage Hub Nepal" }],
  openGraph: {
    title: "Heritage Hub Nepal - Cultural Trek Planning",
    description: "AI-powered personalized Nepal cultural trek itineraries",
    type: "website",
  },
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={`font-serif antialiased bg-background text-foreground`}>
        {children}
        <Analytics />
      </body>
    </html>
  )
}
