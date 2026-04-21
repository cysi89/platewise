import type { Metadata } from 'next'
import './globals.css'

export const metadata: Metadata = {
  title: 'PlateWise - Smart Weekly Dinners',
  description: 'Plan your week. Eat well. Waste nothing.',
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  )
}