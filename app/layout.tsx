import type React from "react"
import type { Metadata } from "next"
import { Inter } from "next/font/google"
import "./globals.css"
import { SoundProvider } from "@/components/sound-manager"

const inter = Inter({ subsets: ["latin"] })

export const metadata: Metadata = {
  title: "Vedant Dhoke | Matrix Portfolio",
  description: "Software Developer, AI/ML Engineer, and Data Scientist",
    generator: 'v0.dev'
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <SoundProvider>{children}</SoundProvider>
      </body>
    </html>
  )
}

