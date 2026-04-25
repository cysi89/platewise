"use client"
import "./globals.css"
import "@/lib/i18n"
import { I18nextProvider } from "react-i18next"
import i18n from "@/lib/i18n"

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <head>
        <meta name="viewport" content="width=device-width, initial-scale=1, maximum-scale=1" />
        <title>Genie - Smart Weekly Dinners</title>
      </head>
      <body suppressHydrationWarning>
        <I18nextProvider i18n={i18n}>
          {children}
        </I18nextProvider>
      </body>
    </html>
  )
}