import type React from "react"
import { Inter } from "next/font/google"
import { Toaster } from "@/components/ui/toaster"
import { NotificationSystem } from "@/components/dashboard/notification-system"
import { OfflineStatusIndicator } from "@/components/offline-status-indicator"

const inter = Inter({ subsets: ["latin"] })

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="fr">
      <head>
        <link rel="manifest" href="/manifest.json" />
        <meta name="theme-color" content="#1A3A72" />
        <meta name="apple-mobile-web-app-capable" content="yes" />
        <meta name="apple-mobile-web-app-status-bar-style" content="black" />
        <meta name="apple-mobile-web-app-title" content="Satisfaction GPIS" />
        <link rel="apple-touch-icon" href="/icons/icon-192x192.png" />
        <script src="/localforage-script.js" defer></script>
      </head>
      <body className={inter.className}>
        {children}
        <NotificationSystem />
        <OfflineStatusIndicator />
        <Toaster />
        <script src="/register-sw.js" defer></script>
      </body>
    </html>
  )
}


import './globals.css'

export const metadata = {
      generator: 'v0.dev'
    };
